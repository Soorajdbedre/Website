// --- 1. Product Database (Source of Truth) ---
const products = [
    { id: 'nova',   name: 'Bedre Nova',     category: 'Running',     price: 165, img: 'shoe2.png', desc: 'Lightweight performance runner built for speed and endurance.',               materials: 'AeroWeave Mesh, Recycled Rubber',  fit: 'True to Size, Snug heel',      features: 'Marathons, Daily Jogs' },
    { id: 'arc',    name: 'Bedre Arc',      category: 'Lifestyle',   price: 140, img: 'shoe3.png', desc: 'The ultimate everyday shoe. Minimalist aesthetic with maximum comfort.',     materials: 'Organic Cotton, CloudFoam',        fit: 'Slightly wide, roomy toe box', features: 'Office wear, City Walking' },
    { id: 'core',   name: 'Bedre Core',     category: 'Casual',      price: 125, img: 'shoe4.png', desc: 'A stripped-down classic. Essential design for an uncomplicated wardrobe.',   materials: 'Vegan Leather, EVA sole',          fit: 'True to size',                 features: 'Weekend outings, Casual fridays' },
    { id: 'aura',   name: 'Bedre Aura',     category: 'Running',     price: 170, img: 'shoe5.png', desc: 'High-rebound cushioning that turns impact into forward momentum.',           materials: 'Knit fabric, Kinetic Foam',        fit: 'Snug performance fit',         features: 'Track running, High-impact sports' },
    { id: 'luna',   name: 'Bedre Luna',     category: 'Lifestyle',   price: 145, img: 'shoe6.png', desc: 'Sleek slip-on design for people on the move.',                              materials: 'Stretchy Neoprene',               fit: 'Molds to foot shape',          features: 'Travel, Everyday errands' },
    { id: 'zenith', name: 'Bedre Zenith',   category: 'Casual',      price: 130, img: 'shoe7.png', desc: 'Retro-inspired lines packed with modern orthopedic support.',               materials: 'Suede accents, Rubberized mesh',   fit: 'Runs half-size large',         features: 'All-day standing, Casual events' },
    { id: 'apex',   name: 'Bedre Apex Pro', category: 'Performance', price: 185, img: 'shoe8.png', desc: 'Our flagship model. Carbon-infused plate for elite athletic output.',       materials: 'Carbon Fiber, Zero-Gravity Foam', fit: 'Lockdown fit, precise length', features: 'Competitive racing, CrossFit' }
];

// --- 2. State & DOM Elements ---
let cartItems = [];
let selectedSize = null;
let activeProductToBuy = null;
let isBuyNowCheckout = false;

const productOverlay  = document.getElementById('productOverlay');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const categoryOverlay = document.getElementById('categoryOverlay');
const sizeGrid = document.getElementById('sizeGrid');
const sizeError = document.getElementById('sizeError');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');
const backToTop = document.getElementById('backToTop');

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
}

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
    saveCart();
    renderCart();
}

function renderCart() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartCountDisplay = document.getElementById('cartCountDisplay');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
    const count = getCartCount();
    const total = getCartTotal();
    
    cartCountDisplay.innerText = `(${count})`;
    cartTotalEl.innerText = total;
    
    if (count === 0) {
        cartItemsEl.innerHTML = `
            <div style="text-align:center; padding-top:3rem; color:var(--text-secondary);">
                <svg viewBox="0 0 24 24" style="width:64px;height:64px;margin-bottom:1rem;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;opacity:0.5;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <p style="margin-bottom: 1.5rem;">Your cart is feeling a bit light.</p>
                <button class="btn btn-secondary" onclick="closeCart(); document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });">Start Shopping</button>
            </div>
        `;
        document.getElementById('clearCartBtn').style.display = 'none';
        if(cartCheckoutBtn) {
            cartCheckoutBtn.disabled = true;
            cartCheckoutBtn.style.opacity = '0.5';
            cartCheckoutBtn.style.cursor = 'not-allowed';
        }
        return;
    }
    
    document.getElementById('clearCartBtn').style.display = 'block';
    if(cartCheckoutBtn) {
        cartCheckoutBtn.disabled = false;
        cartCheckoutBtn.style.opacity = '1';
        cartCheckoutBtn.style.cursor = 'pointer';
    }

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
                <span class="cart-item-price">$${item.price * item.quantity}</span>
            </div>
        </div>`;
    });
    cartItemsEl.innerHTML = html;
}

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

// --- 7. Product Details Modal ---
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    activeProductToBuy = product;
    
    selectedSize = null; 
    sizeGrid.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected')); 
    sizeError.classList.remove('visible');

    document.getElementById('modalImg').src           = product.img;
    document.getElementById('modalName').innerText    = product.name;
    document.getElementById('modalCat').innerText     = product.category;
    document.getElementById('modalPrice').innerText   = `$${product.price}`;
    document.getElementById('modalDesc').innerText    = product.desc;
    document.getElementById('modalMaterial').innerText = product.materials;
    document.getElementById('modalFit').innerText      = product.fit;
    document.getElementById('modalFeatures').innerText = product.features;

    productOverlay.classList.add('active');
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

// --- 8. Category Filtering View ---
function openCategoryModal(category) {
    document.getElementById('categoryModalTitle').innerText = `${category} Collection`;
    const grid = document.getElementById('categoryModalGrid');
    grid.innerHTML = '';
    const filtered = products.filter(p => p.category === category);

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1;font-size:1.2rem;">More ${category} styles dropping soon.</p>`;
    } else {
        let html = '';
        filtered.forEach(p => {
            html += `
                <div class="product-card" data-id="${p.id}" onclick="openProductModal('${p.id}')">
                    <div class="product-img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
                    <div class="product-info">
                        <div>
                            <div class="product-name">${p.name}</div>
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
    categoryOverlay.classList.add('active');
}

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
});

// --- 9. Checkout Flow ---
function openCheckoutModal(amount) {
    productOverlay.classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
    document.getElementById('cartSidebar').classList.remove('active');

    document.getElementById('checkoutTotalDisplay').innerText = amount;
    checkoutOverlay.classList.add('active');
}

document.querySelectorAll('.trigger-checkout').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        let checkoutAmount = 0;
        isBuyNowCheckout = false;

        if (e.target.id === 'modalBuyNow' && activeProductToBuy) {
            if (!validateSize()) return;
            // DO NOT ADD TO CART, just buy this item directly
            checkoutAmount = activeProductToBuy.price;
            isBuyNowCheckout = true;
        } else {
            const parentWithId = e.target.closest('[data-id]');
            if (parentWithId) {
                const product = products.find(p => p.id === parentWithId.getAttribute('data-id'));
                if (product) checkoutAmount = product.price;
            } else if (getCartTotal() > 0) {
                checkoutAmount = getCartTotal();
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
    }, 3000);
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
