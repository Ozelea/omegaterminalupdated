/**
 * Magic Eden Stats API Route
 *
 * Proxies Magic Eden collection stats through relayer.
 * Provides Next.js caching for better performance.
 *
 * GET /api/magiceden/stats?symbol={collectionSymbol}
 */

import { NextRequest, NextResponse } from "next/server";
import { RELAYER_URL } from "@/lib/config";

/**
 * GET handler - fetch collection statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const symbol = searchParams.get("symbol");

    // Validate required parameters
    if (!symbol) {
      return NextResponse.json(
        { error: "Collection symbol is required" },
        { status: 400 }
      );
    }

    // Fetch from relayer
    const response = await fetch(
      `${RELAYER_URL}/magiceden/stats?symbol=${symbol}`,
      {
        next: { revalidate: 120 }, // Cache for 2 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Relayer API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      stats: data,
      success: true,
    });
  } catch (error) {
    console.error("Magic Eden stats error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch stats",
        success: false,
      },
      { status: 500 }
    );
  }
}
