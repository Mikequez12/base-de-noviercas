bdd = {
  "Markel Rosco Matxain": {'DSR':"747821BV238AX"},
  "Ander Ímaz Ucedo": {'DSR':"218216BF109KA"},
  "Nekane Matxain Irastorza": {'DSR':"447269HS162WH"},
  "Vika Lesmes Gil": {'DSR':"154134AN225IL"}
};

// Detecta si el script se está ejecutando en el contexto de una página HTML
if (!document.currentScript) {
  // Si se está abriendo directamente en el navegador, muestra una alerta
  alert('Acceso bloqueado');
} else {
  // Si se está ejecutando dentro de una página HTML, realiza la operación normal
  document.addEventListener('DOMContentLoaded', () => {
    const messageElement = document.getElementById('message');
    if (messageElement) {
      messageElement.textContent = 'Este es un mensaje secreto incluido por el script.';
    }
  });
}
