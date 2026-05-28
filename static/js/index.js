

/* Carrossel de Palestrantes */
(function () {
  const track = document.getElementById('speakers-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  if (!track) return;

  const cards = Array.from(track.children);
  const total = cards.length;
  let current = 0;

  function getVisible() {
    const w = window.innerWidth;
    if (w < 768) return 1;
    if (w < 1024) return 2;
    return 4;
  }

  function totalSteps() {
    return Math.ceil(total / getVisible());
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const steps = totalSteps();
    for (let i = 0; i < steps; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir para página ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    const steps = totalSteps();
    current = ((index % steps) + steps) % steps;
    const visible = getVisible();

    // Usa o card para calcular largura + gap dinamicamente
    const cardEl = cards[0];
    const cardStyle = window.getComputedStyle(cardEl);
    const cardWidth = cardEl.offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
    const offset = current * visible * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch/swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      current = 0;
      track.style.transform = 'translateX(0)';
      buildDots();
    }, 150);
  });

  buildDots();
})();
const counters = document.querySelectorAll('.stat-num');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const text = el.textContent;
    const num = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[\d]/g, '');
    let current = 0;
    const step = Math.ceil(num / 50);
    const timer = setInterval(() => {
      current = Math.min(current + step, num);
      el.textContent = (text.includes('+') ? '+' : '') + current + suffix.replace('+', '');
      if (current >= num) clearInterval(timer);
    }, 30);
    observer.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => observer.observe(c));



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