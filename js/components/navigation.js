/* ===============================================
   Navigation Component - ナビゲーション機能
   =============================================== */

(function() {
  'use strict';
  
  // ===============================================
  // ヘッダーナビゲーション
  // ===============================================
  class HeaderNavigation {
    constructor() {
      this.header = document.querySelector('.header');
      this.menuToggle = document.querySelector('.header__menu-toggle');
      this.mobileMenu = document.querySelector('.mobile-menu');
      this.mobileMenuClose = document.querySelector('.mobile-menu__close');
      this.mobileMenuLinks = document.querySelectorAll('.mobile-menu__nav a');
      
      this.scrollPosition = 0;
      this.isMenuOpen = false;
      
      this.init();
    }
    
    init() {
      if (!this.header) return;
      
      // スクロール処理
      this.initScrollBehavior();
      
      // モバイルメニュー
      this.initMobileMenu();
    }
    
    initScrollBehavior() {
      let lastScroll = 0;
      
      window.addEventListener('scroll', window.LaLaUtils.throttle(() => {
        const currentScroll = window.pageYOffset;
        
        // スクロール方向判定
        if (currentScroll > lastScroll && currentScroll > 100) {
          // 下スクロール
          this.header.classList.add('is-hidden');
        } else {
          // 上スクロール
          this.header.classList.remove('is-hidden');
        }
        
        // スクロール位置によるスタイル変更
        if (currentScroll > 50) {
          this.header.classList.add('is-scrolled');
        } else {
          this.header.classList.remove('is-scrolled');
        }
        
        lastScroll = currentScroll;
      }, 100));
    }
    
    initMobileMenu() {
      if (!this.menuToggle || !this.mobileMenu) return;
      
      // メニュー開閉
      this.menuToggle.addEventListener('click', () => this.toggleMenu());
      
      // 閉じるボタン
      if (this.mobileMenuClose) {
        this.mobileMenuClose.addEventListener('click', () => this.closeMenu());
      }
      
      // リンククリックで閉じる
      this.mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
          setTimeout(() => this.closeMenu(), 300);
        });
      });
      
      // 背景クリックで閉じる
      document.addEventListener('click', (e) => {
        if (this.isMenuOpen && 
            !this.mobileMenu.contains(e.target) && 
            !this.menuToggle.contains(e.target)) {
          this.closeMenu();
        }
      });
      
      // ESCキーで閉じる
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isMenuOpen) {
          this.closeMenu();
        }
      });
    }
    
    toggleMenu() {
      this.isMenuOpen ? this.closeMenu() : this.openMenu();
    }
    
    openMenu() {
      this.isMenuOpen = true;
      this.mobileMenu.classList.add('is-active');
      this.menuToggle.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      
      // アクセシビリティ
      this.mobileMenu.setAttribute('aria-hidden', 'false');
      this.menuToggle.setAttribute('aria-expanded', 'true');
    }
    
    closeMenu() {
      this.isMenuOpen = false;
      this.mobileMenu.classList.remove('is-active');
      this.menuToggle.classList.remove('is-active');
      document.body.style.overflow = '';
      
      // アクセシビリティ
      this.mobileMenu.setAttribute('aria-hidden', 'true');
      this.menuToggle.setAttribute('aria-expanded', 'false');
    }
  }
  
  // ===============================================
  // 初期化
  // ===============================================
  document.addEventListener('DOMContentLoaded', () => {
    new HeaderNavigation();
  });
  
})();