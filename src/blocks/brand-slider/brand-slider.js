(function(){
  const brands = new Swiper('.brand-slider__container', {
    speed: 400,
    spaceBetween: 32,
    slidesPerView: "auto",
    autoplay: {
      delay: 2000,
      pauseOnMouseEnter: true,
    },
    loop: true,
    grabCursor: true,
    breakpoints: {
      768: {
        spaceBetween: 48,
      },
      1280: {
        spaceBetween: 64,
      }
    },
    observer: true,
  });
}());
