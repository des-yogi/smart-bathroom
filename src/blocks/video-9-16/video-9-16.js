document.addEventListener('DOMContentLoaded', function () {

  const videoSlider = new Swiper('.video-9-16__slider', {
    speed: 400,
    slidesPerView: 'auto',
    spaceBetween: 16,
    //grabCursor: true,
    breakpoints: {
      1280: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  const ioOptions = {
    root: null,
    rootMargin: '250px 0px 250px 0px',
    threshold: 0.1,
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;

      if (entry.isIntersecting) {
        if (video.dataset.loaded === 'true') return;

        const sources = video.querySelectorAll('source[data-src]');
        sources.forEach((source) => {
          const src = source.dataset.src;
          if (src) source.src = src;
        });

        video.load();
        video.dataset.loaded = 'true';
      } else {
        if (!video.paused) video.pause();
        const slide = video.closest('.video-9-16__slide');
        if (slide) {
          slide.classList.remove('is-playing');
          if (slide._iconTimeout) {
            clearTimeout(slide._iconTimeout);
            slide._iconTimeout = null;
          }
        }
      }
    });
  }, ioOptions);

  document
    .querySelectorAll('video.js-lazy-video')
    .forEach((video) => io.observe(video));

  // -----------------------
  // Стоп всех видео
  // -----------------------
  function pauseAllVideos() {
    document.querySelectorAll('.video-9-16__slide').forEach((slide) => {
      const v = slide.querySelector('video.js-lazy-video');
      if (v && !v.paused) v.pause();
      slide.classList.remove('is-playing');
      if (slide._iconTimeout) {
        clearTimeout(slide._iconTimeout);
        slide._iconTimeout = null;
      }
    });
  }

  videoSlider.on('slideChange', pauseAllVideos);

  // -----------------------
  // Общая логика toggle play/pause
  // -----------------------
  function toggleVideoByButton(btn) {
    const slide = btn.closest('.video-9-16__slide');
    if (!slide) return;

    const video = slide.querySelector('video.js-lazy-video');
    if (!video) return;

    // подстраховка ленивки
    if (video.dataset.loaded !== 'true') {
      const sources = video.querySelectorAll('source[data-src]');
      sources.forEach((source) => {
        if (!source.src && source.dataset.src) {
          source.src = source.dataset.src;
        }
      });
      video.load();
      video.dataset.loaded = 'true';
    }

    video.muted = true;
    video.playsInline = true;

    if (video.paused) {
      // стопаем остальные
      document.querySelectorAll('.video-9-16__slide').forEach((s) => {
        const v = s.querySelector('video.js-lazy-video');
        if (v && !v.paused) v.pause();
        s.classList.remove('is-playing');
        if (s._iconTimeout) {
          clearTimeout(s._iconTimeout);
          s._iconTimeout = null;
        }
      });

      video
        .play()
        .then(() => {
          slide.classList.add('is-playing');
          slide.classList.add('has-started');   // пометка, что это видео уже запускали
        })
        .catch((err) => console.error('VIDEO PLAY ERROR', err));
    } else {
      video.pause();
      slide.classList.remove('is-playing');
    }
  }

  // -----------------------
  // Pointer‑логика: клик/тап vs свайп
  // -----------------------
  const MOVE_THRESHOLD = 12; // px

  let startX = 0;
  let startY = 0;
  let trackingBtn = null;

  document.addEventListener(
    'pointerdown',
    (e) => {
      const btn = e.target.closest('.js-video-toggle');
      if (!btn) return;

      trackingBtn = btn;
      startX = e.clientX;
      startY = e.clientY;
    },
    true,
  );

  document.addEventListener(
    'pointerup',
    (e) => {
      const btn = e.target.closest('.js-video-toggle');
      if (!btn || btn !== trackingBtn) {
        trackingBtn = null;
        return;
      }

      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      trackingBtn = null;

      // если было реальное перетаскивание – считаем свайп, видео не трогаем
      if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
        return;
      }

      toggleVideoByButton(btn);
    },
    true,
  );

  // -----------------------
  // Клавиатура: Enter / Space по .js-video-toggle
  // -----------------------
  document.addEventListener(
    'keydown',
    (e) => {
      const btn = e.target.closest('.js-video-toggle');
      if (!btn) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // чтобы Space не скроллил страницу
        toggleVideoByButton(btn);
      }
    },
    true,
  );

  // =======================
  // FULLSCREEN
  // =======================

  // helper для Fullscreen API
  function requestFullScreenFor(el) {
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
    if (el.msRequestFullscreen) return el.msRequestFullscreen();
    return Promise.reject(new Error('Fullscreen API not supported'));
  }

  // клик мышью/тач по .js-video-fullscreen
  document.addEventListener(
    'click',
    (e) => {
      const fsBtn = e.target.closest('.js-video-fullscreen');
      if (!fsBtn) return;

      const slide = fsBtn.closest('.video-9-16__slide');
      if (!slide) return;

      const video = slide.querySelector('video.js-lazy-video');
      if (!video) return;

      // подстраховка ленивки (аналогично toggleVideoByButton)
      if (video.dataset.loaded !== 'true') {
        const sources = video.querySelectorAll('source[data-src]');
        sources.forEach((source) => {
          if (!source.src && source.dataset.src) {
            source.src = source.dataset.src;
          }
        });
        video.load();
        video.dataset.loaded = 'true';
      }

      video.muted = true;
      video.playsInline = true;

      // вариант: если видео было на паузе — запускаем и сразу разворачиваем
      const ensurePlaying = video.paused
        ? video.play().catch((err) => {
            console.error('VIDEO PLAY ERROR before fullscreen', err);
          })
        : Promise.resolve();

      Promise.resolve(ensurePlaying).then(() => {
        slide.classList.add('is-playing');
        slide.classList.add('has-started');

        requestFullScreenFor(video).catch((err) => {
          console.error('FULLSCREEN ERROR', err);
        });
      });
    },
    true,
  );

  // клавиатура для .js-video-fullscreen (Enter / Space)
  document.addEventListener(
    'keydown',
    (e) => {
      const fsBtn = e.target.closest('.js-video-fullscreen');
      if (!fsBtn) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fsBtn.click(); // дергаем тот же код, что и для мыши
      }
    },
    true,
  );

  // (опционально) реакция на выход из fullscreen
  // если нужно при выходе ставить видео на паузу — раскомментируй:
  /*
  document.addEventListener('fullscreenchange', () => {
    const fsEl = document.fullscreenElement;
    if (!fsEl) {
      // вышли из fullscreen
      const videos = document.querySelectorAll('video.js-lazy-video');
      videos.forEach((video) => {
        if (!video.paused) {
          video.pause();
          const slide = video.closest('.video-9-16__slide');
          if (slide) slide.classList.remove('is-playing');
        }
      });
    }
  });
  */

});
