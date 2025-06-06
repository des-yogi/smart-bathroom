document.addEventListener('DOMContentLoaded', function () {
  const productSlider = new Swiper('.product-gallery__container', {
    speed: 400,
    spaceBetween: 16,
    slidesPerView: 2,
    breakpoints: {
      768: {
        slidesPerView: 4
      },
      1440: {
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

