/* ============================================================
   Makeup Martina — main.js
   Vanilla JS, žádné závislosti
   ============================================================ */

'use strict';

/* ============================================================
   1. Nav scroll behavior (.scrolled po 60px)
   ============================================================ */

(function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Zavolat ihned (pro případ reload na stránce dole)
})();


/* ============================================================
   2. Hamburger menu (mobil)
   ============================================================ */

(function initHamburger() {
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (!hamburger || !mobileMenu) return;

  const body = document.body;

  function openMenu() {
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    if (hamburger.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Zavřít po kliknutí na odkaz
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Zavřít po resize na desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 640) {
      closeMenu();
    }
  });

  // Zavřít klávesou Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();


/* ============================================================
   3. Scroll reveal (IntersectionObserver pro .reveal)
   ============================================================ */

(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Pokud prohlížeč nepodporuje IntersectionObserver, zobrazit vše
  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  // Respektovat preference reduce-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    elements.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Animovat jen jednou
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();


/* ============================================================
   4. FAQ accordion (kurz-liceni.html)
   ============================================================ */

(function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq__item');
  if (!faqItems.length) return;

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq__question');
    if (!question) return;

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('is-open');

      // Zavřít všechny ostatní
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('is-open');
          const otherQ = other.querySelector('.faq__question');
          if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
        }
      });

      // Přepnout aktuální
      item.classList.toggle('is-open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
    });

    // ARIA
    question.setAttribute('aria-expanded', 'false');
  });
})();


/* ============================================================
   5. Portfolio filter (portfolio.html)
   ============================================================ */

(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-filter__btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item[data-category]');
  if (!filterBtns.length || !portfolioItems.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const category = btn.getAttribute('data-filter');

      // Aktualizovat aktivní tlačítko
      filterBtns.forEach(function (b) {
        b.classList.remove('is-active');
      });
      btn.classList.add('is-active');

      // Filtrovat položky
      portfolioItems.forEach(function (item) {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.style.display = '';
          // Animovat znovuzobrazení
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          requestAnimationFrame(function () {
            item.style.transition = 'opacity .35s ease, transform .35s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Aktivovat první tlačítko (Vše)
  const firstBtn = filterBtns[0];
  if (firstBtn) firstBtn.classList.add('is-active');
})();


/* ============================================================
   6. Lightbox — mapa (kontakt.html)
   ============================================================ */

(function initLightbox() {
  const trigger = document.querySelector('.map-lightbox-trigger');
  const lightbox = document.getElementById('map-lightbox');
  if (!trigger || !lightbox) return;

  const closeBtn = lightbox.querySelector('.lightbox__close');
  const backdrop = lightbox.querySelector('.lightbox__backdrop');

  function openLightbox() {
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    trigger.focus();
  }

  trigger.addEventListener('click', openLightbox);
  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);

  lightbox.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
})();


/* ============================================================
   7. Smooth scroll pro anchor linky
   ============================================================ */

(function initSmoothScroll() {
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72',
      10
    );

    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    });

    // Zavřít mobilní menu po anchor kliknutí
    const mobileMenu = document.querySelector('.nav__mobile');
    const hamburger = document.querySelector('.nav__hamburger');
    if (mobileMenu && mobileMenu.classList.contains('is-open')) {
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
      if (hamburger) hamburger.classList.remove('is-open');
    }
  });
})();
