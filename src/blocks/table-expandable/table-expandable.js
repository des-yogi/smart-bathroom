(function(){
  const wrapper = document.getElementById('tableWrapper');
  const button = document.getElementById('toggleTableBtn');

  if (!wrapper || !button) return;

  const collapsedHeight = parseInt(wrapper.dataset.collapsedHeight || '500', 10);
  let isOpen = false;

  button.addEventListener('click', () => {
    if (!isOpen) {
      // Открытие
      const fullHeight = wrapper.scrollHeight + 'px';
      wrapper.style.maxHeight = fullHeight;
      wrapper.classList.add('open');
      button.textContent = 'Collapse table';
      button.setAttribute('aria-expanded', 'true');
      wrapper.setAttribute('aria-hidden', 'false');
    } else {
      // Закрытие
      wrapper.style.maxHeight = collapsedHeight + 'px';
      wrapper.classList.remove('open');
      button.textContent = 'Show full table';
      button.setAttribute('aria-expanded', 'false');
      wrapper.setAttribute('aria-hidden', 'true');
    }

    isOpen = !isOpen;
  });

  // обновление при ресайзе
  window.addEventListener('resize', () => {
    if (isOpen) {
      wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
    }
  });
}());
