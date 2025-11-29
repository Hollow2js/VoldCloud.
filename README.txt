VoldCloud — Demo frontend (HTML/CSS/JS)
----------------------------------------
Proyecto demo que simula un panel de hosting profesional.

Estructura:
- index.html : landing, planes, compra y login
- hostpanel.html : Host Panel con Dashboard, Consola y File Manager
- css/styles.css : estilos (neon negro + morado)
- js/app.js : lógica de landing, compra, login (simulada con localStorage)
- js/panel.js : lógica del panel (consola y file manager, usa localStorage)

Cómo usar:
1. Abre index.html en un navegador (soporta PC y móvil).
2. Comprar un plan: elegir "Comprar", completar nombre/email/contraseña. Eso guardará una cuenta ficticia en localStorage y redirigirá al panel.
3. Iniciar sesión: usa el mismo email y contraseña que ingresaste al comprar.
4. En Host Panel puedes usar la consola (comandos: help, ls, cat <file>, echo, clear) y crear/editar archivos en File Manager.

Este proyecto es una demo estática pensada para desarrollo y pruebas locales.
