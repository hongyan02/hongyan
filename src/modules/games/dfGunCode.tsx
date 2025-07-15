"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";
import { useGunCode, GunCodeData } from "@/query/df/guncode";
import { useState, useMemo } from "react";

/**
 * 三角洲行动武器代码组件
 * 使用Grid布局展示武器代码，按类型分类显示
 */
export default function DFGunCode() {
    const { data: gunCode, isLoading, error } = useGunCode();
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);

    /**
     * 根据类型分组武器数据
     */
    const groupedGunCode = useMemo(() => {
        if (!gunCode) return {};

        const groups: Record<string, GunCodeData[]> = {};
        gunCode.forEach((gun) => {
            if (!groups[gun.type]) {
                groups[gun.type] = [];
            }
            groups[gun.type].push(gun);
        });

        return groups;
    }, [gunCode]);

    /**
     * 获取所有武器类型
     */
    const weaponTypes = useMemo(() => {
        return Object.keys(groupedGunCode);
    }, [groupedGunCode]);

    /**
     * 处理复制武器代码
     * @param code - 武器代码
     * @param globalIndex - 全局索引（用于动效标识）
     * @private
     */
    const _handleCopyCode = async (code: string, globalIndex: number) => {
        try {
            await navigator.clipboard.writeText(code);
            setClickedIndex(globalIndex);

            // 500ms后重置状态
            setTimeout(() => {
                setClickedIndex(null);
            }, 500);
        } catch (error) {
            console.error("复制失败:", error);
        }
    };

    /**
     * 渲染武器代码网格
     * @param weapons - 武器数组
     * @param startIndex - 起始索引（用于全局动效标识）
     * @private
     */
    const _renderWeaponGrid = (weapons: GunCodeData[], startIndex: number) => {
        return (
            <div className="grid grid-cols-6 gap-4">
                {weapons.map((gun, localIndex) => {
                    const globalIndex = startIndex + localIndex;
                    return (
                        <Card key={globalIndex} className="flex flex-col">
                            <CardHeader className="p-3">
                                <CardTitle className="text-sm font-semibold truncate">
                                    {gun.gunName}
                                </CardTitle>
                                <CardDescription className="text-xs text-gray-500 truncate">
                                    {gun.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600 font-mono truncate flex-1">
                                        {gun.code}
                                    </span>
                                    <div
                                        className={`w-4 h-4 cursor-pointer flex-shrink-0 transition-all duration-200 ${
                                            clickedIndex === globalIndex
                                                ? "scale-125 text-green-500"
                                                : "hover:scale-110 hover:text-blue-500 text-gray-400"
                                        } active:scale-95`}
                                        onClick={() => _handleCopyCode(gun.code, globalIndex)}
                                    >
                                        {clickedIndex === globalIndex ? (
                                            <CheckIcon className="w-full h-full" />
                                        ) : (
                                            <CopyIcon className="w-full h-full" />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">加载中...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-red-500">
                    加载失败：{error instanceof Error ? error.message : "未知错误"}
                </div>
            </div>
        );
    }

    if (!gunCode || gunCode.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">暂无数据</div>
            </div>
        );
    }

    if (weaponTypes.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">暂无武器类型数据</div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Tabs defaultValue={weaponTypes[0]} className="w-full">
                <TabsList className="w-fit">
                    {weaponTypes.map((type) => (
                        <TabsTrigger
                            key={type}
                            value={type}
                            className="text-sm px-4 py-2 min-w-[120px]"
                        >
                            {type} ({groupedGunCode[type].length})
                        </TabsTrigger>
                    ))}
                </TabsList>

                {weaponTypes.map((type) => {
                    // 计算当前类型的起始索引
                    const startIndex = weaponTypes
                        .slice(0, weaponTypes.indexOf(type))
                        .reduce((acc, prevType) => acc + groupedGunCode[prevType].length, 0);

                    return (
                        <TabsContent key={type} value={type} className="mt-6">
                            {_renderWeaponGrid(groupedGunCode[type], startIndex)}
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
}
