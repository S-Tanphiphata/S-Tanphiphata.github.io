// ============================================
// Project pages: gallery carousel + contents highlighting
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-gallery]').forEach(initGallery);
    initTableOfContents();
});

// ============================================
// Gallery Carousel
// Markup: [data-gallery] > .gallery__stage > .gallery__slide > img
// Buttons, counter and thumbnails are generated here.
// ============================================
function initGallery(gallery) {
    const stage = gallery.querySelector('.gallery__stage');
    const slides = Array.from(gallery.querySelectorAll('.gallery__slide'));
    if (!stage || slides.length === 0) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AUTO_CHANGE_MS = 10000;
    const arrow = '<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>';
    let current = 0;
    let timer = null;

    stage.setAttribute('role', 'region');
    stage.setAttribute('aria-roledescription', 'carousel');
    stage.tabIndex = 0;

    // Counter
    const count = document.createElement('span');
    count.className = 'gallery__count';
    count.setAttribute('aria-live', 'polite');
    stage.appendChild(count);

    // Thumbnails
    const thumbs = document.createElement('div');
    thumbs.className = 'gallery__thumbs';
    const thumbButtons = slides.map(function(slide, i) {
        const img = slide.querySelector('img');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gallery__thumb';
        btn.setAttribute('aria-label', 'Show image ' + (i + 1) + (img && img.alt ? ': ' + img.alt : ''));
        if (img) {
            const thumbImg = document.createElement('img');
            thumbImg.src = img.getAttribute('src');
            thumbImg.alt = '';
            thumbImg.loading = 'lazy';
            btn.appendChild(thumbImg);
        }
        btn.addEventListener('click', function() { goTo(i); });
        thumbs.appendChild(btn);
        return btn;
    });

    if (slides.length > 1) {
        // Prev / next buttons
        const prev = document.createElement('button');
        prev.type = 'button';
        prev.className = 'gallery__btn gallery__btn--prev';
        prev.setAttribute('aria-label', 'Previous image');
        prev.innerHTML = arrow;
        prev.addEventListener('click', function() { goTo(current - 1); });

        const next = document.createElement('button');
        next.type = 'button';
        next.className = 'gallery__btn gallery__btn--next';
        next.setAttribute('aria-label', 'Next image');
        next.innerHTML = arrow;
        next.addEventListener('click', function() { goTo(current + 1); });

        stage.append(prev, next);
        stage.after(thumbs);

        // Keyboard arrows while the stage is focused
        stage.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') goTo(current - 1);
            if (e.key === 'ArrowRight') goTo(current + 1);
        });

        // Auto-advance, paused on hover/focus
        gallery.addEventListener('mouseenter', stop);
        gallery.addEventListener('mouseleave', start);
        gallery.addEventListener('focusin', stop);
        gallery.addEventListener('focusout', start);
        start();
    }

    show(0);

    function show(n) {
        current = (n + slides.length) % slides.length;
        slides.forEach(function(slide, i) {
            const active = i === current;
            slide.classList.toggle('is-active', active);
            slide.setAttribute('aria-hidden', String(!active));
        });
        thumbButtons.forEach(function(btn, i) {
            btn.classList.toggle('is-active', i === current);
            btn.setAttribute('aria-current', i === current ? 'true' : 'false');
        });
        count.textContent = (current + 1) + ' / ' + slides.length;
    }

    function goTo(n) {
        show(n);
        // Keep the active thumbnail visible in the strip
        const thumb = thumbButtons[current];
        if (thumb) {
            thumbs.scrollTo({
                left: thumb.offsetLeft - thumbs.clientWidth / 2 + thumb.offsetWidth / 2,
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
        }
        if (timer) {
            stop();
            start();
        }
    }

    function start() {
        if (reduceMotion || timer || gallery.contains(document.activeElement)) return;
        timer = setInterval(function() { show(current + 1); }, AUTO_CHANGE_MS);
    }

    function stop() {
        clearInterval(timer);
        timer = null;
    }
}

// ============================================
// Table of Contents: highlight the section in view
// ============================================
function initTableOfContents() {
    const links = Array.from(document.querySelectorAll('.toc a[href^="#"]'));
    if (links.length === 0) return;

    const sections = links
        .map(function(link) { return document.querySelector(link.getAttribute('href')); })
        .filter(Boolean);

    function update() {
        const offset = window.innerHeight * 0.3;
        let activeIndex = 0;
        sections.forEach(function(section, i) {
            if (section.getBoundingClientRect().top - offset <= 0) activeIndex = i;
        });
        // Last section can be too short to reach the threshold
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
            activeIndex = sections.length - 1;
        }
        links.forEach(function(link, i) {
            link.classList.toggle('is-active', i === activeIndex);
        });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}
