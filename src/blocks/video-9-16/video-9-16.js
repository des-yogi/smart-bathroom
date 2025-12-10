document.addEventListener('DOMContentLoaded', function () {

  const videoSlider = new Swiper('.video-9-16__slider', {
    speed: 400,
    slidesPerView: 'auto',
    spaceBetween: 16,
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
  // СИНХРОНИЗАЦИЯ громкости и range-контрола
  // -----------------------
  function syncVolumeControl(slide, video) {
    const volControl = slide.querySelector('.field-range__input');
    if (!volControl) return;

    let initialVol = parseInt(volControl.value, 10) / 100;
    video.volume = Math.max(0, Math.min(1, initialVol));
    volControl.value = Math.round(video.volume * 100);

    volControl.oninput = function () {
      const val = parseInt(volControl.value, 10);
      video.volume = Math.max(0, Math.min(1, val / 100));
    };

    video.addEventListener('volumechange', function () {
      volControl.value = Math.round(video.volume * 100);
    });
  }

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

    video.playsInline = true;

    if (video.paused) {
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
          slide.classList.add('has-started');
          syncVolumeControl(slide, video);
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
  const MOVE_THRESHOLD = 12;

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

      if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
        return;
      }

      toggleVideoByButton(btn);
    },
    true,
  );

  document.addEventListener(
    'keydown',
    (e) => {
      const btn = e.target.closest('.js-video-toggle');
      if (!btn) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleVideoByButton(btn);
      }
    },
    true,
  );

  // =======================
  // FULLSCREEN
  // =======================

  function requestFullScreenFor(el) {
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
    if (el.msRequestFullscreen) return el.msRequestFullscreen();
    return Promise.reject(new Error('Fullscreen API not supported'));
  }

  document.addEventListener(
    'click',
    (e) => {
      const fsBtn = e.target.closest('.js-video-fullscreen');
      if (!fsBtn) return;

      const slide = fsBtn.closest('.video-9-16__slide');
      if (!slide) return;

      const video = slide.querySelector('video.js-lazy-video');
      if (!video) return;

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

      video.playsInline = true;

      const ensurePlaying = video.paused
        ? video.play().catch((err) => {
            console.error('VIDEO PLAY ERROR before fullscreen', err);
          })
        : Promise.resolve();

      Promise.resolve(ensurePlaying).then(() => {
        slide.classList.add('is-playing');
        slide.classList.add('has-started');
        syncVolumeControl(slide, video);
        requestFullScreenFor(video).catch((err) => {
          console.error('FULLSCREEN ERROR', err);
        });
      });
    },
    true,
  );

  document.addEventListener(
    'keydown',
    (e) => {
      const fsBtn = e.target.closest('.js-video-fullscreen');
      if (!fsBtn) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fsBtn.click();
      }
    },
    true,
  );

  // -----------------------
  // Возвращаем к плейсхолдеру после окончания видео
  // -----------------------
  document
    .querySelectorAll('.video-9-16__slide')
    .forEach((slide) => {
      const video = slide.querySelector('video.js-lazy-video');
      if (video) {
        video.addEventListener('ended', function () {
          video.pause();
          video.currentTime = 0;
          slide.classList.remove('is-playing');
        });
      }
    });

  /*
  document.addEventListener('fullscreenchange', () => {
    const fsEl = document.fullscreenElement;
    if (!fsEl) {
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
