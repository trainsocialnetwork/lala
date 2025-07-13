/* ===============================================
   Main JavaScript - 共通機能
   =============================================== */

// DOM要素の取得を安全に行うヘルパー関数
const getElement = (selector) => document.querySelector(selector);
const getElements = (selector) => document.querySelectorAll(selector);

// ===============================================
// ページ初期化
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
  // スムーススクロール
  initSmoothScroll();
  
  // バックトゥトップボタン
  initBackToTop();
  
  // ローディング解除
  setTimeout(() => {
    document.body.classList.add('is-loaded');
  }, 100);
});

// ===============================================
// スムーススクロール
// ===============================================
function initSmoothScroll() {
  const anchors = getElements('a[href^="#"]');
  
  anchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = getElement(href);
      
      if (target) {
        const headerHeight = 60;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===============================================
// バックトゥトップボタン
// ===============================================
function initBackToTop() {
  const backToTopButton = getElement('#backToTop');
  if (!backToTopButton) return;
  
  // スクロール位置によって表示/非表示を切り替え
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('is-visible');
      } else {
        backToTopButton.classList.remove('is-visible');
      }
    });
  });
  
  // クリックでトップへスクロール
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===============================================
// ユーティリティ関数
// ===============================================

// デバウンス関数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// スロットル関数
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===============================================
// インターセクションオブザーバー（遅延読み込み）
// ===============================================
function initLazyLoad() {
  const lazyImages = getElements('img[data-src]');
  if (!lazyImages.length) return;
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('is-loaded');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px'
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ===============================================
// フェードインアニメーション
// ===============================================
function initFadeInAnimation() {
  const fadeElements = getElements('.fade-in');
  if (!fadeElements.length) return;
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  fadeElements.forEach(element => fadeObserver.observe(element));
}

// ===============================================
// エクスポート（モジュール化対応）
// ===============================================
window.LaLaUtils = {
  getElement,
  getElements,
  debounce,
  throttle,
  initLazyLoad,
  initFadeInAnimation
};