// Google tag init
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
window.gtag('js', new Date());
window.gtag('config', 'G-R7PMRC7B3V');


document.addEventListener('DOMContentLoaded', () => {
      // Reviews fade-in
      (() => {
        const cards = Array.from(document.querySelectorAll('.review-card'));
        if (!cards.length || !('IntersectionObserver' in window)) {
          cards.forEach(card => card.classList.add('visible'));
          return;
        }
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
          });
        }, { threshold: 0.15 });
        cards.forEach(card => observer.observe(card));
      })();

      // Benefits notes + reveal
      (() => {
        const items = Array.from(document.querySelectorAll('.benefit-item'));
        if (!items.length) return;
        items.forEach(item => {
          const note = item.dataset.note;
          const span = item.querySelector('.benefit-note');
          if (span && note) span.textContent = note;
          item.addEventListener('mouseenter', () => span && span.classList.add('visible'));
          item.addEventListener('mouseleave', () => span && span.classList.remove('visible'));
        });
        if (!('IntersectionObserver' in window)) {
          items.forEach(item => item.classList.add('visible'));
          return;
        }
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
          });
        }, { threshold: 0.2 });
        items.forEach(item => observer.observe(item));
      })();

      // Reviews masonry layout (lightweight)
      (() => {
        const grid = document.querySelector('.reviews-grid');
        if (!grid) return;
        const cards = Array.from(grid.querySelectorAll('.review-card'));
        if (!cards.length) return;

        const readVar = (name, fallback) => {
          const value = getComputedStyle(grid).getPropertyValue(name).trim();
          const num = parseFloat(value);
          return Number.isFinite(num) ? num : fallback;
        };

        const layout = () => {
          const width = grid.clientWidth;
          if (width <= 720) {
            grid.classList.remove('masonry');
            grid.style.height = '';
            cards.forEach(card => {
              card.style.position = '';
              card.style.left = '';
              card.style.top = '';
              card.style.width = '';
            });
            return;
          }

          const gap = readVar('--masonry-gap', 96);
          const min = readVar('--masonry-min', 320);
          const columns = Math.max(2, Math.floor((width + gap) / (min + gap)));
          const colWidth = (width - gap * (columns - 1)) / columns;
          const heights = Array(columns).fill(0);

          grid.classList.add('masonry');
          cards.forEach(card => {
            card.style.position = 'absolute';
            card.style.width = `${colWidth}px`;
            const minHeight = Math.min(...heights);
            const colIndex = heights.indexOf(minHeight);
            const x = colIndex * (colWidth + gap);
            const y = minHeight;
            card.style.left = `${x}px`;
            card.style.top = `${y}px`;
            heights[colIndex] = y + card.offsetHeight + gap;
          });
          grid.style.height = `${Math.max(...heights)}px`;
        };

        let raf = null;
        const schedule = () => {
          if (raf) cancelAnimationFrame(raf);
          raf = requestAnimationFrame(layout);
        };

        window.addEventListener('resize', schedule);
        window.addEventListener('load', schedule);
        schedule();
      })();

      // Review modal + submit
      (() => {
        const modal = document.querySelector('.review-modal');
        const openBtn = document.querySelector('.review-button');
        const closeBtn = modal ? modal.querySelector('.review-close') : null;
        const form = document.getElementById('reviewForm');
        const message = modal ? modal.querySelector('.review-message') : null;
        if (!modal || !openBtn || !closeBtn || !form) return;

        const open = () => {
          modal.classList.add('active');
          modal.setAttribute('aria-hidden', 'false');
        };
        const close = () => {
          modal.classList.remove('active');
          modal.setAttribute('aria-hidden', 'true');
        };

        openBtn.addEventListener('click', open);
        closeBtn.addEventListener('click', close);
        modal.addEventListener('click', (e) => {
          if (e.target === modal) close();
        });

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          if (message) message.textContent = '';
          try {
            const data = new FormData(form);
            const res = await fetch(form.action, {
              method: 'POST',
              body: data,
            });
            if (res.ok) {
              if (message) message.textContent = 'Спасибо за отзыв';
              form.reset();
              setTimeout(close, 3000);
            } else if (message) {
              message.textContent = 'Не удалось отправить. Попробуйте ещё раз.';
            }
          } catch {
            if (message) message.textContent = 'Ошибка отправки. Попробуйте ещё раз.';
          }
        });
      })();
    

      // Hero typewriter effect
      (() => {
        const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduce) return;
  
        const sequence = [
          { sel: '.hero-kicker', speed: 18 },
          { sel: '.hero-title', speed: 22 },
          { sel: '.hero-subtitle', speed: 16 }
        ];
  
        const items = sequence
          .map(cfg => {
            const el = document.querySelector(cfg.sel);
            if (!el) return null;
            const full = (el.textContent || '').trim();
            el.textContent = '';
            return { el, full, speed: cfg.speed };
          })
          .filter(Boolean);
  
        if (!items.length) return;
  
        const type = (item, done) => {
          let i = 0;
          const tick = () => {
            item.el.textContent = item.full.slice(0, i);
            i++;
            if (i <= item.full.length) {
              setTimeout(tick, item.speed);
            } else {
              done();
            }
          };
          tick();
        };
  
        let idx = 0;
        const next = () => {
          if (idx >= items.length) return;
          type(items[idx], () => {
            idx++;
            setTimeout(next, 120);
          });
        };
  
        next();
      })();

      // Services intro typewriter
      (() => {
        const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (prefersReduce || isMobile) return;
        const el = document.querySelector('.services-intro');
        if (!el) return;
        const full = (el.textContent || '').trim();
        if (!full) return;
        el.textContent = '';
        let i = 0;
        const tick = () => {
          el.textContent = full.slice(0, i);
          i++;
          if (i <= full.length) {
            setTimeout(tick, 12);
          }
        };
        tick();
      })();

      // Mobile accordion for "О чём моя работа"
      (() => {
        const services = Array.from(document.querySelectorAll('.service-item'));
        if (!services.length) return;
        const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

        const bind = () => {
          services.forEach(item => {
            const trigger = item.querySelector('.service-trigger');
            if (!trigger || trigger.dataset.bound) return;
            trigger.dataset.bound = 'true';
            trigger.addEventListener('click', () => {
              if (!isMobile()) return;
              const isOpen = item.classList.contains('open');
              services.forEach(other => other.classList.remove('open'));
              if (!isOpen) item.classList.add('open');
            });
          });
        };

        bind();
        window.addEventListener('resize', () => {
          if (!isMobile()) {
            services.forEach(item => item.classList.remove('open'));
          }
        });
      })();

      // Mobile contact buttons: periodic color pulse when in view
      (() => {
        const contactInfo = document.querySelector('.contact-info');
        if (!contactInfo) return;
        const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
        let intervalId = null;

        const startPulse = () => {
          if (intervalId || !isMobile()) return;
          contactInfo.classList.add('is-colored');
          intervalId = window.setInterval(() => {
            contactInfo.classList.toggle('is-colored');
          }, 10000);
        };

        const stopPulse = () => {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          contactInfo.classList.remove('is-colored');
        };

        if (!('IntersectionObserver' in window)) {
          startPulse();
          return;
        }

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              startPulse();
            } else {
              stopPulse();
            }
          });
        }, { threshold: 0.2 });

        observer.observe(contactInfo);
        window.addEventListener('resize', () => {
          if (!isMobile()) stopPulse();
        });
      })();
  
      // Year
      document.getElementById('year').textContent = new Date().getFullYear();
  
      // Обновляем высоту шапки для отступов и якорей
      (() => {
        const header = document.querySelector('header');
        if (!header) return;
        const setH = () => {
          document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
        };
        window.addEventListener('load', setH);
        window.addEventListener('resize', setH);
        setH();
      })();
  
      // Прячем шапку после блока "Чем я помогу"
      (() => {
        const header = document.querySelector('header');
        const target = document.querySelector('.help-compact');
        if (!header || !target) return;
  
        const getHeaderH = () => {
          const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-h').trim();
          const num = parseFloat(raw);
          return Number.isFinite(num) ? num : header.offsetHeight || 0;
        };
  
        let hidden = false;
        const update = () => {
          const trigger = target.getBoundingClientRect().top + (window.scrollY || 0) - getHeaderH();
          const shouldHide = (window.scrollY || 0) >= trigger;
          if (shouldHide !== hidden) {
            hidden = shouldHide;
            header.classList.toggle('is-hidden', shouldHide);
          }
        };
  
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
      })();

      // Прогресс для pinned-сцен (равномерный hold) + смена контраста hero
      (() => {
        const scenes = Array.from(document.querySelectorAll('.pin-scene'));
        const update = () => {
        const vh = window.innerHeight || 1;
        scenes.forEach(scene => {
          const surface = scene.querySelector('.pin-surface');
          if (!surface) return;
            const rect = scene.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, (vh / 2 - rect.top) / Math.max(1, rect.height - vh)));
          surface.style.setProperty('--pin-progress', progress.toFixed(3));
          // no color toggle needed; keep hero text stable over gradient
        });
      };
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
      })();
  
      // Reveal process narrative as a whole
      (() => {
        const container = document.querySelector('.process-narrative');
        if (!container) return;
        const paras = Array.from(container.querySelectorAll('p'));
        const reveal = () => paras.forEach(p => p.classList.add('visible'));
        if (!('IntersectionObserver' in window)) {
          reveal();
          return;
        }
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => { if (entry.isIntersecting) reveal(); });
        }, { threshold: 0.1 });
        observer.observe(container);
      })();
  
      // Vanilla slider logic
      (function() {
        const slider = document.querySelector('.slider');
        const track = slider.querySelector('.track');
        const slides = Array.from(track.children);
        const prev = slider.querySelector('.prev');
        const next = slider.querySelector('.next');
        const dotsWrap = slider.querySelector('.dots');
  
        let index = 0;
  
        function perView() {
          return window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
        }
  
        function maxIndex() {
          return Math.max(0, slides.length - perView());
        }
  
        function slideWidth() {
          return slides[0].getBoundingClientRect().width;
        }
  
        function layoutDots() {
          dotsWrap.innerHTML = '';
          const count = slides.length - perView() + 1;
          for (let i=0; i<count; i++) {
            const d = document.createElement('div');
            d.className = 'dot' + (i===index ? ' active' : '');
            d.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(d);
          }
        }
  
        function goTo(i) {
          index = Math.max(0, Math.min(i, maxIndex()));
          track.style.transform = `translateX(${-index * slideWidth()}px)`;
          Array.from(dotsWrap.children).forEach((d, di) => d.classList.toggle('active', di===index));
        }
  
        function step(dir) {
          goTo(index + dir);
        }
  
        prev.addEventListener('click', () => step(-1));
        next.addEventListener('click', () => step(1));
        window.addEventListener('resize', () => { layoutDots(); goTo(index); });
  
        // Touch swipe
        let startX = 0, dx = 0, dragging = false;
        slider.addEventListener('touchstart', e => { dragging = true; startX = e.touches[0].clientX; }, {passive:true});
        slider.addEventListener('touchmove', e => { if(!dragging) return; dx = e.touches[0].clientX - startX; }, {passive:true});
        slider.addEventListener('touchend', () => { if(Math.abs(dx) > 40) step(dx>0?-1:1); dragging=false; dx=0; });
  
        layoutDots();
        goTo(0);
      })();
  
      // Всегда открывать страницу с верхушки
      window.addEventListener('load', () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
  
      // FAQ: аккордеон с плавным раскрытием
      (function() {
        const rows = Array.from(document.querySelectorAll('#faq .faq-row'));
        rows.forEach(row => {
          const btn = row.querySelector('.faq-btn');
          btn.addEventListener('click', () => {
            const isOpen = row.classList.contains('open');
            rows.forEach(r => r.classList.remove('open'));
            if (!isOpen) row.classList.add('open');
          });
        });
      })();
  
      // Бургер-меню
      (() => {
        const b = document.querySelector('.burger');
        const m = document.querySelector('.mobile-nav');
        if (!b || !m) return;
        b.addEventListener('click', () => m.classList.toggle('is-open'));
        m.addEventListener('click', (e) => {
          if (e.target.tagName === 'A') m.classList.remove('is-open');
        });
      })();
    

});
