document.addEventListener('DOMContentLoaded', function () {
  const standardsSlider = new Swiper('.standards-slider__container', {
    speed: 400,
    spaceBetween: 16,
    slidesPerView: 1,
    breakpoints: {
      // 480: {
      //   slidesPerView: 2
      // },
      768: {
        slidesPerView: 2
      },
      1024: {
        slidesPerView: 3
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 32
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
});

