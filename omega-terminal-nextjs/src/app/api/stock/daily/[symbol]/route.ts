/**
 * Alpha Vantage Daily Time Series API Route
 * Server-side proxy for Alpha Vantage daily historical data with caching
 * TTL: 300 seconds (5 minutes)
 * Note: Prevents API key exposure by handling requests server-side
 */

import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

const RELAYER_URL = config.relayerUrl;

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params;

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${RELAYER_URL}/stock/daily/${symbol}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Alpha Vantage API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Normalize response format
    const timeSeries = data["Time Series (Daily)"] || null;

    return NextResponse.json({
      timeSeries,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        timeSeries: null,
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch daily data",
      },
      { status: 500 }
    );
  }
}
