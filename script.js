// NERA SAFARIS — SHARED SITE SCRIPT (multi-page version)

function initRevealAnimations() {
  const root = document;

  // Elements that animate in immediately (above-the-fold: hero / page header)
  const loadSelectors = '.hero-title, .hero-description, .hero-buttons, .scroll-cue, .page-header .eyebrow, .page-header h1, .page-header p, .breadcrumb, .post-header .eyebrow, .post-header h1, .post-meta';
  root.querySelectorAll(loadSelectors).forEach((el, i) => {
    el.classList.remove('load-in');
    void el.offsetWidth;
    el.style.animationDelay = Math.min(i * 110, 440) + 'ms';
    el.classList.add('load-in');
  });

  // Elements that fade+rise as the user scrolls to them
  const revealSelectors = '.section-head, .stat, .tour-card, .value-card, .service-card, .team-card, .test-card, .blog-card, .itinerary-day, .faq-item, .about-imgs, .post-cta, .gallery-grid img, .cal-cell, .founder-avatar-photo, .founder-avatar, .contact-grid, .package-includes ul';
  const els = Array.from(root.querySelectorAll(revealSelectors));
  els.forEach(el => el.classList.add('reveal'));

  // Stagger siblings within the same parent (grids, lists) for a natural cascade
  const parents = new Set(els.map(el => el.parentElement));
  parents.forEach(parent => {
    const children = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
    children.forEach((c, idx) => { c.style.transitionDelay = Math.min(idx * 90, 360) + 'ms'; });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => observer.observe(el));
}

function initPageScripts() {
  initRevealAnimations();

  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.onclick = () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
    };
  });

  const form = document.querySelector('.contact-form');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Enquiry Sent';
      setTimeout(() => { btn.textContent = original; form.reset(); }, 2200);
    };
  }

  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      const slides = document.querySelectorAll('.hero-slide');
      if (!slides.length) return;
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000);
  }

  // Pre-select the "Interested Safari" dropdown on the contact page if a
  // ?tour= query param was passed in from a package's "Enquire" link.
  const tourSelect = document.getElementById('tour');
  if (tourSelect) {
    const params = new URLSearchParams(window.location.search);
    const tourSlug = params.get('tour');
    const slugToLabel = {
      'serengeti-untamed': 'Serengeti Untamed',
      'zanzibar-island-escape': 'Zanzibar Island Escape',
      'kilimanjaro-conquest': 'Kilimanjaro Conquest',
      'ruaha-wild-escape': 'Ruaha Wild Escape',
      'dar-es-salaam-city-tour': 'Dar es Salaam City Tour',
      'gastronomy-experience': 'Gastronomy Experience'
    };
    if (tourSlug && slugToLabel[tourSlug]) {
      Array.from(tourSelect.options).forEach(opt => {
        if (opt.textContent.trim() === slugToLabel[tourSlug]) tourSelect.value = opt.value;
      });
    }
  }

  // If the URL has a #hash (e.g. packages.html#serengeti-untamed), scroll to it
  if (window.location.hash) {
    const el = document.getElementById(window.location.hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initPageScripts();

  // Nav scroll shadow + mobile menu toggle
  const navEl = document.getElementById('nav');
  if (navEl) {
    window.addEventListener('scroll', () => navEl.classList.toggle('scrolled', window.scrollY > 40));
  }
  const navToggleEl = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');
  if (navToggleEl && navLinksEl) {
    navToggleEl.addEventListener('click', () => {
      const open = navLinksEl.classList.toggle('open');
      navToggleEl.setAttribute('aria-expanded', open);
    });
    // Close mobile menu after tapping a link
    navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinksEl.classList.remove('open')));
  }

  // Cookie consent banner (simple, for EU/international visitors)
  if (!localStorage.getItem('neraCookieConsent')) {
    const bar = document.createElement('div');
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie Notice');
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:999;background:rgba(15,17,21,0.97);color:#f5efe0;padding:1.1rem 1.5rem;display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:center;font-family:Montserrat,sans-serif;font-size:0.85rem;border-top:1px solid rgba(245,239,224,0.15);';
    bar.innerHTML = '<span style="max-width:640px;">This website uses cookies to improve your experience and analyze usage. By continuing to use this site, you agree to our <a href="#" style="color:#c5a880;text-decoration:underline;">Privacy Policy</a>.</span>' +
      '<button id="neraCookieAccept" style="background:#c5a880;color:#0f1115;border:none;padding:0.55rem 1.3rem;font-weight:600;cursor:pointer;border-radius:2px;">Accept</button>';
    document.body.appendChild(bar);
    document.getElementById('neraCookieAccept').addEventListener('click', function () {
      localStorage.setItem('neraCookieConsent', '1');
      bar.remove();
    });
  }
});
