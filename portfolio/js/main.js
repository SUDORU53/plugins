/* =========================================================
   Jordan Blake — Designer Portfolio
   Interactions: scroll reveal, nav blur, counters,
   testimonial slider, mobile menu.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initNavScroll();
  initMobileMenu();
  initRevealOnScroll();
  initCounters();
  initTestimonialSlider();
});

/* ---------- Footer year ---------- */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Nav background on scroll ---------- */
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const toggle = () => {
    nav.style.background = window.scrollY > 10
      ? 'rgba(255,255,255,.85)'
      : 'rgba(255,255,255,.7)';
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------- Mobile burger menu ---------- */
function initMobileMenu() {
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    links.classList.toggle('is-open');
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => links.classList.remove('is-open'));
  });
}

/* ---------- Scroll-triggered reveal ---------- */
function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el) => observer.observe(el));
}

/* ---------- Animated number counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => observer.observe(el));
}

/* ---------- Testimonial slider ---------- */
function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.children);
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Отзыв ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === index));
  }

  let timer = setInterval(() => goTo(index + 1), 5000);
  const slider = track.closest('.testimonial-slider');
  if (slider) {
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', () => {
      timer = setInterval(() => goTo(index + 1), 5000);
    });
  }
}
