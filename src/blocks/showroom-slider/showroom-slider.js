document.addEventListener('DOMContentLoaded', function () {
  const showroom = new Swiper('.showroom-slider__container', {
    speed: 400,
    spaceBetween: 16,
    slidesPerView: 2,
    breakpoints: {
      768: {
        slidesPerView: 3
      },
      1440: {
        slidesPerView: 3,
        spaceBetween: 32
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  Fancybox.bind('[data-fancybox="showroom"]', {
    // Your custom options for a specific gallery
  });
});

