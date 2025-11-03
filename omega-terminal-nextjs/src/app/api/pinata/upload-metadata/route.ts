/**
 * Pinata Metadata Upload API Route
 *
 * Handles secure server-side metadata JSON uploads to IPFS via Pinata.
 * Protects Pinata JWT from client exposure.
 *
 * POST /api/pinata/upload-metadata
 * Body: JSON with NFT metadata (name, description, image, attributes)
 */

import { NextRequest, NextResponse } from "next/server";
import { NFTMetadata } from "@/types/nft";

/**
 * GET handler - not supported
 */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to upload metadata." },
    { status: 405 }
  );
}

/**
 * POST handler - upload metadata JSON to Pinata IPFS
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
    // Parse JSON body
    const metadata: NFTMetadata = await request.json();

    // Validate metadata has required fields
    if (!metadata.name || !metadata.image) {
      return NextResponse.json(
        { error: "Metadata must include name and image fields" },
        { status: 400 }
      );
    }

    // Create metadata JSON blob
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: "application/json",
    });

    // Create File from blob
    const metadataFile = new File([metadataBlob], "metadata.json", {
      type: "application/json",
    });

    // Create FormData for Pinata
    const formData = new FormData();
    formData.append("file", metadataFile);

    // Upload to Pinata
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
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
      success: true,
    });
  } catch (error) {
    console.error("Pinata metadata upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload metadata to IPFS",
        success: false,
      },
      { status: 500 }
    );
  }
}
