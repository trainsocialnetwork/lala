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
      this.links = document.querySelectorAll('.page-nav__link');
      this.sections = [];
      
      if (!this.nav || !this.links.length) return;
      
      this.headerHeight = 60; // ヘッダーの高さ
      this.navHeight = this.nav.offsetHeight;
      
      this.init();
    }
    
    init() {
      // セクション要素を取得
      this.collectSections();
      
      // スクロールイベント
      this.initScrollBehavior();
      
      // クリックイベント
      this.initClickBehavior();
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
      window.addEventListener('scroll', window.LaLaUtils.throttle(() => {
        this.updateActiveLink();
      }, 100));
      
      // 初期状態をチェック
      this.updateActiveLink();
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
      }
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
  
})();