document.addEventListener('DOMContentLoaded', function () {
  const projectSlider = new Swiper('.portfolio-slider__container', {
    speed: 400,
    slidesPerView: 1,
    spaceBetween: 32,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    allowTouchMove: false,
    on: {
      init: initBeforeAfterSliders, // Вызываем функцию инициализации при загрузке Swiper
      slideChange: initBeforeAfterSliders, // Повторяем инициализацию при смене слайда
    },
  });

  initBeforeAfterSliders(); // Запуск при загрузке страницы — работает и вне Swiper

  // Функция инициализации всех "До и После" слайдеров
  function initBeforeAfterSliders() {
    const sliders = document.querySelectorAll('.swiper-slide .before-after-wrapper');

    sliders.forEach((imageWrapper) => {
      if (!imageWrapper.classList.contains('initialized')) {
        const handle = imageWrapper.querySelector('.handle');
        if (handle) {
          dragElement(imageWrapper, handle);
          imageWrapper.classList.add('initialized'); // Помечаем, что слайдер инициализирован
        }
      }
    });
  }

  // Основная функция перетаскивания (адаптирована для нескольких экземпляров)
  function dragElement(imageWrapper, handle) {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    const getCoords = (e) => {
      let x, y;
      if (isTouch) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }
      return { x, y };
    };

    const dragInit = (e) => {
      e = e || window.event;
      e.preventDefault();

      const { x, y } = getCoords(e);
      pos3 = x;
      pos4 = y;

      if (isTouch) {
        document.ontouchend = closeElementDrag;
        document.ontouchmove = elementDrag;
      } else {
        document.onmouseup = closeElementDrag;
        document.onmousemove = elementDrag;
      }
    };

    const elementDrag = (e) => {
      e = e || window.event;
      e.preventDefault();

      const { x, y } = getCoords(e);
      pos1 = pos3 - x;
      pos2 = pos4 - y;
      pos3 = x;
      pos4 = y;

      let wrapperRight = handle.offsetLeft - pos1;

      if (wrapperRight >= 0 && wrapperRight <= imageWrapper.offsetWidth) {
        handle.style.left = `${handle.offsetLeft - pos1}px`;
        imageWrapper.querySelector('.before-image-wrapper').style.width = `${wrapperRight}px`;
      }
    };

    const closeElementDrag = () => {
      if (isTouch) {
        document.ontouchend = null;
        document.ontouchmove = null;
      } else {
        document.onmouseup = null;
        document.onmousemove = null;
      }
    };

    if (isTouch) {
      handle.ontouchstart = dragInit;
    } else {
      handle.onmousedown = dragInit;
    }
  }


  Fancybox.bind('[data-fancybox^="ba-gallery"]', {
    // Your custom options for a specific gallery
  });
});

