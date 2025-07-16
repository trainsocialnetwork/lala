/* ===============================================
   Page Navigation Component - ページ内ナビゲーション機能
   =============================================== */

(function() {
  'use strict';
  
  // ===============================================
  // ページナビゲーション
  // ===============================================
  class PageNavigation {
    constructor() {
      this.nav = document.querySelector('.page-nav');
      this.navList = document.querySelector('.page-nav__list');
      this.links = document.querySelectorAll('.page-nav__link');
      this.sections = [];
      
      if (!this.nav || !this.links.length) return;
      
      this.headerHeight = 60; // ヘッダーの高さ
      this.navHeight = this.nav.offsetHeight;
      
      this.init();
    }
    
    init() {
      // 横スクロール位置を初期化
      this.resetScrollPosition();
      
      // セクション要素を取得
      this.collectSections();
      
      // スクロールイベント
      this.initScrollBehavior();
      
      // クリックイベント
      this.initClickBehavior();
    }
    
    // 横スクロール位置をリセット
    resetScrollPosition() {
      if (this.navList) {
        // 即座にリセット
        this.navList.scrollLeft = 0;
        
        // 念のため、少し遅延してもう一度リセット
        setTimeout(() => {
          this.navList.scrollLeft = 0;
        }, 100);
      }
    }
    
    collectSections() {
      this.links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const section = document.querySelector(href);
          if (section) {
            this.sections.push({
              element: section,
              link: link,
              id: href.substring(1)
            });
          }
        }
      });
    }
    
    initScrollBehavior() {
      // スロットル関数が利用可能か確認
      const throttleFunc = window.LaLaUtils && window.LaLaUtils.throttle 
        ? window.LaLaUtils.throttle 
        : this.simpleThrottle;
      
      window.addEventListener('scroll', throttleFunc(() => {
        this.updateActiveLink();
      }, 100));
      
      // 初期状態をチェック
      this.updateActiveLink();
    }
    
    // LaLaUtilsが読み込まれていない場合の簡易スロットル
    simpleThrottle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
    
    updateActiveLink() {
      const scrollPosition = window.pageYOffset + this.headerHeight + this.navHeight + 50;
      
      let currentSection = null;
      
      // 現在のセクションを判定
      this.sections.forEach(section => {
        const rect = section.element.getBoundingClientRect();
        const top = rect.top + window.pageYOffset;
        
        if (scrollPosition >= top) {
          currentSection = section;
        }
      });
      
      // アクティブ状態を更新
      this.links.forEach(link => link.classList.remove('is-active'));
      
      if (currentSection) {
        currentSection.link.classList.add('is-active');
        
        // アクティブなリンクを中央に表示
        this.scrollToActiveLink(currentSection.link);
      }
    }
    
    // アクティブなリンクを表示領域の中央に配置
    scrollToActiveLink(activeLink) {
      if (!this.navList) return;
      
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = this.navList.getBoundingClientRect();
      
      // リンクの中心位置
      const linkCenter = linkRect.left + linkRect.width / 2;
      // ナビゲーションの中心位置
      const navCenter = navRect.left + navRect.width / 2;
      
      // スクロール量を計算
      const scrollAmount = linkCenter - navCenter;
      
      // スムーズにスクロール
      this.navList.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
    
    initClickBehavior() {
      this.links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const href = link.getAttribute('href');
          const target = document.querySelector(href);
          
          if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - this.headerHeight - this.navHeight - 20;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  }
  
  // ===============================================
  // 初期化
  // ===============================================
  document.addEventListener('DOMContentLoaded', () => {
    new PageNavigation();
  });
  
  // ページ読み込み完了後にも念のためリセット
  window.addEventListener('load', () => {
    const navList = document.querySelector('.page-nav__list');
    if (navList) {
      navList.scrollLeft = 0;
    }
  });
  
})();
