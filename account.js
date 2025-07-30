var users;

function domload() {
  createTopbarButton("logout", () => {
    localStorage.removeItem('acc');
    window.location.reload();
  }, 'Cerrar sesión');
}

function waitForJsyalm() {
  return new Promise(resolve => {
    const check = () => {
      if (typeof jsyaml !== 'undefined') {
        resolve();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

document.addEventListener('DOMContentLoaded', async (event) => {
  await waitForJsyalm();

  function createTree(parent, data) {
    if (typeof data === "string") {
      const li = document.createElement("li");
      li.textContent = data;
      parent.appendChild(li);
    } else if (Array.isArray(data)) {
      const ul = document.createElement("ul");
      parent.appendChild(ul);
      data.forEach(item => {
        createTree(ul, item);
      });
    } else if (typeof data === "object") {
      Object.entries(data).forEach(([key, value]) => {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = key;
        details.appendChild(summary);

        const li = document.createElement("li");
        li.appendChild(details);

        parent.appendChild(li);

        createTree(details, value);
      });
    }
  }

  // Parse YAML and create treeview
  const treeContainer = document.querySelector('#protocol-page').appendChild(document.createElement('div'));
  treeContainer.id = 'protocols';

  const parsedData = jsyaml.load(await fetch('protocols.yaml')
    .then(response => response.text())
    .catch(error => alert(error)));
  parsedData.forEach((pd) => {
    let p = treeContainer.appendChild(document.createElement('div'));
    p.classList.add('page');
    p.appendChild(document.createElement('div'));
    let title = p.appendChild(document.createElement('h2'));
    let ldv = p.appendChild(document.createElement('div'));
    let dv = ldv.appendChild(document.createElement('div'));
    dv.style.textAlign = 'left';
    dv.style.margin = `auto`;
    let treeview = dv.appendChild(document.createElement('ul'));
    treeview.classList.add('tree');
    title.textContent = Object.keys(pd)[0];
    title.style.width = '100%';
    createTree(treeview, Object.values(pd)[0]);
    p.querySelector('*:not(h2)').style.margin = 'auto';
  })
})

function parseDate(fechaStr) {
  const [fechaPart, horaPart = '00:00:00'] = fechaStr.split(' ');
  const [dia, mes, anio] = fechaPart.split('/').map(Number);
  const [hora, min, seg] = horaPart.split(':').map(Number);
  return new Date(anio, mes - 1, dia, hora, min, seg);
}

function loadMainJS(timeout = 10000) {
  const interval = 50;
  let waited = 0;

  return new Promise((resolve, reject) => {
    const check = () => {
      if (typeof window.decode === 'function') {
        resolve();
      } else if (waited >= timeout) {
        reject(new Error("main.js no está disponible después del tiempo límite"));
      } else {
        waited += interval;
        setTimeout(check, interval);
      }
    };
    check();
  });
}

async function main() {
  if (window.location.hash != '') {
    await loadMainJS();

    if (window.location.hash.length > 0) {
      const cookies = parseCookies();
      const check = await fetch('https://base-de-noviercas.onrender.com/check',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: window.location.hash.slice(1)
        })
      }).then(r => r.json())
      if (check.ok) {
          localStorage.setItem('acc', check.values.dat.dsr);
        }
      } else {
        alert('El token no es válido. Revisa que no haya caducado.');
      }

      document.location.href = document.location.href.slice(0, document.location.href.length - document.location.hash.length);
      return false;
  } else {
    let dsr = localStorage.getItem('acc');
    if (dsr == undefined || dsr == '') {
      window.location.href = 'login';
    }
    users = await getUsers();
    document.querySelector('#name').textContent = users[dsr].name + ' ' + users[dsr].surname;
    document.querySelector('#mail').textContent = users[dsr].mail;
    document.querySelector('#dsr').textContent = dsr;
    document.querySelector('#rol').textContent = users[dsr].rol;
    document.querySelector('#qrcode').src = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${dsr}`;
    if (users[dsr].rol != "Administrador") {
      document.querySelector('#admin-content').remove()
    } else {
      document.querySelector('#admin-content').style.display = 'block';
    }

    let part = document.querySelector('#tour-participating');
    part.style.width = 'calc(100% - 25px)';
    part.style.minHeight = '10px';

    let trs = await getTours();

    let tours = await fetch('https://sheets.googleapis.com/v4/spreadsheets/1RCxdryrlsUn37VZz5UlndUcFWjCUDElhGQMJLTfx6rk/values/tours?key=AIzaSyCPoCo9JcBf6_p7JqlPDZ_6frBODdw4EAI')
      .then(response => response.json())
      .catch(error => alert(error));
    tours = tours.values.slice(1);
    tours = Object.fromEntries(
      tours.map(l => [l[0], l.slice(1)])
    );

    trs = Object.keys(trs).filter((k) => trs[k].includes(users[dsr].name + ' ' + users[dsr].surname) && tours[k] != undefined && new Date(parseDate(tours[k][1])) >= new Date());

    trs.forEach(cd => {
      let tour = document.createElement('div');
      if (tours[cd] == undefined) {
        tour.textContent = 'Tour no encontrado';
        tour.style.color = 'red';
      } else {
        tour.textContent = tours[cd][0];
      }
      tour.classList.add('visitor');
      tour.style.margin = 'auto';
      part.appendChild(tour);

      tour.style.cursor = 'pointer';
      tour.onclick = () => window.location.href = `tours#${cd}`;
    });
  };
  return true;
}

async function updateDSRDetector(event) {
  let key_ = event.target.value;
  let parent = event.target.parentElement.parentElement;
  let values = users;
  Object.keys(values).forEach(function (key, index) {
    values[key].dsr = key;
  });
  let nkey = {
    "DSR": ["dsr"],
    "Nombre y apellidos": ["name", "surname"],
    "Rol": ["rol"]
  }[event.target.parentElement.querySelector('span').textContent];
  if (nkey == 'dsr') {
    key_ = key_.toUpperCase();
  }
  values = Object.keys(values).filter((k, i) => {
    return nkey.map((l) => values[k][l]).join(' ') == key_
  });
  values = values[values.length - 1]
  if (values == undefined) {
    alert('El usuario no ha sido encontrado, verifica las mayúsculas y tildes en el nombre')
    return
  }
  values = users[values];
  parent.querySelectorAll('entry:not(:has(input#tour-code))').forEach((el) => {
    let id = el.querySelector('input').id;
    let nkey = {
      'search-dsr': ["dsr"],
      'search-name': ["name", "surname"],
      'search-rol': ["rol"],
      'search-parking': ['parking']
    }[id];
    el.querySelector('input').value = nkey.map((k) => values[k]).join(' ');
    if (id == 'search-parking') {
      el.querySelector('input').value = nkey.map((k) => values[k])[0] ? 'Sí' : 'No';
    }
  });
}

async function tourWhitelist(event) {
  let tourCode = event.target.value.toUpperCase();

  let content = await getTours();

  let div = event.target.parentElement.parentElement.querySelector('div#tour-whitelist');
  div.textContent = '';

  if (!Object.keys(content).includes(tourCode)) {
    alert('No se ha encontrado el Tour especificado');
    return
  }

  for (let user of content[tourCode]) {
    let visitor = div.appendChild(document.createElement('div'));
    visitor.textContent = user; visitor.classList.add('visitor');
  }
}

async function load() {
  let response = await main();
  if (response) { setTimeout(() => document.querySelector('logo').id = 'hide', 1000); }

  var searchParams;

  const interr = window.location.href.split('?');
  if (interr.length < 2) {
    return
  } else {
    searchParams = new URLSearchParams(interr[1]);
  }

  if (searchParams.has('dsr_search')) {
    document.querySelector('#search-dsr').value = searchParams.get('dsr_search').toUpperCase();
    updateDSRDetector({ target: document.querySelector('#search-dsr') });
    document.querySelector('#tour-participating').scrollIntoView({
      behavior: 'smooth'
    });
  }
}

document.addEventListener('DOMContentLoaded', () => load());

function parseCookies() {
  // Cambiado para que lea localStorage y devuelva el objeto igual que antes
  let result = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    result[key] = localStorage.getItem(key);
  }
  return result;
}