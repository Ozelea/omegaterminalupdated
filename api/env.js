/**
 * Vercel API endpoint to serve environment variables to the frontend
 * This provides a secure way to access environment variables in the client
 */

export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Return environment variables (only safe ones)
  const envVars = {
    CHAINGPT_API_KEY: process.env.CHAINGPT_API_KEY || null,
    // Add other environment variables here as needed
    // CUSTOM_VAR: process.env.CUSTOM_VAR || null,
  };

  // Log for debugging (remove in production)
  console.log('[API] Environment variables requested');
  console.log('[API] CHAINGPT_API_KEY present:', !!envVars.CHAINGPT_API_KEY);

  res.status(200).json(envVars);
}
