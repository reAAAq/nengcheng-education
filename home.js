(() => {
  'use strict';
  const filters = [...document.querySelectorAll('[data-service-filter]')];
  const packages = [...document.querySelectorAll('[data-service-category]')];
  const status = document.getElementById('service-status');
  filters.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.serviceFilter;
      filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      let visibleCount = 0;
      packages.forEach(card => {
        const visible = category === 'all' || category === card.dataset.serviceCategory;
        card.hidden = !visible;
        if (visible) visibleCount++;
      });
      status.textContent = button.textContent.trim() + '：展示 ' + visibleCount + ' 项服务';
    });
  });
})();
