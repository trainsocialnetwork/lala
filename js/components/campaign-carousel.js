// Campaign Carousel Component
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
        this.autoPlayInterval = null;
        
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
        
        // スクロールイベント（手動スクロール時の同期）
        this.track.addEventListener('scroll', () => {
            const slideWidth = this.slides[0].offsetWidth;
            const newIndex = Math.round(this.track.scrollLeft / slideWidth);
            if (newIndex !== this.currentIndex) {
                this.currentIndex = newIndex;
                this.updateDots();
            }
        });
        
        // ウィンドウリサイズ時の再計算
        window.addEventListener('resize', () => {
            this.updateCarousel();
        });
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
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }
    
    updateCarousel() {
        const slideWidth = this.slides[0].offsetWidth;
        const scrollPosition = this.currentIndex * slideWidth;
        
        this.track.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        this.updateDots();
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('is-active', index === this.currentIndex);
        });
    }
    
    startAutoPlay() {
        this.stopAutoPlay(); // 既存のインターバルをクリア
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // 5秒ごとに切り替え
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new CampaignCarousel();
});
