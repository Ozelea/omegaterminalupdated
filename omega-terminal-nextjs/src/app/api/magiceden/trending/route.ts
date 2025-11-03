/**
 * Magic Eden Trending API Route
 *
 * Proxies Magic Eden trending collections through relayer.
 * Provides Next.js caching for better performance.
 *
 * GET /api/magiceden/trending?timeRange={1h|1d|7d|30d}
 */

import { NextRequest, NextResponse } from "next/server";
import { RELAYER_URL } from "@/lib/config";

/**
 * GET handler - fetch trending collections
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const timeRange = searchParams.get("timeRange") || "1d";

    // Validate timeRange
    const validTimeRanges = ["1h", "1d", "7d", "30d"];
    if (!validTimeRanges.includes(timeRange)) {
      return NextResponse.json(
        { error: "Invalid timeRange. Must be one of: 1h, 1d, 7d, 30d" },
        { status: 400 }
      );
    }

    // Fetch from relayer
    const response = await fetch(
      `${RELAYER_URL}/magiceden/trending?timeRange=${timeRange}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Relayer API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      collections: data || [],
      success: true,
    });
  } catch (error) {
    console.error("Magic Eden trending error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch trending collections",
        success: false,
      },
      { status: 500 }
    );
  }
}
