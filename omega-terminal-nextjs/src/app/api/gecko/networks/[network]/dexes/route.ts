/**
 * GeckoTerminal Network DEXes API Route
 * Server-side proxy for GeckoTerminal network-specific DEX list with caching
 * TTL: 3600 seconds (1 hour)
 */

import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

const RELAYER_URL = config.relayerUrl;

export async function GET(
  request: NextRequest,
  { params }: { params: { network: string } }
) {
  try {
    const { network } = params;

    if (!network) {
      return NextResponse.json(
        { error: "Network parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${RELAYER_URL}/gecko/networks/${network}/dexes`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `GeckoTerminal API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Normalize response format
    const dexes = data.data || data.dexes || [];

    return NextResponse.json({
      dexes,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        dexes: [],
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch DEXes",
      },
      { status: 500 }
    );
  }
}
