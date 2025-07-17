"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigationMenu";
import { usePathname } from "next/navigation";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useMemo } from "react";

// 将navItems移到组件外部，避免重复创建
const NAV_ITEMS = [
    { label: "首页", href: "/" },
    { label: "博客", href: "/blog" },
    { label: "游戏", href: "/games" },
] as const;

/**
 * 页面头部组件
 * 包含用户头像、搜索框和导航菜单
 */
export default function Header() {
    const pathname = usePathname();

    const navigationItems = useMemo(() => {
        return NAV_ITEMS.map((item) => (
            <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                    href={item.href}
                    className={`text-lg font-bold transition-colors ${
                        (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
                            ? "text-foreground"
                            : "text-muted-foreground"
                    }`}
                >
                    {item.label}
                </NavigationMenuLink>
            </NavigationMenuItem>
        ));
    }, [pathname]);

    return (
        <div className="flex items-center justify-between p-4 pl-10 pr-10">
            <div className="w-1/2 flex items-center gap-2">
                <Avatar className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-100 rounded-full" />
                    <Image
                        src="/avatar.jpeg"
                        alt="用户头像"
                        width={40}
                        height={40}
                        className="rounded-full relative z-10"
                        priority={true}
                        quality={100}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7XTvtd0Q="
                    />
                    <AvatarFallback>Ly</AvatarFallback>
                </Avatar>

                <Input type="text" placeholder="搜索..." className="w-1/2" />
            </div>

            <div className="w-full h-10 flex justify-end items-center">
                <div className="flex items-center gap-2 ">
                    <div className="pr-10">
                        <NavigationMenu>
                            <NavigationMenuList>{navigationItems}</NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className="w-10 h-10">
                        <a href="https://github.com/hongyan02" target="_blank">
                            <GitHubLogoIcon className="w-full h-full" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
