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
  // СЧЁТЧИКИ СТАТИСТИКИ
  // ============================================
  function animateCount(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseInt(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var duration = 1600;
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var cObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        cObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0 });

  document.querySelectorAll('.about-stat-num').forEach(function(el) {
    cObs.observe(el);
  });

  // ============================================
  // КАРТОЧКИ ОТЗЫВОВ
  // ============================================
  (function() {
    var stage = document.getElementById('freecards-stage');
    if (!stage) return;
    var allCards = Array.from(stage.querySelectorAll('.freecard'));
    if (!allCards.length) return;

    // Expand кнопки
    allCards.forEach(function(card) {
      var btn = card.querySelector('.freecard-expand');
      if (!btn) return;
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var exp = card.classList.toggle('is-expanded');
        btn.textContent = exp ? 'Свернуть' : 'Читать';
        if (window.innerWidth <= 768) {
          setTimeout(function() {
            var h = card.offsetHeight + 100;
            stage.style.height = exp ? Math.max(stage.offsetHeight, h) + 'px' : '';
          }, 50);
        }
      });
    });

    // МОБИЛЕ: стопка со свайпом
    function initStack() {
      stage.classList.add('stack-mode');
      stage.style.height = '';
      var cards = allCards.slice();

      function layout() {
        cards.forEach(function(card, i) {
          card.style.position = 'absolute';
          card.style.width = Math.min(300, window.innerWidth * 0.82) + 'px';
          card.style.left = '50%';
          card.style.top = '50%';
          card.style.zIndex = String(cards.length - i);
          card.style.pointerEvents = i === 0 ? 'auto' : 'none';
          var rot = i === 0 ? 0 : (i % 2 === 0 ? -(i * 2) : (i * 2));
          card.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
          card.style.transform = 'translate(-50%, calc(-50% + ' + (i * 8) + 'px)) rotate(' + rot + 'deg) scale(' + (1 - i * 0.04) + ')';
          card.style.opacity = i > 4 ? '0' : '1';
        });
      }
      layout();

      var sx = 0, sy = 0, touching = false, moved = false;

      stage.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('freecard-expand')) return;
        var t = e.touches[0];
        sx = t.clientX; sy = t.clientY;
        touching = true; moved = false;
        cards[0].style.transition = 'none';
      }, { passive: true });

      document.addEventListener('touchmove', function(e) {
        if (!touching) return;
        var t = e.touches[0];
        var dx = t.clientX - sx, dy = t.clientY - sy;
        if (!moved && Math.abs(dy) > Math.abs(dx)) { touching = false; return; }
        moved = true;
        if (e.cancelable) e.preventDefault();
        cards[0].style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + (dy * 0.2) + 'px)) rotate(' + (dx * 0.1) + 'deg)';
        cards[0].style.opacity = String(Math.max(0, 1 - Math.abs(dx) / 250));
      }, { passive: false });

      document.addEventListener('touchend', function(e) {
        if (!touching) return;
        touching = false;
        if (!moved) return;
        var dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 80) {
          var dir = dx > 0 ? 1 : -1;
          cards[0].style.transition = 'transform 0.4s ease, opacity 0.3s ease';
          cards[0].style.transform = 'translate(calc(-50% + ' + (dir * 600) + 'px), -50%) rotate(' + (dir * 20) + 'deg)';
          cards[0].style.opacity = '0';
          setTimeout(function() { cards.push(cards.shift()); layout(); }, 420);
        } else {
          layout();
        }
      });
    }

    // ДЕСКТОП: свободное перетаскивание с инерцией
    function initFree() {
      stage.classList.remove('stack-mode');
      allCards.forEach(function(card) {
        card.style.cssText = '';
        card.style.position = 'absolute';
        card.style.left = (parseFloat(card.dataset.x || 0) + (Math.random() - 0.5) * 20) + 'px';
        card.style.top  = (parseFloat(card.dataset.y || 0) + (Math.random() - 0.5) * 16) + 'px';
        card.style.zIndex = '1';
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        card.style.cursor = 'grab';
      });

      var active = null, ox = 0, oy = 0, zC = 10;
      var lx = 0, ly = 0, vx = 0, vy = 0, lt = 0, raf = null;

      allCards.forEach(function(card) {
        card.addEventListener('mousedown', function(e) {
          if (e.target.classList.contains('freecard-expand')) return;
          if (raf) { cancelAnimationFrame(raf); raf = null; }
          active = card;
          card.style.cursor = 'grabbing';
          zC++; card.style.zIndex = String(zC);
          ox = e.clientX - card.getBoundingClientRect().left;
          oy = e.clientY - card.getBoundingClientRect().top;
          lx = e.clientX; ly = e.clientY;
          lt = Date.now(); vx = 0; vy = 0;
          e.preventDefault();
        });
      });

      window.addEventListener('mousemove', function(e) {
        if (!active) return;
        var sr = stage.getBoundingClientRect();
        active.style.left = Math.max(0, Math.min(sr.width - active.offsetWidth, e.clientX - sr.left - ox)) + 'px';
        active.style.top  = Math.max(0, Math.min(sr.height - active.offsetHeight, e.clientY - sr.top - oy)) + 'px';
        var now = Date.now(), dt = now - lt || 16;
        vx = (e.clientX - lx) / dt * 16;
        vy = (e.clientY - ly) / dt * 16;
        lx = e.clientX; ly = e.clientY; lt = now;
        e.preventDefault();
      });

      window.addEventListener('mouseup', function() {
        if (!active) return;
        var card = active; active = null;
        card.style.cursor = 'grab';
        var cvx = vx * 0.8, cvy = vy * 0.8;
        function step() {
          if (Math.abs(cvx) < 0.2 && Math.abs(cvy) < 0.2) return;
          var x = parseFloat(card.style.left) + cvx;
          var y = parseFloat(card.style.top) + cvy;
          var sw = stage.offsetWidth, sh = stage.offsetHeight;
          if (x <= 0) { x = 0; cvx = Math.abs(cvx) * 0.4; }
          if (x >= sw - card.offsetWidth) { x = sw - card.offsetWidth; cvx = -Math.abs(cvx) * 0.4; }
          if (y <= 0) { y = 0; cvy = Math.abs(cvy) * 0.4; }
          if (y >= sh - card.offsetHeight) { y = sh - card.offsetHeight; cvy = -Math.abs(cvy) * 0.4; }
          card.style.left = x + 'px'; card.style.top = y + 'px';
          cvx *= 0.88; cvy *= 0.88;
          raf = requestAnimationFrame(step);
        }
        raf = requestAnimationFrame(step);
      });
    }

    if (window.innerWidth <= 768) initStack(); else initFree();
  })();

});
