# OMEGA TERMINAL - COMPREHENSIVE API SETUP GUIDE
## For Next.js Migration & Integration

---

## TABLE OF CONTENTS

1. [Overview](#overview)
2. [API Architecture](#api-architecture)
3. [YouTube API Integration](#youtube-api-integration)
4. [Spotify API Integration](#spotify-api-integration)
5. [Relayer/Proxy System](#relayerproxy-system)
6. [Other API Integrations](#other-api-integrations)
7. [Environment Variables](#environment-variables)
8. [Next.js Migration Strategy](#nextjs-migration-strategy)
9. [API Configuration Files](#api-configuration-files)

---

## OVERVIEW

The Omega Terminal uses a multi-layered API architecture:

1. **Direct Client-Side APIs** (YouTube, Spotify Web SDK)
2. **Proxy/Relayer APIs** (Kalshi, Polymarket, Magic Eden, DexScreener, etc.)
3. **Server-Side Environment Variables** (ChainGPT, API keys)
4. **Fallback Systems** (Multiple API providers with automatic failover)

### API Categories

- **Media APIs**: YouTube, Spotify, Custom Music Player
- **Crypto/DeFi APIs**: Kalshi, Polymarket, DexScreener, CoinGecko, Magic Eden
- **News APIs**: CryptoPanic, CryptoCompare, NewsAPI
- **AI APIs**: ChainGPT
- **Blockchain APIs**: Ethereum RPC, Solana RPC, Near RPC, Omega RPC
- **Stock APIs**: Alpha Vantage (via relayer)

---

## API ARCHITECTURE

### Architecture Diagram

```
Frontend (Browser)
    ├── Direct API Calls
    │   ├── YouTube API (Google Cloud Console)
    │   └── Spotify Web Playback SDK
    │
    ├── Relayer Proxy (Render.com)
    │   ├── /kalshi/* → Kalshi API (server-side auth)
    │   ├── /polymarket/* → Polymarket API
    │   ├── /dex/* → DexScreener API
    │   ├── /gecko/* → CoinGecko API
    │   ├── /magiceden/* → Magic Eden API
    │   ├── /stock/* → Alpha Vantage API
    │   └── /jupiter/* → Jupiter Aggregator (Solana)
    │
    └── Environment API (/api/env)
        └── Returns safe env vars (ChainGPT API key)
```

### Key Design Patterns

1. **CORS Proxy Pattern**: All third-party APIs go through a relayer to avoid CORS issues
2. **Environment Variable Security**: Sensitive keys stored server-side, exposed via API endpoint
3. **Fallback System**: Multiple API providers with automatic failover
4. **PKCE OAuth Flow**: Spotify uses PKCE for secure authentication
5. **API Key Management**: Client-side keys (YouTube) vs server-side keys (everything else)

---

## YOUTUBE API INTEGRATION

### File Location
- **Plugin**: `js/plugins/omega-youtube-player.js`
- **Commands**: `js/commands/youtube.js`

### Configuration

```javascript
const YOUTUBE_CONFIG = {
    CLIENT_ID: '119481701339-b4fm5sujtt2mjupu2rk1s2v749cess44.apps.googleusercontent.com',
    API_KEY: 'AIzaSyCpz49l79hdPYN1VmREpPjylwlHmfki3S0',
    PLAYER_ID: 'omega-youtube-player',
    SEARCH_RESULTS_LIMIT: 10,
    DEFAULT_CHANNEL_ID: 'UCrM7B7SL_g1edFOnmj-SDKg', // Bloomberg Technology
    DEFAULT_CHANNEL_HANDLE: '@BloombergTechnology',
    DEFAULT_CHANNEL_NAME: 'Bloomberg Technology',
    SCOPES: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl'
    ].join(' ')
};
```

### API Endpoints Used

1. **YouTube Data API v3 - Search**
   ```
   GET https://www.googleapis.com/youtube/v3/search
   ```
   - **Parameters**: `part=snippet`, `channelId`, `maxResults`, `order`, `type=video`, `key`
   - **Example**: 
   ```javascript
   const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=15&order=date&type=video&key=${API_KEY}`;
   ```

2. **YouTube IFrame Player API**
   - **Script**: `https://www.youtube.com/iframe_api`
   - **Usage**: Embedded player with programmatic control
   - **Events**: `onReady`, `onStateChange`

### Setup Steps for Next.js

1. **Get YouTube API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create/select project
   - Enable "YouTube Data API v3"
   - Create API key (or OAuth 2.0 credentials)
   - Restrict key to YouTube Data API v3

2. **Environment Variables**:
   ```env
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
   NEXT_PUBLIC_YOUTUBE_CLIENT_ID=your_client_id_here
   ```

3. **Next.js Implementation**:
   ```javascript
   // lib/youtube-config.js
   export const YOUTUBE_CONFIG = {
       CLIENT_ID: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID,
       API_KEY: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
       // ... rest of config
   };
   
   // Load IFrame API in useEffect
   useEffect(() => {
       if (!window.YT) {
           const script = document.createElement('script');
           script.src = 'https://www.youtube.com/iframe_api';
           document.head.appendChild(script);
       }
   }, []);
   ```

### Rate Limits

- **Default Quota**: 10,000 units/day
- **Search Request**: 100 units
- **Video List Request**: 1 unit
- **Quota Exceeded**: Falls back to error handling, shows user-friendly message

### Security Considerations

- **API Key Exposure**: YouTube API key is public (designed for client-side use)
- **Restrictions**: Should restrict by HTTP referrer or IP in Google Cloud Console
- **OAuth Scopes**: Only request necessary scopes (`youtube.readonly`)

---

## SPOTIFY API INTEGRATION

### File Location
- **Plugin**: `js/plugins/omega-spotify-player.js`
- **Commands**: `js/commands/entertainment.js` (spotify subcommands)
- **Callback Page**: `pages/spotify-callback.html`

### Configuration

```javascript
const SPOTIFY_CONFIG = {
    CLIENT_ID: 'dc96d602cecc4ff0a28e122dc71fa8af',
    REDIRECT_URI: window.location.origin + '/pages/spotify-callback.html',
    SCOPES: [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-library-read',
        'playlist-read-private',
        'user-top-read'
    ].join(' '),
    TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token'
};
```

### Authentication Flow (PKCE)

**Step 1: Generate Code Verifier & Challenge**
```javascript
// Generate random 64-character string
const codeVerifier = generateRandomString(64);

// Hash with SHA-256 and base64url encode
const codeChallenge = await generateCodeChallenge(codeVerifier);

// Store code verifier in localStorage for later
localStorage.setItem('spotify_code_verifier', codeVerifier);
```

**Step 2: Redirect to Authorization**
```javascript
const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPES)}` +
    `&code_challenge_method=S256` +
    `&code_challenge=${codeChallenge}` +
    `&show_dialog=true`;
    
window.location.href = authUrl;
```

**Step 3: Exchange Code for Token** (in callback page)
```javascript
const code = urlParams.get('code');
const codeVerifier = localStorage.getItem('spotify_code_verifier');

const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier
    })
});

const data = await response.json();
// Store access_token, refresh_token, expires_in
```

### API Endpoints Used

1. **Authorization**
   ```
   GET https://accounts.spotify.com/authorize
   POST https://accounts.spotify.com/api/token
   ```

2. **Web Playback SDK**
   - **Script**: `https://sdk.scdn.co/spotify-player.js`
   - **Usage**: `new Spotify.Player({ name, getOAuthToken, volume })`

3. **REST API Endpoints**
   ```
   GET https://api.spotify.com/v1/search?q={query}&type=track&limit=20
   GET https://api.spotify.com/v1/me/playlists?limit=20
   PUT https://api.spotify.com/v1/me/player/play?device_id={deviceId}
   GET https://api.spotify.com/v1/me/player
   ```

### Setup Steps for Next.js

1. **Create Spotify App**:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create app (name: "Omega Terminal")
   - Add redirect URI: `http://localhost:3000/api/spotify/callback` (dev)
   - Add redirect URI: `https://yourdomain.com/api/spotify/callback` (prod)
   - Copy Client ID

2. **Environment Variables**:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
   ```

3. **Next.js Implementation**:
   ```javascript
   // lib/spotify-config.js
   export const SPOTIFY_CONFIG = {
       CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
       REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
       // ... rest of config
   };
   
   // pages/api/spotify/callback.js
   export default async function handler(req, res) {
       const { code } = req.query;
       // Exchange code for token server-side
       // Return token to frontend via postMessage or redirect
   }
   ```

### Token Management

- **Storage**: `localStorage` (`spotify_access_token`, `spotify_refresh_token`, `spotify_token_expiry`)
- **Refresh**: Tokens expire after 1 hour, use refresh token to get new access token
- **Validation**: Check `tokenExpiry` before API calls

### Rate Limits

- **Web API**: 10,000 requests per hour per user
- **Search**: No specific limit, but rate-limited by IP
- **Playback**: Limited by Spotify Premium subscription

### Security Considerations

- **PKCE Flow**: Required for public clients (no client secret)
- **Redirect URI Validation**: Must match exactly in Spotify dashboard
- **Token Storage**: Consider using `httpOnly` cookies for production
- **HTTPS Required**: All redirect URIs must use HTTPS in production

---

## RELAYER/PROXY SYSTEM

### Overview

The relayer acts as a CORS proxy and authentication layer for third-party APIs that:
1. Don't support CORS
2. Require server-side authentication
3. Have rate limits that need central management

### Relayer Server

**File**: `server/relayer-faucet.js`  
**Deployment**: Render.com (`https://terminal-v1-5-9.onrender.com`)

### Configuration

```javascript
// js/config.js
RELAYER_URL: "https://terminal-v1-5-9.onrender.com"
```

### Proxy Endpoints

#### 1. Kalshi Proxy (`/kalshi/*`)

**Authentication**: Server-side RSA-PSS signing
- **Environment Variables**: `KALSHI_API_KEY`, `KALSHI_PRIVATE_KEY` (PEM format)
- **Endpoints**:
  ```
  GET /kalshi/markets?limit=10&status=open
  GET /kalshi/markets/{ticker}
  GET /kalshi/events?status=open
  GET /kalshi/events/{eventTicker}
  GET /kalshi/series/{seriesTicker}
  ```

**Implementation**:
```javascript
// Frontend
const baseURL = `${RELAYER_URL}/kalshi`;
const response = await fetch(`${baseURL}/markets?limit=10`);

// Server (relayer-faucet.js)
app.get('/kalshi/*', async (req, res) => {
    const path = req.path.replace('/kalshi', '');
    const message = `${req.method}${path}${timestamp}`;
    const signature = signKalshiRequest(message);
    
    const apiResponse = await axios.get(`https://api.trade.kalshi.com/trade-api/v2${path}`, {
        headers: {
            'X-Api-Key': KALSHI_API_KEY,
            'X-Timestamp': timestamp,
            'X-Signature': signature
        }
    });
    
    res.json(apiResponse.data);
});
```

#### 2. Polymarket Proxy (`/polymarket/*`)

**Endpoints**:
```
GET /polymarket/events?order=id&ascending=false&closed=false&limit=100
GET /polymarket/events?order=volume&ascending=false&closed=false&limit=50
```

**Implementation**:
```javascript
// Frontend
const response = await fetch(`${RELAYER_URL}/polymarket/events?order=id&ascending=false&closed=false&limit=100`);

// Server
app.get('/polymarket/*', async (req, res) => {
    const path = req.path.replace('/polymarket', '');
    const apiUrl = `https://clob.polymarket.com${path}`;
    const response = await axios.get(apiUrl);
    res.json(response.data);
});
```

#### 3. DexScreener Proxy (`/dex/*`)

**Endpoints**:
```
GET /dex/search?q=BTC
GET /dex/trending
```

**Implementation**:
```javascript
// Frontend
const response = await fetch(`${RELAYER_URL}/dex/search?q=${encodeURIComponent(query)}`);

// Server
app.get('/dex/*', async (req, res) => {
    const path = req.path.replace('/dex', '');
    const apiUrl = `https://api.dexscreener.com/latest${path}`;
    const response = await axios.get(apiUrl);
    res.json(response.data);
});
```

#### 4. CoinGecko Proxy (`/gecko/*`)

**Endpoints**:
```
GET /gecko/search?q=bitcoin
GET /gecko/networks
GET /gecko/networks/{network}/dexes
```

#### 5. Magic Eden Proxy (`/magiceden/*`)

**Endpoints**:
```
GET /magiceden/activities?symbol={collection}&limit=10
GET /magiceden/stats?symbol={collection}
GET /magiceden/listings?symbol={collection}&limit=10
GET /magiceden/trending?timeRange=7d
```

#### 6. Alpha Vantage Stock API (`/stock/*`)

**Endpoints**:
```
GET /stock/quote/{symbol}
GET /stock/daily/{symbol}
GET /stock/overview/{symbol}
GET /stock/inflation
```

**API Key**: Stored server-side in relayer environment

#### 7. Jupiter (Solana DEX Aggregator) (`/jupiter/*`)

**Endpoints**:
```
GET /jupiter/search?q={query}
POST /jupiter/quote
POST /jupiter/swap
```

### Next.js Migration Strategy

**Option 1: Keep Relayer (Recommended)**
- Keep existing relayer for APIs requiring server-side auth
- Add Next.js API routes for new features
- Gradually migrate to Next.js API routes

**Option 2: Migrate to Next.js API Routes**
```javascript
// pages/api/kalshi/[...path].js
export default async function handler(req, res) {
    const path = req.query.path.join('/');
    const message = `${req.method}/${path}${timestamp}`;
    const signature = signKalshiRequest(message);
    
    const response = await fetch(`https://api.trade.kalshi.com/trade-api/v2/${path}`, {
        headers: {
            'X-Api-Key': process.env.KALSHI_API_KEY,
            'X-Timestamp': timestamp,
            'X-Signature': signature
        }
    });
    
    const data = await response.json();
    res.json(data);
}
```

**Environment Variables Needed**:
```env
KALSHI_API_KEY=your_key
KALSHI_PRIVATE_KEY=your_private_key_pem
ALPHA_VANTAGE_API_KEY=your_key
```

---

## OTHER API INTEGRATIONS

### 1. ChainGPT API

**Location**: `js/config.js` (CHAINGPT config)

**Configuration**:
```javascript
CHAINGPT: {
    PRODUCTION_API_KEY: null, // Loaded from /api/env
    DEFAULT_API_KEYS: [
        "5e9305e6-7713-4216-9bed-e554e9bb8d08",
        // JWT token fallback
    ],
    BASE_URL: "https://api.chaingpt.org",
    CHAT_ENDPOINT: "/chat/stream",
    NFT_ENDPOINT: "/nft/generate-nft",
    SMART_CONTRACT_ENDPOINT: "/chat/stream",
    AUDITOR_ENDPOINT: "/chat/stream"
}
```

**Endpoints**:
```
POST https://api.chaingpt.org/chat/stream
POST https://api.chaingpt.org/nft/generate-nft
```

**Environment Variable Loading**:
```javascript
// api/env.js (Vercel)
export default function handler(req, res) {
    res.json({
        CHAINGPT_API_KEY: process.env.CHAINGPT_API_KEY || null
    });
}

// Frontend
const response = await fetch('/api/env');
const { CHAINGPT_API_KEY } = await response.json();
```

**Next.js Setup**:
```javascript
// .env.local
CHAINGPT_API_KEY=your_key_here

// pages/api/env.js
export default function handler(req, res) {
    res.json({
        CHAINGPT_API_KEY: process.env.CHAINGPT_API_KEY || null
    });
}
```

### 2. Crypto News APIs

**File**: `js/commands/crypto-news.js`

**Providers** (with fallback order):
1. **CryptoPanic** (Primary)
   - API Key: `65692f21a0c18da010338deedff46f3c67fcc89`
   - Endpoint: `https://cryptopanic.com/api/v1/posts/`
   - Rate Limit: 100 requests/hour

2. **CryptoCompare** (Fallback)
   - Endpoint: `https://min-api.cryptocompare.com/data/v2/news/`
   - Rate Limit: 100,000 requests/month
   - No API key required

3. **NewsAPI** (Fallback)
   - API Key: `0f9555cb63414820a8b47e2360befde2`
   - Endpoint: `https://newsapi.org/v2/everything`
   - Rate Limit: 1,000 requests/day

**Implementation**:
```javascript
async getNews(options) {
    for (const source of ['cryptopanic', 'cryptocompare', 'newsapi']) {
        try {
            const news = await this.fetchFromSource(source, options);
            if (news && news.length > 0) return news;
        } catch (error) {
            continue; // Try next source
        }
    }
    return this.getMockNews(limit); // Final fallback
}
```

**Next.js Setup**:
```javascript
// .env.local
CRYPTOPANIC_API_KEY=your_key
NEWSAPI_KEY=your_key

// lib/crypto-news.js
const CRYPTOPANIC_API_KEY = process.env.CRYPTOPANIC_API_KEY;
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
```

### 3. Blockchain RPC Endpoints

**Ethereum**: `https://eth.llamarpc.com`
**BSC**: `https://bsc-dataseed.binance.org`
**Polygon**: `https://polygon-rpc.com`
**Arbitrum**: `https://arb1.arbitrum.io/rpc`
**Optimism**: `https://mainnet.optimism.io`
**Base**: `https://mainnet.base.org`
**Solana**: `https://api.mainnet-beta.solana.com`
**Near**: `https://rpc.mainnet.near.org`
**Omega Network**: `https://0x4e454228.rpc.aurora-cloud.dev`

**Next.js Setup**:
- Can use directly from client or server
- Consider using Next.js API routes for sensitive operations
- Use environment variables for custom RPC URLs

---

## ENVIRONMENT VARIABLES

### Required Environment Variables

#### Production (Vercel/Render)

```env
# Spotify
SPOTIFY_CLIENT_ID=dc96d602cecc4ff0a28e122dc71fa8af

# Kalshi (Relayer)
KALSHI_API_KEY=your_api_key_id
KALSHI_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----

# Alpha Vantage (Relayer)
ALPHA_VANTAGE_API_KEY=Y4N6LC9U5OH8Q4MQ

# ChainGPT
CHAINGPT_API_KEY=your_chain_gpt_key

# YouTube (Client-side, can be NEXT_PUBLIC)
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyCpz49l79hdPYN1VmREpPjylwlHmfki3S0
NEXT_PUBLIC_YOUTUBE_CLIENT_ID=119481701339-b4fm5sujtt2mjupu2rk1s2v749cess44.apps.googleusercontent.com

# Crypto News
CRYPTOPANIC_API_KEY=65692f21a0c18da010338deedff46f3c67fcc89
NEWSAPI_KEY=0f9555cb63414820a8b47e2360befde2

# Relayer URL (if keeping relayer)
NEXT_PUBLIC_RELAYER_URL=https://terminal-v1-5-9.onrender.com
```

#### Development

```env
# Same as production, but use localhost for relayer
NEXT_PUBLIC_RELAYER_URL=http://localhost:4000
```

### Environment Variable Access Patterns

**Client-Side** (use `NEXT_PUBLIC_` prefix):
```javascript
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
```

**Server-Side** (API routes, getServerSideProps):
```javascript
const apiKey = process.env.CHAINGPT_API_KEY;
```

**Runtime Loading** (via API endpoint):
```javascript
// pages/api/env.js
export default function handler(req, res) {
    res.json({
        CHAINGPT_API_KEY: process.env.CHAINGPT_API_KEY || null
    });
}

// Frontend
const response = await fetch('/api/env');
const { CHAINGPT_API_KEY } = await response.json();
```

---

## NEXT.JS MIGRATION STRATEGY

### Phase 1: Configuration Migration

1. **Create Environment Files**:
   ```
   .env.local (development)
   .env.production (production)
   ```

2. **Migrate Config Files**:
   - Create `lib/config.ts` with TypeScript types
   - Migrate `js/config.js` to Next.js structure
   - Use environment variables for all API keys

3. **Create API Route Structure**:
   ```
   pages/api/
   ├── env.js (environment variables)
   ├── spotify/
   │   ├── callback.js (OAuth callback)
   │   └── token.js (token refresh)
   ├── kalshi/[...path].js (proxy)
   ├── polymarket/[...path].js (proxy)
   └── ... (other proxies)
   ```

### Phase 2: Plugin Migration

1. **YouTube Player**:
   - Convert to React component
   - Use `useEffect` for IFrame API loading
   - Store config in environment variables

2. **Spotify Player**:
   - Convert to React component
   - Use Next.js API route for OAuth callback
   - Store tokens in cookies (server-side) or localStorage (client-side)

3. **Command System**:
   - Migrate to API routes for server-side commands
   - Keep client-side commands in components/hooks

### Phase 3: Proxy Migration

**Option A: Keep Relayer** (Easier)
- Keep existing relayer running
- Add Next.js API routes for new features
- Gradually migrate endpoints

**Option B: Migrate to Next.js API Routes** (Cleaner)
- Copy relayer logic to Next.js API routes
- Update frontend to use `/api/*` instead of relayer URL
- Remove relayer dependency

### Phase 4: Authentication Migration

1. **Spotify OAuth**:
   ```javascript
   // pages/api/spotify/callback.js
   export default async function handler(req, res) {
       const { code } = req.query;
       // Exchange code for token
       // Set httpOnly cookie
       res.redirect('/');
   }
   ```

2. **Kalshi Authentication**:
   - Keep server-side (API route or relayer)
   - Never expose private keys to client

3. **Token Management**:
   - Use `httpOnly` cookies for sensitive tokens
   - Use `localStorage` for non-sensitive tokens
   - Implement refresh token rotation

### Phase 5: API Route Structure

```
pages/api/
├── auth/
│   ├── spotify/
│   │   ├── callback.js
│   │   └── refresh.js
│   └── ...
├── proxy/
│   ├── kalshi/[...path].js
│   ├── polymarket/[...path].js
│   ├── dex/[...path].js
│   └── ...
├── env.js
└── ...
```

### Example: Kalshi Proxy in Next.js

```javascript
// pages/api/proxy/kalshi/[...path].js
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const path = req.query.path.join('/');
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const message = `GET/${path}${timestamp}`;
    
    // Sign request
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(message);
    const signature = sign.sign(
        {
            key: process.env.KALSHI_PRIVATE_KEY,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
        },
        'base64'
    );
    
    // Make API request
    const apiResponse = await fetch(`https://api.trade.kalshi.com/trade-api/v2/${path}`, {
        headers: {
            'X-Api-Key': process.env.KALSHI_API_KEY,
            'X-Timestamp': timestamp,
            'X-Signature': signature,
        },
    });
    
    const data = await apiResponse.json();
    res.json(data);
}
```

---

## API CONFIGURATION FILES

### Current Configuration Files

1. **`js/config.js`**: Main configuration
   - Relayer URL
   - ChainGPT config
   - Available commands
   - Theme options

2. **`api/env.js`**: Environment variable API endpoint (Vercel)
   - Returns safe environment variables to frontend
   - Currently only returns `CHAINGPT_API_KEY`

3. **`server/relayer-faucet.js`**: Relayer server
   - All proxy endpoints
   - Database operations
   - Blockchain interactions

### Next.js Configuration Structure

```
lib/
├── config.ts (main config)
├── api/
│   ├── youtube.ts
│   ├── spotify.ts
│   ├── kalshi.ts
│   └── ...
└── constants/
    └── endpoints.ts

pages/api/
├── env.ts (environment variables)
└── proxy/
    └── ... (proxy endpoints)
```

---

## SUMMARY

### Key Takeaways for Next.js Migration

1. **YouTube**: Client-side API key, use `NEXT_PUBLIC_` prefix
2. **Spotify**: PKCE OAuth flow, use Next.js API route for callback
3. **Relayer APIs**: Migrate to Next.js API routes or keep relayer
4. **Environment Variables**: Use `.env.local` for dev, Vercel env vars for prod
5. **Security**: Keep sensitive keys server-side (API routes), expose only safe vars to client
6. **Fallback Systems**: Maintain multi-provider fallback logic
7. **Rate Limiting**: Consider implementing rate limiting in API routes

### Migration Checklist

- [ ] Set up `.env.local` with all API keys
- [ ] Create `lib/config.ts` with environment variable access
- [ ] Migrate YouTube player to React component
- [ ] Migrate Spotify OAuth to Next.js API routes
- [ ] Create Next.js API routes for proxy endpoints (or keep relayer)
- [ ] Migrate environment variable loading to `/api/env`
- [ ] Update all API calls to use new endpoints
- [ ] Test all API integrations in Next.js environment
- [ ] Set up production environment variables
- [ ] Update documentation with new API structure

---

**END OF API SETUP GUIDE**

