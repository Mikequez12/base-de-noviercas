function parseCookies() {
  // Aquí si quieres mantener para compatibilidad,
  // Pero si usas solo localStorage, esta función puede quedar vacía o eliminada.
  // Para que no falle, devolveremos un objeto con las claves de localStorage.
  let result = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    result[key] = localStorage.getItem(key);
  }
  return result;
}

async function main() {
  let dsr = parseCookies().acc;
  let users = await getUsers();

  if (users[dsr].rol == "Administrador") {
    document.querySelector('body>.page').innerHTML = `
<link rel="stylesheet" href="style.css">

<div class='page' style="width:80%;">
  <h1>
    Escanea el DSR
  </h1>
  <video id="video" style="box-shadow:var(--shadow);border-radius:5px;border:solid 2px var(--main-color);" autoplay></video>
  <canvas id="canvas" style="display: none;"></canvas>
</div>
<script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"></script>
<script>
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => {
    const video = document.getElementById('video');
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          if (code.data != '') {
            window.location.href = 'https://mikequez12.github.io/base-de-noviercas/account?dsr_search=' + code.data;
          }
        }
      }
      requestAnimationFrame(tick);
    }
    tick();
  });
</script>

`;
  }
}

main();