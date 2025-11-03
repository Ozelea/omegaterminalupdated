/**
 * Pinata Image Upload API Route
 *
 * Handles secure server-side image uploads to IPFS via Pinata.
 * Protects Pinata JWT from client exposure.
 *
 * POST /api/pinata/upload-image
 * Body: FormData with 'file' field containing image
 *
 * Note: PINATA_JWT should be added to .env.local for production
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler - not supported
 */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to upload images." },
    { status: 405 }
  );
}

/**
 * POST handler - upload image to Pinata IPFS
 */
export async function POST(request: NextRequest) {
  try {
    // Check for required environment variable
    const PINATA_JWT = process.env.PINATA_JWT;
    if (!PINATA_JWT) {
      console.error("PINATA_JWT environment variable is not set");
      return NextResponse.json(
        {
          error:
            "Server configuration error: PINATA_JWT is not configured. Please set the PINATA_JWT environment variable.",
          success: false,
        },
        { status: 500 }
      );
    }
    // Extract FormData from request
    const formData = await request.formData();
    const file = formData.get("file");

    // Validate file exists and is File type
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided or invalid file type" },
        { status: 400 }
      );
    }

    // Create FormData for Pinata
    const pinataFormData = new FormData();
    pinataFormData.append("file", file);

    // Upload to Pinata
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: pinataFormData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const ipfsHash = data.IpfsHash;

    return NextResponse.json({
      ipfsHash,
      ipfsUrl: `ipfs://${ipfsHash}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      success: true,
    });
  } catch (error) {
    console.error("Pinata image upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload image to IPFS",
        success: false,
      },
      { status: 500 }
    );
  }
}
