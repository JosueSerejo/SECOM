// accordion 
document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion-item');
    
    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os outros accordions
            accordions.forEach(acc => {
                acc.classList.remove('active');
                acc.querySelector('.accordion-body').style.maxHeight = null;
            });
            
            // Abre se não estava ativo
            if (!isActive) {
                item.classList.add('active');
                const body = item.querySelector('.accordion-body');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });
});

/* Carrossel de Áreas */
(function () {
    const track = document.getElementById('themes-track');
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