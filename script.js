// --- 1. Product Database (Source of Truth) ---
const products = [
    { id: 'nova', name: 'Bedre Nova', category: 'Running', price: 165, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600', desc: 'Lightweight performance runner built for speed and endurance.', materials: 'AeroWeave Mesh, Recycled Rubber', fit: 'True to Size, Snug heel', features: 'Marathons, Daily Jogs' },
    { id: 'arc', name: 'Bedre Arc', category: 'Lifestyle', price: 140, img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=600', desc: 'The ultimate everyday shoe. Minimalist aesthetic with maximum comfort.', materials: 'Organic Cotton, CloudFoam', fit: 'Slightly wide, roomy toe box', features: 'Office wear, City Walking' },
    { id: 'core', name: 'Bedre Core', category: 'Casual', price: 125, img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600', desc: 'A stripped-down classic. Essential design for an uncomplicated wardrobe.', materials: 'Vegan Leather, EVA sole', fit: 'True to size', features: 'Weekend outings, Casual fridays' },
    { id: 'aura', name: 'Bedre Aura', category: 'Running', price: 170, img: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=600', desc: 'High-rebound cushioning that turns impact into forward momentum.', materials: 'Knit fabric, Kinetic Foam', fit: 'Snug performance fit', features: 'Track running, High-impact sports' },
    { id: 'luna', name: 'Bedre Luna', category: 'Lifestyle', price: 145, img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=600', desc: 'Sleek slip-on design for people on the move.', materials: 'Stretchy Neoprene', fit: 'Molds to foot shape', features: 'Travel, Everyday errands' },
    { id: 'zenith', name: 'Bedre Zenith', category: 'Casual', price: 130, img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600', desc: 'Retro-inspired lines packed with modern orthopedic support.', materials: 'Suede accents, Rubberized mesh', fit: 'Runs half-size large', features: 'All-day standing, Casual events' },
    { id: 'apex', name: 'Bedre Apex Pro', category: 'Performance', price: 185, img: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800', desc: 'Our flagship model. Carbon-infused plate for elite athletic output.', materials: 'Carbon Fiber, Zero-Gravity Foam', fit: 'Lockdown fit, precise length', features: 'Competitive racing, CrossFit' }
];

// --- 2. State & DOM Elements ---
let cartCount = 0;
let cartTotal = 0;
let activeProductToBuy = null; // Stores what product is currently viewed

// Modals
const productOverlay = document.getElementById('productOverlay');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const categoryOverlay = document.getElementById('categoryOverlay');

// --- 3. Search Functionality ---
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    searchResults.innerHTML = '';
    
    if (!term) {
        searchResults.style.display = 'none';
        return;
    }

    const matches = products.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
    
    if (matches.length > 0) {
        searchResults.style.display = 'flex';
        matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `<span>${match.name}</span> <span style="color:var(--text-secondary)">${match.category}</span>`;
            div.onclick = () => {
                openProductModal(match.id);
                searchResults.style.display = 'none';
                searchInput.value = '';
            };
            searchResults.appendChild(div);
        });
    } else {
        searchResults.style.display = 'flex';
        searchResults.innerHTML = `<div class="search-result-item" style="color: var(--text-secondary)">No shoes found.</div>`;
    }
});

// --- 4. Product Details Modal Logic ---
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    activeProductToBuy = product;

    document.getElementById('modalImg').src = product.img;
    document.getElementById('modalName').innerText = product.name;
    document.getElementById('modalCat').innerText = product.category;
    document.getElementById('modalPrice').innerText = `$${product.price}`;
    document.getElementById('modalDesc').innerText = product.desc;
    document.getElementById('modalMaterial').innerText = product.materials;
    document.getElementById('modalFit').innerText = product.fit;
    document.getElementById('modalFeatures').innerText = product.features;

    productOverlay.classList.add('active');
}

// Attach to all "View Product" buttons
document.querySelectorAll('.view-product-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('[data-id]');
        if(card) openProductModal(card.getAttribute('data-id'));
    });
});

document.getElementById('closeProductModal').addEventListener('click', () => {
    productOverlay.classList.remove('active');
});

// --- 5. Category Filtering View ---
document.querySelectorAll('.filter-category').forEach(card => {
    card.addEventListener('click', (e) => {
        const category = e.currentTarget.getAttribute('data-category');
        document.getElementById('categoryModalTitle').innerText = `${category} Collection`;
        
        const grid = document.getElementById('categoryModalGrid');
        grid.innerHTML = ''; // Clear previous
        
        const filtered = products.filter(p => p.category === category);
        
        if (filtered.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; font-size: 1.2rem;">More ${category} styles dropping soon.</p>`;
        } else {
            filtered.forEach(p => {
                grid.innerHTML += `
                    <div class="product-card" data-id="${p.id}" onclick="openProductModal('${p.id}')">
                        <div class="product-img"><img src="${p.img}" alt="${p.name}"></div>
                        <div class="product-info">
                            <div><div class="product-name">${p.name}</div><div class="product-cat">${p.category}</div></div>
                            <div class="product-price">$${p.price}</div>
                        </div>
                        <button class="btn btn-secondary" style="width: 100%">View Details</button>
                    </div>
                `;
            });
        }
        categoryOverlay.classList.add('active');
    });
});

document.getElementById('closeCategoryModal').addEventListener('click', () => {
    categoryOverlay.classList.remove('active');
});

// --- 6. Checkout Flow ---
function openCheckoutModal(amount) {
    // Hide other modals to keep UI clean
    productOverlay.classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
    document.getElementById('cartSidebar').classList.remove('active');
    
    document.getElementById('checkoutTotalDisplay').innerText = amount;
    checkoutOverlay.classList.add('active');
}

// Listen to all buttons that trigger checkout (Hero Shop Now, Buy Now inside Modal)
document.querySelectorAll('.trigger-checkout').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Determine total amount
        let checkoutAmount = 0;
        
        if (e.target.id === 'modalBuyNow' && activeProductToBuy) {
            // Buying a single item directly from the product view
            checkoutAmount = activeProductToBuy.price;
        } else if (cartTotal > 0) {
            // Checking out from the cart, or clicking "Shop Now" with items in cart
            checkoutAmount = cartTotal;
        } else {
            // Clicking "Shop Now" from Hero with an empty cart - redirect to view products instead
            document.getElementById('categories').scrollIntoView();
            return;
        }
        
        openCheckoutModal(checkoutAmount);
    });
});

document.getElementById('closeCheckoutModal').addEventListener('click', () => {
    checkoutOverlay.classList.remove('active');
});

document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Payment integration coming soon! Your order details have been received.');
    checkoutOverlay.classList.remove('active');
    e.target.reset();
});

// --- 7. Cart Logic ---
document.getElementById('modalAddToCart').addEventListener('click', () => {
    if(!activeProductToBuy) return;
    
    cartCount++;
    cartTotal += activeProductToBuy.price;
    
    document.getElementById('cartCountDisplay').innerText = `(${cartCount})`;
    document.getElementById('cartTotal').innerText = cartTotal;
    
    document.querySelector('.empty-cart-msg').style.display = 'none';
    document.getElementById('cartItems').innerHTML += `
        <div class="cart-item">
            <span>${activeProductToBuy.name}</span>
            <span>$${activeProductToBuy.price}</span>
        </div>
    `;
    
    // Close Product Modal, Open Cart
    productOverlay.classList.remove('active');
    document.getElementById('cartOverlay').classList.add('active');
    document.getElementById('cartSidebar').classList.add('active');
});

// Cart Toggle
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

// --- 8. Newsletter Alert ---
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('This is working!');
    e.target.reset();
});

// --- 9. Reveal Animations on Scroll ---
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
}
window.addEventListener("load", reveal);

// --- 10. Header Style on Scroll ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        header.style.padding = '0.8rem 0';
    } else {
        header.style.boxShadow = 'none';
        header.style.padding = '1.2rem 0';
    }
});