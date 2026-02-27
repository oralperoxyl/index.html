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

  // Typewriter effect for headings
  function typewriterEffect(element, speed = 50) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';

    let charIndex = 0;
    const typeNextChar = () => {
      if (charIndex < text.length) {
        element.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeNextChar, speed);
      }
    };

    typeNextChar();
  }

  // Only initialize animations if user hasn't requested reduced motion
  if (!prefersReducedMotion) {
    // Create Intersection Observer
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation class when element enters viewport
          const element = entry.target;
          const animationType = element.getAttribute('data-animate');

          // Check if element is a heading (h1, h2)
          if (element.tagName === 'H1' || element.tagName === 'H2') {
            // Apply typewriter effect to headings
            setTimeout(() => typewriterEffect(element, 30), 200);
          } else if (animationType) {
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

  // ============================================
  // ЧИСЛО АНИМАЦИЯ (счётчик)
  // ============================================

  function animateCounter(el, target, suffix, duration) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const badgeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const original = el.dataset.original || el.textContent.trim();
      el.dataset.original = original;
      const match = original.match(/^(\d+)(\+?\s*.*)$/);
      if (match) {
        const target = parseInt(match[1]);
        const suffix = match[2];
        animateCounter(el, target, suffix, 1400);
      }
      badgeObserver.unobserve(el);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.about-badge').forEach(el => {
    badgeObserver.observe(el);
  });

  // ============================================
  // REFERRAL SYSTEM
  // ============================================

  const WEB3FORMS_KEY = "15cc9dfa-af27-418a-aae7-5a195d354206";
  const REFERRAL_BASE_URL = "https://fastbroker21.ru";

  function refGenerateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function refNormalizePhone(raw) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return raw;
    let d = digits;
    if (d.startsWith("8") && d.length === 11) d = "7" + d.slice(1);
    if (!d.startsWith("7")) d = "7" + d;
    if (d.length < 11) return raw;
    return "+7" + d.slice(1);
  }

  function refShowError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("is-visible", !!msg);
  }

  function refClearErrors() {
    document.querySelectorAll(".referral-error").forEach(e => {
      e.textContent = "";
      e.classList.remove("is-visible");
    });
    document.querySelectorAll(".referral-input").forEach(i => i.classList.remove("is-error"));
  }

  function refMarkError(inputId, errId, msg) {
    const input = document.getElementById(inputId);
    if (input) input.classList.add("is-error");
    refShowError(errId, msg);
  }

  function refSetupShareButtons(link) {
    const text = "Рекомендую агента по недвижимости Семёна Гончарова. Ссылка: " + link;
    const tgBtn = document.getElementById("share-tg");
    const waBtn = document.getElementById("share-wa");
    const copyBtn = document.getElementById("share-copy");

    if (tgBtn) {
      tgBtn.onclick = () => window.open(
        "https://t.me/share/url?url=" + encodeURIComponent(link) + "&text=" + encodeURIComponent("Рекомендую агента по недвижимости Семёна Гончарова 🏠"),
        "_blank", "noopener"
      );
    }
    if (waBtn) {
      waBtn.onclick = () => window.open(
        "https://wa.me/?text=" + encodeURIComponent(text),
        "_blank", "noopener"
      );
    }
    if (copyBtn) {
      copyBtn.onclick = () => {
        const done = () => {
          copyBtn.textContent = "Скопировано";
          copyBtn.classList.add("copied");
          setTimeout(() => {
            copyBtn.textContent = "Скопировать ссылку";
            copyBtn.classList.remove("copied");
          }, 2000);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(link).then(done);
        } else {
          const ta = document.createElement("textarea");
          ta.value = link;
          ta.style.cssText = "position:fixed;opacity:0";
          document.body.appendChild(ta);
          ta.focus(); ta.select();
          try { document.execCommand("copy"); done(); } catch(e) {}
          document.body.removeChild(ta);
        }
      };
    }
  }

  const refForm = document.getElementById("referral-form");
  const refFormCard = document.getElementById("referral-form-card");
  const refSuccessCard = document.getElementById("referral-success-card");
  const refLinkDisplay = document.getElementById("referral-link-display");
  const refSubmitBtn = document.getElementById("referral-submit-btn");
  const refSendingMsg = document.getElementById("referral-sending");
  const refNewLinkBtn = document.getElementById("referral-new-link");

  // Восстановить из localStorage если уже создавали ссылку
  const savedRefId = localStorage.getItem("referral_ref_id");
  if (savedRefId && refFormCard && refSuccessCard && refLinkDisplay) {
    const savedLink = REFERRAL_BASE_URL + "/?ref=" + savedRefId;
    refLinkDisplay.textContent = savedLink;
    refFormCard.hidden = true;
    refSuccessCard.hidden = false;
    refSetupShareButtons(savedLink);
  }

  if (refForm) {
    refForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      refClearErrors();

      const refName = document.getElementById("ref-name").value.trim();
      const refPhoneRaw = document.getElementById("ref-phone").value.trim();
      const clientName = document.getElementById("client-name").value.trim();
      const clientPhoneRaw = document.getElementById("client-phone").value.trim();
      const comment = document.getElementById("ref-comment").value.trim();
      const consent = document.getElementById("ref-consent").checked;

      let valid = true;
      if (!refName)       { refMarkError("ref-name", "err-ref-name", "Введите ваше имя"); valid = false; }
      if (!refPhoneRaw)   { refMarkError("ref-phone", "err-ref-phone", "Введите ваш телефон"); valid = false; }
      if (!clientName)    { refMarkError("client-name", "err-client-name", "Введите имя клиента"); valid = false; }
      if (!clientPhoneRaw){ refMarkError("client-phone", "err-client-phone", "Введите телефон клиента"); valid = false; }
      if (!consent)       { refShowError("err-consent", "Необходимо согласие на обработку данных"); valid = false; }
      if (!valid) return;

      const refPhone = refNormalizePhone(refPhoneRaw);
      const clientPhone = refNormalizePhone(clientPhoneRaw);
      const refId = refGenerateId();
      const referralLink = REFERRAL_BASE_URL + "/?ref=" + refId;

      if (refSubmitBtn) refSubmitBtn.disabled = true;
      if (refSendingMsg) refSendingMsg.hidden = false;

      // Отправка на почту через web3forms
      try {
        const fd = new FormData();
        fd.append("access_key", WEB3FORMS_KEY);
        fd.append("subject", "Новая рекомендация — " + refName);
        fd.append("Рекомендатель", refName + " / " + refPhone);
        fd.append("Клиент", clientName + " / " + clientPhone);
        fd.append("Комментарий", comment || "—");
        fd.append("Реферальная ссылка", referralLink);
        fd.append("ID", refId);
        fd.append("Дата", new Date().toLocaleString("ru-RU"));
        await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      } catch (err) { /* продолжаем */ }

      localStorage.setItem("referral_ref_id", refId);

      if (refSubmitBtn) refSubmitBtn.disabled = false;
      if (refSendingMsg) refSendingMsg.hidden = true;

      refLinkDisplay.textContent = referralLink;
      refFormCard.hidden = true;
      refSuccessCard.hidden = false;
      refSuccessCard.scrollIntoView({ behavior: "smooth", block: "start" });
      refSetupShareButtons(referralLink);
    });
  }

  if (refNewLinkBtn) {
    refNewLinkBtn.addEventListener("click", () => {
      localStorage.removeItem("referral_ref_id");
      refFormCard.hidden = false;
      refSuccessCard.hidden = true;
      refForm.reset();
      refClearErrors();
      refFormCard.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // ============================================
  // МГНОВЕННОЕ КАСАНИЕ — кнопки в контактах
  // ============================================

  document.querySelectorAll('.contact-form-submit, .channel-link').forEach(btn => {
    btn.addEventListener('touchstart', () => {
      btn.style.transition = 'none';
      btn.classList.add('is-touched');
    }, { passive: true });

    btn.addEventListener('touchend', () => {
      btn.style.transition = 'background 0.5s ease, border-color 0.5s ease, color 0.5s ease';
      btn.classList.remove('is-touched');
    }, { passive: true });

    btn.addEventListener('touchcancel', () => {
      btn.style.transition = 'background 0.5s ease, border-color 0.5s ease, color 0.5s ease';
      btn.classList.remove('is-touched');
    }, { passive: true });
  });

  // ============================================
  // КАРТОЧКИ ОТЗЫВОВ — десктоп: свободное перетаскивание с инерцией
  //                    мобиле: стопка со свайпом
  // ============================================
  const stage = document.getElementById('freecards-stage');
  if (stage) {
    const freecards = Array.from(stage.querySelectorAll('.freecard'));
    const isMobile = () => window.innerWidth <= 768;

    // ── МОБИЛЕ: стопка ──────────────────────────────────────────
    function initStack() {
      stage.classList.add('stack-mode');
      const cards = [...freecards];
      const total = cards.length;

      function layoutStack() {
        cards.forEach((card, i) => {
          card.style.position = 'absolute';
          card.style.left = '50%';
          card.style.top = '50%';
          const offset = i * 6;
          const rot = i === 0 ? 0 : (i % 2 === 0 ? -(i * 1.5) : (i * 1.5));
          const scale = 1 - i * 0.04;
          card.style.transform = `translate(-50%, calc(-50% + ${offset}px)) rotate(${rot}deg) scale(${scale})`;
          card.style.zIndex = total - i;
          card.style.opacity = i > 4 ? '0' : '1';
          card.style.transition = i === 0 ? 'none' : 'transform 0.35s ease, opacity 0.35s ease';
          card.style.pointerEvents = i === 0 ? 'auto' : 'none';
          card.style.width = '';
          card.style.flex = '';
        });
      }

      layoutStack();

      let startX = 0, startY = 0, dragging = false, moved = false;

      function onTouchStart(e) {
        if (e.target.classList.contains('freecard-expand')) return;
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
        dragging = true;
        moved = false;
        cards[0].style.transition = 'none';
      }

      function onTouchMove(e) {
        if (!dragging || !cards[0]) return;
        const t = e.touches[0];
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;
        if (Math.abs(dx) > Math.abs(dy)) {
          e.preventDefault();
          moved = true;
        } else return;
        const rot = dx * 0.12;
        const fade = Math.max(0, 1 - Math.abs(dx) / 220);
        cards[0].style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy * 0.3}px)) rotate(${rot}deg)`;
        cards[0].style.opacity = fade;
        // Следующая карточка чуть приближается
        if (cards[1]) {
          const prog = Math.min(Math.abs(dx) / 120, 1);
          const s = 0.96 + prog * 0.04;
          cards[1].style.transform = `translate(-50%, calc(-50% + 6px)) rotate(${cards[1].dataset.baseRot || 1.5}deg) scale(${s})`;
        }
      }

      function onTouchEnd(e) {
        if (!dragging) return;
        dragging = false;
        if (!moved || !cards[0]) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - startX;
        if (Math.abs(dx) > 80) {
          // Улетает
          const dir = dx > 0 ? 1 : -1;
          cards[0].style.transition = 'transform 0.4s ease, opacity 0.3s ease';
          cards[0].style.transform = `translate(calc(-50% + ${dir * 500}px), -50%) rotate(${dir * 25}deg)`;
          cards[0].style.opacity = '0';
          setTimeout(() => {
            cards.push(cards.shift());
            layoutStack();
          }, 420);
        } else {
          // Возврат
          cards[0].style.transition = 'transform 0.35s ease, opacity 0.35s ease';
          layoutStack();
        }
      }

      stage.addEventListener('touchstart', onTouchStart, { passive: true });
      stage.addEventListener('touchmove', onTouchMove, { passive: false });
      stage.addEventListener('touchend', onTouchEnd);

      // Expand кнопки
      freecards.forEach(card => {
        const btn = card.querySelector('.freecard-expand');
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const expanded = card.classList.toggle('is-expanded');
            btn.textContent = expanded ? 'Свернуть' : 'Читать';
          });
        }
      });
    }

    // ── ДЕСКТОП: свободное перетаскивание с инерцией ──────────────
    function initFree() {
      stage.classList.remove('stack-mode');
      freecards.forEach(card => {
        card.style.position = 'absolute';
        card.style.left = (parseFloat(card.dataset.x) + (Math.random() - 0.5) * 20) + 'px';
        card.style.top  = (parseFloat(card.dataset.y) + (Math.random() - 0.5) * 16) + 'px';
        card.style.transform = `rotate(${card.style.getPropertyValue('--rot') || '0deg'})`;
        card.style.zIndex = '1';
        card.style.opacity = '1';
        card.style.width = '';
        card.style.transition = 'box-shadow 0.2s ease';
        card.style.pointerEvents = 'auto';
      });

      let activeCard = null, offsetX = 0, offsetY = 0, zCounter = 10;
      let lastX = 0, lastY = 0, velX = 0, velY = 0, lastTime = 0, inertiaFrame = null;

      function getPoint(e) { return e.touches ? e.touches[0] : e; }

      function startDrag(e) {
        if (e.target.classList.contains('freecard-expand')) return;
        if (inertiaFrame) { cancelAnimationFrame(inertiaFrame); inertiaFrame = null; }
        activeCard = e.currentTarget;
        activeCard.classList.add('is-dragging');
        activeCard.style.transition = 'box-shadow 0.2s ease';
        zCounter++;
        activeCard.style.zIndex = zCounter;
        const point = getPoint(e);
        const rect = activeCard.getBoundingClientRect();
        offsetX = point.clientX - rect.left;
        offsetY = point.clientY - rect.top;
        lastX = point.clientX; lastY = point.clientY;
        lastTime = Date.now(); velX = 0; velY = 0;
        e.preventDefault();
      }

      function moveDrag(e) {
        if (!activeCard) return;
        const point = getPoint(e);
        const sr = stage.getBoundingClientRect();
        let x = Math.max(0, Math.min(sr.width - activeCard.offsetWidth, point.clientX - sr.left - offsetX));
        let y = Math.max(0, Math.min(sr.height - activeCard.offsetHeight, point.clientY - sr.top - offsetY));
        activeCard.style.left = x + 'px';
        activeCard.style.top  = y + 'px';
        const now = Date.now(), dt = now - lastTime || 16;
        velX = (point.clientX - lastX) / dt * 16;
        velY = (point.clientY - lastY) / dt * 16;
        lastX = point.clientX; lastY = point.clientY; lastTime = now;
        e.preventDefault();
      }

      function endDrag() {
        if (!activeCard) return;
        const card = activeCard;
        card.classList.remove('is-dragging');
        activeCard = null;
        let vx = velX * 0.8, vy = velY * 0.8;
        const friction = 0.88;
        function inertia() {
          if (Math.abs(vx) < 0.2 && Math.abs(vy) < 0.2) return;
          const sw = stage.offsetWidth, sh = stage.offsetHeight;
          const cw = card.offsetWidth, ch = card.offsetHeight;
          let x = parseFloat(card.style.left) + vx;
          let y = parseFloat(card.style.top) + vy;
          if (x <= 0) { x = 0; vx = Math.abs(vx) * 0.4; }
          if (x >= sw - cw) { x = sw - cw; vx = -Math.abs(vx) * 0.4; }
          if (y <= 0) { y = 0; vy = Math.abs(vy) * 0.4; }
          if (y >= sh - ch) { y = sh - ch; vy = -Math.abs(vy) * 0.4; }
          card.style.left = x + 'px'; card.style.top = y + 'px';
          vx *= friction; vy *= friction;
          inertiaFrame = requestAnimationFrame(inertia);
        }
        inertiaFrame = requestAnimationFrame(inertia);
      }

      freecards.forEach(card => {
        card.addEventListener('mousedown', startDrag);
        const btn = card.querySelector('.freecard-expand');
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const expanded = card.classList.toggle('is-expanded');
            btn.textContent = expanded ? 'Свернуть' : 'Читать';
            setTimeout(() => {
              const sh = stage.offsetHeight;
              if (card.offsetTop + card.offsetHeight > sh)
                card.style.top = Math.max(0, sh - card.offsetHeight) + 'px';
            }, 320);
          });
        }
      });

      window.addEventListener('mousemove', moveDrag);
      window.addEventListener('mouseup', endDrag);
    }

    // ── Инициализация в зависимости от ширины экрана ──────────────
    if (isMobile()) {
      initStack();
    } else {
      initFree();
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (isMobile()) initStack(); else initFree();
      }, 200);
    });
  }


});
