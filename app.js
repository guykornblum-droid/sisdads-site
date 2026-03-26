/* ===== SIS BULLDOG DADS — APP.JS ===== */

(function () {
  'use strict';

  // ===== DARK MODE TOGGLE =====
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  updateToggleIcon();

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
      updateToggleIcon();
    });
  }

  function updateToggleIcon() {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  // ===== HEADER SCROLL BEHAVIOR =====
  const header = document.getElementById('header');
  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const current = window.scrollY;

        // Hide/show header on scroll
        if (current > 100 && current > lastScroll) {
          header.classList.add('header--hidden');
        } else {
          header.classList.remove('header--hidden');
        }

        // Add shadow when scrolled
        if (current > 10) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }

        lastScroll = current;
        ticking = false;
      });
      ticking = true;
    }
  });

  // ===== ACTIVE NAV LINK TRACKING =====
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.header__links a');

  function updateActiveNav() {
    let currentSection = 'home';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.id;
      }
    });

    // Map sub-sections to parent nav items
    const sectionMap = {
      'home': 'home',
      'events-preview': 'home',
      'golf-classic': 'golf-classic',
      'events': 'events',
      'about': 'about',
      'contact': 'contact'
    };

    const activeId = sectionMap[currentSection] || currentSection;

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveNav);
  });

  // ===== MOBILE MENU =====
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // ===== SMOOTH SCROLL FOR HASH LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.offsetTop - 80;
        window.scrollTo({ top, behavior: 'smooth' });

        // Update URL without triggering scroll
        history.pushState(null, '', link.getAttribute('href'));
      }
    });
  });

  // ===== NUMBER COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.stat__number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        // Simple reveal — numbers are already in place
        el.style.opacity = '1';
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ===== PHOTO GALLERY LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const galleryItems = document.querySelectorAll('.gallery__item');
  let currentIndex = 0;
  const galleryImages = [];

  galleryItems.forEach((item, i) => {
    const img = item.querySelector('img');
    if (img) {
      galleryImages.push({ src: img.src, alt: img.alt });
      item.addEventListener('click', () => openLightbox(i));
    }
  });

  function openLightbox(index) {
    if (!lightbox || galleryImages.length === 0) return;
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const img = galleryImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + galleryImages.length;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightboxImage();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  if (lightbox) {
    lightbox.querySelector('.lightbox__close').addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', (e) => {
      e.stopPropagation();
      prevImage();
    });

    lightbox.querySelector('.lightbox__nav--next').addEventListener('click', (e) => {
      e.stopPropagation();
      nextImage();
    });

    // Click backdrop to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });
  }

})();
