// ============================================
// ACADEMY FC — MAIN JAVASCRIPT (ULTRA ENHANCED)
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ========== NAVBAR SCROLL EFFECT ==========
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 80;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    const scrollBtn = document.querySelector('.scroll-top');
    if (scrollBtn) {
      if (window.scrollY > 400) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ========== MOBILE NAV TOGGLE ==========
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // ========== HERO PARALLAX SLIDER (Enhanced) ==========
  const slides = document.querySelectorAll('.parallax-slider .slide');
  const sliderDots = document.getElementById('sliderDots');
  const sliderPrev = document.getElementById('sliderPrev');
  const sliderNext = document.getElementById('sliderNext');
  const sliderProgress = document.getElementById('sliderProgress');
  let currentSlide = 0;
  let slideInterval;
  let progressInterval;
  const SLIDE_DURATION = 6000;

  if (slides.length > 0 && sliderDots) {
    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => { goToSlide(i); resetAutoSlide(); });
      sliderDots.appendChild(dot);
    });

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      sliderDots.children[currentSlide].classList.remove('active');
      currentSlide = index;
      slides[currentSlide].classList.add('active');
      sliderDots.children[currentSlide].classList.add('active');
      resetProgress();
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
      goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    if (sliderNext) sliderNext.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    if (sliderPrev) sliderPrev.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

    // --- Progress bar ---
    function resetProgress() {
      if (!sliderProgress) return;
      clearInterval(progressInterval);
      let elapsed = 0;
      sliderProgress.style.width = '0%';
      progressInterval = setInterval(() => {
        elapsed += 30;
        const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
        sliderProgress.style.width = pct + '%';
        if (elapsed >= SLIDE_DURATION) clearInterval(progressInterval);
      }, 30);
    }

    // --- Auto-slide ---
    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, SLIDE_DURATION);
      resetProgress();
    }

    function resetAutoSlide() {
      clearInterval(slideInterval);
      startAutoSlide();
    }

    startAutoSlide();

    // Pause on hover
    const slider = document.querySelector('.parallax-slider');
    if (slider) {
      slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
        clearInterval(progressInterval);
      });
      slider.addEventListener('mouseleave', startAutoSlide);
    }

    // Touch swipe
    let touchStartX = 0;
    let touchEndX = 0;

    if (slider) {
      slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) nextSlide();
          else prevSlide();
          resetAutoSlide();
        }
      }, { passive: true });
    }

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { nextSlide(); resetAutoSlide(); }
      if (e.key === 'ArrowLeft')  { prevSlide(); resetAutoSlide(); }
    });
  }

  // ========== HERO MOUSE PARALLAX ==========
  const heroSlider = document.querySelector('.parallax-slider');
  const heroGlow = document.getElementById('heroGlow');

  if (heroSlider && window.innerWidth > 768) {
    heroSlider.addEventListener('mousemove', (e) => {
      const rect = heroSlider.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Move slide content in opposite direction of mouse for depth
      const activeSlide = heroSlider.querySelector('.slide.active .slide-content');
      if (activeSlide) {
        activeSlide.style.transform = `translate(${x * -20}px, ${y * -15}px)`;
      }

      // Move glow to follow mouse
      if (heroGlow) {
        heroGlow.style.left = e.clientX - rect.left + 'px';
        heroGlow.style.top = e.clientY - rect.top + 'px';
      }

      // Subtle movement on particles
      const particles = heroSlider.querySelector('.parallax-particles');
      if (particles) {
        particles.style.transform = `translate(${x * 10}px, ${y * 8}px)`;
      }
    });

    heroSlider.addEventListener('mouseleave', () => {
      const activeSlide = heroSlider.querySelector('.slide.active .slide-content');
      if (activeSlide) activeSlide.style.transform = '';
      const particles = heroSlider.querySelector('.parallax-particles');
      if (particles) particles.style.transform = '';
    });
  }

  // ========== ADVANCED PARALLAX SCROLL ENGINE ==========
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  function updateParallax() {
    const scrollY = window.scrollY;
    const winH = window.innerHeight;

    // --- Parallax break + testimonials + video-cta + counter-strip background shift ---
    document.querySelectorAll('.parallax-break, .section-testimonials, .section-video-cta, .parallax-counter-strip').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < winH && rect.bottom > 0) {
        const speed = 0.35;
        const yPos = -(rect.top * speed);
        el.style.backgroundPositionY = `${yPos}px`;
      }
    });

    // --- Depth layers inside parallax sections ---
    document.querySelectorAll('.parallax-layer').forEach(layer => {
      const parent = layer.closest('.parallax-break') || layer.closest('.section-testimonials') || layer.closest('.section-video-cta');
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.top < winH && rect.bottom > 0) {
        const depth = parseFloat(layer.getAttribute('data-depth')) || 0.3;
        const moveY = rect.top * depth * 0.4;
        layer.style.transform = `translateY(${moveY}px)`;
      }
    });

    // --- Horizontal parallax elements ---
    document.querySelectorAll('.parallax-h-left, .parallax-h-right').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < winH && rect.bottom > 0) {
        const progress = (winH - rect.top) / (winH + rect.height);
        const offset = (progress - 0.5) * 60;
        if (el.classList.contains('parallax-h-left')) {
          el.style.transform = `translateX(${-offset}px)`;
        } else {
          el.style.transform = `translateX(${offset}px)`;
        }
      }
    });

    // --- Navbar transparency based on hero ---
    if (heroSlider) {
      const heroBottom = heroSlider.offsetHeight;
      const scrollPct = Math.min(scrollY / heroBottom, 1);
      navbar.style.background = scrollY > scrollThreshold
        ? `rgba(1,29,110,${0.85 + scrollPct * 0.15})`
        : 'transparent';
    }

    // --- Section titles slide-in on scroll ---
    document.querySelectorAll('.section-header').forEach(header => {
      const rect = header.getBoundingClientRect();
      if (rect.top < winH * 0.85 && !header.classList.contains('animated')) {
        header.classList.add('animated');
      }
    });

    // --- Text reveal on scroll ---
    document.querySelectorAll('.text-reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < winH * 0.85) {
        el.classList.add('revealed');
      }
    });

    // --- Why Choose section card parallax (staggered depth) ---
    document.querySelectorAll('.why-card').forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < winH && rect.bottom > 0) {
        const progress = (winH - rect.top) / (winH + rect.height);
        const offset = (1 - progress) * (10 + i * 3);
        card.style.transform = `translateY(${offset}px)`;
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ========== TILT CARD EFFECT (mouse-based 3D) ==========
  if (window.innerWidth > 768) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) scale(1.03)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ========== STAT COUNTER ANIMATION ==========
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      function updateCount() {
        current += increment;
        if (current < target) {
          stat.textContent = Math.floor(current);
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target;
        }
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateCount();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(stat);
    });
  }

  if (statNumbers.length > 0) animateCounters();

  // ========== SCROLL ANIMATIONS (Staggered Fade-up) ==========
  function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
      '.news-card, .news-card-full, .team-preview-card, .team-card, .fixture-card, ' +
      '.value-card, .staff-card, .sponsor-card, .shop-card, .package-card, .gallery-item, ' +
      '.testimonial-card, .stat-card, .contact-item, .why-card, .counter-strip-item'
    );

    animateElements.forEach((el) => {
      el.classList.add('fade-up');
      // Stagger within groups
      const parent = el.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children);
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = `${idx * 0.1}s`;
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    animateElements.forEach(el => observer.observe(el));
  }

  initScrollAnimations();

  // ========== SECTION HEADER ANIMATIONS ==========
  document.querySelectorAll('.section-header').forEach(header => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(header);
  });

  // ========== TESTIMONIALS CAROUSEL ==========
  const testimonialsPages = document.querySelectorAll('.testimonials-page');
  const testimonialDots = document.querySelectorAll('.testimonials-page-dot');
  const testimonialPrev = document.querySelector('.testimonials-prev');
  const testimonialNext = document.querySelector('.testimonials-next');
  let currentTestimonialPage = 0;

  function goToTestimonialPage(index) {
    if (!testimonialsPages.length) return;
    testimonialsPages.forEach(page => {
      page.style.display = 'none';
      page.classList.remove('active');
    });
    testimonialDots.forEach(dot => dot.classList.remove('active'));

    currentTestimonialPage = index;
    testimonialsPages[currentTestimonialPage].style.display = '';
    testimonialsPages[currentTestimonialPage].classList.add('active');
    if (testimonialDots[currentTestimonialPage]) {
      testimonialDots[currentTestimonialPage].classList.add('active');
    }

    // Re-trigger fade-up for newly visible cards
    testimonialsPages[currentTestimonialPage].querySelectorAll('.testimonial-card').forEach((card, i) => {
      card.classList.remove('visible');
      setTimeout(() => card.classList.add('visible'), 100 + i * 120);
    });
  }

  if (testimonialNext) {
    testimonialNext.addEventListener('click', () => {
      goToTestimonialPage((currentTestimonialPage + 1) % testimonialsPages.length);
    });
  }
  if (testimonialPrev) {
    testimonialPrev.addEventListener('click', () => {
      goToTestimonialPage((currentTestimonialPage - 1 + testimonialsPages.length) % testimonialsPages.length);
    });
  }
  testimonialDots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToTestimonialPage(parseInt(dot.getAttribute('data-page')));
    });
  });

  // Auto-rotate testimonials
  if (testimonialsPages.length > 1) {
    setInterval(() => {
      goToTestimonialPage((currentTestimonialPage + 1) % testimonialsPages.length);
    }, 8000);
  }

  // ========== FIXTURES TABS ==========
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${tab}`).classList.add('active');
    });
  });

  // ========== FILTER (News & Teams) ==========
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      const parent = btn.closest('.section') || btn.closest('.container');
      const cards = parent.querySelectorAll('[data-category]');
      const siblings = btn.parentElement.querySelectorAll('.filter-btn');

      siblings.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ========== FORMS ==========
  const registrationForm = document.getElementById('registrationForm');
  const contactForm = document.getElementById('contactForm');

  function handleFormSubmit(form, messageElId) {
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const messageEl = document.getElementById(messageElId);
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      if (messageEl) {
        messageEl.textContent = '✅ Thank you! Your submission has been received. We\'ll be in touch soon.';
        messageEl.className = 'form-message success';
      }

      console.log('Form submission data:', data);

      // TODO: Firebase Firestore submission
      // db.collection('registrations').add(data).then(...)

      form.reset();

      setTimeout(() => {
        if (messageEl) messageEl.className = 'form-message';
      }, 5000);
    });
  }

  handleFormSubmit(registrationForm, 'formMessage');
  handleFormSubmit(contactForm, 'contactFormMessage');

  // ========== SCROLL TO TOP BUTTON ==========
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.classList.add('scroll-top');
  scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(scrollTopBtn);

  // ========== SUB-PAGE NAVBAR ==========
  if (!document.querySelector('.parallax-slider')) {
    navbar.classList.add('scrolled');
  }

  // ========== SMOOTH SCROLL FOR SCROLL INDICATOR ==========
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.style.cursor = 'pointer';
    scrollIndicator.addEventListener('click', () => {
      const firstSection = document.querySelector('.quick-stats') || document.querySelector('.section');
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ========== PLAY BUTTON (VIDEO CTA) ==========
  const playBtn = document.querySelector('.play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      // Placeholder: open a modal or navigate to video page
      alert('🎬 Video player coming soon! Your colleague can integrate a video modal or embed here.');
    });
  }

  // ========== INITIAL PARALLAX CALL ==========
  updateParallax();

});
