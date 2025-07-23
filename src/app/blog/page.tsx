import Link from "next/link";
import { getAllPosts } from "@/core/md";
import { Card } from "@/components/ui/card";

/**
 * 格式化日期显示
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
 * 从HTML内容中提取纯文本
 * @param htmlContent - HTML内容字符串
 * @returns 纯文本内容
 */
const _extractPlainText = (htmlContent: string): string => {
    // 移除HTML标签
    return htmlContent
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
};

/**
 * 生成页面元数据
 */
export const metadata = {
    title: "博客",
    description: "个人博客文章列表",
};

/**
 * 博客列表页面组件
 * @returns 博客列表页面JSX
 */
export default async function BlogPage() {
    const posts = await getAllPosts();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* 页面标题 */}
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">博客文章</h1>
                    <p className="text-gray-600">分享学习、项目经验和生活感悟</p>
                </header>

                {/* 文章列表 */}
                <div className="space-y-6">
                    {posts.length === 0 ? (
                        <Card className="p-8 text-center">
                            <p className="text-gray-500">暂无文章发布</p>
                        </Card>
                    ) : (
                        posts.map((post) => (
                            <Card key={post.slug} className="p-6 hover:shadow-lg transition-shadow">
                                <article>
                                    {/* 文章标题 */}
                                    <h2 className="text-2xl mb-3">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="text-stone-700 font-bold hover:text-black transition-colors"
                                        >
                                            {post.frontmatter.title}
                                        </Link>
                                    </h2>

                                    {/* 文章元信息 */}
                                    <div className="flex items-center gap-4 text-gray-500 mb-4">
                                        <time dateTime={post.frontmatter.date}>
                                            {_formatDate(post.frontmatter.date)}
                                        </time>
                                    </div>

                                    {/* 文章预览 */}
                                    <div className="text-gray-700 mb-4">
                                        <p className="line-clamp-3">
                                            {_extractPlainText(post.htmlContent).substring(0, 200)}
                                            {_extractPlainText(post.htmlContent).length > 200
                                                ? "..."
                                                : ""}
                                        </p>
                                    </div>

                                    {/* 阅读更多按钮 */}
                                    <div>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-2 text-blue-600 
                                hover:text-blue-700 font-medium transition-colors"
                                        >
                                            阅读全文 →
                                        </Link>
                                    </div>
                                </article>
                            </Card>
                        ))
                    )}
                </div>

                {/* 统计信息 */}
                {posts.length > 0 && (
                    <div className="mt-8 text-center text-gray-500">共 {posts.length} 篇文章</div>
                )}
            </div>
        </div>
    );
}
