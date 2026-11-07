/* =========================================================
   松揽月笔记 · 站点交互脚本
   原生 JavaScript，无任何第三方依赖（file:// 直接打开即可运行）
   ========================================================= */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  /* ---------------- 1. 主题切换 ---------------- */
  var THEME_KEY = 'cwj-theme';
  var themeToggle = $('#themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'
      );
    }
  }

  function readSavedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* 隐私模式下忽略 */ }
  }

  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  // 站点默认深色工业风；用户手动切换过则尊重其选择
  // 也支持用 ?theme=light / ?theme=dark 直接指定（便于分享指定主题的链接）
  var urlTheme = new URLSearchParams(location.search).get('theme');
  applyTheme(
    urlTheme === 'light' || urlTheme === 'dark' ? urlTheme : (readSavedTheme() || 'dark')
  );

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      saveTheme(next);
    });
  }

  /* ---------------- 2. 移动端菜单 ---------------- */
  var menuBtn = $('#menuBtn');
  var nav = $('#nav');

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove('is-open');
    menuBtn.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', '打开菜单');
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = nav.classList.toggle('is-open');
      menuBtn.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    });

    $$('.nav-link', nav).forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    doc.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || menuBtn.contains(e.target)) return;
      closeMenu();
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------------- 3. 滚动进度 / 导航状态 / 回到顶部 ---------------- */
  var progressBar = $('#progressBar');
  var header = $('#header');
  var toTop = $('#toTop');
  var sections = $$('main section[id]');
  var navLinks = $$('.nav-link');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || doc.documentElement.scrollTop;
    var height = doc.documentElement.scrollHeight - window.innerHeight;

    // 顶部阅读进度
    if (progressBar) {
      progressBar.style.width = (height > 0 ? Math.min(y / height, 1) * 100 : 0) + '%';
    }

    // 头部阴影
    if (header) header.classList.toggle('is-scrolled', y > 8);

    // 回到顶部按钮
    if (toTop) toTop.classList.toggle('is-visible', y > 520);

    // 导航高亮
    var currentId = sections.length ? sections[0].id : '';
    sections.forEach(function (sec) {
      if (sec.offsetTop - 120 <= y) currentId = sec.id;
    });
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', onScroll, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  onScroll();

  /* ---------------- 4. 进入视口渐显 ---------------- */
  var revealItems = $$('.reveal');

  if ('IntersectionObserver' in window && revealItems.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Number(el.dataset.delay || 0);
        window.setTimeout(function () { el.classList.add('is-in'); }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach(function (el, i) {
      // 同一组卡片错开出场，观感更自然
      if (!el.dataset.delay) el.dataset.delay = String((i % 4) * 70);
      observer.observe(el);
    });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------- 5. 年份 ---------------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- 6. 图片降级：加载失败时给出占位提示 ---------------- */
  $$('img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.background = 'linear-gradient(135deg, #4f46e5, #0ea5e9)';
      img.style.opacity = '0.85';
      img.alt = img.alt || '图片加载失败';
    });
  });
  /* ---------------- 7. 首屏景深视差 ---------------- */
  (function () {
    var hero = document.querySelector('.hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var raf = null;
    function set(x, y) {
      hero.style.setProperty('--px', x.toFixed(1) + 'px');
      hero.style.setProperty('--py', y.toFixed(1) + 'px');
    }

    hero.addEventListener('pointermove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        var r = hero.getBoundingClientRect();
        set(((e.clientX - r.left) / r.width - 0.5) * -30,
            ((e.clientY - r.top) / r.height - 0.5) * -20);
      });
    });

    hero.addEventListener('pointerleave', function () { set(0, 0); });
  })();
})();
