import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { unified } from "unified";

/**
 * 文章的前置数据类型
 */
export interface PostFrontmatter {
    date: string;
    draft: boolean;
    title: string;
    [key: string]: unknown;
}

/**
 * 完整的文章数据类型
 */
export interface Post {
    slug: string;
    frontmatter: PostFrontmatter;
    content: string;
    htmlContent: string;
}

/**
 * markdown处理器实例
 * 配置了GitHub风格的markdown支持
 */
const processor = unified()
    .use(remarkParse)
    .use(remarkGfm) // GitHub Flavored Markdown (表格、删除线、任务列表等)
    .use(remarkBreaks) // 支持换行符
    .use(remarkRehype, { allowDangerousHtml: true }) // 允许原始HTML
    .use(rehypeRaw) // 处理原始HTML
    .use(rehypeSlug) // 为标题生成slug
    .use(rehypeAutolinkHeadings, {
        behavior: "wrap",
        properties: {
            className: ["heading-link"],
            ariaLabel: "链接到此标题",
        },
    }) // 为标题添加自动链接
    .use(rehypeHighlight, {
        detect: true,
        ignoreMissing: true,
    }) // 代码高亮
    .use(rehypeStringify);

/**
 * 获取posts目录的绝对路径
 */
const _getPostsDirectory = (): string => {
    return path.join(process.cwd(), "posts");
};

/**
 * 读取并解析单个markdown文件
 * @param filePath - 文件路径
 * @returns 解析后的文章数据
 */
const _parseMarkdownFile = async (filePath: string): Promise<Post> => {
    const fileContent = await fs.readFile(filePath, "utf8");
    const { data: frontmatter, content } = matter(fileContent);

    // 转换markdown为HTML
    const result = await processor.process(content);
    const htmlContent = result.toString();

    // 生成slug（从文件名）
    const fileName = path.basename(filePath, ".md");

    return {
        slug: fileName,
        frontmatter: frontmatter as PostFrontmatter,
        content,
        htmlContent,
    };
};

/**
 * 获取所有文章列表
 * @returns 文章列表数组
 */
export const getAllPosts = async (): Promise<Post[]> => {
    const postsDirectory = _getPostsDirectory();

    try {
        const files = await fs.readdir(postsDirectory);
        const markdownFiles = files.filter((file) => file.endsWith(".md"));

        const posts = await Promise.all(
            markdownFiles.map(async (file) => {
                const filePath = path.join(postsDirectory, file);
                return _parseMarkdownFile(filePath);
            })
        );

        // 按日期降序排序，过滤掉草稿
        return posts
            .filter((post) => !post.frontmatter.draft)
            .sort(
                (a, b) =>
                    new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
            );
    } catch (error) {
        console.error("Error reading posts directory:", error);
        return [];
    }
};

/**
 * 根据slug获取单篇文章
 * @param slug - 文章的slug
 * @returns 文章数据或null
 */
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
    const postsDirectory = _getPostsDirectory();

    // 对URL编码的slug进行解码（处理中文文件名）
    const decodedSlug = decodeURIComponent(slug);
    const filePath = path.join(postsDirectory, `${decodedSlug}.md`);

    try {
        const post = await _parseMarkdownFile(filePath);

        // 检查是否为草稿
        if (post.frontmatter.draft) {
            return null;
        }

        return post;
    } catch (error) {
        console.error(`Error reading post ${slug}:`, error);
        return null;
    }
};

/**
 * 获取所有文章的slug列表（用于静态路由生成）
 * @returns slug数组
 */
export const getAllPostSlugs = async (): Promise<string[]> => {
    const posts = await getAllPosts();
    return posts.map((post) => post.slug);
};
