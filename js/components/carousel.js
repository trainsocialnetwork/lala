/* ===============================================
   Carousel Component - カルーセル機能
   =============================================== */

(function() {
  'use strict';
  
  // ===============================================
  // クリニックギャラリーカルーセル
  // ===============================================
  class ClinicGalleryCarousel {
    constructor() {
      this.wrapper = document.querySelector('.clinic-gallery__wrapper');
      this.track = document.querySelector('.clinic-gallery__track');
      
      if (!this.wrapper || !this.track) return;
      
      this.init();
    }
    
    init() {
      // トラックの複製（無限スクロール用）
      this.duplicateSlides();
      
      // タッチ操作の設定
      this.initTouchControls();
      
      // ホバーで一時停止
      this.initHoverPause();
    }
    
    duplicateSlides() {
      const slides = this.track.querySelectorAll('.clinic-gallery__slide');
      const clonedSlides = Array.from(slides).map(slide => slide.cloneNode(true));
      
      // 複製したスライドを追加
      clonedSlides.forEach(slide => {
        this.track.appendChild(slide);
      });
    }
    
    initTouchControls() {
      let startX = 0;
      let currentX = 0;
      let isDragging = false;
      
      this.wrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        this.pauseAnimation();
      }, { passive: true });
      
      this.wrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        
        // スワイプに応じてトラックを移動
        const currentTransform = this.getCurrentTransform();
        this.track.style.transform = `translateX(${currentTransform + diff}px)`;
      }, { passive: true });
      
      this.wrapper.addEventListener('touchend', () => {
        isDragging = false;
        
        // アニメーションを再開
        setTimeout(() => {
          this.resumeAnimation();
        }, 3000);
      });
    }
    
    initHoverPause() {
      this.wrapper.addEventListener('mouseenter', () => {
        this.pauseAnimation();
      });
      
      this.wrapper.addEventListener('mouseleave', () => {
        this.resumeAnimation();
      });
    }
    
    pauseAnimation() {
      this.track.style.animationPlayState = 'paused';
    }
    
    resumeAnimation() {
      this.track.style.animationPlayState = 'running';
    }
    
    getCurrentTransform() {
      const style = window.getComputedStyle(this.track);
      const matrix = new WebKitCSSMatrix(style.transform);
      return matrix.m41;
    }
  }
  
  // ===============================================
  // ボイスカルーセル（モバイル用）
  // ===============================================
  class VoiceCarousel {
    constructor() {
      this.carousel = document.querySelector('.voice-carousel');
      if (!this.carousel) return;
      
      this.init();
    }
    
    init() {
      // モバイルでのみ動作
      // if (window.innerWidth >= 768) return;
      
      // スナップスクロールの設定
      this.carousel.style.scrollSnapType = 'x mandatory';
      
      const cards = this.carousel.querySelectorAll('.voice-card');
      cards.forEach(card => {
        card.style.scrollSnapAlign = 'start';
      });
    }
  }
  
  // ===============================================
  // 初期化
  // ===============================================
  document.addEventListener('DOMContentLoaded', () => {
    new ClinicGalleryCarousel();
    new VoiceCarousel();
  });
  
})();
