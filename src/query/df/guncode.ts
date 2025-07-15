import { useQuery } from "@tanstack/react-query";

/**
 * 武器代码数据类型
 */
export interface GunCodeData {
    type: string;
    gunName: string;
    description: string;
    code: string;
}

/**
 * 获取武器代码数据的API函数
 * @returns {Promise<GunCodeData[]>} 武器代码数据数组
 */
const fetchGunCode = async (): Promise<GunCodeData[]> => {
    const response = await fetch("/api/df/v1/guncode");

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorData.error || "Unknown error"}`
        );
    }

    const data = await response.json();
    return data; // API现在直接返回数组
};

/**
 * 使用React Query获取武器代码数据的hook
 * @returns {Object} React Query的查询结果
 */
export const useGunCode = () => {
    return useQuery({
        queryKey: ["gunCode"],
        queryFn: fetchGunCode,
        staleTime: 5 * 60 * 1000, // 5分钟内数据视为新鲜
        gcTime: 10 * 60 * 1000, // 10分钟后清理缓存
        retry: 3, // 失败时重试3次
    });
};
