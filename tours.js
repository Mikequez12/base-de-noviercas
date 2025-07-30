function domload() {
  createTopbarButton('searchtours', searchTours,'Buscar tours')
}

var details;

function showTour(ev,data) {
  document.querySelectorAll('button#tour.gray').forEach((el) => el.classList.remove('gray'));
  ev.target.classList.add('gray');
  
  details.querySelector('#'+"id").textContent=data[0];
  details.querySelector('#'+"name").textContent=data[1];
  details.querySelector('#'+'date').textContent=data[2];
  details.querySelector('#'+'details').textContent=data[3];
  details.querySelector('#'+"aviability").textContent=data[4];
  details.querySelector('#'+"necessary").textContent=data[5]=='TRUE'?'☑':'☐';
}

async function searchTours() {
  let tourScreen = document.body.appendChild(document.createElement('div'));
  tourScreen.id = 'blackscreen';
  tourScreen.style.display = 'flex';
  
  let toplevel = tourScreen.appendChild(document.createElement('div'));
  toplevel.style.position = 'relative';
  toplevel.classList.add('page');
  toplevel.style.width = 'calc(100vw - 400px)';
  toplevel.style.height = 'calc(100vh - 400px)';
  toplevel.style.margin = 'auto';
  toplevel.style.display = 'flex';
  toplevel.style.flexDirection = 'row';
  toplevel.style.flexWrap = 'nowrap';

  let tourFrame = toplevel.appendChild(document.createElement('div'));
  tourFrame.appendChild(document.createElement('h1')).textContent = `Tours disponibles`;
  tourFrame.style.height = '100%';
  tourFrame.style.minWidth = 'calc(70% - 300px - 10px)'
  tourFrame.style.width = 'calc(70% - 20px)';
  tourFrame.style.paddingRight = '10px';
  tourFrame.style.borderRight = 'solid 2px white';
  
  let close = toplevel.appendChild(document.createElement('button'));
  close.id = 'close';
  close.style.position = 'absolute';
  close.style.right = '5px';
  close.style.top = '5px';
  close.style.width = '30px';
  close.style.height = '30px';
  close.style.backgroundSize = 'cover';
  close.style.backgroundImage = 'var(--url)';
  close.addEventListener('click',(event)=>event.target.parentElement.parentElement.remove())
  
  let tourDiv = tourFrame.appendChild(document.createElement('div'));
  tourDiv.style.overflowY = 'auto';
  tourDiv.style.height = '100%';
  
  details = toplevel.appendChild(document.createElement('div'));
  details.style.width = '20%';
  details.style.minWidth = '200px';
  details.style.textAlign = 'left';
  details.innerHTML = `
  <div><b>ID: </b><span id="id"></span></div>
  <div><b>Disponible para: </b><span id="aviability"></span></div>
  <div><b>DSR necesario: </b><span id="necessary"></span></div>
  <div><b>Nombre: </b><span id="name"></span></div>
  <div><b>Fecha y hora: </b><span id='date'></span></div>
  <div><b>Detalles: </b><span id='details'></span></div>
  `;
  details.id = 'details';
  
  let tours = await fetch('https://sheets.googleapis.com/v4/spreadsheets/1RCxdryrlsUn37VZz5UlndUcFWjCUDElhGQMJLTfx6rk/values/tours?key=AIzaSyCPoCo9JcBf6_p7JqlPDZ_6frBODdw4EAI')
    .then(response=>response.json())
    .catch(error=>alert(error))
  tours = tours.values.slice(1);
  
  tours = tours.filter((el) => isoDate(el[2]) >= new Date())
  
  tours.forEach((tour) => {
    let btn = tourDiv.appendChild(document.createElement('button'));
    btn.id = 'tour';
    btn.setAttribute('code',tour[0]);
    btn.textContent = tour[1];
    btn.style.margin = '0 10';
    btn.addEventListener('click',(event) => showTour(event,tour))
  });
  
  return tourDiv;
}

function isoDate(input) {
  console.log(input);
  const [dia, mes, resto] = input.split('/');
  const [año, hora] = resto.split(' ');

  // Aseguramos que la hora esté bien formateada
  const [h, m, s] = hora.split(':');
  const horaISO = `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`;

  const iso = `${año}-${mes}-${dia}T${horaISO}`;
  const date = new Date(iso);
  return date;
}

async function hash() {
  let cd = window.location.hash.slice(1);
  let div = await searchTours();
  console.log(div);
  let responses = Array.from(div.querySelectorAll(`button`)).filter(el => el.getAttribute('code') == cd);
  if (responses.length < 1) {
    alert('Tour no encontrado');
  } else {
    responses[0].click()
  }
}

if (window.location.hash.slice(1).length > 0) {
  hash()
}