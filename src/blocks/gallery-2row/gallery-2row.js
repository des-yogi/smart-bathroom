document.addEventListener('DOMContentLoaded', function () {
  const slider2rowInstances = [];
  const containers = document.querySelectorAll('.gallery-2row__container');

  if (!containers.length) return;

  function getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width >= 1440) return 'xl';
    if (width >= 768) return 'md';
    return 'sm';
  }

  function initSliders() {
    const currentBreakpoint = getCurrentBreakpoint();

    containers.forEach((container, index) => {
      const instance = new Swiper(container, {
        slidesPerView: 2,
        grid: {
          rows: 2,
          fill: 'row'
        },
        spaceBetween: 16,
        breakpoints: {
          768: {
            slidesPerView: 3,
            spaceBetween: 16
          },
          1440: {
            slidesPerView: 3,
            spaceBetween: 32
          }
        },
        navigation: {
          nextEl: container.parentElement.querySelector('.swiper-button-next'),
          prevEl: container.parentElement.querySelector('.swiper-button-prev'),
        },
        on: {
          init: function () {
            setTimeout(() => adjustSlideHeights(this), 50);
          }
        }
      });

      slider2rowInstances.push({
        swiper: instance,
        container,
        breakpoint: currentBreakpoint
      });
    });
  }

  function adjustSlideHeights(swiperInstance) {
    if (!swiperInstance || !swiperInstance.el || !swiperInstance.el.isConnected) return;

    const slides = swiperInstance.el.querySelectorAll('.gallery-2row__slide');
    if (!slides.length) return;

    let maxHeight = 0;

    // Сброс высот
    slides.forEach(slide => {
      slide.style.height = 'auto';
    });

    // Подсчет максимальной
    slides.forEach(slide => {
      const h = slide.offsetHeight;
      if (h > maxHeight) maxHeight = h;
    });

    // Применение
    slides.forEach(slide => {
      slide.style.height = maxHeight + 'px';
    });

    swiperInstance.update();
  }

  function rebuildSlidersIfNeeded() {
    //if (!swiper || typeof swiper.destroy !== 'function') return;

    const newBreakpoint = getCurrentBreakpoint();

    slider2rowInstances.forEach((instanceObj, index) => {
      const { swiper, container, breakpoint } = instanceObj;

      if (!container || !container.isConnected) return;

      // 🛡 Добавляем защиту:
      if (!swiper || typeof swiper.destroy !== 'function') return;

      if (newBreakpoint !== breakpoint) {
        swiper.destroy(true, true);

        // Переинициализация
        const newSwiper = new Swiper(container, {
          slidesPerView: 2,
          grid: {
            rows: 2,
            fill: 'row'
          },
          spaceBetween: 16,
          breakpoints: {
            768: {
              slidesPerView: 3,
              spaceBetween: 16
            },
            1440: {
              slidesPerView: 3,
              spaceBetween: 32
            }
          },
          navigation: {
            nextEl: container.parentElement.querySelector('.swiper-button-next'),
            prevEl: container.parentElement.querySelector('.swiper-button-prev'),
          },
          on: {
            init: function () {
              setTimeout(() => adjustSlideHeights(this), 50);
            }
          }
        });

        // Обновляем экземпляр
        slider2rowInstances[index] = {
          swiper: newSwiper,
          container,
          breakpoint: newBreakpoint
        };
      } else {
        swiper.update();
        setTimeout(() => adjustSlideHeights(swiper), 100);
      }
    });
  }

  window.addEventListener('load', initSliders);
  window.addEventListener('resize', () => {
    setTimeout(rebuildSlidersIfNeeded, 150);
  });

  Fancybox.bind('[data-fancybox="showroom"]', {
    // кастомные опции
  });
});
