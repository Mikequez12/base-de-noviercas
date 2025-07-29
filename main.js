var msgPanel;

function alert(text, duration = 5000) {
  const msg = msgPanel.appendChild(document.createElement('div'));
  msg.classList.add('alert');
  msg.id = `alert-${Date.now()}-${Math.random()}`;
  msg.textContent = text;

  setTimeout(() => {
    msg.style.opacity = 1;
  }, 100);

  setTimeout(() => {
    msg.style.opacity = 0;
    setTimeout(() => {
      msg.style.opacity = '0';
      msg.style.maxHeight = '0';
      msg.style.margin = '0';
      msg.style.padding = '0';
      setTimeout(() => {
        msg.remove();
      }, 5000);
    }, 300);
  }, duration - 300);
}

function createTopbarButton(id, event, title, def = 0) {
  let button = topbar.appendChild(document.createElement('button'));
  button.classList.add('corner-btn');
  if (def == 0) {
    button.classList.add('alternative');
  }
  button.id = id;

  button.addEventListener('click', event);

  button.title = title;

  return button;
}

var topbar;

document.addEventListener('DOMContentLoaded', (event) => {
  topbar = document.body.appendChild(document.createElement('div'));
  topbar.id = 'topbar';
  createTopbarButton('home', () => window.location.href = './', 'Página principal', 1);
  createTopbarButton('rules', () => window.location.href = 'reglamento', 'Reglamento', 1);
  createTopbarButton('account', () => window.location.href = 'account', 'Cuenta', 1);
  createTopbarButton('help', () => window.location.href = 'help', 'Ayuda', 1);
  createTopbarButton('news', () => window.location.href = 'noticias', 'Noticias', 1);
  createTopbarButton('tours', () => window.location.href = 'tours', 'Tours', 1);

  msgPanel = document.body.appendChild(document.createElement('div'));
  msgPanel.id = 'msgPanel';

  domload();
});

async function getUsers() {
  let values = await fetch('https://sheets.googleapis.com/v4/spreadsheets/1RCxdryrlsUn37VZz5UlndUcFWjCUDElhGQMJLTfx6rk/values/signup?key=AIzaSyCPoCo9JcBf6_p7JqlPDZ_6frBODdw4EAI')
    .then(response => response.json())
    .then(content => content.values);
  let headers = values[0].slice(10);
  let data = values.slice(1);
  data = data.map(v => v.slice(10)).filter(v => v.length != 0);

  let response = {};
  data.forEach(row => {
    response[row[0]] = {};
    headers.forEach((k, i) => {
      response[row[0]][k] = row[i];
    });
  });

  return response;
}

function createPersonalToken(length = 30) {
  const char = '0123456789ABCDEF';
  return Array.from({ length: length }, () => char[Math.floor(Math.random() * (char.length - 1))]).join('');
}

String.prototype.reverse = function () {
  return this.split('').reverse().join('');
};

function encode(txt) {
  return btoa(btoa(txt).reverse());
}

function decode(txt) {
  return atob(atob(txt).reverse());
}

async function getTours() {
  data = await fetch('https://sheets.googleapis.com/v4/spreadsheets/1RCxdryrlsUn37VZz5UlndUcFWjCUDElhGQMJLTfx6rk/values/tour-whitelist?key=AIzaSyCPoCo9JcBf6_p7JqlPDZ_6frBODdw4EAI')
    .then(response => response.json())
    .then(response => response.values.slice(1));

  console.log(data);

  let response = {};

  for (let row of data) {
    if (!Object.keys(response).includes(row[2])) {
      response[row[2]] = [];
      console.log(row[2]);
    }
    response[row[2]].push(row[3]);
    console.log(response[row[2]]);
  }

  return response;
}

function cookieToken(token, userdata) {
  localStorage.setItem('token', encode(token));
  localStorage.setItem('tokenExp', encodeURIComponent(new Date(new Date().getTime() + 5 * 60 * 1000).toISOString()));
  localStorage.setItem('tokenAcc', encodeURIComponent(userdata.mail));
  return encode(token);
}

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

document.addEventListener('DOMContentLoaded', (event) => {
  let emailjsScript = document.createElement('script');
  emailjsScript.src = "https://cdn.emailjs.com/dist/email.min.js";
  emailjsScript.onload = () => {
    emailjs.init("qWFBbuoanu6zZMeAR");
  };
  document.head.appendChild(emailjsScript);
});

async function sendLoginMail(token, dsr) {
  document.querySelectorAll('form#mail').forEach(l => l.remove());
  let form = document.body.appendChild(document.createElement('form'));
  form.id = 'mail';
  form.innerHTML = `
  <input type="hidden" name="user_name" id="user_name">
  <input type="hidden" name="token" id="token">
  <input type="hidden" name="to_email" id="to">
  `;
  let users = await getUsers();
  form.querySelector('#user_name').value = users[dsr].name;
  form.querySelector('#to').value = users[dsr].mail;
  form.querySelector('#token').value = token;

  emailjs.sendForm("service_cot9xcm", "template_itwz36b", form)
    .then(function (response) {
      alert("Correo enviado con éxito ✅");
    }, function (error) {
      console.error("Fallo al enviar", error);
      alert("Error al enviar el correo ❌");
    });
}
