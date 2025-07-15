/**
 * Zeoskin Page JavaScript
 * Handles product loading and interactive features
 */

// DOM Elements
const productsContainer = document.getElementById('products-container');

// Load products data
async function loadProducts() {
  try {
    const response = await fetch('../data/zeoskin-product.json');
    const data = await response.json();
    renderProducts(data.products.categories);
  } catch (error) {
    console.error('Error loading products:', error);
    productsContainer.innerHTML = '<p class="error-message">製品の読み込みに失敗しました。</p>';
  }
}

// Render products
function renderProducts(categories) {
  const productsHTML = categories.map(category => `
    <div class="product-category" data-category-id="${category.id}">
      <div class="product-category__header" onclick="toggleCategory('${category.id}')">
        <h3 class="product-category__title">${category.name}</h3>
      </div>
      <div class="product-category__content" id="${category.id}">
        <div class="product-grid">
          ${renderProductCards(category.products)}
        </div>
      </div>
    </div>
  `).join('');
  
  productsContainer.innerHTML = productsHTML;
}

// Render individual product cards
function renderProductCards(products) {
  return products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" class="product-card__image" loading="lazy">
      <h4 class="product-card__name">${product.name}</h4>
      <p class="product-card__description">${product.description}</p>
      <p class="product-card__price">${product.price}</p>
      <a href="${product.link}" class="product-card__cta">商品詳細へ</a>
    </div>
  `).join('');
}

// Toggle category visibility
function toggleCategory(categoryId) {
  const content = document.getElementById(categoryId);
  const header = content.previousElementSibling;
  
  if (content.style.display === 'none') {
    content.style.display = 'block';
    header.classList.add('active');
  } else {
    content.style.display = 'none';
    header.classList.remove('active');
  }
}

// Mobile menu toggle
function initMobileMenu() {
  const menuToggle = document.querySelector('.header__menu-toggle');
  const nav = document.querySelector('.header__nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Header scroll behavior
function initHeaderScroll() {
  const header = document.getElementById('header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  initMobileMenu();
  initSmoothScroll();
  initHeaderScroll();
});
