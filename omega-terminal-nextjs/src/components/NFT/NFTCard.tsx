/**
 * NFTCard Component
 *
 * Displays OpenSea NFT information in a formatted card with action buttons.
 * Matches OpenSea plugin display format with purple theme.
 */

"use client";

import React from "react";
import styles from "./NFTCard.module.css";

interface NFTCardProps {
  nft: {
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
  };
  collectionSlug: string;
  index: number;
  onView?: (collection: string, tokenId: string) => void;
  onBuy?: (collection: string, tokenId: string) => void;
  onBid?: (collection: string, tokenId: string) => void;
}

/**
 * NFTCard - Displays an individual NFT with image, info, and action buttons
 */
export function NFTCard({
  nft,
  collectionSlug,
  index,
  onView,
  onBuy,
  onBid,
}: NFTCardProps) {
  // Get best image URL
  const imageUrl = nft.display_image_url || nft.image_url || nft.animation_url;

  // Check if NFT has active listing
  const hasPrice = nft.listing?.price?.current?.value;
  const price = hasPrice
    ? `${(
        nft.listing!.price!.current!.value /
        Math.pow(10, nft.listing!.price!.current!.decimals)
      ).toFixed(4)} ${nft.listing!.price!.current!.currency}`
    : null;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = "none";
    e.currentTarget.nextElementSibling?.classList.add(styles.visible);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={nft.name || nft.identifier}
              className={styles.image}
              onError={handleImageError}
            />
            <div className={styles.imagePlaceholder}>🖼️</div>
          </>
        ) : (
          <div className={`${styles.imagePlaceholder} ${styles.visible}`}>
            🖼️
          </div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.header}>
          <div>
            <div className={styles.name}>
              {nft.name || `#${nft.identifier}`}
            </div>
            <div className={styles.collection}>{collectionSlug}</div>
          </div>
          <div className={styles.indexBadge}>{index}</div>
        </div>

        <div
          className={`${styles.priceSection} ${
            price ? styles.forSale : styles.notForSale
          }`}
        >
          <div className={styles.priceLabel}>
            {price ? "FOR SALE" : "NOT FOR SALE"}
          </div>
          {price && <div className={styles.priceValue}>{price}</div>}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={() => onView?.(collectionSlug, nft.identifier)}
          >
            View
          </button>
          {price && (
            <button
              className={`${styles.button} ${styles.buyButton}`}
              onClick={() => onBuy?.(collectionSlug, nft.identifier)}
            >
              Buy
            </button>
          )}
          {!price && (
            <button
              className={`${styles.button} ${styles.bidButton}`}
              onClick={() => onBid?.(collectionSlug, nft.identifier)}
            >
              Bid
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
