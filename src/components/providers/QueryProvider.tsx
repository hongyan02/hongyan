"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

/**
 * React Query Provider组件
 * 在客户端组件中创建QueryClient实例
 * @param {Object} props - 组件props
 * @param {ReactNode} props.children - 子组件
 * @returns {JSX.Element} QueryClientProvider包装的JSX元素
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
