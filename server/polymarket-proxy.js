const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3002;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

console.log("🚀 Polymarket CORS Proxy starting...");

// Polymarket proxy endpoint - using middleware approach for Express 5
app.use("/polymarket", async (req, res) => {
  try {
    const polymarketPath = req.path;
    console.log(`📊 Polymarket path: ${polymarketPath}`);
    const polymarketUrl = `https://gamma-api.polymarket.com${polymarketPath}`;

    console.log(`📊 Proxying request: ${req.method} ${polymarketUrl}`);

    // Forward the request to Polymarket API
    const response = await axios({
      method: req.method,
      url: polymarketUrl,
      params: req.query,
      data: req.body,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Omega-Terminal/1.0",
      },
      timeout: 10000,
    });

    console.log(`✅ Response: ${response.status} ${response.statusText}`);
    res.json(response.data);
  } catch (error) {
    console.log(`❌ Polymarket Proxy Error: ${error.message}`);

    if (error.response) {
      res.status(error.response.status).json({
        error: "Polymarket API Error",
        status: error.response.status,
        message: error.response.statusText,
      });
    } else {
      res.status(500).json({
        error: "Proxy Error",
        message: error.message,
      });
    }
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Polymarket CORS Proxy", port: PORT });
});

app.listen(PORT, () => {
  console.log(`🚀 Polymarket CORS Proxy running on http://localhost:${PORT}`);
  console.log(`📊 Proxy endpoint: http://localhost:${PORT}/polymarket/*`);
  console.log(
    `💡 Usage: Send requests to http://localhost:${PORT}/polymarket/markets`
  );
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});
