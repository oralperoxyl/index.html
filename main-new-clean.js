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

});
