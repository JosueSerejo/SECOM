/* Particles */
const container = document.getElementById('particles');
const colors = ['#00d4ff', '#ff6b00', '#00ff88', '#0099cc', '#ff9500'];
const footerYear = document.getElementById('footer-year');

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const dur = Math.random() * 15 + 10;
    const delay = Math.random() * 20;
    p.style.cssText = `
        width:${size}px; height:${size}px;
        background:${color};
        box-shadow: 0 0 ${size * 3}px ${color};
        left:${Math.random() * 100}%;
        animation-duration:${dur}s;
        animation-delay:-${delay}s;
    `;
    container.appendChild(p);
}

/* Navbar scroll effect */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 50
        ? 'rgba(5,10,18,0.97)'
        : 'rgba(5,10,18,0.85)';
});


/* Menu sandwich toggle */
const menuToggle = document.querySelector('#mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navLogo = document.querySelector('.nav-logo');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // animação simples do ícone sanduíche
    menuToggle.classList.toggle('is-active');
});

// Fechar o menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('is-active');
    });
});

navLogo?.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('is-active');
});