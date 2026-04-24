/* ============================================
   Gallery Page JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Filter ---
  const filterContainer = document.getElementById('galleryFilter');
  const grid = document.getElementById('galleryGrid');

  if (filterContainer && grid) {
    const filterBtns = filterContainer.querySelectorAll('.gallery-filter__btn');
    const items = grid.querySelectorAll('.gallery-masonry__item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        items.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxMeta = document.getElementById('lightboxMeta');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!lightbox || !grid) return;

  let visibleItems = [];
  let currentIndex = 0;

  function getVisibleItems() {
    return Array.from(grid.querySelectorAll('.gallery-masonry__item:not(.hidden)'));
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = visibleItems[currentIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const src = img.src.replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=1200');

    lightboxImage.src = src;
    lightboxImage.alt = item.dataset.title;
    lightboxTitle.textContent = item.dataset.title;
    lightboxMeta.textContent = `Stylist: ${item.dataset.stylist}`;
    lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
  }

  function prevSlide() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : visibleItems.length - 1;
    updateLightbox();
  }

  function nextSlide() {
    currentIndex = currentIndex < visibleItems.length - 1 ? currentIndex + 1 : 0;
    updateLightbox();
  }

  // Click to open
  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-masonry__item');
    if (!item) return;

    visibleItems = getVisibleItems();
    const index = visibleItems.indexOf(item);
    if (index >= 0) openLightbox(index);
  });

  // Close
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // Navigation
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevSlide);
  if (lightboxNext) lightboxNext.addEventListener('click', nextSlide);

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });
});
