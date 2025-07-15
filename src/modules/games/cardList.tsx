"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GameList } from "@/data/game/list";

/**
 * 游戏卡片列表组件
 * 显示游戏推荐卡片，包含游戏信息和图片
 * @returns {JSX.Element} 卡片列表的JSX元素
 */
export default function CardList() {
    const router = useRouter();

    /**
     * 处理卡片标题点击事件
     * @param {string} path - 游戏页面路径
     * @private
     */
    const _handleTitleClick = (path: string) => {
        router.push(path);
    };

    return (
        <div className="space-y-4">
            {GameList.map((game, index) => (
                <div key={index} className="p-4 border-b border-gray-200 first:border-t">
                    {/* 标题区域 */}
                    <div className="cursor-pointer" onClick={() => _handleTitleClick(game.path)}>
                        <h1 className="text-2xl text-stone-700 font-bold hover:text-black transition-colors">
                            {game.title}
                        </h1>
                    </div>

                    {/* 内容区域：左边固定宽度图片，右边自适应文字 */}
                    <div className="flex gap-4">
                        {/* 左侧图片区域 - 固定尺寸 */}
                        <div className="flex-shrink-0 w-100 h-60">
                            <div className="w-full h-full rounded-md overflow-hidden">
                                <Image
                                    src={game.image}
                                    alt={game.title}
                                    width={320}
                                    height={240}
                                    quality={100}
                                    unoptimized={true}
                                    className="w-full h-full object-cover"
                                    priority={index === 0}
                                />
                            </div>
                        </div>

                        {/* 右侧描述区域 - 自适应内容，新闻资讯贴底 */}
                        <div className="flex-1 min-w-0 h-60 flex flex-col">
                            {/* 上部分：描述和用户信息 */}
                            <div className="flex-1">
                                <div className="text-sm text-gray-500 leading-relaxed">
                                    {game.description}
                                </div>
                                <div className="text-sm text-gray-500 mt-4">
                                    账号：{game.userAccount}
                                </div>
                                <div className="text-sm text-gray-500 mt-4">
                                    用户名：{game.userName}
                                </div>
                            </div>

                            {/* 底部：新闻资讯链接 */}
                            <div className="mt-auto">
                                <a
                                    href={game.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 text-sm transition-colors"
                                >
                                    新闻资讯
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
