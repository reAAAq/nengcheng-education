(() => {
  'use strict';
  document.documentElement.classList.add('has-js');
  const config = window.NENGCHENG_CONFIG || {};
  if (typeof config.referencePrice === 'number' && Number.isFinite(config.referencePrice) && config.referencePrice > 0) {
    document.querySelectorAll('[data-price]').forEach(el => { el.textContent = new Intl.NumberFormat('zh-CN').format(config.referencePrice); });
  }
  document.querySelectorAll('[data-price-key]').forEach(el => {
    const amount = config[el.dataset.priceKey];
    if (typeof amount === 'number' && Number.isFinite(amount) && amount >= 0) {
      el.textContent = new Intl.NumberFormat('zh-CN').format(amount);
    }
  });
  // Display contact details only; this site does not collect or submit visitor data.
  [['phone', '[data-contact-phone]'], ['email', '[data-contact-email]']].forEach(([key, selector]) => {
    if (typeof config[key] === 'string' && config[key].trim()) {
      document.querySelectorAll(selector).forEach(el => { el.textContent = config[key].trim(); });
    }
  });
  if (Number.isInteger(config.copyrightYear)) {
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = config.copyrightYear; });
  }

  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  const closeMenu = (restoreFocus = false) => {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', '打开导航');
    nav.classList.remove('is-open');
    if (restoreFocus) menu.focus();
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', () => closeMenu());

  // Hydrate every tiled card from the same data used for its image and caption.
  const cases = window.NENGCHENG_SCORES || [];
  document.querySelectorAll('[data-score-case]').forEach(card => {
    const item = cases.find(score => score.id === card.dataset.scoreCase);
    if (!item) return;
    card.querySelectorAll('[data-score-field]').forEach(field => {
      field.textContent = item[field.dataset.scoreField];
    });
    const label = '成绩案例 ' + item.id;
    const caption = label + '，总分' + item.overall + '，听力' + item.listening + '、阅读' + item.reading + '、写作' + item.writing + '、口语' + item.speaking;
    const trigger = card.querySelector('.image-trigger');
    const preview = trigger.querySelector('img');
    preview.src = item.image;
    preview.alt = caption;
    trigger.dataset.image = item.image;
    trigger.dataset.caption = caption;
  });

  const dialog = document.getElementById('lightbox');
  const image = document.getElementById('lightbox-image');
  const caption = document.getElementById('lightbox-caption');
  const close = dialog.querySelector('.lightbox-close');
  let opener;
  document.querySelectorAll('.image-trigger').forEach(button => {
    button.addEventListener('click', () => {
      if (typeof dialog.showModal !== 'function') { window.open(button.dataset.image, '_blank', 'noopener'); return; }
      opener = button;
      image.src = button.dataset.image;
      image.alt = button.dataset.caption;
      caption.textContent = button.dataset.caption;
      dialog.showModal();
      document.body.classList.add('modal-open');
      close.focus();
    });
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const b = dialog.getBoundingClientRect();
    if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    image.removeAttribute('src');
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
  });
})();
