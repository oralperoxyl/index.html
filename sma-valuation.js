/* sma-valuation.js — блок «Оценка (API)» для sma.html
 * Подключается ОДНОЙ строкой перед </body>:  <script src="sma-valuation.js?v=1"></script>
 * Ключ сервиса оценки здесь не хранится: запросы идут в Supabase Edge Function `estimate`,
 * которая проверяет GitHub-токен агента и сама подставляет X-API-Key.
 */
(function () {
  'use strict';
  var FN_URL = 'https://pogmpmbgddljujzumvnr.supabase.co/functions/v1/estimate';
  var LISTS_KEY = 'wr_est_lists_v1';
  var busy = false, lastRaw = null, mode = 'params';

  /* ── helpers ── */
  function $(id) { return document.getElementById(id); }
  function cur() { return allData.objects[currentId]; }
  function esc(s) { return escHtml(String(s == null ? '' : s)); }
  function ea(s) { return escAttr(s); }
  function num(v) { var n = Number(String(v == null ? '' : v).replace(/\s/g, '').replace(',', '.')); return isFinite(n) ? n : 0; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function call(body) {
    return fetch(FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.text().then(function (t) {
        var d; try { d = JSON.parse(t); } catch (e) { d = { raw: t }; }
        return { status: r.status, data: d };
      });
    });
  }
  function errText(r) {
    var m = r.data && (r.data.message || r.data.detail || r.data.error);
    if (r.status === 401) return 'Нет доступа: войдите по GitHub-токену владельца репозитория.';
    if (r.status === 403) return 'Сервис оценки отклонил ключ (403). Проверьте секрет EXPERT_API_KEY в Supabase.';
    if (r.status === 429) return 'Слишком часто: сервис разрешает 1 расчёт в 5 секунд. Повторите чуть позже.';
    if (r.status === 500 && r.data && r.data.error === 'no_key') return 'В Supabase не задан секрет EXPERT_API_KEY.';
    return 'Ошибка ' + r.status + (m ? ': ' + (typeof m === 'string' ? m : JSON.stringify(m)) : '');
  }

  /* ── справочники ── */
  function normList(x) {
    if (!x) return [];
    if (!Array.isArray(x) && typeof x === 'object') {
      var inner = x.items || x.data || x.list || x.values;
      if (Array.isArray(inner)) return normList(inner);
      return Object.keys(x).map(function (k) { return { id: k, name: String(x[k]) }; });
    }
    return x.map(function (o) {
      if (o && typeof o === 'object') {
        var id = o.id != null ? o.id : (o.value != null ? o.value : o.key);
        return { id: id, name: String(o.name || o.title || o.label || o.text || id) };
      }
      return { id: o, name: String(o) };
    });
  }
  function getListsCached() {
    try { return JSON.parse(localStorage.getItem(LISTS_KEY) || 'null'); } catch (e) { return null; }
  }
  async function ensureLists(force) {
    var c = !force && getListsCached();
    if (c) return c;
    var r = await call({ action: 'lists' });
    if (r.status !== 200) throw new Error(errText(r));
    var out = {};
    ['propertyTypes', 'roomsCount', 'buildingMaterials', 'repairTypes'].forEach(function (k) { out[k] = normList(r.data[k]); });
    try { localStorage.setItem(LISTS_KEY, JSON.stringify(out)); } catch (e) {}
    return out;
  }

  /* ── разметка блока ── */
  var CSS = '.est-box{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:14px}'
    + '.est-tabs{display:flex;gap:6px;margin-bottom:12px}'
    + '.est-tab{flex:1;font:500 12px var(--sans);padding:7px;border:1px solid var(--border);border-radius:4px;background:#fff;color:var(--muted);cursor:pointer}'
    + '.est-tab.on{background:var(--dark);color:#E5E5E5;border-color:var(--dark)}'
    + '.est-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}'
    + '.est-btn{width:100%;font:500 12px var(--sans);letter-spacing:.06em;text-transform:uppercase;padding:11px;border:none;border-radius:4px;background:var(--accent);color:#fff;cursor:pointer;margin-top:6px}'
    + '.est-btn[disabled]{opacity:.5;cursor:wait}'
    + '.est-btn.ghost{background:none;border:1px dashed var(--accent);color:var(--accent);text-transform:none;letter-spacing:0;padding:8px}'
    + '.est-msg{font-size:12px;line-height:1.5;margin-top:8px;color:var(--muted)}.est-msg.err{color:#C0392B}.est-msg.ok{color:#2D8A4E}'
    + '.est-price{display:flex;justify-content:space-between;gap:8px;font-size:13px;padding:6px 0;border-top:1px solid var(--border)}'
    + '.est-price b{font-weight:600}'
    + '.est-off{display:flex;gap:8px;align-items:flex-start;font-size:12px;padding:6px 0;border-top:1px solid var(--border);line-height:1.4}'
    + '.est-off input{margin-top:3px}.est-off span{color:var(--muted)}'
    + '.est-raw{font-size:10px;white-space:pre-wrap;word-break:break-all;max-height:200px;overflow:auto;background:#fff;border:1px solid var(--border);padding:8px;margin-top:6px}';

  function sel(id, label, items, val) {
    return '<div class="edit-row"><label class="edit-label">' + label + '</label><select class="edit-select" id="' + id + '">'
      + '<option value="">— выберите —</option>'
      + items.map(function (i) { return '<option value="' + ea(i.id) + '"' + (String(i.id) === String(val) ? ' selected' : '') + '>' + esc(i.name) + '</option>'; }).join('')
      + '</select></div>';
  }

  function mount() {
    if ($('estGroup')) return;
    var anchor = $('e-comps'); if (!anchor) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var g = document.createElement('div'); g.className = 'edit-group'; g.id = 'estGroup';
    g.innerHTML = '<div class="edit-group-title">Оценка (API)</div><div class="est-box" id="estBox"></div>';
    anchor.closest('.edit-group').parentNode.insertBefore(g, anchor.closest('.edit-group'));
  }

  function geoState(s) { return (s.estimate = s.estimate || {}); }

  function renderEst() {
    mount();
    var box = $('estBox'), s = cur(); if (!box || !s) return;
    var e = geoState(s), L = getListsCached() || { propertyTypes: [], roomsCount: [], buildingMaterials: [], repairTypes: [] };
    var hasL = !!getListsCached();
    var v = s.valuation;
    var html = '<div class="est-tabs">'
      + '<button class="est-tab' + (mode === 'params' ? ' on' : '') + '" data-m="params">По данным объекта</button>'
      + '<button class="est-tab' + (mode === 'url' ? ' on' : '') + '" data-m="url">По ссылке</button></div>';

    if (!hasL) {
      html += '<div class="est-msg">Сначала загрузите справочники сервиса (один раз).</div><button class="est-btn ghost" id="estLoadLists">Загрузить справочники</button>';
    } else {
      html += sel('est-type', 'Тип недвижимости', L.propertyTypes, e.propertyType || guessType(L.propertyTypes));
      if (mode === 'params') {
        var fl = parseFloor(s.floor);
        html += '<div class="est-msg" style="margin:0 0 8px">Площадь, этаж, адрес берутся из полей выше: '
          + (s.area ? s.area + ' м²' : '<b style="color:#C0392B">нет площади</b>') + ', '
          + (fl.floor ? 'этаж ' + fl.floor + '/' + (fl.total || '?') : '<b style="color:#C0392B">нет этажа 5/9</b>') + '.</div>'
          + sel('est-rooms', 'Комнат', L.roomsCount, e.roomsCount || guessRooms(L.roomsCount, s.rooms))
          + '<div class="est-grid"><div class="edit-row"><label class="edit-label">Год постройки</label><input class="edit-input" id="est-year" type="number" value="' + ea(e.builtYear || '') + '"></div>'
          + '<div class="edit-row"><label class="edit-label">Общая площадь (если иная)</label><input class="edit-input" id="est-sqt" type="number" step="0.1" value="' + ea(e.squareTotal || '') + '"></div></div>'
          + sel('est-mat', 'Материал стен', L.buildingMaterials, e.buildingMaterial)
          + sel('est-rep', 'Ремонт', L.repairTypes, e.repairType)
          + '<div class="est-grid"><div class="edit-row"><label class="edit-label">Широта</label><input class="edit-input" id="est-lat" value="' + ea(e.latitude || '') + '"></div>'
          + '<div class="edit-row"><label class="edit-label">Долгота</label><input class="edit-input" id="est-lon" value="' + ea(e.longitude || '') + '"></div></div>'
          + '<button class="est-btn ghost" id="estGeo">Найти координаты по адресу</button>';
      } else {
        html += '<div class="edit-row"><label class="edit-label">Ссылка на объявление</label><input class="edit-input" id="est-url" placeholder="https://www.cian.ru/sale/flat/..." value="' + ea(e.offerUrl || '') + '"></div>';
      }
      html += '<button class="est-btn" id="estRun">' + (v ? 'Пересчитать (платный запрос)' : 'Оценить') + '</button>';
    }
    html += '<div class="est-msg" id="estMsg"></div><div id="estRes"></div>';
    box.innerHTML = html;
    wire();
    if (v) renderResult(v);
  }

  function guessType(items) {
    var f = items.filter(function (i) { return /квартир|flat|apartment/i.test(i.name + i.id); })[0];
    return f ? f.id : (items[0] && items[0].id);
  }
  function guessRooms(items, n) {
    n = Number(n); if (!items.length) return '';
    var f = items.filter(function (i) { return n === 0 ? /студ|stud/i.test(i.name) : new RegExp('(^|\\D)' + n + '(\\D|$)').test(i.name); })[0];
    return f ? f.id : '';
  }
  function parseFloor(str) {
    var m = String(str || '').match(/(\d+)\s*[\/из]+\s*(\d+)/);
    if (m) return { floor: +m[1], total: +m[2] };
    var m2 = String(str || '').match(/(\d+)/);
    return { floor: m2 ? +m2[1] : 0, total: 0 };
  }

  function msg(t, cls) { var m = $('estMsg'); if (m) { m.className = 'est-msg ' + (cls || ''); m.textContent = t || ''; } }

  function wire() {
    document.querySelectorAll('.est-tab').forEach(function (b) {
      b.onclick = function () { readInputs(); mode = b.dataset.m; renderEst(); };
    });
    var ll = $('estLoadLists');
    if (ll) ll.onclick = async function () {
      ll.disabled = true; msg('Загружаю справочники…');
      try { await ensureLists(true); renderEst(); } catch (er) { msg(er.message, 'err'); ll.disabled = false; }
    };
    var geo = $('estGeo'); if (geo) geo.onclick = doGeo;
    var run = $('estRun'); if (run) run.onclick = doRun;
  }

  function readInputs() {
    var s = cur(); if (!s) return;
    var e = geoState(s);
    function val(id) { var el = $(id); return el ? el.value : undefined; }
    var t = val('est-type'); if (t !== undefined) e.propertyType = t;
    var r = val('est-rooms'); if (r !== undefined) e.roomsCount = r;
    var y = val('est-year'); if (y !== undefined) e.builtYear = y;
    var q = val('est-sqt'); if (q !== undefined) e.squareTotal = q;
    var m = val('est-mat'); if (m !== undefined) e.buildingMaterial = m;
    var p = val('est-rep'); if (p !== undefined) e.repairType = p;
    var a = val('est-lat'); if (a !== undefined) e.latitude = a;
    var o = val('est-lon'); if (o !== undefined) e.longitude = o;
    var u = val('est-url'); if (u !== undefined) e.offerUrl = u;
  }

  async function doGeo() {
    var s = cur(); if (!s) return;
    var addr = ($('e-address') || {}).value || s.address;
    if (!addr) { msg('Заполните адрес объекта выше.', 'err'); return; }
    msg('Ищу адрес…');
    try {
      var city = /москв/i.test(addr + ' ' + (s.location || '')) ? 'Москва' : 'Санкт-Петербург';
      var r = await call({ action: 'geocode', address: addr, city: /(санкт|спб|петербург|москв)/i.test(addr) ? '' : city });
      if (r.status !== 200) { msg(errText(r) + (r.data && r.data.message ? '' : ''), 'err'); return; }
      $('est-lat').value = r.data.latitude; $('est-lon').value = r.data.longitude;
      readInputs(); debounceSave();
      msg('Найдено: ' + r.data.display + '. Проверьте, что это тот дом.', 'ok');
    } catch (er) { msg('Сеть недоступна: ' + er.message, 'err'); }
  }

  async function doRun() {
    if (busy) return;
    var s = cur(); if (!s) return;
    readInputs();
    var e = geoState(s), body;
    if (s.valuation && !confirm('Оценка уже есть. Повторный расчёт — платный запрос. Продолжить?')) return;
    if (mode === 'url') {
      if (!/^https?:\/\//i.test(e.offerUrl || '')) { msg('Вставьте ссылку на объявление.', 'err'); return; }
      if (!e.propertyType) { msg('Выберите тип недвижимости.', 'err'); return; }
      body = { action: 'by_url', propertyType: num(e.propertyType) || e.propertyType, offerUrl: e.offerUrl.trim() };
    } else {
      var fl = parseFloor(s.floor), miss = [];
      if (!e.propertyType) miss.push('тип недвижимости');
      if (!e.roomsCount) miss.push('комнаты');
      if (!num(s.area)) miss.push('площадь');
      if (!fl.floor || !fl.total) miss.push('этаж в формате 5/9');
      if (!num(e.builtYear)) miss.push('год постройки');
      if (!e.buildingMaterial) miss.push('материал стен');
      if (!e.repairType) miss.push('ремонт');
      if (!num(e.latitude) || !num(e.longitude)) miss.push('координаты');
      if (miss.length) { msg('Не хватает: ' + miss.join(', ') + '.', 'err'); return; }
      body = {
        action: 'predict',
        params: {
          propertyType: num(e.propertyType) || e.propertyType, latitude: num(e.latitude), longitude: num(e.longitude),
          roomsCount: num(e.roomsCount) || e.roomsCount, square: num(s.area), squareTotal: num(e.squareTotal) || undefined,
          floor: fl.floor, floorTotal: fl.total, builtYear: num(e.builtYear),
          buildingMaterial: num(e.buildingMaterial) || e.buildingMaterial, repairType: num(e.repairType) || e.repairType
        }
      };
    }
    busy = true; var btn = $('estRun'); if (btn) btn.disabled = true;
    msg('Считаю… обычно несколько секунд.');
    try {
      var r = await call(body);
      if (r.status !== 200) { msg(errText(r), 'err'); return; }
      var d = r.data;
      s.valuation = {
        at: new Date().toISOString(), mode: mode, input: body.params || { offerUrl: body.offerUrl },
        prices: ((d.prices_and_charts && d.prices_and_charts.prices) || []).map(function (p) { return { name: p.name, price: p.price, ppm: p.price_per_meter }; }),
        similar: Array.isArray(d.similar_offers) ? d.similar_offers.slice(0, 30) : [],
        sales: Array.isArray(d.sales) ? d.sales.slice(0, 10) : [],
        header: d.header || null
      };
      lastRaw = d;
      debounceSave();
      renderEst();
      msg('Готово. Результат сохранён в объекте.', 'ok');
    } catch (er) { msg('Сеть недоступна: ' + er.message, 'err'); }
    finally { busy = false; var b2 = $('estRun'); if (b2) b2.disabled = false; }
  }

  /* ── результат ── */
  function getv(o, keys) { for (var i = 0; i < keys.length; i++) { var v = o[keys[i]]; if (v != null && v !== '') return v; } return ''; }
  function fmtDate(x) {
    var d = new Date(x); if (isNaN(d)) return '';
    return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear();
  }
  function bargainOf(o) {
    var pc = getv(o, ['price_changes', 'priceChanges']); if (!Array.isArray(pc) || pc.length < 2) return '';
    var pr = pc.map(function (x) { return typeof x === 'object' ? num(getv(x, ['price', 'value', 'new_price'])) : num(x); }).filter(Boolean);
    if (pr.length < 2) return '';
    var first = pr[0], last = pr[pr.length - 1];
    if (last >= first) return '';
    return 'снижена на ' + Number(first - last).toLocaleString('ru-RU') + ' ₽ (' + Math.round((first - last) / first * 100) + '%)';
  }
  function offerToComp(o) {
    var c = blankComp();
    c.address = String(getv(o, ['address', 'full_address', 'title']) || '');
    c.url = String(getv(o, ['url', 'link', 'offer_url', 'offerUrl']) || '');
    c.price = Math.round(num(getv(o, ['price', 'price_rub'])));
    c.area = String(getv(o, ['square', 'area', 'total_area', 'square_total']) || '');
    var fl = getv(o, ['floor']), ft = getv(o, ['floors_total', 'floor_total', 'floorTotal', 'floors_count']);
    c.floor = fl ? (ft ? fl + '/' + ft : String(fl)) : '';
    var cr = getv(o, ['created', 'created_at', 'date', 'published']);
    c.adDate = cr ? 'С ' + fmtDate(cr) : '';
    var vw = getv(o, ['views', 'views_total', 'total_views']); c.adViews = vw ? String(vw) : '';
    c.bargain = bargainOf(o);
    c.ppm = c.price && num(c.area) ? Math.round(c.price / num(c.area)) : 0;
    return c;
  }
  function normUrl(u) { return String(u || '').toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/[?#].*$/, '').replace(/\/+$/, ''); }

  function renderResult(v) {
    var res = $('estRes'); if (!res) return;
    var h = '<div style="margin-top:12px;font-size:11px;color:var(--muted)">Оценка от ' + esc(fmtDate(v.at)) + '</div>';
    var prices = v.prices || [];
    h += prices.map(function (p) {
      return '<div class="est-price"><span>' + esc(p.name) + '</span><span><b>' + (p.price ? Number(p.price).toLocaleString('ru-RU') + ' ₽' : '—') + '</b>'
        + (p.ppm ? ' <span style="color:var(--muted)">· ' + Number(p.ppm).toLocaleString('ru-RU') + ' ₽/м²</span>' : '') + '</span></div>';
    }).join('');
    if (prices.length) h += '<button class="est-btn ghost" id="estApplyPrice">Подставить диапазон в «Рекомендуемую стоимость»</button>';
    var off = v.similar || [];
    if (off.length) {
      h += '<div style="margin-top:12px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">Похожие объявления (' + off.length + ')</div>';
      h += off.map(function (o, i) {
        var c = offerToComp(o);
        return '<label class="est-off"><input type="checkbox" data-o="' + i + '"' + (i < 8 ? ' checked' : '') + '><div>' + esc(c.address || 'без адреса')
          + '<br><span>' + esc([c.area ? c.area + ' м²' : '', c.floor ? c.floor + ' эт.' : '', c.price ? Number(c.price).toLocaleString('ru-RU') + ' ₽' : ''].filter(Boolean).join(' · ')) + '</span></div></label>';
      }).join('');
      h += '<button class="est-btn ghost" id="estApplyComps">Добавить выбранные в конкуренты</button>';
    }
    h += '<details style="margin-top:10px"><summary style="font-size:11px;color:var(--muted);cursor:pointer">Показать сырой ответ (для отладки)</summary><div class="est-raw" id="estRaw"></div></details>';
    res.innerHTML = h;
    var raw = $('estRaw'); if (raw) raw.textContent = JSON.stringify(lastRaw || { prices: v.prices, similar: v.similar.slice(0, 2), sales: v.sales.slice(0, 1) }, null, 1).slice(0, 6000);
    var ap = $('estApplyPrice'); if (ap) ap.onclick = applyPrice;
    var ac = $('estApplyComps'); if (ac) ac.onclick = applyComps;
  }

  function applyPrice() {
    var s = cur(), pr = ((s.valuation && s.valuation.prices) || []).map(function (p) { return num(p.price); }).filter(Boolean);
    if (!pr.length) return;
    var lo = Math.min.apply(null, pr), hi = Math.max.apply(null, pr);
    if ((s.sma.priceFrom || s.sma.priceTo) && !confirm('Заменить текущий диапазон ' + fmtPrice(s.sma.priceFrom) + ' — ' + fmtPrice(s.sma.priceTo) + ' на ' + fmtPrice(lo) + ' — ' + fmtPrice(hi) + '?')) return;
    s.sma.priceFrom = lo; s.sma.priceTo = hi;
    $('e-priceFrom').value = lo; $('e-priceTo').value = hi;
    updatePriceHint(); render(); debounceSave();
    msg('Диапазон подставлен: ' + fmtPrice(lo) + ' — ' + fmtPrice(hi) + '.', 'ok');
  }

  function applyComps() {
    var s = cur(); if (!s.sma) s.sma = {}; if (!s.sma.competitors) s.sma.competitors = [];
    var have = {}; s.sma.competitors.forEach(function (c) { if (c.url) have[normUrl(c.url)] = 1; });
    var added = 0, skipped = 0;
    document.querySelectorAll('#estRes input[data-o]').forEach(function (cb) {
      if (!cb.checked) return;
      var c = offerToComp(s.valuation.similar[+cb.dataset.o]);
      if (c.url && have[normUrl(c.url)]) { skipped++; return; }
      if (c.url) have[normUrl(c.url)] = 1;
      s.sma.competitors.push(c); added++;
    });
    renderCompPanel(); render(); debounceSave();
    msg('Добавлено: ' + added + (skipped ? ', уже были: ' + skipped : '') + '. Проверьте «Торг» и добавьте комментарии.', 'ok');
  }

  /* ── хуки в sma.html ── */
  var origPopulate = window.populatePanel;
  window.populatePanel = function () { origPopulate.apply(this, arguments); lastRaw = null; try { renderEst(); } catch (e) { console.error(e); } };
  mount();
})();
