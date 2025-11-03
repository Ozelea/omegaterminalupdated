/**
 * NFTGallery Component
 *
 * Displays a responsive grid of NFT cards with optional load more functionality.
 * Used for OpenSea NFT collections.
 */

"use client";

import React from "react";
import { NFTCard } from "./NFTCard";
import styles from "./NFTGallery.module.css";

interface NFTGalleryProps {
  nfts: Array<{
    identifier: string;
    name?: string;
    image_url?: string;
    display_image_url?: string;
    animation_url?: string;
    collection: string;
    listing?: {
      price?: {
        current?: {
          value: number;
          decimals: number;
          currency: string;
        };
      };
    };
  }>;
  collectionSlug: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onView?: (collection: string, tokenId: string) => void;
  onBuy?: (collection: string, tokenId: string) => void;
  onBid?: (collection: string, tokenId: string) => void;
}

/**
 * NFTGallery - Responsive grid of NFT cards
 */
export function NFTGallery({
  nfts,
  collectionSlug,
  onLoadMore,
  hasMore,
  onView,
  onBuy,
  onBid,
}: NFTGalleryProps) {
  return (
    <>
      <div className={styles.gallery}>
        {nfts.map((nft, index) => (
          <NFTCard
            key={nft.identifier}
            nft={nft}
            collectionSlug={collectionSlug}
            index={index + 1}
            onView={onView}
            onBuy={onBuy}
            onBid={onBid}
          />
        ))}
      </div>

      {hasMore && onLoadMore && (
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreButton} onClick={onLoadMore}>
            Load More NFTs
          </button>
        </div>
      )}
    </>
  );
}
