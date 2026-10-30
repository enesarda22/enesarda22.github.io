(() => {
  const news = document.getElementById('news-list');
  const toggle = document.querySelector('.news-toggle');
  const olderItems = Array.from(news.children).slice(2);
  const mobile = window.matchMedia('(max-width: 600px)');
  let expanded = false;

  function render() {
    const collapsed = mobile.matches && !expanded;
    olderItems.forEach(item => { item.hidden = collapsed; });
    news.classList.toggle('news-collapsed', collapsed);
    toggle.hidden = !mobile.matches;
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.querySelector('.news-toggle-label').textContent = collapsed ? 'More' : 'Less';
    toggle.querySelector('.news-toggle-marker').textContent = collapsed ? '▸' : '▾';
  }

  toggle.addEventListener('click', () => {
    expanded = !expanded;
    render();
  });
  mobile.addEventListener('change', render);
  render();
})();
