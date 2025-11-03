/**
 * Magic Eden Listings API Route
 *
 * Proxies Magic Eden collection listings through relayer.
 * Provides Next.js caching for better performance.
 *
 * GET /api/magiceden/listings?symbol={collectionSymbol}&limit={limit}
 */

import { NextRequest, NextResponse } from "next/server";
import { RELAYER_URL } from "@/lib/config";

/**
 * GET handler - fetch collection listings
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const symbol = searchParams.get("symbol");
    const limit = searchParams.get("limit") || "20";

    // Validate required parameters
    if (!symbol) {
      return NextResponse.json(
        { error: "Collection symbol is required" },
        { status: 400 }
      );
    }

    // Fetch from relayer
    const response = await fetch(
      `${RELAYER_URL}/magiceden/listings?symbol=${symbol}&limit=${limit}`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`Relayer API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      listings: data || [],
      success: true,
    });
  } catch (error) {
    console.error("Magic Eden listings error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch listings",
        success: false,
      },
      { status: 500 }
    );
  }
}
