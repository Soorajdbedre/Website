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
function getCartCount() { return cartItems.length; }
function getCartTotal() { return cartItems.reduce((sum, item) => sum + item.price, 0); }

function saveCart() { localStorage.setItem('bedreCart', JSON.stringify(cartItems)); }

function loadCart() {
    const saved = localStorage.getItem('bedreCart');
    if (saved) { cartItems = JSON.parse(saved); renderCart(); }
}

function addToCart(product, size) {
    cartItems.push({ id: product.id, name: product.name, price: product.price, size: size, img: product.img });
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

function clearCart() {
    cartItems = [];
    saveCart();
    renderCart();
}

function renderCart() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartCountDisplay = document.getElementById('cartCountDisplay');
    const cartTotalEl = document.getElementById('cartTotal');
    const count = getCartCount();
    const total = getCartTotal();
    
    cartCountDisplay.innerText = `(${count})`;
    cartTotalEl.innerText = total;
    
    if (count === 0) {
        cartItemsEl.innerHTML = '<p class="empty-cart-msg">Your cart is currently empty.</p>';
        return;
    }
    
    let html = '';
    cartItems.forEach((item, index) => {
        html += `<div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-size">Size ${item.size}</div>
            </div>
            <span class="cart-item-price">$${item.price}</span>
            <button class="cart-item-remove" onclick="removeFromCart(${index})" aria-label="Remove ${item.name}">✕</button>
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
const searchInput   = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    searchResults.innerHTML = '';

    if (!term) {
        searchResults.style.display = 'none';
        return;
    }

    const matches = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );

    if (matches.length > 0) {
        searchResults.style.display = 'flex';
        matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `<span>${match.name}</span><span style="color:var(--text-secondary)">${match.category}</span>`;
            div.onclick = () => {
                openProductModal(match.id);
                searchResults.style.display = 'none';
                searchInput.value = '';
            };
            searchResults.appendChild(div);
        });
    } else {
        searchResults.style.display = 'flex';
        searchResults.innerHTML = `<div class="search-result-item" style="color:var(--text-secondary)">No shoes found.</div>`;
    }
});

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

        if (e.target.id === 'modalBuyNow' && activeProductToBuy) {
            if (!validateSize()) return;
            addToCart(activeProductToBuy, selectedSize);
            checkoutAmount = activeProductToBuy.price;
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
    clearCart();
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

// --- 11. Newsletter ---
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Welcome to Bedre! Check your inbox for 10% off.', 'success');
    e.target.reset();
});

// --- 12. Reveal Animations & Global Events ---
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
