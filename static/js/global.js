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

/* Particles locais do footer */
(function () {
    const footerParticles = document.getElementById('footer-particles');
    if (!footerParticles) return;
    const fColors = ['#00d4ff', '#ff6b00', '#00ff88', '#0099cc', '#ff9500'];
    for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.className = 'footer-particle';
        const size = Math.random() * 3 + 1;
        const color = fColors[Math.floor(Math.random() * fColors.length)];
        const dur = Math.random() * 12 + 8;
        const delay = Math.random() * 15;
        p.style.cssText = `
        width:${size}px; height:${size}px;
        background:${color};
        box-shadow: 0 0 ${size * 3}px ${color};
        left:${Math.random() * 100}%;
        animation-duration:${dur}s;
        animation-delay:-${delay}s;
        `;
        footerParticles.appendChild(p);
    }
    })();
    (function () {
    const wrapper = document.querySelector('.sponsors-track-wrapper');
    const track   = document.getElementById('sponsors-track');
    if (!track) return;

    const GAP_PX  = 28.8; // 1.8rem em px (assumindo 16px base)
    const SPEED   = 0.7;  // pixels por frame

    /* 1. Garante que a faixa tenha itens suficientes  */
    function fillTrack() {
        const originals = Array.from(track.children);
        if (!originals.length) return;
        while (track.scrollWidth < window.innerWidth * 2.5) {
        originals.forEach(node => track.appendChild(node.cloneNode(true)));
        }
    }
    fillTrack();

    /* 2. Posição atual (px) nunca reseta */
    let offset = 0;
    let paused = false;

    wrapper.addEventListener('mouseenter', () => { paused = true;  });
    wrapper.addEventListener('mouseleave', () => { paused = false; });

    /* 3. Loop principal */
    function tick() {
        if (!paused) {
        offset += SPEED;

        const first = track.firstElementChild;
        if (first) {
            const firstRight = first.offsetLeft + first.offsetWidth + GAP_PX;
            if (firstRight <= offset) {
            track.appendChild(first);

            offset -= firstRight;
            }
        }

        track.style.transform = `translateX(-${offset}px)`;
        }
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    window.addEventListener('resize', fillTrack);
})();