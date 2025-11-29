// app.js — handles landing, purchase, and login (local simulation)
document.addEventListener('DOMContentLoaded', ()=> {
  document.getElementById('year').innerText = new Date().getFullYear();

  const buyButtons = document.querySelectorAll('.buy-btn');
  const modal = document.getElementById('purchaseModal');
  const closeModal = document.getElementById('closeModal');
  const purchaseForm = document.getElementById('purchaseForm');
  const purchaseMsg = document.getElementById('purchaseMsg');
  const loginForm = document.getElementById('loginForm');
  const loginMsg = document.getElementById('loginMsg');
  const btnStart = document.getElementById('btn-start');
  const goLogin = document.getElementById('go-login');
  const goToPlans = document.getElementById('go-to-plans');

  function openModal(planCard){
    const title = planCard.getAttribute('data-plan');
    const price = planCard.getAttribute('data-price');
    document.getElementById('selectedPlanTitle').innerText = `Comprar - ${title}`;
    document.getElementById('metaPlan').innerText = title;
    document.getElementById('metaPrice').innerText = `$${price} / mes`;
    modal.classList.remove('hidden');
  }

  buyButtons.forEach(b => b.addEventListener('click', (e)=>{
    const card = e.target.closest('.card');
    openModal(card);
  }));
  btnStart.addEventListener('click', ()=>{document.getElementById('plans').scrollIntoView({behavior:'smooth'})});
  goLogin.addEventListener('click', ()=>{location.hash='login'; document.getElementById('login-section').scrollIntoView({behavior:'smooth'})});
  goToPlans.addEventListener('click', ()=>{document.getElementById('plans').scrollIntoView({behavior:'smooth'})});

  closeModal.addEventListener('click', ()=> modal.classList.add('hidden'));
  document.getElementById('cancelPurchase').addEventListener('click', ()=> modal.classList.add('hidden'));

  purchaseForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const name = document.getElementById('pname').value.trim();
    const email = document.getElementById('pemail').value.trim().toLowerCase();
    const pass = document.getElementById('ppass').value;
    const plan = document.getElementById('metaPlan').innerText;
    // Simulate "payment" and store user in localStorage
    if(!name || !email || !pass){ purchaseMsg.innerText = 'Completa todos los campos'; return; }
    const user = {name, email, pass, plan, created: new Date().toISOString()};
    localStorage.setItem('vold_user', JSON.stringify(user));
    purchaseMsg.innerText = 'Compra registrada — redirigiendo al panel...';
    setTimeout(()=>{ location.href = 'hostpanel.html'; }, 700);
  });

  loginForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value;
    const raw = localStorage.getItem('vold_user');
    if(!raw){ loginMsg.innerText = 'No hay cuentas registradas. Compra un plan primero.'; return; }
    const user = JSON.parse(raw);
    if(user.email === email && user.pass === pass){
      loginMsg.innerText = 'Acceso correcto — redirigiendo...';
      setTimeout(()=>{ location.href = 'hostpanel.html'; }, 500);
    } else {
      loginMsg.innerText = 'Email o contraseña incorrectos.';
    }
  });

  // small UX: close modal on outside click
  modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.add('hidden'); });

  // small neon focus on inputs
  document.querySelectorAll('input,textarea,button').forEach(el=>{
    el.addEventListener('focus', ()=> el.classList.add('focused'));
    el.addEventListener('blur', ()=> el.classList.remove('focused'));
  });
});
                                
