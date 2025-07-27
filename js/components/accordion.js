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
      const answer = item.querySelector('.faq-item__answer');
      const answerInner = item.querySelector('.faq-item__answer-inner');
      
      if (answer && answerInner) {
        // 実際のコンテンツの高さを取得
        answer.style.height = 'auto';
        answer.style.position = 'absolute';
        answer.style.visibility = 'hidden';
        answer.style.display = 'block';
        
        const contentHeight = answerInner.getBoundingClientRect().height;
        
        // 元に戻す
        answer.style.height = '';
        answer.style.position = '';
        answer.style.visibility = '';
        answer.style.display = '';
        
        // maxHeightを0から開始
        answer.style.maxHeight = '0';
        
        // リフローを強制
        answer.offsetHeight;
        
        // アニメーション開始
        item.classList.add('is-open');
        answer.style.maxHeight = contentHeight + 'px';
        
        // アニメーション完了後にmax-heightを削除
        setTimeout(() => {
          if (item.classList.contains('is-open')) {
            answer.style.maxHeight = 'none';
          }
        }, 500);
      }
      
      // アクセシビリティ
      const question = item.querySelector('.faq-item__question');
      if (question) {
        question.setAttribute('aria-expanded', 'true');
      }
    }
    
    closeItem(item) {
      const answer = item.querySelector('.faq-item__answer');
      
      if (answer) {
        // 現在の高さを取得して設定
        const currentHeight = answer.scrollHeight;
        answer.style.maxHeight = currentHeight + 'px';
        
        // リフローを強制
        answer.offsetHeight;
        
        // 0にアニメーション
        answer.style.maxHeight = '0';
        
        // アニメーション完了後にクラスを削除
        setTimeout(() => {
          item.classList.remove('is-open');
          answer.style.maxHeight = '';
        }, 500);
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
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        if (!this.slides.length) return;
        
        this.createDots();
        this.addEventListeners();
        this.updateCarousel();
        
        // 自動再生
        this.startAutoPlay();
    }
    
    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'campaign-carousel__dot';
            dot.setAttribute('aria-label', `スライド ${index + 1}`);
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });
    }
    
    addEventListeners() {
        // タッチイベント
        this.carousel.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.stopAutoPlay();
        }, { passive: true });
        
        this.carousel.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
            this.startAutoPlay();
        }, { passive: true });
        
        // マウスイベント
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    updateCarousel() {
        // スライド位置更新
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        
        // アクティブなドットを更新
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('is-active', index === this.currentIndex);
        });
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
  }
  
  // ===============================================
  // 初期化
  // ===============================================
  document.addEventListener('DOMContentLoaded', function() {
    new FAQAccordion();
    new CampaignCarousel();
  });
  
  // エクスポート（他のスクリプトから使用する場合）
  window.FAQAccordion = FAQAccordion;
  window.CampaignCarousel = CampaignCarousel;
  
})();
