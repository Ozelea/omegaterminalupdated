/**
 * Media Components Barrel Export
 *
 * Export point for all media player components.
 *
 * Components:
 * - SpotifyPanel: Spotify music player with OAuth authentication
 * - YouTubePanel: YouTube video player with search and playlist
 * - NewsReaderPanel: Crypto news reader with sentiment analysis
 * - MediaPanelContainer: Container that manages panel visibility
 *
 * Usage:
 *   import { MediaPanelContainer } from '@/components/Media';
 *
 *   // In your app layout or page:
 *   <MediaPanelContainer />
 */

export { SpotifyPanel } from "./SpotifyPanel";
export { YouTubePanel } from "./YouTubePanel";
export { NewsReaderPanel } from "./NewsReaderPanel";
export { MediaPanelContainer } from "./MediaPanelContainer";
