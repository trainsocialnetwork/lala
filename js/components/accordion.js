/* ===============================================
   Accordion Component - アコーディオン機能
   =============================================== */

(function() {
  'use strict';
  
  // ===============================================
  // FAQアコーディオン
  // ===============================================
  class FAQAccordion {
    constructor() {
      this.items = document.querySelectorAll('.faq-item');
      
      if (!this.items.length) return;
      
      this.init();
    }
    
    init() {
      this.items.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        
        if (question) {
          question.addEventListener('click', () => this.toggleItem(item));
          
          // キーボード操作対応
          question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.toggleItem(item);
            }
          });
        }
      });
    }
    
    toggleItem(clickedItem) {
      const isOpen = clickedItem.classList.contains('is-open');
      
      // 他のアイテムを閉じる
      this.items.forEach(item => {
        if (item !== clickedItem && item.classList.contains('is-open')) {
          this.closeItem(item);
        }
      });
      
      // クリックされたアイテムの開閉
      if (isOpen) {
        this.closeItem(clickedItem);
      } else {
        this.openItem(clickedItem);
      }
    }
    
    openItem(item) {
      item.classList.add('is-open');
      
      const answer = item.querySelector('.faq-item__answer');
      const content = item.querySelector('.faq-item__content');
      
      if (answer && content) {
        // コンテンツの高さを取得
        const contentHeight = content.scrollHeight;
        answer.style.maxHeight = contentHeight + 'px';
      }
      
      // アクセシビリティ
      const question = item.querySelector('.faq-item__question');
      if (question) {
        question.setAttribute('aria-expanded', 'true');
      }
    }
    
    closeItem(item) {
      item.classList.remove('is-open');
      
      const answer = item.querySelector('.faq-item__answer');
      if (answer) {
        answer.style.maxHeight = '0';
      }
      
      // アクセシビリティ
      const question = item.querySelector('.faq-item__question');
      if (question) {
        question.setAttribute('aria-expanded', 'false');
      }
    }
  }
  
  // ===============================================
  // キャンペーンカルーセル
  // ===============================================
  class CampaignCarousel {
    constructor() {
      this.carousel = document.querySelector('.campaign-carousel');
      if (!this.carousel) return;
      
      this.track = this.carousel.querySelector('.campaign-carousel__track');
      this.slides = this.carousel.querySelectorAll('.campaign-slide');
      this.dotsContainer = this.carousel.querySelector('.campaign-carousel__dots');
      
      this.currentIndex = 0;
      this.dots = [];
      
      this.init();
    }
    
    init() {
      if (!this.track || !this.slides.length) return;
      
      // ドットインジケーターの作成
      this.createDots();
      
      // スクロールイベント
      this.track.addEventListener('scroll', window.LaLaUtils.debounce(() => {
        this.updateCurrentIndex();
      }, 100));
      
      // タッチ操作の改善
      this.initTouchScroll();
    }
    
    createDots() {
      if (!this.dotsContainer) return;
      
      this.slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'campaign-carousel__dot';
        dot.setAttribute('aria-label', `スライド ${index + 1}`);
        
        if (index === 0) {
          dot.classList.add('is-active');
        }
        
        dot.addEventListener('click', () => this.goToSlide(index));
        
        this.dotsContainer.appendChild(dot);
        this.dots.push(dot);
      });
    }
    
    updateCurrentIndex() {
      const scrollLeft = this.track.scrollLeft;
      const slideWidth = this.slides[0].offsetWidth;
      
      this.currentIndex = Math.round(scrollLeft / slideWidth);
      
      // ドットの更新
      this.updateDots();
    }
    
    updateDots() {
      this.dots.forEach((dot, index) => {
        if (index === this.currentIndex) {
          dot.classList.add('is-active');
        } else {
          dot.classList.remove('is-active');
        }
      });
    }
    
    goToSlide(index) {
      const slideWidth = this.slides[0].offsetWidth;
      const scrollPosition = slideWidth * index;
      
      this.track.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
    
    initTouchScroll() {
      let startX = 0;
      let scrollLeft = 0;
      
      this.track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - this.track.offsetLeft;
        scrollLeft = this.track.scrollLeft;
      });
      
      this.track.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - this.track.offsetLeft;
        const walk = (x - startX) * 2;
        this.track.scrollLeft = scrollLeft - walk;
      });
    }
  }
  
  // ===============================================
  // 初期化
  // ===============================================
  document.addEventListener('DOMContentLoaded', () => {
    new FAQAccordion();
    new CampaignCarousel();
  });
  
})();