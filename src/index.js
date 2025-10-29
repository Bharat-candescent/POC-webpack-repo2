// In the MFE's entry file (e.g., src/index.js or src/bootstrap.js)

// IMPORTANT: Identify the URL of the SCRIPT TAG that loaded THIS MFE
const script = document.querySelector(`script[src*="remoteEntry.js"]`);
if (script) {
  // Extract the MFE's base URL from the script tag's source attribute
  // Example: If src is https://poc-webpack-repo4.vercel.app/remoteEntry.js, we get the base URL
  const publicPath = script.src.substring(0, script.src.lastIndexOf('/') + 1);
  
  // FIX: Immediately tell Webpack where to load chunks from
  __webpack_public_path__ = publicPath;
}

// Ensure the main logic is dynamically imported (as you did previously)
import('./bootstrap');