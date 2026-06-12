// --- 1. Product Database (Source of Truth) ---
const products = [
    { 
        id: 'nova', name: 'Bedre Nova', category: 'Running', price: 165, img: 'shoe2.png', 
        images: ['shoe2.png', 'shoe3.png', 'shoe4.png'], rating: 4.8, reviewsCount: 124,
        desc: 'Lightweight performance runner built for speed and endurance.', 
        materials: 'AeroWeave Mesh, Recycled Rubber', fit: 'True to Size, Snug heel', features: 'Marathons, Daily Jogs',
        reviews: [
            { author: 'Sarah J.', rating: 5, text: 'Best running shoes I have ever owned. Felt like running on clouds.' },
            { author: 'Mike T.', rating: 4, text: 'Great fit, really responsive on the track.' }
        ]
    },
    { 
        id: 'arc', name: 'Bedre Arc', category: 'Lifestyle', price: 140, img: 'shoe3.png', 
        images: ['shoe3.png', 'shoe4.png', 'shoe2.png'], rating: 4.9, reviewsCount: 89,
        desc: 'The ultimate everyday shoe. Minimalist aesthetic with maximum comfort.', 
        materials: 'Organic Cotton, CloudFoam', fit: 'Slightly wide, roomy toe box', features: 'Office wear, City Walking',
        reviews: [
            { author: 'David L.', rating: 5, text: 'I wear these to the office every day. Unbelievable comfort.' },
            { author: 'Emma W.', rating: 5, text: 'Sleek design and super lightweight.' }
        ]
    },
    { 
        id: 'core', name: 'Bedre Core', category: 'Casual', price: 125, img: 'shoe4.png', 
        images: ['shoe4.png', 'shoe2.png', 'shoe3.png'], rating: 4.7, reviewsCount: 210,
        desc: 'A stripped-down classic. Essential design for an uncomplicated wardrobe.', 
        materials: 'Vegan Leather, EVA sole', fit: 'True to size', features: 'Weekend outings, Casual fridays',
        reviews: [
            { author: 'Chris P.', rating: 4, text: 'Solid casual shoe, goes with everything.' },
            { author: 'Anna K.', rating: 5, text: 'My go-to weekend shoe. Easy to clean.' }
        ]
    },
    { 
        id: 'aura', name: 'Bedre Aura', category: 'Running', price: 170, img: 'shoe5.png', 
        images: ['shoe5.png', 'shoe6.png', 'shoe7.png'], rating: 4.9, reviewsCount: 156,
        desc: 'High-rebound cushioning that turns impact into forward momentum.', 
        materials: 'Knit fabric, Kinetic Foam', fit: 'Snug performance fit', features: 'Track running, High-impact sports',
        reviews: [
            { author: 'Jordan M.', rating: 5, text: 'Pushed my 5k personal best in these. Incredible energy return.' },
            { author: 'Alex B.', rating: 5, text: 'Super supportive around the ankles.' }
        ]
    },
    { 
        id: 'luna', name: 'Bedre Luna', category: 'Lifestyle', price: 145, img: 'shoe6.png', 
        images: ['shoe6.png', 'shoe7.png', 'shoe5.png'], rating: 4.6, reviewsCount: 92,
        desc: 'Sleek slip-on design for people on the move.', 
        materials: 'Stretchy Neoprene', fit: 'Molds to foot shape', features: 'Travel, Everyday errands',
        reviews: [
            { author: 'Taylor S.', rating: 4, text: 'Perfect for airports. Just slip on and off.' },
            { author: 'Jamie D.', rating: 5, text: 'Very breathable and stylish.' }
        ]
    },
    { 
        id: 'zenith', name: 'Bedre Zenith', category: 'Casual', price: 130, img: 'shoe7.png', 
        images: ['shoe7.png', 'shoe5.png', 'shoe6.png'], rating: 4.8, reviewsCount: 341,
        desc: 'Retro-inspired lines packed with modern orthopedic support.', 
        materials: 'Suede accents, Rubberized mesh', fit: 'Runs half-size large', features: 'All-day standing, Casual events',
        reviews: [
            { author: 'Sam G.', rating: 5, text: 'I stand all day for work and these saved my back.' },
            { author: 'Riley H.', rating: 4, text: 'Looks retro but feels futuristic. Runs a bit big.' }
        ]
    },
    { 
        id: 'apex', name: 'Bedre Apex Pro', category: 'Performance', price: 185, img: 'shoe8.png', 
        images: ['shoe8.png', 'shoe2.png', 'shoe5.png'], rating: 5.0, reviewsCount: 890,
        desc: 'Our flagship model. Carbon-infused plate for elite athletic output.', 
        materials: 'Carbon Fiber, Zero-Gravity Foam', fit: 'Lockdown fit, precise length', features: 'Competitive racing, CrossFit',
        reviews: [
            { author: 'Marcus F.', rating: 5, text: 'The ultimate performance shoe. You can feel the carbon plate propel you.' },
            { author: 'Elena R.', rating: 5, text: 'Worth every penny. Built incredibly well.' },
            { author: 'Tom W.', rating: 5, text: 'Smashed my marathon record.' }
        ]
    }
];

// --- 2. State & DOM Elements ---
let cartItems = [];
let selectedSize = null;
let activeProductToBuy = null;
let isBuyNowCheckout = false;
let promoDiscount = 0; // percentage
let currentCategoryFilter = null;

const productOverlay  = document.getElementById('productOverlay');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const categoryOverlay = document.getElementById('categoryOverlay');
const sizeGrid = document.getElementById('sizeGrid');
const sizeError = document.getElementById('sizeError');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');
const backToTop = document.getElementById('backToTop');
const themeToggle = document.getElementById('themeToggle');

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
}

// --- Dark Mode ---
function initTheme() {
    const savedTheme = localStorage.getItem('bedreTheme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }
}
initTheme();

themeToggle.addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('bedreTheme', 'light');
        themeToggle.textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('bedreTheme', 'dark');
        themeToggle.textContent = '☀️';
    }
});

// --- 3. Cart Logic ---
function getCartCount() { return cartItems.reduce((sum, item) => sum + item.quantity, 0); }
function getCartTotal() { return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0); }

function saveCart() { localStorage.setItem('bedreCart', JSON.stringify(cartItems)); }

function loadCart() {
    const saved = localStorage.getItem('bedreCart');
    if (saved) { cartItems = JSON.parse(saved); renderCart(); }
}

function addToCart(product, size) {
    const existing = cartItems.find(i => i.id === product.id && i.size === size);
    if (existing) {
        existing.quantity += 1;
    } else {
        cartItems.push({ id: product.id, name: product.name, price: product.price, size: size, img: product.img, quantity: 1 });
    }
    saveCart();
    renderCart();
    showToast(`${product.name} (Size ${size}) added to cart`, 'success');
}

function removeFromCart(index) {
    const removed = cartItems.splice(index, 1);
    saveCart();
    renderCart();
    showToast(`${removed[0].name} removed from cart`, 'info');
}

function updateQuantity(index, delta) {
    cartItems[index].quantity += delta;
    if (cartItems[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCart();
        renderCart();
    }
}

function clearCart() {
    cartItems = [];
    promoDiscount = 0;
    document.getElementById('promoCodeInput').value = '';
    document.getElementById('discountDisplay').style.display = 'none';
    saveCart();
    renderCart();
}

function renderCart() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartCountDisplay = document.getElementById('cartCountDisplay');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
    const promoContainer = document.getElementById('promoContainer');
    
    const count = getCartCount();
    let total = getCartTotal();
    
    cartCountDisplay.innerText = `(${count})`;
    
    if (count === 0) {
        cartItemsEl.innerHTML = `
            <div style="text-align:center; padding-top:3rem; color:var(--text-secondary);">
                <svg viewBox="0 0 24 24" style="width:64px;height:64px;margin-bottom:1rem;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;opacity:0.5;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <p style="margin-bottom: 1.5rem;">Your cart is feeling a bit light.</p>
                <button class="btn btn-secondary" onclick="closeCart(); document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });">Start Shopping</button>
            </div>
        `;
        document.getElementById('clearCartBtn').style.display = 'none';
        promoContainer.style.display = 'none';
        document.getElementById('discountDisplay').style.display = 'none';
        cartTotalEl.innerText = '0.00';
        if(cartCheckoutBtn) {
            cartCheckoutBtn.disabled = true;
            cartCheckoutBtn.style.opacity = '0.5';
            cartCheckoutBtn.style.cursor = 'not-allowed';
        }
        return;
    }
    
    document.getElementById('clearCartBtn').style.display = 'block';
    promoContainer.style.display = 'flex';
    if(cartCheckoutBtn) {
        cartCheckoutBtn.disabled = false;
        cartCheckoutBtn.style.opacity = '1';
        cartCheckoutBtn.style.cursor = 'pointer';
    }

    let discountAmt = 0;
    if (promoDiscount > 0) {
        discountAmt = total * promoDiscount;
        total = total - discountAmt;
        document.getElementById('discountDisplay').style.display = 'block';
        document.getElementById('discountAmount').innerText = discountAmt.toFixed(2);
    } else {
        document.getElementById('discountDisplay').style.display = 'none';
    }
    cartTotalEl.innerText = total.toFixed(2);

    let html = '';
    cartItems.forEach((item, index) => {
        html += `<div class="cart-item">
            <div class="cart-item-img" style="width: 60px; height: 60px; background: var(--bg-primary); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; padding: 0.5rem; flex-shrink: 0;">
                <img src="${item.img}" alt="${item.name}" style="max-width: 100%; max-height: 100%;">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-size" style="margin-bottom: 0.4rem;">Size ${item.size}</div>
                <div class="cart-item-qty" style="display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border); border-radius: var(--radius-full); width: fit-content; padding: 0.2rem 0.5rem;">
                    <button type="button" style="background:none;border:none;cursor:pointer;font-size:1.1rem;color:var(--text-secondary);line-height:1;" onclick="updateQuantity(${index}, -1)">-</button>
                    <span style="font-size:0.85rem;font-weight:600;min-width:1rem;text-align:center;">${item.quantity}</span>
                    <button type="button" style="background:none;border:none;cursor:pointer;font-size:1.1rem;color:var(--text-secondary);line-height:1;" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between;">
                <button class="cart-item-remove" onclick="removeFromCart(${index})" aria-label="Remove ${item.name}">✕</button>
                <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        </div>`;
    });
    cartItemsEl.innerHTML = html;
}

// Promo Code Logic
document.getElementById('applyPromoBtn').addEventListener('click', () => {
    const code = document.getElementById('promoCodeInput').value.trim().toUpperCase();
    if (code === 'WELCOME10') {
        promoDiscount = 0.10;
        showToast('Promo code applied!', 'success');
        renderCart();
    } else if (code) {
        showToast('Invalid promo code', 'error');
    }
});

document.getElementById('modalAddToCart').addEventListener('click', () => {
    if (!activeProductToBuy) return;
    if (!validateSize()) return;
    
    addToCart(activeProductToBuy, selectedSize);
    
    productOverlay.classList.remove('active');
    document.getElementById('cartOverlay').classList.add('active');
    document.getElementById('cartSidebar').classList.add('active');
});

document.getElementById('cartBtn').addEventListener('click', () => {
    document.getElementById('cartOverlay').classList.add('active');
    document.getElementById('cartSidebar').classList.add('active');
});

const closeCart = () => {
    document.getElementById('cartOverlay').classList.remove('active');
    document.getElementById('cartSidebar').classList.remove('active');
};
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

document.getElementById('clearCartBtn').addEventListener('click', () => {
    clearCart();
    showToast('Cart cleared', 'info');
});

// --- 4. Size Selector Logic ---
sizeGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('size-btn')) {
        sizeGrid.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedSize = e.target.textContent;
        sizeError.classList.remove('visible');
    }
});

function validateSize() {
    if (!selectedSize) {
        sizeError.classList.add('visible');
        sizeGrid.classList.add('shake');
        setTimeout(() => sizeGrid.classList.remove('shake'), 400);
        return false;
    }
    return true;
}

// --- 5. Mobile Nav ---
hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('active');
    hamburgerBtn.textContent = isOpen ? '✕' : '☰';
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
});

mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        hamburgerBtn.textContent = '☰';
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
});

// --- 6. Search Functionality ---
function setupSearch(inputId, resultsId) {
    const input = document.getElementById(inputId);
    const results = document.getElementById(resultsId);
    if (!input || !results) return;

    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        results.innerHTML = '';
        if (!term) {
            results.style.display = 'none';
            return;
        }
        const matches = products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
        );
        if (matches.length > 0) {
            results.style.display = 'flex';
            matches.forEach(match => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.innerHTML = `<span>${match.name}</span><span style="color:var(--text-secondary)">${match.category}</span>`;
                div.onclick = () => {
                    openProductModal(match.id);
                    results.style.display = 'none';
                    input.value = '';
                    if (mobileNav.classList.contains('active')) {
                        mobileNav.classList.remove('active');
                        hamburgerBtn.textContent = '☰';
                    }
                };
                results.appendChild(div);
            });
        } else {
            results.style.display = 'flex';
            results.innerHTML = `<div class="search-result-item" style="color:var(--text-secondary)">No shoes found.</div>`;
        }
    });
}
setupSearch('searchInput', 'searchResults');
setupSearch('mobileSearchInput', 'mobileSearchResults');

// --- 7. Product Details Modal (Gallery, Reviews, Cross-sell) ---
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    activeProductToBuy = product;
    
    selectedSize = null; 
    sizeGrid.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected')); 
    sizeError.classList.remove('visible');

    const modalImg = document.getElementById('modalImg');
    modalImg.src = product.img;
    document.getElementById('modalName').innerText    = product.name;
    document.getElementById('modalCat').innerText     = product.category;
    document.getElementById('modalPrice').innerText   = `$${product.price}`;
    document.getElementById('modalDesc').innerText    = product.desc;
    document.getElementById('modalMaterial').innerText = product.materials;
    document.getElementById('modalFit').innerText      = product.fit;
    document.getElementById('modalFeatures').innerText = product.features;
    document.getElementById('modalRating').innerText   = `★ ${product.rating.toFixed(1)} (${product.reviewsCount} reviews)`;

    // Render Gallery
    const gallery = document.getElementById('modalGallery');
    let galHtml = '';
    product.images.forEach((img, idx) => {
        galHtml += `<div class="gallery-thumb ${idx===0 ? 'active':''}" onclick="setMainImg('${img}', this)">
                        <img src="${img}" alt="Thumbnail">
                    </div>`;
    });
    gallery.innerHTML = galHtml;

    // Render Reviews
    const reviewsBox = document.getElementById('modalReviews');
    let revHtml = '';
    product.reviews.forEach(r => {
        let stars = '';
        for(let i=0; i<5; i++) { stars += (i < r.rating) ? '★' : '☆'; }
        revHtml += `
            <div class="review-mock">
                <div class="review-author">${r.author}</div>
                <div class="review-stars">${stars}</div>
                <div>${r.text}</div>
            </div>
        `;
    });
    reviewsBox.innerHTML = revHtml;

    // Render Related Products (Cross-sell)
    const relatedGrid = document.getElementById('relatedProductsGrid');
    const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
    let relHtml = '';
    related.forEach(p => {
        relHtml += `
            <div class="product-card" onclick="openProductModal('${p.id}')" style="cursor:pointer; padding: 1rem;">
                <div class="product-img" style="margin-bottom: 0.5rem; padding: 1rem;"><img src="${p.img}" alt="${p.name}"></div>
                <div class="product-name" style="font-size: 0.95rem;">${p.name}</div>
                <div class="product-price" style="font-size: 0.95rem;">$${p.price}</div>
            </div>
        `;
    });
    relatedGrid.innerHTML = relHtml;

    productOverlay.classList.add('active');
}

window.setMainImg = function(src, el) {
    document.getElementById('modalImg').src = src;
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

document.querySelectorAll('.view-product-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('[data-id]');
        if (card) openProductModal(card.getAttribute('data-id'));
    });
});

document.getElementById('closeProductModal').addEventListener('click', () => {
    productOverlay.classList.remove('active');
});

// --- 8. Category Filtering & Sorting ---
function renderCategoryGrid(filtered) {
    const grid = document.getElementById('categoryModalGrid');
    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1;font-size:1.2rem;">More styles dropping soon.</p>`;
        return;
    }
    let html = '';
    filtered.forEach(p => {
        html += `
            <div class="product-card" data-id="${p.id}" onclick="openProductModal('${p.id}')">
                <div class="product-img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
                <div class="product-info">
                    <div>
                        <div class="product-name">${p.name}</div>
                        <div class="product-rating">★ ${p.rating.toFixed(1)}</div>
                        <div class="product-cat">${p.category}</div>
                    </div>
                    <div class="product-price">$${p.price}</div>
                </div>
                <button class="btn btn-secondary" style="width:100%">View Details</button>
            </div>
        `;
    });
    grid.innerHTML = html;
}

function openCategoryModal(category) {
    currentCategoryFilter = category;
    document.getElementById('categoryModalTitle').innerText = `${category} Collection`;
    document.getElementById('sortSelect').value = 'featured'; // reset
    
    const filtered = products.filter(p => p.category === category);
    renderCategoryGrid(filtered);
    categoryOverlay.classList.add('active');
}

document.getElementById('sortSelect').addEventListener('change', (e) => {
    const sortType = e.target.value;
    let filtered = products.filter(p => p.category === currentCategoryFilter);
    
    if (sortType === 'price-asc') {
        filtered.sort((a,b) => a.price - b.price);
    } else if (sortType === 'price-desc') {
        filtered.sort((a,b) => b.price - a.price);
    } else if (sortType === 'name-asc') {
        filtered.sort((a,b) => a.name.localeCompare(b.name));
    }
    // 'featured' maintains default array order

    renderCategoryGrid(filtered);
});

document.querySelectorAll('.filter-category').forEach(card => {
    card.addEventListener('click', (e) => {
        e.stopPropagation();
        const category = card.getAttribute('data-category');
        if (category) openCategoryModal(category);
    });
});

document.getElementById('closeCategoryModal').addEventListener('click', () => {
    categoryOverlay.classList.remove('active');
    document.getElementById('categoryModalGrid').innerHTML = '';
    document.getElementById('categoryModalTitle').innerText = '';
    currentCategoryFilter = null;
});

// --- 9. Checkout Flow & Strict Validation ---
// Card Number formatting (add space every 4 digits)
document.getElementById('ccNum').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for(let i=0; i<value.length; i++) {
        if(i > 0 && i % 4 === 0) formatted += ' ';
        formatted += value[i];
    }
    e.target.value = formatted;
});

// Expiry formatting (add slash)
document.getElementById('ccExp').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.substring(0,2) + '/' + value.substring(2,4);
    }
    e.target.value = value;
});

function openCheckoutModal(amount) {
    productOverlay.classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
    document.getElementById('cartSidebar').classList.remove('active');

    document.getElementById('checkoutTotalDisplay').innerText = amount.toFixed(2);
    checkoutOverlay.classList.add('active');
}

document.querySelectorAll('.trigger-checkout').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        let checkoutAmount = 0;
        isBuyNowCheckout = false;

        if (e.target.id === 'modalBuyNow' && activeProductToBuy) {
            if (!validateSize()) return;
            checkoutAmount = activeProductToBuy.price;
            isBuyNowCheckout = true;
        } else {
            const parentWithId = e.target.closest('[data-id]');
            if (parentWithId) {
                const product = products.find(p => p.id === parentWithId.getAttribute('data-id'));
                if (product) checkoutAmount = product.price;
            } else if (getCartTotal() > 0) {
                // Apply promo discount if any
                let total = getCartTotal();
                checkoutAmount = total - (total * promoDiscount);
            } else {
                document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }

        openCheckoutModal(checkoutAmount);
    });
});

document.getElementById('closeCheckoutModal').addEventListener('click', () => {
    checkoutOverlay.classList.remove('active');
});

document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('checkoutFormContent').style.display = 'none';
    const successEl = document.getElementById('checkoutSuccess');
    successEl.classList.add('active');
    
    // Only clear cart if this wasn't a direct "Buy Now" checkout
    if (!isBuyNowCheckout) {
        clearCart();
    }
    
    showToast('Order placed successfully!', 'success');
    setTimeout(() => {
        checkoutOverlay.classList.remove('active');
        successEl.classList.remove('active');
        document.getElementById('checkoutFormContent').style.display = 'block';
        e.target.reset();
    }, 4000);
});

// --- 10. Close Modals (Click Outside & Escape) ---
productOverlay.addEventListener('click', (e) => {
    if (e.target === productOverlay) productOverlay.classList.remove('active');
});

categoryOverlay.addEventListener('click', (e) => {
    if (e.target === categoryOverlay) {
        categoryOverlay.classList.remove('active');
        document.getElementById('categoryModalGrid').innerHTML = '';
        document.getElementById('categoryModalTitle').innerText = '';
    }
});

checkoutOverlay.addEventListener('click', (e) => {
    if (e.target === checkoutOverlay) checkoutOverlay.classList.remove('active');
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (checkoutOverlay.classList.contains('active')) {
            checkoutOverlay.classList.remove('active');
            document.getElementById('checkoutSuccess').classList.remove('active');
            document.getElementById('checkoutFormContent').style.display = 'block';
        } else if (productOverlay.classList.contains('active')) {
            productOverlay.classList.remove('active');
        } else if (categoryOverlay.classList.contains('active')) {
            categoryOverlay.classList.remove('active');
            document.getElementById('categoryModalGrid').innerHTML = '';
            document.getElementById('categoryModalTitle').innerText = '';
            currentCategoryFilter = null;
        } else if (document.getElementById('cartSidebar').classList.contains('active')) {
            closeCart();
        } else if (mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            hamburgerBtn.textContent = '☰';
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    }
});

// --- 11. FAQ Accordion ---
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// --- 12. Newsletter ---
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Welcome to Bedre! Check your inbox for 10% off.', 'success');
    e.target.reset();
});

// --- 13. Reveal Animations & Global Events ---
window.addEventListener('load', () => {
    loadCart();
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        header.style.padding   = '0.8rem 0';
    } else {
        header.style.boxShadow = 'none';
        header.style.padding   = '1.2rem 0';
    }
    
    if (window.scrollY > window.innerHeight) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
