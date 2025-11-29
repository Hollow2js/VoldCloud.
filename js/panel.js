// panel.js — Host Panel simulation: dashboard, console, file manager
document.addEventListener('DOMContentLoaded', ()=>{
  const raw = localStorage.getItem('vold_user');
  if(!raw){ alert('No estás autenticado. Serás enviado a la página principal.'); location.href='index.html'; }
  const user = JSON.parse(raw);
  // fill server info
  document.getElementById('srv-name').innerText = user.name + "'s Server";
  document.getElementById('srv-plan').innerText = `Plan: ${user.plan}`;
  // set plan specific specs
  const planMap = {'Básico': ['1GB','1 vCPU'], 'Estándar': ['2GB','2 vCPU'], 'Premium': ['8GB','4 vCPU']};
  const specs = planMap[user.plan] || ['--','--'];
  document.getElementById('srv-ram').innerText = `RAM: ${specs[0]}`;
  document.getElementById('srv-cpu').innerText = `CPU: ${specs[1]}`;

  // navigation
  document.querySelectorAll('.side-btn').forEach(b=>{
    b.addEventListener('click', ()=> {
      document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
      document.getElementById('view-'+b.dataset.view).classList.add('active');
    });
  });

  // generate some fake stats
  function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min}
  document.getElementById('cpu-usage').innerText = rand(5,65) + '%';
  document.getElementById('ram-usage').innerText = rand(128,8192) + 'MB';
  document.getElementById('uptime').innerText = `${rand(0,7)}d ${rand(0,23)}h`;

  // Console simulation
  const consoleForm = document.getElementById('consoleForm');
  const consoleOut = document.getElementById('consoleOutput');
  const consoleInput = document.getElementById('consoleInput');

  function writeConsole(txt, type='out'){
    const p = document.createElement('div');
    p.className = 'line';
    p.textContent = txt;
    consoleOut.appendChild(p);
    consoleOut.scrollTop = consoleOut.scrollHeight;
  }
  writeConsole(`Bienvenido a la consola de ${user.name}. Escribe "help" para ver comandos.`);

  consoleForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const cmd = consoleInput.value.trim();
    if(!cmd) return;
    writeConsole(`$ ${cmd}`);
    handleCmd(cmd);
    consoleInput.value='';
  });

  function handleCmd(cmd){
    const parts = cmd.split(' ').filter(Boolean);
    const c = parts[0];
    if(c === 'help'){
      writeConsole('Comandos: help, ls, cat <file>, echo <texto>, clear');
    } else if(c === 'ls'){
      const files = Object.keys(getFiles());
      writeConsole(files.length ? files.join('  ') : '(vacio)');
    } else if(c === 'clear'){
      consoleOut.innerHTML='';
    } else if(c === 'cat'){
      const name = parts[1];
      if(!name) writeConsole('Uso: cat <archivo>');
      else {
        const files = getFiles();
        if(files[name]===undefined) writeConsole(`cat: ${name}: No existe el archivo`);
        else writeConsole(files[name]);
      }
    } else if(c === 'echo'){
      writeConsole(parts.slice(1).join(' '));
    } else {
      writeConsole(`${c}: comando no encontrado`);
    }
  }

  // File manager (stored in localStorage under 'vold_files')
  function getFiles(){
    try{ return JSON.parse(localStorage.getItem('vold_files')||'{}'); }catch(e){ return {}; }
  }
  function setFiles(obj){ localStorage.setItem('vold_files', JSON.stringify(obj)); }

  const fileList = document.getElementById('fileList');
  const newFilename = document.getElementById('newFilename');
  const createFileBtn = document.getElementById('createFileBtn');
  const fileEditor = document.getElementById('fileEditor');
  const editingFileName = document.getElementById('editingFileName');
  const fileContent = document.getElementById('fileContent');
  const saveFileBtn = document.getElementById('saveFileBtn');
  const closeEditor = document.getElementById('closeEditor');

  function renderFiles(){
    const files = getFiles();
    fileList.innerHTML = '';
    if(Object.keys(files).length===0){
      fileList.innerHTML = '<div class="muted">No hay archivos. Crea uno nuevo arriba.</div>';
      return;
    }
    Object.keys(files).forEach(fn=>{
      const el = document.createElement('div');
      el.className = 'file-item';
      el.innerHTML = `<strong>${fn}</strong><div class="fbtns"><button class="btn open">${'Abrir'}</button> <button class="btn-outline del">Eliminar</button></div>`;
      el.querySelector('.open').addEventListener('click', ()=> openFile(fn));
      el.querySelector('.del').addEventListener('click', ()=>{
        if(confirm('Eliminar '+fn+'?')){ const f = getFiles(); delete f[fn]; setFiles(f); renderFiles(); }
      });
      fileList.appendChild(el);
    });
  }

  function openFile(name){
    const files = getFiles();
    editingFileName.innerText = name;
    fileContent.value = files[name] || '';
    fileEditor.classList.remove('hidden');
  }

  createFileBtn.addEventListener('click', ()=>{
    const name = newFilename.value.trim();
    if(!name){ alert('Escribe un nombre de archivo'); return; }
    const files = getFiles();
    if(files[name]){ alert('Ya existe un archivo con ese nombre'); return; }
    files[name] = `# Nuevo archivo ${name}\n`; setFiles(files); renderFiles(); newFilename.value='';
  });

  saveFileBtn.addEventListener('click', ()=>{
    const name = editingFileName.innerText;
    const files = getFiles(); files[name] = fileContent.value; setFiles(files); renderFiles(); alert('Guardado');
  });
  closeEditor.addEventListener('click', ()=> fileEditor.classList.add('hidden'));

  // initial render
  renderFiles();

  // logout
  document.getElementById('logoutBtn').addEventListener('click', ()=>{
    // keep user but navigate back
    location.href='index.html';
  });
});
