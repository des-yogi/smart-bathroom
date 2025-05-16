document.addEventListener('DOMContentLoaded', function () {
  const catalogSlider = new Swiper('.catalog-slider__container', {
    speed: 400,
    spaceBetween: 16,
    slidesPerView: 'auto',
    breakpoints: {
      // 768: {
      //   slidesPerView: 4
      // },
      1440: {
        slidesPerView: 5,
        spaceBetween: 32
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
});

