import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/modules/header";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AgCl",
    description: "AgCl的个人博客",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <div>
                    <Header />
                </div>
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
