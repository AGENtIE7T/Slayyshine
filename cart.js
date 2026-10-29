(function () {
  if (window.__ccCart) return; window.__ccCart = true;
  var KEY = 'cc-cart-v1', WA = '919876543210', TEL = '+919876543210';
  var cart = load(), root, overlay, panel, list, foot, closeBtn, isOpen = false, lastFocus = null;

  function load() { try { var c = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(c) ? c : []; } catch (e) { return []; } }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} render(); sync(); }
  function fmt(n) { return '\u20B9' + Number(n).toLocaleString('en-IN'); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function count() { return cart.reduce(function (a, i) { return a + i.qty; }, 0); }
  function total() { return cart.reduce(function (a, i) { return a + i.qty * i.price; }, 0); }
  function home() { var h = document.querySelector('[data-home-link]'); return h ? h.getAttribute('href') : 'index.html'; }

  function sync() {
    var n = count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      var t = n ? String(n) : '';
      if (el.textContent !== t) el.textContent = t;
      el.style.display = n ? 'block' : 'none';
    });
  }

  function qbtn(kind, id, label, aria) {
    return '<button type="button" data-cart-' + kind + '="' + esc(id) + '" aria-label="' + aria + ' quantity" style="width:40px;height:40px;display:grid;place-items:center;background:none;border:1px solid var(--color-divider);border-radius:var(--radius-md);font:inherit;font-size:17px;color:var(--color-text);cursor:pointer;">' + label + '</button>';
  }

  function build() {
    if (root) return;
    root = document.createElement('div');
    root.setAttribute('style', 'position:fixed;inset:0;z-index:100;visibility:hidden;');
    root.innerHTML =
      '<div data-cart-close="1" style="position:absolute;inset:0;background:color-mix(in srgb,var(--color-neutral-900) 45%,transparent);opacity:0;transition:opacity .22s ease;"></div>' +
      '<aside role="dialog" aria-modal="true" aria-label="Your cart" style="position:absolute;top:0;right:0;height:100%;width:min(420px,100vw);background:var(--color-bg);border-left:1px solid var(--color-divider);box-shadow:var(--shadow-lg);display:flex;flex-direction:column;transform:translateX(100%);transition:transform .26s ease;font-family:var(--font-body);color:var(--color-text);">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--color-divider);">' +
          '<span style="font-family:var(--font-heading);font-size:26px;">Your cart</span>' +
          '<button type="button" data-cart-close="1" aria-label="Close cart" style="width:44px;height:44px;display:grid;place-items:center;background:none;border:1px solid var(--color-divider);border-radius:var(--radius-md);cursor:pointer;color:var(--color-text);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"></path></svg></button>' +
        '</div>' +
        '<div data-cart-list="1" style="flex:1;overflow-y:auto;padding:0 22px;"></div>' +
        '<div data-cart-foot="1" style="border-top:1px solid var(--color-divider);padding:18px 22px calc(18px + env(safe-area-inset-bottom));flex-direction:column;gap:10px;"></div>' +
      '</aside>';
    document.body.appendChild(root);
    overlay = root.firstChild; panel = root.lastChild;
    list = root.querySelector('[data-cart-list]'); foot = root.querySelector('[data-cart-foot]');
    closeBtn = panel.querySelector('button');
  }

  function render() {
    if (!root) return;
    var muted = 'color:color-mix(in srgb,var(--color-text) 64%,transparent);';
    if (!cart.length) {
      list.innerHTML = '<div style="padding:56px 4px;text-align:center;">' +
        '<p style="font-family:var(--font-heading);font-size:24px;margin:0 0 8px;">Your cart is empty</p>' +
        '<p style="font-size:14px;line-height:22px;margin:0 0 22px;' + muted + '">Add a service package to plan your booking.</p>' +
        '<a class="btn btn-secondary" href="' + esc(home() + '#services') + '" data-cart-close="1">Browse services</a></div>';
      foot.style.display = 'none';
      return;
    }
    list.innerHTML = cart.map(function (i) {
      return '<div style="display:flex;gap:14px;justify-content:space-between;padding:18px 0;border-bottom:1px solid var(--color-divider);">' +
        '<div style="min-width:0;">' +
          '<p style="font-family:var(--font-heading);font-size:19px;line-height:1.2;margin:0 0 4px;">' + esc(i.name) + '</p>' +
          '<p style="font-size:13px;margin:0 0 12px;' + muted + '">' + fmt(i.price) + ' each</p>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            qbtn('dec', i.id, '\u2212', 'Decrease') +
            '<span style="min-width:22px;text-align:center;font-feature-settings:\'tnum\' 1;">' + i.qty + '</span>' +
            qbtn('inc', i.id, '+', 'Increase') +
            '<button type="button" data-cart-remove="' + esc(i.id) + '" style="margin-left:8px;background:none;border:0;padding:10px 4px;font:inherit;font-size:13px;color:var(--color-accent-700);text-decoration:underline;text-underline-offset:3px;cursor:pointer;">Remove</button>' +
          '</div>' +
        '</div>' +
        '<p style="font-family:var(--font-heading);font-weight:700;font-size:19px;margin:0;white-space:nowrap;font-feature-settings:\'tnum\' 1;">' + fmt(i.price * i.qty) + '</p>' +
      '</div>';
    }).join('');
    var msg = 'Hi Cleaning Cartel, I would like to book:\n' +
      cart.map(function (i) { return '- ' + i.name + ' x' + i.qty + ' (' + fmt(i.price * i.qty) + ')'; }).join('\n') +
      '\nEstimated total: ' + fmt(total());
    foot.style.display = 'flex';
    foot.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;"><span style="font-size:14px;">Estimated total</span>' +
      '<span style="font-family:var(--font-heading);font-weight:700;font-size:28px;color:var(--color-accent);font-feature-settings:\'tnum\' 1;">' + fmt(total()) + '</span></div>' +
      '<p style="font-size:12.5px;line-height:19px;margin:0 0 4px;' + muted + '">Pay after the service. We confirm your slot and final price on a quick call.</p>' +
      '<a class="btn btn-primary btn-block" style="padding:12px 16px;font-size:14px;" target="_blank" rel="noopener" href="https://wa.me/' + WA + '?text=' + encodeURIComponent(msg) + '">Book on WhatsApp</a>' +
      '<a class="btn btn-secondary btn-block" style="padding:12px 16px;font-size:14px;" href="tel:' + TEL + '">Call to book \u00B7 +91 98765 43210</a>';
  }

  function open() {
    build(); render();
    isOpen = true; lastFocus = document.activeElement;
    root.style.visibility = 'visible';
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { overlay.style.opacity = '1'; panel.style.transform = 'none'; });
    setTimeout(function () { if (closeBtn) closeBtn.focus(); }, 60);
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.style.opacity = '0'; panel.style.transform = 'translateX(100%)';
    document.documentElement.style.overflow = '';
    setTimeout(function () { if (!isOpen) root.style.visibility = 'hidden'; }, 280);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function change(id, d) {
    var it = cart.filter(function (i) { return i.id === id; })[0];
    if (!it) return;
    it.qty += d;
    if (it.qty <= 0) cart = cart.filter(function (i) { return i.id !== id; });
    persist();
  }

  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var a = t.closest('[data-add-to-cart]');
    if (a) {
      e.preventDefault();
      var id = a.getAttribute('data-id');
      var it = cart.filter(function (i) { return i.id === id; })[0];
      if (it) it.qty++;
      else cart.push({ id: id, name: a.getAttribute('data-name'), price: +a.getAttribute('data-price') || 0, qty: 1 });
      persist(); open(); return;
    }
    if (t.closest('[data-cart-open]')) { e.preventDefault(); open(); return; }
    var b;
    if ((b = t.closest('[data-cart-inc]'))) { change(b.getAttribute('data-cart-inc'), 1); return; }
    if ((b = t.closest('[data-cart-dec]'))) { change(b.getAttribute('data-cart-dec'), -1); return; }
    if ((b = t.closest('[data-cart-remove]'))) { var rid = b.getAttribute('data-cart-remove'); cart = cart.filter(function (i) { return i.id !== rid; }); persist(); return; }
    if (t.closest('[data-cart-close]')) close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) close(); });
  window.addEventListener('storage', function (e) { if (e.key === KEY) { cart = load(); render(); sync(); } });

  function init() {
    sync();
    var pending = false;
    new MutationObserver(function () {
      if (pending) return; pending = true;
      requestAnimationFrame(function () { pending = false; sync(); });
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
