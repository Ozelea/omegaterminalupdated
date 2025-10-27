/**
 * Script to inject environment variables into the frontend
 * This runs during the build process to make env vars available to the client
 */

const fs = require('fs');
const path = require('path');

// Read the main HTML file
const htmlPath = path.join(__dirname, '..', 'terminal.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Create environment variables object
const envVars = {
  CHAINGPT_API_KEY: process.env.CHAINGPT_API_KEY || null
};

// Create a script tag to inject the environment variables
const envScript = `
<script>
  // Environment variables injected during build
  window.ENV = ${JSON.stringify(envVars)};
  console.log('[DEBUG] Environment variables loaded:', window.ENV);
</script>`;

// Inject the script before the closing head tag
htmlContent = htmlContent.replace('</head>', `${envScript}\n</head>`);

// Write the modified HTML back
fs.writeFileSync(htmlPath, htmlContent);

console.log('✅ Environment variables injected into HTML');
console.log('📋 Available env vars:', Object.keys(envVars));
