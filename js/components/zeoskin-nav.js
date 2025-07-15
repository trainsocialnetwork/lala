/* ===============================================
   Zeoskin Product Navigation
   製品カテゴリナビゲーションのアクティブ状態管理
   =============================================== */

(function() {
  'use strict';
  
  class ZeoskinNavigation {
    constructor() {
      this.navLinks = document.querySelectorAll('.product-nav--zeoskin .product-nav__link');
      this.sections = [];
      
      if (!this.navLinks.length) return;
      
      this.init();
    }
    
    init() {
      // セクション要素を収集
      this.collectSections();
      
      // クリックイベント
      this.initClickBehavior();
      
      // スクロールイベント
      this.initScrollBehavior();
    }
    
    collectSections() {
      this.navLinks.forEach(link => {
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
    
    initClickBehavior() {
      this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          // アクティブ状態を更新
          this.navLinks.forEach(l => l.classList.remove('is-active'));
          link.classList.add('is-active');
          
          // スクロール
          const href = link.getAttribute('href');
          const target = document.querySelector(href);
          
          if (target) {
            const headerHeight = 60;
            const navHeight = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - headerHeight - navHeight - 20;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
    
    initScrollBehavior() {
      // スロットル関数
      const throttle = (func, limit) => {
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
      };
      
      window.addEventListener('scroll', throttle(() => {
        this.updateActiveLink();
      }, 100));
      
      // 初期状態をチェック
      this.updateActiveLink();
    }
    
    updateActiveLink() {
      const scrollPosition = window.pageYOffset + 200;
      
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
      if (currentSection) {
        this.navLinks.forEach(link => link.classList.remove('is-active'));
        currentSection.link.classList.add('is-active');
        
        // アクティブなリンクを表示領域の中央に配置
        this.scrollToActiveLink(currentSection.link);
      }
    }
    
    scrollToActiveLink(activeLink) {
      const navList = activeLink.closest('.product-nav__list');
      if (!navList) return;
      
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = navList.getBoundingClientRect();
      
      // リンクの中心位置
      const linkCenter = linkRect.left + linkRect.width / 2;
      // ナビゲーションの中心位置
      const navCenter = navRect.left + navRect.width / 2;
      
      // スクロール量を計算
      const scrollAmount = linkCenter - navCenter;
      
      // スムーズにスクロール
      navList.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }
  
  // 初期化
  document.addEventListener('DOMContentLoaded', () => {
    new ZeoskinNavigation();
  });
  
})();
