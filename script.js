/* =============================================
   AKSHAT GUPTA — PORTFOLIO SCRIPT
   ============================================= */

/* ---- Custom Cursor ---- */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top  = `${mouseY}px`;
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top  = `${ringY}px`;
  requestAnimationFrame(animateRing);
}
animateRing();

const hoverTargets = document.querySelectorAll(
  'a, button, .project-card, .skill-category, .stat-card, .cert-card, .hackathon-card, .edu-card, .contact-link-item, input, textarea'
);
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
});

/* ---- Navbar: scroll effect + active link ---- */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');
const backTop   = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY > 60) navbar.classList.add('scrolled');
  else               navbar.classList.remove('scrolled');

  if (scrollY > 400) backTop.classList.add('visible');
  else                backTop.classList.remove('visible');

  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (scrollY >= top) current = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

/* ---- Mobile Nav ---- */
const hamburger   = document.getElementById('hamburger');
const mobileLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileLinks.classList.toggle('open');
});

mobileLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileLinks.classList.remove('open');
  });
});

/* ---- Back To Top ---- */
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- Typewriter ---- */
const typewriterEl = document.getElementById('typewriter');
const phrases = [
  'Software Developer',
  'Web Developer',
  'Backend Engineer',
  'Java Programmer',
  'Python Enthusiast',
  'REST API Builder',
];

let phraseIdx = 0;
let charIdx   = 0;
let isDeleting = false;
let delay      = 120;

function typeLoop() {
  const phrase = phrases[phraseIdx];
  if (isDeleting) {
    typewriterEl.textContent = phrase.slice(0, charIdx - 1);
    charIdx--;
    delay = 60;
  } else {
    typewriterEl.textContent = phrase.slice(0, charIdx + 1);
    charIdx++;
    delay = 110;
  }

  if (!isDeleting && charIdx === phrase.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx  = (phraseIdx + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typeLoop, delay);
}
typeLoop();

/* ---- Particle Canvas ---- */
const canvas  = document.getElementById('particlesCanvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let animId;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = canvas.parentElement.offsetHeight;
}

function createParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 14000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      r:   Math.random() * 1.5 + 0.4,
      dx:  (Math.random() - 0.5) * 0.4,
      dy:  (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.15,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i], p2 = particles[j];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(124, 58, 237, ${(1 - dist / 120) * 0.18})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  // Draw particles
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245, 166, 35, ${p.alpha})`;
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  animId = requestAnimationFrame(drawParticles);
}

resizeCanvas();
createParticles();
drawParticles();

window.addEventListener('resize', () => {
  cancelAnimationFrame(animId);
  resizeCanvas();
  createParticles();
  drawParticles();
});

/* ---- Intersection Observer — reveal on scroll ---- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add('visible'), Number(delay));
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.1 });

// Elements to reveal
const revealEls = document.querySelectorAll(
  '.about-text, .about-card, .stat-card, ' +
  '.skill-category, ' +
  '.timeline-item, ' +
  '.project-card, ' +
  '.hackathon-card, ' +
  '.edu-card, ' +
  '.cert-card, ' +
  '.contact-text, .contact-form, ' +
  '.section-header'
);

revealEls.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ---- Counter Animation — Stats ---- */
function animateCounter(el, target, duration = 1500) {
  const isDecimal = target % 1 !== 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = target * eased;

    el.textContent = isDecimal
      ? value.toFixed(3)
      : Math.floor(value) + (target > 5 && !isDecimal ? '+' : '');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = isDecimal
        ? target.toFixed(3)
        : target + (target > 5 ? '+' : '');
    }
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const raw = el.textContent.replace('+','').trim();
        const val = parseFloat(raw);
        animateCounter(el, val);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);

/* ---- Contact Form ---- */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn     = document.getElementById('contactSubmitBtn');
  const success = document.getElementById('formSuccess');

  btn.textContent = 'Sending…';
  btn.disabled    = true;

  // Simulate send (no backend)
  setTimeout(() => {
    btn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Message';
    btn.disabled  = false;
    success.classList.add('show');
    e.target.reset();
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1400);
}

/* ---- Smooth active section highlight ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ---- Skill tag micro-interaction ---- */
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    tag.style.transform = 'scale(0.92)';
    setTimeout(() => tag.style.transform = '', 150);
  });
});

/* ---- Tilt effect on project cards ---- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - 0.5;
    const y      = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${(-y * 6).toFixed(1)}deg) rotateY(${(x * 6).toFixed(1)}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---- Ambient glow follower on hero ---- */
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y    = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    hero.style.setProperty('--glow-x', `${x}%`);
    hero.style.setProperty('--glow-y', `${y}%`);
  });
}
