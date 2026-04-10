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

      // Aktualizovat aktivní tlačítko + aria-pressed
      filterBtns.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      // Filtrovat položky
      portfolioItems.forEach(function (item) {
        const cats = item.getAttribute('data-category').split(' ');
        if (category === 'all' || cats.includes(category)) {
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


/* ============================================================
   8. Lightbox — galerie fotek (portfolio.html, makeup-hair.html)
   ============================================================ */

(function initGalleryLightbox() {
  const clickableImgs = document.querySelectorAll('.portfolio-item img, .gallery-placeholder__item img');
  if (!clickableImgs.length) return;

  // Dynamicky vytvoříme lightbox element
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.hidden = true;
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML =
    '<div class="lightbox__backdrop"></div>' +
    '<img class="lightbox__img" src="" alt="">' +
    '<button class="lightbox__close" aria-label="Zavřít">' +
      '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2">' +
        '<line x1="1" y1="1" x2="17" y2="17"/><line x1="17" y1="1" x2="1" y2="17"/>' +
      '</svg>' +
    '</button>';
  document.body.appendChild(lb);

  const lbImg  = lb.querySelector('.lightbox__img');
  const closeBtn = lb.querySelector('.lightbox__close');
  const backdrop = lb.querySelector('.lightbox__backdrop');
  let currentIndex = 0;
  let lastFocused = null;

  // Vrátí aktuálně viditelné obrázky (respektuje filtr portfolia)
  function visibleImgs() {
    return Array.from(clickableImgs).filter(function (img) {
      const parent = img.closest('.portfolio-item, .gallery-placeholder__item');
      return !parent || parent.style.display !== 'none';
    });
  }

  function open(index) {
    const imgs = visibleImgs();
    currentIndex = Math.max(0, Math.min(index, imgs.length - 1));
    lbImg.src  = imgs[currentIndex].src;
    lbImg.alt  = imgs[currentIndex].alt;
    lb.hidden  = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  clickableImgs.forEach(function (img) {
    img.addEventListener('click', function () {
      lastFocused = img;
      const imgs = visibleImgs();
      open(imgs.indexOf(img));
    });
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  lb.addEventListener('keydown', function (e) {
    const imgs = visibleImgs();
    if (e.key === 'Escape')      { close(); }
    if (e.key === 'ArrowRight')  { open((currentIndex + 1) % imgs.length); }
    if (e.key === 'ArrowLeft')   { open((currentIndex - 1 + imgs.length) % imgs.length); }
  });
})();
