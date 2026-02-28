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

  // Счётчики — запускаются при появлении в viewport
  function runCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    if (el.dataset.target) {
      animateCounter(el, parseInt(el.dataset.target), el.dataset.suffix || '', 1600);
    } else {
      var orig = el.textContent.trim();
      var m = orig.match(/^(\d+)(.*)/);
      if (m) animateCounter(el, parseInt(m[1]), m[2], 1400);
    }
  }

  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      runCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px' });

  document.querySelectorAll('.about-stat-num').forEach(function(el) {
    counterObserver.observe(el);
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
  // КАРТОЧКИ ОТЗЫВОВ
  // ============================================
  (function() {
    const stage = document.getElementById('freecards-stage');
    if (!stage) return;

    const allCards = Array.from(stage.querySelectorAll('.freecard'));
    if (!allCards.length) return;

    let mode = null; // 'stack' | 'free'

    // ── ОБЩИЕ EXPAND КНОПКИ ─────────────────────────────────────
    allCards.forEach(card => {
      const btn = card.querySelector('.freecard-expand');
      if (!btn) return;
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const exp = card.classList.toggle('is-expanded');
        btn.textContent = exp ? 'Свернуть' : 'Читать';
        if (mode === 'stack') {
          setTimeout(() => {
            const h = card.offsetHeight + 100;
            stage.style.height = exp ? Math.max(stage.offsetHeight, h) + 'px' : '';
          }, 50);
        }
      });
    });

    // ── СТОПКА (мобиле) ──────────────────────────────────────────
    function initStack() {
      mode = 'stack';
      stage.classList.add('stack-mode');
      stage.style.height = '';
      const cards = allCards.slice(); // copy

      function layout() {
        cards.forEach(function(card, i) {
          card.style.position = 'absolute';
          card.style.width = Math.min(300, window.innerWidth * 0.82) + 'px';
          card.style.left = '50%';
          card.style.top = '50%';
          card.style.zIndex = String(cards.length - i);
          card.style.pointerEvents = i === 0 ? 'auto' : 'none';
          var rot = i === 0 ? 0 : (i % 2 === 0 ? -(i * 2) : (i * 2));
          var sc = 1 - i * 0.04;
          var dy = i * 8;
          card.style.transition = 'transform 0.35s ease, opacity 0.35s ease, box-shadow 0.2s ease';
          card.style.transform = 'translate(-50%, calc(-50% + ' + dy + 'px)) rotate(' + rot + 'deg) scale(' + sc + ')';
          card.style.opacity = i > 4 ? '0' : '1';
        });
      }

      layout();

      var sx = 0, sy = 0, dragging = false, moved = false;

      function onDown(e) {
        if (e.target && e.target.classList && e.target.classList.contains('freecard-expand')) return;
        var pt = e.touches ? e.touches[0] : e;
        sx = pt.clientX; sy = pt.clientY;
        dragging = true; moved = false;
        cards[0].style.transition = 'none';
      }

      function onMove(e) {
        if (!dragging) return;
        var pt = e.touches ? e.touches[0] : e;
        var dx = pt.clientX - sx;
        var dy = pt.clientY - sy;
        if (!moved && Math.abs(dy) > Math.abs(dx)) { dragging = false; return; }
        moved = true;
        if (e.cancelable) e.preventDefault();
        var rot = dx * 0.1;
        var fade = Math.max(0, 1 - Math.abs(dx) / 250);
        cards[0].style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + (dy * 0.2) + 'px)) rotate(' + rot + 'deg)';
        cards[0].style.opacity = String(fade);
        if (cards[1]) {
          var prog = Math.min(Math.abs(dx) / 120, 1);
          var rot2 = 1 % 2 === 0 ? -2 : 2;
          var sc2 = (1 - 0.04) + prog * 0.04;
          cards[1].style.transition = 'none';
          cards[1].style.transform = 'translate(-50%, calc(-50% + 8px)) rotate(' + rot2 + 'deg) scale(' + sc2 + ')';
        }
      }

      function onUp(e) {
        if (!dragging) return;
        dragging = false;
        if (!moved) return;
        var pt = e.changedTouches ? e.changedTouches[0] : e;
        var dx = pt.clientX - sx;
        if (Math.abs(dx) > 80) {
          var dir = dx > 0 ? 1 : -1;
          cards[0].style.transition = 'transform 0.4s ease, opacity 0.3s ease';
          cards[0].style.transform = 'translate(calc(-50% + ' + (dir * 600) + 'px), -50%) rotate(' + (dir * 20) + 'deg)';
          cards[0].style.opacity = '0';
          setTimeout(function() { cards.push(cards.shift()); layout(); }, 420);
        } else {
          layout();
        }
      }

      stage.addEventListener('mousedown', onDown);
      stage.addEventListener('touchstart', onDown, { passive: true });
      document.addEventListener('mousemove', onMove);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchend', onUp);
    }

    // ── СВОБОДНОЕ ПЕРЕТАСКИВАНИЕ (десктоп) ───────────────────────
    function initFree() {
      mode = 'free';
      stage.classList.remove('stack-mode');
      stage.style.height = '';

      allCards.forEach(function(card) {
        card.style.cssText = '';
        card.style.position = 'absolute';
        var bx = parseFloat(card.dataset.x || 0) + (Math.random() - 0.5) * 20;
        var by = parseFloat(card.dataset.y || 0) + (Math.random() - 0.5) * 16;
        card.style.left = bx + 'px';
        card.style.top = by + 'px';
        var rot = card.style.getPropertyValue('--rot') || '0deg';
        card.style.transform = 'rotate(' + rot + ')';
        card.style.zIndex = '1';
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
      });

      var active = null, ox = 0, oy = 0, zC = 10;
      var lx = 0, ly = 0, cvx = 0, cvy = 0, lt = 0, raf = null;

      function onDown(e) {
        if (e.target && e.target.classList && e.target.classList.contains('freecard-expand')) return;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        active = this;
        active.classList.add('is-dragging');
        zC++; active.style.zIndex = String(zC);
        var pt = e.touches ? e.touches[0] : e;
        var r = active.getBoundingClientRect();
        ox = pt.clientX - r.left; oy = pt.clientY - r.top;
        lx = pt.clientX; ly = pt.clientY; lt = Date.now();
        cvx = 0; cvy = 0;
        e.preventDefault();
      }

      function onMove(e) {
        if (!active) return;
        var pt = e.touches ? e.touches[0] : e;
        var sr = stage.getBoundingClientRect();
        var x = Math.max(0, Math.min(sr.width - active.offsetWidth, pt.clientX - sr.left - ox));
        var y = Math.max(0, Math.min(sr.height - active.offsetHeight, pt.clientY - sr.top - oy));
        active.style.left = x + 'px'; active.style.top = y + 'px';
        var now = Date.now(), dt = now - lt || 16;
        cvx = (pt.clientX - lx) / dt * 16;
        cvy = (pt.clientY - ly) / dt * 16;
        lx = pt.clientX; ly = pt.clientY; lt = now;
        e.preventDefault();
      }

      function onUp() {
        if (!active) return;
        var card = active; active = null;
        card.classList.remove('is-dragging');
        var vx = cvx * 0.8, vy = cvy * 0.8;
        function step() {
          if (Math.abs(vx) < 0.2 && Math.abs(vy) < 0.2) return;
          var sw = stage.offsetWidth, sh = stage.offsetHeight;
          var x = parseFloat(card.style.left) + vx;
          var y = parseFloat(card.style.top) + vy;
          if (x <= 0) { x = 0; vx = Math.abs(vx) * 0.4; }
          if (x >= sw - card.offsetWidth) { x = sw - card.offsetWidth; vx = -Math.abs(vx) * 0.4; }
          if (y <= 0) { y = 0; vy = Math.abs(vy) * 0.4; }
          if (y >= sh - card.offsetHeight) { y = sh - card.offsetHeight; vy = -Math.abs(vy) * 0.4; }
          card.style.left = x + 'px'; card.style.top = y + 'px';
          vx *= 0.88; vy *= 0.88;
          raf = requestAnimationFrame(step);
        }
        raf = requestAnimationFrame(step);
      }

      allCards.forEach(function(card) {
        card.addEventListener('mousedown', onDown);
      });
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    }

    // ── ЗАПУСК ───────────────────────────────────────────────────
    var currentMode = window.innerWidth <= 768 ? 'stack' : 'free';
    if (currentMode === 'stack') initStack(); else initFree();

    var resizeT;
    window.addEventListener('resize', function() {
      clearTimeout(resizeT);
      resizeT = setTimeout(function() {
        var m = window.innerWidth <= 768 ? 'stack' : 'free';
        if (m !== currentMode) { currentMode = m; if (m === 'stack') initStack(); else initFree(); }
      }, 200);
    });
  })();

});
