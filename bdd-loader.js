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
  // Asegúrate de que `window.bdd` esté definido y contiene datos válidos
  if (window.bdd) {
    try {
      const decodedData = reveal_data(window.bdd, 5);
      console.log(decodedData);
      const jsonData = JSON.parse(decodedData);
      console.log(jsonData);
      window.data = jsonData;
    } catch (e) {
      console.error('Error processing data:', e);
    }
  } else {
    console.error('window.bdd is not defined');
  }
}

// Crea el script y adjúntalo al documento
let bddScript = document.createElement('script');
bddScript.charset = 'utf-8';
bddScript.src = 'https://mikequez12.github.io/base-de-noviercas/bdd.js';
bddScript.onload = onScriptLoad;  // Configura el manejador para cuando el script se cargue
bddScript.onerror = function() {
  console.error('Failed to load the script.');
};
document.head.appendChild(bddScript);

console.log(window.bdd);
window.bdd = JSON.parse(window.bdd);
console.log(window.bdd);
