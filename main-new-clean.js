// Google tag init
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);} 
window.gtag = window.gtag || gtag;
window.gtag('js', new Date());
window.gtag('config', 'G-R7PMRC7B3V');

document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const workItems = Array.from(document.querySelectorAll('.work-item'));
  workItems.forEach(item => {
    const header = item.querySelector('.work-header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      workItems.forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.work-header');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const caseToggles = Array.from(document.querySelectorAll('.case-toggle'));
  caseToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.case-card');
      if (!card) return;
      const isOpen = card.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach(i => i.classList.remove('is-open'));
      faqItems.forEach(i => {
        const b = i.querySelector('.faq-question');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const reviewToggle = document.querySelector('.review-toggle');
  const reviewForm = document.getElementById('review-form');
  if (reviewToggle && reviewForm) {
    reviewToggle.addEventListener('click', () => {
      const isHidden = reviewForm.hasAttribute('hidden');
      if (isHidden) {
        reviewForm.removeAttribute('hidden');
        reviewToggle.setAttribute('aria-expanded', 'true');
        reviewForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        reviewForm.setAttribute('hidden', '');
        reviewToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const reviewsTrack = document.querySelector('.reviews-track');
  if (reviewsTrack) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    reviewsTrack.addEventListener('mousedown', (event) => {
      isDown = true;
      reviewsTrack.classList.add('is-dragging');
      startX = event.pageX - reviewsTrack.offsetLeft;
      scrollLeft = reviewsTrack.scrollLeft;
    });

    reviewsTrack.addEventListener('mouseleave', () => {
      isDown = false;
      reviewsTrack.classList.remove('is-dragging');
    });

    reviewsTrack.addEventListener('mouseup', () => {
      isDown = false;
      reviewsTrack.classList.remove('is-dragging');
    });

    reviewsTrack.addEventListener('mousemove', (event) => {
      if (!isDown) return;
      event.preventDefault();
      const x = event.pageX - reviewsTrack.offsetLeft;
      const walk = (x - startX) * 1.2;
      reviewsTrack.scrollLeft = scrollLeft - walk;
    });
  }

  // Review expand/collapse logic
  const reviewCards = Array.from(document.querySelectorAll('.review-card'));
  reviewCards.forEach(card => {
    const quote = card.querySelector('.review-quote');
    const expandBtn = card.querySelector('.review-expand');

    if (!quote || !expandBtn) return;

    // Check if content is truncated
    const checkTruncation = () => {
      if (quote.scrollHeight > quote.clientHeight + 5) {
        expandBtn.removeAttribute('hidden');
      }
    };

    // Check on load and after fonts load
    checkTruncation();
    if (document.fonts) {
      document.fonts.ready.then(checkTruncation);
    }

    // Toggle expand/collapse
    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = card.classList.toggle('is-expanded');
      expandBtn.textContent = isExpanded ? 'Свернуть' : 'Читать полностью';
      expandBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });

    // Close menu when clicking a link
    const navLinks = Array.from(siteNav.querySelectorAll('a'));
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Открыть меню');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !siteNav.contains(e.target)) {
        if (siteNav.classList.contains('is-open')) {
          siteNav.classList.remove('is-open');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.setAttribute('aria-label', 'Открыть меню');
        }
      }
    });
  }

  // ============================================
  // PREMIUM SCROLL ANIMATIONS (React Bits Style)
  // ============================================

  // Configuration
  const animationConfig = {
    threshold: 0.15,  // Trigger when 15% of element is visible
    rootMargin: '0px 0px -50px 0px'  // Slight offset for better timing
  };

  // Detect if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Only initialize animations if user hasn't requested reduced motion
  if (!prefersReducedMotion) {
    // Create Intersection Observer
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation class when element enters viewport
          const element = entry.target;
          const animationType = element.getAttribute('data-animate');

          if (animationType) {
            element.classList.add(`animate-${animationType}`);
          }

          // Stop observing this element (animation only triggers once)
          scrollObserver.unobserve(element);
        }
      });
    }, animationConfig);

    // Select all elements to animate
    const animateElements = Array.from(document.querySelectorAll('.animate-on-scroll'));

    // Observe each element
    animateElements.forEach(element => {
      scrollObserver.observe(element);
    });
  } else {
    // If reduced motion is preferred, immediately show all elements
    const animateElements = Array.from(document.querySelectorAll('.animate-on-scroll'));
    animateElements.forEach(element => {
      element.style.opacity = '1';
    });
  }

});
