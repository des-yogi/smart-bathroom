document.addEventListener('DOMContentLoaded', function () {
  const issuesSlider = new Swiper('.issues-slider__container', {
    speed: 400,
    spaceBetween: 16,
    slidesPerView: 1,
    a11y: {
      containerRole: 'list',
      slideRole: 'listitem'
    },
    breakpoints: {
      // 480: {
      //   slidesPerView: 2
      // },
      // 768: {
      //   slidesPerView: 2
      // },
      // 1024: {
      //   slidesPerView: 3
      // },
      1024: {
        slidesPerView: 2
      },
      1440: {
        slidesPerView: 2,
        spaceBetween: 32
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
});

