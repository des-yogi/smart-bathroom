document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.review-slider__container .swiper-slide');
  const totalSlides = slides.length;
  const middleSlideIndex = Math.floor(totalSlides / 2);

  const review = new Swiper('.review-slider__container', {
    speed: 400,
    slidesPerView: 1,
    spaceBetween: 16,
    centeredSlides: true,
    initialSlide: middleSlideIndex,
    rewind: true,
    breakpoints: {
      768: {
        slidesPerView: 'auto'
      },
      1440: {
        slidesPerView: 'auto',
        spaceBetween: 32
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  //Fancybox.bind('[data-fancybox="showroom"]', {
    // Your custom options for a specific gallery
  //});
});
