/**
 * Alpha Vantage Stock Quote API Route
 * Server-side proxy for Alpha Vantage stock quotes with caching
 * TTL: 60 seconds (1 minute)
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

    const response = await fetch(`${RELAYER_URL}/stock/quote/${symbol}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Alpha Vantage API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Normalize response format
    let quote = null;

    if (data["Global Quote"]) {
      const gq = data["Global Quote"];
      quote = {
        symbol: gq["01. symbol"] || symbol,
        price: gq["05. price"] || "0",
        change: gq["09. change"] || "0",
        changePercent: gq["10. change percent"]?.replace("%", "") || "0",
        open: gq["02. open"] || "0",
        high: gq["03. high"] || "0",
        low: gq["04. low"] || "0",
        previousClose: gq["08. previous close"] || "0",
        latestTradingDay: gq["07. latest trading day"] || "",
      };
    } else if (data.price) {
      quote = {
        symbol: data.symbol || symbol,
        price: data.price || "0",
        change: data.change || "0",
        changePercent: data.changePercent || "0",
        open: data.open || "0",
        high: data.high || "0",
        low: data.low || "0",
        previousClose: data.previousClose || "0",
        latestTradingDay: data.latestTradingDay || "",
      };
    }

    return NextResponse.json({
      quote,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        quote: null,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch stock quote",
      },
      { status: 500 }
    );
  }
}
