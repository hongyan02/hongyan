import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs } from "@/core/md";

/**
 * 页面参数类型
 */
interface PageProps {
    params: Promise<{
        title: string;
    }>;
}

/**
 * 生成静态路由参数
 * @returns 所有文章的参数列表
 */
export async function generateStaticParams() {
    const slugs = await getAllPostSlugs();

    return slugs.map((slug) => ({
        title: slug,
    }));
}

/**
 * 生成页面元数据
 * @param props - 页面属性
 * @returns 页面元数据
 */
export async function generateMetadata({ params }: PageProps) {
    const { title } = await params;
    const post = await getPostBySlug(title);

    if (!post) {
        return {
            title: "文章未找到",
        };
    }

    return {
        title: post.frontmatter.title,
        description: `发布于 ${new Date(post.frontmatter.date).toLocaleDateString("zh-CN")}`,
    };
}

/**
 * 格式化日期
 * @param dateString - 日期字符串
 * @returns 格式化后的日期
 */
const _formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

/**
 * 生成文章目录
 * @param htmlContent - HTML内容
 * @returns 目录HTML字符串
 */
const _generateTOC = (htmlContent: string): string => {
    // 正则匹配所有标题标签
    const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
    const headings: Array<{
        level: number;
        id: string;
        text: string;
    }> = [];

    let match;
    while ((match = headingRegex.exec(htmlContent)) !== null) {
        const level = parseInt(match[1]);
        const id = match[2];
        const text = match[3].replace(/<[^>]*>/g, ""); // 移除HTML标签

        headings.push({ level, id, text });
    }

    if (headings.length === 0) {
        return '<p class="text-gray-500 text-xs">暂无目录</p>';
    }

    // 生成目录HTML
    let tocHtml = '<ul class="space-y-1">';

    headings.forEach((heading) => {
        const indent = heading.level > 1 ? `ml-${(heading.level - 1) * 3}` : "";
        const textSize = heading.level <= 2 ? "text-base" : "text-sm";
        const fontWeight = heading.level <= 2 ? "font-medium" : "font-normal";

        tocHtml += `
      <li class="${indent}">
        <a 
          href="#${heading.id}" 
          class="${textSize} ${fontWeight} text-gray-600 hover:text-blue-600 
                 block py-1 transition-colors border-l-2 border-transparent 
                 hover:border-blue-300 pl-2"
        >
          ${heading.text}
        </a>
      </li>
    `;
    });

    tocHtml += "</ul>";
    return tocHtml;
};

/**
 * 博客文章页面组件
 * @param props - 页面属性
 * @returns 文章页面JSX
 */
export default async function BlogPostPage({ params }: PageProps) {
    const { title } = await params;
    const post = await getPostBySlug(title);

    // 如果文章不存在，返回404
    if (!post) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="blog-layout flex gap-8 max-w-7xl mx-auto">
                {/* 左侧目录 */}
                <aside className="blog-sidebar w-64 flex-shrink-0 lg:block">
                    <div className="sticky top-8">
                        <div className="mb-6">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 px-3 py-2 
                           text-blue-600 hover:text-blue-700 
                           border border-blue-200 rounded-lg 
                           hover:bg-blue-50 transition-colors text-sm
                           dark:border-blue-800 dark:text-blue-400 
                           dark:hover:text-blue-300 dark:hover:bg-blue-950"
                            >
                                ← 返回博客列表
                            </Link>
                        </div>

                        <nav className="space-y-1">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                文章目录
                            </h3>
                            <div
                                className="toc-content"
                                dangerouslySetInnerHTML={{ __html: _generateTOC(post.htmlContent) }}
                            />
                        </nav>
                    </div>
                </aside>

                {/* 右侧文章内容 */}
                <main className="flex-1 min-w-0">
                    <article>
                        {/* 文章头部信息 */}
                        <header className="mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                {post.frontmatter.title}
                            </h1>

                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                <time dateTime={post.frontmatter.date}>
                                    发布于 {_formatDate(post.frontmatter.date)}
                                </time>
                            </div>
                        </header>

                        {/* 文章内容 - 移除Card边框 */}
                        <div
                            className="markdown-content max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                        />
                    </article>
                </main>
            </div>
        </div>
    );
}
