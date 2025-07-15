import { NextResponse } from "next/server";

/**
 * Gitee API 响应类型
 */
interface GiteeApiResponse {
    content: string;
    encoding: string;
    name: string;
    path: string;
    sha: string;
    size: number;
    type: string;
    url: string;
    html_url: string;
    download_url: string;
}

/**
 * 武器代码数据类型
 */
interface GunCodeItem {
    type: string;
    gunName: string;
    description: string;
    code: string;
}

/**
 * 错误响应类型
 */
interface ErrorResponse {
    error: string;
    details: string;
}

/**
 * 从Gitee获取武器代码数据的内部方法
 * @returns 武器代码数据数组
 * @private
 */
async function _fetchGunCodeFromGitee(): Promise<GunCodeItem[]> {
    const apiUrl =
        "https://gitee.com/api/v5/repos/agcl02/guncode/contents/data/guncode.json?access_token=0dca6e9994ac5fbb464324f5cc50bb65";

    const response = await fetch(apiUrl, {
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        next: { revalidate: 300 }, // 5分钟缓存
    });

    if (!response.ok) {
        throw new Error(`Gitee API请求失败: ${response.status} ${response.statusText}`);
    }

    const data: GiteeApiResponse = await response.json();

    if (data.encoding !== "base64") {
        throw new Error("不支持的文件编码格式");
    }

    // 解码base64内容
    const content: string = Buffer.from(data.content, "base64").toString("utf-8");
    const gunCodeData: GunCodeItem[] = JSON.parse(content);

    return gunCodeData;
}

/**
 * 获取三角洲行动武器代码列表的API端点
 * @returns 武器代码数据的响应
 */
async function GETGunCodeList(): Promise<NextResponse<GunCodeItem[] | ErrorResponse>> {
    try {
        const gunCodeData: GunCodeItem[] = await _fetchGunCodeFromGitee();

        console.log("成功获取武器代码数据，条数:", gunCodeData.length);

        return NextResponse.json(gunCodeData, {
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=59",
            },
        });
    } catch (error) {
        console.error("获取武器代码数据失败:", error);

        const errorMessage: string = error instanceof Error ? error.message : "未知错误";
        const errorResponse: ErrorResponse = {
            error: "获取武器代码数据失败",
            details: errorMessage,
        };

        return NextResponse.json(errorResponse, { status: 500 });
    }
}

// Next.js App Router 需要的标准导出
export const GET = GETGunCodeList;
