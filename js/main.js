/* ============================================
   Main JavaScript — la-melu inspired
   Subtle, refined animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Hamburger Navigation ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const navOverlay = document.getElementById('navOverlay');

  if (hamburger && mobileNav && navOverlay) {
    const toggleNav = () => {
      const isOpen = mobileNav.classList.contains('active');
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      navOverlay.classList.toggle('active');
      document.body.classList.toggle('nav-open');
      hamburger.setAttribute('aria-label', isOpen ? 'メニューを開く' : 'メニューを閉じる');
    };

    hamburger.addEventListener('click', toggleNav);
    navOverlay.addEventListener('click', toggleNav);
  }

  // --- Header Scroll (shadow on scroll) ---
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Back to Top ---
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Scroll Animations ---
  if (!prefersReducedMotion) {
    const animElements = document.querySelectorAll('.animate-on-scroll');
    if (animElements.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const staggerChildren = entry.target.querySelectorAll('.stagger');
            if (staggerChildren.length > 0) {
              staggerChildren.forEach((child, i) => {
                child.style.transitionDelay = `${i * 100}ms`;
                child.classList.add('in-view');
              });
            }
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.06,
        rootMargin: '0px 0px -50px 0px'
      });

      animElements.forEach(el => observer.observe(el));
    }

    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
      const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            fadeObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      });

      fadeElements.forEach(el => fadeObserver.observe(el));
    }
  } else {
    document.querySelectorAll('.animate-on-scroll, .fade-in, .stagger').forEach(el => {
      el.classList.add('in-view');
    });
  }

  // --- Menu Page Filter ---
  const menuFilter = document.getElementById('menuFilter');
  if (menuFilter) {
    const filterBtns = menuFilter.querySelectorAll('.menu-filter__btn');
    const categories = document.querySelectorAll('.menu-category');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        categories.forEach(cat => {
          if (filter === 'all' || cat.dataset.category === filter) {
            cat.style.display = '';
          } else {
            cat.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Coupon Popup ---
  const couponPopup = document.getElementById('couponPopup');
  const couponClose = document.getElementById('couponClose');
  const couponBackdrop = document.getElementById('couponBackdrop');

  if (couponPopup && !localStorage.getItem('fleur-coupon-seen')) {
    setTimeout(() => {
      couponPopup.classList.add('active');
    }, 4000);

    const closeCoupon = () => {
      couponPopup.classList.remove('active');
      localStorage.setItem('fleur-coupon-seen', 'true');
    };

    if (couponClose) couponClose.addEventListener('click', closeCoupon);
    if (couponBackdrop) couponBackdrop.addEventListener('click', closeCoupon);
  }

  // --- Set min date for reservation ---
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // --- Hero Slideshow ---
  const heroSlides = document.querySelectorAll('.hero__slide');
  if (heroSlides.length > 1) {
    let current = 0;
    setInterval(() => {
      heroSlides[current].classList.remove('hero__slide--active');
      current = (current + 1) % heroSlides.length;
      heroSlides[current].classList.add('hero__slide--active');
    }, 5000);
  }

  // --- Opening Animation cleanup ---
  const opening = document.getElementById('opening');
  if (opening) {
    setTimeout(() => opening.classList.add('done'), 3200);
  } else if (header) {
    header.style.animation = 'none';
    header.style.opacity = '1';
  }

  // --- Page load fade ---
  document.body.classList.add('loaded');
});
