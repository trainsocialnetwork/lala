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
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.startScrollLeft = 0;
        
        this.init();
    }
    
    init() {
        if (!this.track || !this.slides.length) return;
        
        // ドットインジケーターの作成
        this.createDots();
        
        // タッチ・マウスイベントの設定
        this.initSwipeEvents();
        
        // スクロールイベント（デバウンス処理）
        this.track.addEventListener('scroll', window.LaLaUtils.debounce(() => {
            if (!this.isDragging) {
                this.updateCurrentIndex();
            }
        }, 100));
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
    
    initSwipeEvents() {
        // タッチイベント
        this.track.addEventListener('touchstart', (e) => this.handleStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleMove(e), { passive: true });
        this.track.addEventListener('touchend', (e) => this.handleEnd(e));
        
        // マウスイベント（デスクトップ対応）
        this.track.addEventListener('mousedown', (e) => this.handleStart(e));
        this.track.addEventListener('mousemove', (e) => this.handleMove(e));
        this.track.addEventListener('mouseup', (e) => this.handleEnd(e));
        this.track.addEventListener('mouseleave', (e) => {
            if (this.isDragging) this.handleEnd(e);
        });
        
        // スクロールスナップを一時的に無効化
        this.track.style.scrollSnapType = 'none';
    }
    
    handleStart(e) {
        this.isDragging = true;
        this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        this.startScrollLeft = this.track.scrollLeft;
        this.track.style.cursor = 'grabbing';
        this.track.style.userSelect = 'none';
    }
    
    handleMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diff = this.startX - this.currentX;
        
        // 指の動きに追従してスクロール
        this.track.scrollLeft = this.startScrollLeft + diff;
    }
    
    handleEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.style.cursor = '';
        this.track.style.userSelect = '';
        
        // スワイプの速度と距離を計算
        const diff = this.startX - this.currentX;
        const threshold = this.slides[0].offsetWidth * 0.2; // 20%以上スワイプで切り替え
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && this.currentIndex < this.slides.length - 1) {
                this.goToSlide(this.currentIndex + 1);
            } else if (diff < 0 && this.currentIndex > 0) {
                this.goToSlide(this.currentIndex - 1);
            } else {
                this.goToSlide(this.currentIndex);
            }
        } else {
            // 閾値以下の場合は現在のスライドに戻る
            this.goToSlide(this.currentIndex);
        }
        
        // スクロールスナップを再有効化
        setTimeout(() => {
            this.track.style.scrollSnapType = 'x mandatory';
        }, 300);
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
        
        this.currentIndex = index;
        
        this.track.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        this.updateDots();
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
