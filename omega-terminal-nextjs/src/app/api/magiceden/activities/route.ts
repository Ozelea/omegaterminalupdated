/**
 * Magic Eden Activities API Route
 *
 * Proxies Magic Eden API through relayer to avoid CORS issues.
 * Provides Next.js caching benefits for better performance.
 *
 * GET /api/magiceden/activities?symbol={collectionSymbol}&limit={limit}
 */

import { NextRequest, NextResponse } from "next/server";
import { RELAYER_URL } from "@/lib/config";

/**
 * GET handler - fetch collection activities
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const symbol = searchParams.get("symbol");
    const limit = searchParams.get("limit") || "10";

    // Validate required parameters
    if (!symbol) {
      return NextResponse.json(
        { error: "Collection symbol is required" },
        { status: 400 }
      );
    }

    // Fetch from relayer
    const response = await fetch(
      `${RELAYER_URL}/magiceden/activities?symbol=${symbol}&limit=${limit}`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`Relayer API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      activities: data || [],
      success: true,
    });
  } catch (error) {
    console.error("Magic Eden activities error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch activities",
        success: false,
      },
      { status: 500 }
    );
  }
}
