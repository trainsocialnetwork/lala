/* ===============================================
   Mobile Fixed CTA Component - モバイル固定CTAボタン
   =============================================== */

(function() {
  'use strict';
  
  class MobileFixedCTA {
    constructor() {
      this.button = document.getElementById('mobileFixedCTA');
      this.heroSection = document.querySelector('.hero, .page-hero');
      this.lastScrollTop = 0;
      this.isShown = false;
      this.heroThreshold = 0;
      
      this.init();
    }
    
    init() {
      if (!this.button) return;
      
      // モバイルでのみ動作
      if (window.innerWidth > 768) return;
      
      // Hero sectionの高さを取得
      this.calculateHeroThreshold();
      
      // スクロールイベントの監視
      window.addEventListener('scroll', window.LaLaUtils.throttle(() => {
        this.handleScroll();
      }, 100));
      
      // リサイズ時の再計算
      window.addEventListener('resize', window.LaLaUtils.debounce(() => {
        if (window.innerWidth > 768) {
          this.hideButton();
          document.body.classList.remove('has-mobile-cta');
        } else {
          this.calculateHeroThreshold();
        }
      }, 250));
      
      // 初期状態をチェック
      this.handleScroll();
    }
    
    calculateHeroThreshold() {
      if (this.heroSection) {
        const heroRect = this.heroSection.getBoundingClientRect();
        const heroHeight = heroRect.height;
        // Hero sectionの高さの80%を通過したら表示
        this.heroThreshold = heroHeight * 0.8;
      } else {
        // Hero sectionがない場合は300pxスクロール後に表示
        this.heroThreshold = 300;
      }
    }
    
    handleScroll() {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDirection = currentScrollTop > this.lastScrollTop ? 'down' : 'up';
      
      // Hero sectionを通過したかチェック
      const passedHero = currentScrollTop > this.heroThreshold;
      
      // 最下部付近かチェック（フッター手前で非表示）
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const nearBottom = currentScrollTop + windowHeight > documentHeight - 200;
      
      // 表示/非表示の制御
      if (passedHero && !nearBottom) {
        if (!this.isShown) {
          this.showButton();
        }
      } else {
        if (this.isShown) {
          this.hideButton();
        }
      }
      
      this.lastScrollTop = currentScrollTop;
    }
    
    showButton() {
      this.button.classList.add('show');
      this.button.classList.remove('hide');
      document.body.classList.add('has-mobile-cta');
      this.isShown = true;
    }
    
    hideButton() {
      this.button.classList.remove('show');
      this.button.classList.add('hide');
      document.body.classList.remove('has-mobile-cta');
      this.isShown = false;
    }
  }
  
  // 初期化
  document.addEventListener('DOMContentLoaded', () => {
    new MobileFixedCTA();
  });
  
})();
