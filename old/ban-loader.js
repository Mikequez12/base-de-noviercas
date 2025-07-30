function base64ToBytes(base64) {
  const binString = atob(base64);
  return Uint8Array.from(binString, c => c.charCodeAt(0));
}

function reveal_data(t, i) {
  while (i-- > 0) {
    t = new TextDecoder().decode(base64ToBytes(t));
  }
  return t;
}

function onScriptLoad() {
  // Ensure `window.ban` is defined and contains valid data
  if (window.ban) {
    try {
      const decodedData = reveal_data(window.ban, 5);
      // Remove the eval, and instead treat decodedData as JSON directly
      const jsonData = decodedData.replace(/\n/g, '').replace(/'/g, '"');
      console.log('Decoded JSON String:', jsonData);

      // Attempt to parse the string to JSON
      window.data = JSON.parse(jsonData);
      console.log('Parsed Data:', window.data);
    } catch (e) {
      console.error('Error processing data:', e);
    }
  } else {
    console.error('window.ban is not defined');
  }
}

// Create and attach the script to the document
let bddScript = document.createElement('script');
bddScript.charset = 'utf-8';
bddScript.src = 'https://mikequez12.github.io/base-de-noviercas/ban.js';
document.head.appendChild(bddScript);
bddScript.onload = onScriptLoad;  // Set up the handler for when the script loads
bddScript.onerror = function() {
  console.error('Failed to load the script.');
};
