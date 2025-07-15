"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigationMenu";
import { usePathname } from "next/navigation";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Header() {
    const pathname = usePathname();

    const navItems = [
        { label: "首页", href: "/" },
        { label: "博客", href: "/blog" },
        { label: "游戏", href: "/games" },
    ];

    return (
        <div className="flex items-center justify-between p-4 pl-10 pr-10">
            <div className="w-1/2 flex items-center gap-2">
                <Avatar>
                    <AvatarImage src="/avatar.jpeg" loading="eager" />
                    <AvatarFallback>Ly</AvatarFallback>
                </Avatar>

                <Input type="text" placeholder="搜索..." className="w-1/2" />
            </div>

            <div className="w-full h-10 flex justify-end items-center">
                <div className="flex items-center gap-2 ">
                    <div className="pr-10">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navItems.map((item) => (
                                    <NavigationMenuItem key={item.href}>
                                        <NavigationMenuLink
                                            href={item.href}
                                            className={`text-lg font-bold transition-colors ${
                                                (
                                                    item.href === "/"
                                                        ? pathname === "/"
                                                        : pathname.startsWith(item.href)
                                                )
                                                    ? "text-foreground"
                                                    : "text-muted-foreground"
                                            }`}
                                        >
                                            {item.label}
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
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
