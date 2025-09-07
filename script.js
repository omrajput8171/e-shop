// Sample product data with Indian Rupees (₹)
const products = [
    {
        id: 1,
        title: "Classic White T-Shirt",
        price: 2499,
        originalPrice: 3299,
        category: "men",
        brand: "nike",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        description: "Comfortable cotton t-shirt perfect for everyday wear. Made from 100% organic cotton.",
        rating: 4.8,
        reviews: 124,
        inStock: true
    },
    {
        id: 2,
        title: "Elegant Black Dress",
        price: 7499,
        originalPrice: 10999,
        category: "women",
        brand: "adidas",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
        description: "Sophisticated black dress perfect for special occasions. Elegant design with premium fabric.",
        rating: 4.9,
        reviews: 89,
        inStock: true
    },
    {
        id: 3,
        title: "Wireless Headphones",
        price: 16999,
        originalPrice: 20999,
        category: "electronics",
        brand: "apple",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
        rating: 4.7,
        reviews: 256,
        inStock: true
    },
    {
        id: 4,
        title: "Leather Watch",
        price: 12499,
        originalPrice: 16999,
        category: "accessories",
        brand: "samsung",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        description: "Classic leather watch with modern design. Perfect for both casual and formal occasions.",
        rating: 4.6,
        reviews: 78,
        inStock: true
    },
    {
        id: 5,
        title: "Running Shoes",
        price: 10999,
        originalPrice: 13499,
        category: "men",
        brand: "nike",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        description: "Comfortable running shoes with advanced cushioning technology for optimal performance.",
        rating: 4.8,
        reviews: 342,
        inStock: true
    },
    {
        id: 6,
        title: "Designer Handbag",
        price: 24999,
        originalPrice: 32999,
        category: "women",
        brand: "adidas",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        description: "Luxurious designer handbag made from premium leather with elegant styling.",
        rating: 4.9,
        reviews: 156,
        inStock: true
    },
    {
        id: 7,
        title: "Smartphone",
        price: 66999,
        originalPrice: 82999,
        category: "electronics",
        brand: "apple",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
        description: "Latest smartphone with advanced features, high-resolution camera, and long-lasting battery.",
        rating: 4.7,
        reviews: 423,
        inStock: true
    },
    {
        id: 8,
        title: "Sunglasses",
        price: 6699,
        originalPrice: 8299,
        category: "accessories",
        brand: "samsung",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
        description: "Stylish sunglasses with UV protection and polarized lenses for clear vision.",
        rating: 4.5,
        reviews: 92,
        inStock: true
    }
];

// Currency formatting function for Indian Rupees
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilters = {
    category: 'all',
    priceRange: 100000,
    brand: 'all',
    sortBy: 'default'
};

// DOM elements
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load products based on current page
    if (window.location.pathname.includes('shop.html')) {
        loadShopProducts();
        setupShopFilters();
    } else if (window.location.pathname.includes('product-details.html')) {
        loadProductDetails();
    } else {
        loadFeaturedProducts();
    }

    // Setup event listeners
    setupEventListeners();
    updateCartUI();
}

function setupEventListeners() {
    // Cart functionality
    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    
    // Mobile menu
    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            if (window.location.pathname.includes('shop.html')) {
                filterByCategory(category);
            } else {
                window.location.href = `shop.html?category=${category}`;
            }
        });
    });
    
    // CTA button
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            window.location.href = 'shop.html';
        });
    }
}

// Cart functions
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    updateCartUI();
    saveCart();
    showNotification('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            updateCartUI();
            saveCart();
        }
    }
}

function updateCartUI() {
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    if (cartItems) {
        renderCartItems();
    }
    
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = formatPrice(total);
    }
}

function renderCartItems() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center p-4">Your cart is empty</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-control" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="10" onchange="updateCartQuantity(${item.id}, parseInt(this.value))">
                    <button class="quantity-control" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function toggleCart() {
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
    }
}

function closeCart() {
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Mobile menu
function toggleMobileMenu() {
    if (hamburger && navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
}

// Product loading functions
function loadFeaturedProducts() {
    const featuredProducts = document.getElementById('featured-products');
    if (!featuredProducts) return;
    
    const featured = products.slice(0, 4);
    featuredProducts.innerHTML = featured.map(product => createProductCard(product)).join('');
}

function loadShopProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    const filteredProducts = getFilteredProducts();
    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    // Update products count
    const productsCount = document.getElementById('products-count');
    if (productsCount) {
        productsCount.textContent = filteredProducts.length;
    }
}

function createProductCard(product) {
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    return `
        <div class="product-card fade-in" onclick="viewProduct(${product.id})">
            ${discount > 0 ? `<div class="product-badge">${discount}% OFF</div>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-text">(${product.rating}) ${product.reviews} reviews</span>
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function viewProduct(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Shop filters
function setupShopFilters() {
    const filterToggle = document.getElementById('filter-toggle');
    const filtersSidebar = document.getElementById('filters-sidebar');
    const sortSelect = document.getElementById('sort-select');
    const clearFilters = document.getElementById('clear-filters');
    
    if (filterToggle && filtersSidebar) {
        filterToggle.addEventListener('click', () => {
            filtersSidebar.classList.toggle('open');
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentFilters.sortBy = e.target.value;
            loadShopProducts();
        });
    }
    
    if (clearFilters) {
        clearFilters.addEventListener('click', clearAllFilters);
    }
    
    // Category filters
    const categoryFilters = document.querySelectorAll('input[type="checkbox"][value]');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', handleCategoryFilter);
    });
    
    // Price range filter
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            currentFilters.priceRange = parseInt(e.target.value);
            const maxPrice = document.getElementById('max-price');
            if (maxPrice) {
                maxPrice.textContent = formatPrice(e.target.value);
            }
            loadShopProducts();
        });
    }
    
    // Brand filters
    const brandFilters = document.querySelectorAll('input[type="checkbox"][value]');
    brandFilters.forEach(filter => {
        if (['nike', 'adidas', 'apple', 'samsung'].includes(filter.value)) {
            filter.addEventListener('change', handleBrandFilter);
        }
    });
}

function handleCategoryFilter(e) {
    const value = e.target.value;
    if (value === 'all') {
        // Uncheck other category filters
        document.querySelectorAll('input[type="checkbox"][value]').forEach(cb => {
            if (cb.value !== 'all') cb.checked = false;
        });
        currentFilters.category = 'all';
    } else {
        // Uncheck 'all' and set specific category
        document.querySelector('input[type="checkbox"][value="all"]').checked = false;
        currentFilters.category = value;
    }
    loadShopProducts();
}

function handleBrandFilter(e) {
    const value = e.target.value;
    currentFilters.brand = value;
    loadShopProducts();
}

function clearAllFilters() {
    currentFilters = {
        category: 'all',
        priceRange: 100000,
        brand: 'all',
        sortBy: 'default'
    };
    
    // Reset UI
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = cb.value === 'all';
    });
    
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        priceRange.value = 100000;
        const maxPrice = document.getElementById('max-price');
        if (maxPrice) {
            maxPrice.textContent = formatPrice(100000);
        }
    }
    
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.value = 'default';
    }
    
    loadShopProducts();
}

function getFilteredProducts() {
    let filtered = [...products];
    
    // Category filter
    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(product => product.category === currentFilters.category);
    }
    
    // Price filter
    filtered = filtered.filter(product => product.price <= currentFilters.priceRange);
    
    // Brand filter
    if (currentFilters.brand !== 'all') {
        filtered = filtered.filter(product => product.brand === currentFilters.brand);
    }
    
    // Sort
    switch (currentFilters.sortBy) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'popularity':
            filtered.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'newest':
            filtered.sort((a, b) => b.id - a.id);
            break;
    }
    
    return filtered;
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const allProducts = document.querySelectorAll('.product-card');
    
    allProducts.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Product details page
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        window.location.href = 'shop.html';
        return;
    }
    
    // Update page content
    document.title = `${product.title} - E-Shop`;
    
    // Update breadcrumb
    const productCategory = document.getElementById('product-category');
    const productName = document.getElementById('product-name');
    if (productCategory) productCategory.textContent = product.category;
    if (productName) productName.textContent = product.title;
    
    // Update product details
    const productTitle = document.getElementById('product-title');
    const productPrice = document.getElementById('product-price');
    const originalPrice = document.getElementById('original-price');
    const discount = document.getElementById('discount');
    const productDescription = document.getElementById('product-description');
    const mainImage = document.getElementById('main-product-image');
    
    if (productTitle) productTitle.textContent = product.title;
    if (productPrice) productPrice.textContent = formatPrice(product.price);
    if (originalPrice) originalPrice.textContent = formatPrice(product.originalPrice);
    if (discount) {
        const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        discount.textContent = `${discountPercent}% OFF`;
    }
    if (productDescription) productDescription.textContent = product.description;
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.title;
    }
    
    // Setup product interactions
    setupProductInteractions(product);
}

function setupProductInteractions(product) {
    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            addToCart(product.id, quantity);
        });
    }
    
    // Quantity controls
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const quantityInput = document.getElementById('quantity');
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            const currentQty = parseInt(quantityInput.value) || 1;
            if (currentQty > 1) {
                quantityInput.value = currentQty - 1;
            }
        });
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            const currentQty = parseInt(quantityInput.value) || 1;
            if (currentQty < 10) {
                quantityInput.value = currentQty + 1;
            }
        });
    }
    
    // Size selection
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Color selection
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Thumbnail images
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    thumbnails.forEach((thumb, index) => {
        thumb.src = product.image; // In a real app, you'd have multiple images
        thumb.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            if (mainImage) {
                mainImage.src = thumb.src;
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1002;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (cartSidebar && !cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
        closeCart();
    }
});

// Handle URL parameters for shop page
if (window.location.pathname.includes('shop.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        currentFilters.category = category;
        // Update UI to reflect the filter
        const categoryCheckbox = document.querySelector(`input[value="${category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
            document.querySelector('input[value="all"]').checked = false;
        }
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states
function showLoading(element) {
    element.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
}

function hideLoading(element) {
    // Loading will be replaced by actual content
}

// Initialize animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.product-card, .category-card');
    animatedElements.forEach(el => observer.observe(el));
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        // Close mobile menu on desktop
        if (navMenu) navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    }
});

// Add to cart animation
function animateAddToCart(button) {
    button.style.transform = 'scale(0.95)';
    button.style.backgroundColor = '#10b981';
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.style.backgroundColor = '#2563eb';
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    }, 1000);
}

// Enhanced add to cart function with animation
function addToCartWithAnimation(productId, quantity = 1) {
    addToCart(productId, quantity);
    
    // Find the button that was clicked
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(productId)) {
            animateAddToCart(btn);
        }
    });
}

// Update all add to cart buttons to use the animated version
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(btn => {
        const originalOnclick = btn.onclick;
        btn.onclick = function(e) {
            e.stopPropagation();
            const productId = this.getAttribute('data-product-id') || 
                            this.onclick.toString().match(/addToCart\((\d+)\)/)?.[1];
            if (productId) {
                addToCartWithAnimation(parseInt(productId));
            }
        };
    });
});
