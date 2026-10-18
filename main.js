// =============================================================
// WEB3FORMS SETUP — Free, No Library, No Backend Required
// =============================================================
// HOW TO ACTIVATE (takes 2 minutes):
//  1. Go to  https://web3forms.com
//  2. Enter  hamdantahir7759@gmail.com  and click "Create Access Key"
//  3. Copy the key from your Gmail inbox and paste it below
// =============================================================
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

// --- Product Data ---
const products = [
    {
        id: 'office-men',
        name: 'OFFICE MEN',
        price: 1000,
        image: 'images/Office men.jpeg',
        description: 'A commanding blend of crisp citrus and sharp woods. Designed for the modern professional to exude confidence and authority.'
    },
    {
        id: 'white-oud',
        name: 'WHITE OUD',
        price: 1000,
        image: 'images/White Oud.jpeg',
        description: 'An ethereal, pure take on traditional oud, softened with delicate floral notes and a warm amber base. True luxury.'
    },
    {
        id: 'azure',
        name: 'AZURE',
        price: 1000,
        image: 'images/Azure.jpeg',
        description: 'A fresh, aquatic masterpiece that captures the endless horizon and the deep blue of the ocean. Refreshing and timeless.'
    },
    {
        id: 'trio-pack',
        name: 'PACK OF 3 (TRIO BUNDLE)',
        price: 2500,
        image: 'images/pack of 3 (2).png',
        description: 'Special luxury bundle featuring all 3 signature NOIRE fragrances: OFFICE MEN, WHITE OUD, and AZURE (100ml each).'
    }
];

// --- State ---
let cart = [];

// --- DOM Elements ---
const featuredProductsContainer = document.getElementById('featuredProducts');
const modalsContainer = document.getElementById('modalsContainer');
const cartToggleBtn = document.getElementById('cartToggle');
const closeCartBtn = document.getElementById('closeCart');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountSpan = document.getElementById('cartCount');
const cartTotalValue = document.getElementById('cartTotalValue');
const checkoutBtn = document.getElementById('checkoutBtn');

// Checkout DOM
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutBtn = document.getElementById('closeCheckout');
const checkoutItemsList = document.getElementById('checkoutItemsList');
const checkoutSubtotal = document.getElementById('checkoutSubtotal');
const checkoutGrandTotal = document.getElementById('checkoutGrandTotal');
const checkoutForm = document.getElementById('checkoutForm');

// Success DOM
const successModal = document.getElementById('successModal');
const closeSuccessBtn = document.getElementById('closeSuccess');
const successOrderId = document.getElementById('successOrderId');
const finishOrderBtn = document.getElementById('finishOrderBtn');

// --- Initialization ---
function init() {
    // Reset scroll position to top (#home) on page refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }

    renderProducts();
    renderModals();
    setupCartToggle();
    setupCheckout();
    setupContactForm();
    setupCollectionTabs();
    setupScrollAnimations();
    setupFAQ();
    initHeroCanvas();
}

// --- Render Functions ---
function renderProducts() {
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in-up';
        card.innerHTML = `
            <div class="product-image-container" onclick="openModal('${product.id}')">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">Rs. ${product.price.toLocaleString()}</p>
                <div class="product-actions">
                    <button class="cta-btn outline-btn" onclick="openModal('${product.id}')">Details</button>
                    <button class="cta-btn primary-btn" onclick="addToCart('${product.id}', 1)">Add to Cart</button>
                </div>
            </div>
        `;
        featuredProductsContainer.appendChild(card);
    });
}

function renderModals() {
    products.forEach(product => {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = `modal-${product.id}`;
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal('${product.id}')">&times;</button>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="modal-details">
                        <h2>${product.name}</h2>
                        <p class="price" id="modal-price-${product.id}">Rs. ${product.price.toLocaleString()}</p>
                        <p class="description">${product.description}</p>
                        
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="updateModalQty('${product.id}', -1)">-</button>
                            <input type="text" class="quantity-input" id="modal-qty-${product.id}" value="1" readonly>
                            <button class="quantity-btn" onclick="updateModalQty('${product.id}', 1)">+</button>
                        </div>
                        
                        <button class="cta-btn primary-btn" style="width: 100%" onclick="addFromModal('${product.id}')">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        modalsContainer.appendChild(modal);

        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(product.id);
        });
    });
}

// --- Modal Logic ---
function openModal(productId) {
    const modal = document.getElementById(`modal-${productId}`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(productId) {
    const modal = document.getElementById(`modal-${productId}`);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset quantity back to 1 and price on close
        const product = products.find(p => p.id === productId);
        document.getElementById(`modal-qty-${productId}`).value = 1;
        if (product) {
            document.getElementById(`modal-price-${productId}`).textContent = `Rs. ${product.price.toLocaleString()}`;
        }
    }
}

function updateModalQty(productId, change) {
    const input = document.getElementById(`modal-qty-${productId}`);
    let qty = parseInt(input.value) + change;
    if (qty < 1) qty = 1;
    input.value = qty;

    const product = products.find(p => p.id === productId);
    if (product) {
        const modalPrice = document.getElementById(`modal-price-${productId}`);
        if (modalPrice) {
            modalPrice.textContent = `Rs. ${(product.price * qty).toLocaleString()}`;
        }
    }
}

function addFromModal(productId) {
    const input = document.getElementById(`modal-qty-${productId}`);
    const qty = parseInt(input.value);
    addToCart(productId, qty);
    closeModal(productId);
    openCart();
}

// --- Cart Logic ---
function setupCartToggle() {
    cartToggleBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
}

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    updateCartUI();
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartQty(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;

    // Update items display
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
    } else {
        cart.forEach(item => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">Rs. ${(item.price * item.quantity).toLocaleString()} <span style="font-size: 0.8rem; opacity: 0.7;">(Rs. ${item.price.toLocaleString()} ea)</span></div>
                    <div class="cart-item-actions">
                        <div class="quantity-selector" style="margin-bottom: 0;">
                            <button class="quantity-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
                            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(el);
        });
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalValue.textContent = `Rs. ${total.toLocaleString()}`;
}

// --- Checkout & Order Flow ---
function setupCheckout() {
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your shopping cart is empty. Please add a fragrance first!');
                return;
            }
            closeCart();
            openCheckoutModal();
        });
    }

    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
    }

    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) closeCheckoutModal();
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            processOrder();
        });
    }

    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeSuccessModal);
    if (finishOrderBtn) finishOrderBtn.addEventListener('click', closeSuccessModal);
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) closeSuccessModal();
        });
    }
}

function openCheckoutModal() {
    renderCheckoutSummary();
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
}

function renderCheckoutSummary() {
    checkoutItemsList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('div');
        row.className = 'checkout-item-row';
        row.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <strong>Rs. ${itemTotal.toLocaleString()}</strong>
        `;
        checkoutItemsList.appendChild(row);
    });

    checkoutSubtotal.textContent = `Rs. ${total.toLocaleString()}`;
    checkoutGrandTotal.textContent = `Rs. ${total.toLocaleString()}`;
}

function processOrder() {
    const orderRef = `#NOIRE-${Math.floor(100000 + Math.random() * 900000)}`;
    if (successOrderId) successOrderId.textContent = orderRef;

    // --- Collect customer details ---
    const custName      = document.getElementById('custName').value.trim();
    const custEmail     = document.getElementById('custEmail').value.trim();
    const custPhone     = document.getElementById('custPhone').value.trim();
    const custAddress   = document.getElementById('custAddress').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value === 'cod'
        ? 'Cash on Delivery (COD)'
        : 'Online Transfer / Card';

    // --- Build email body ---
    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemLines  = cart.map(item =>
        `\u2022 ${item.name}  x${item.quantity}  \u2014  Rs. ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');
    const orderDate = new Date().toLocaleString('en-PK', { dateStyle: 'full', timeStyle: 'short' });

    const emailBody = [
        '\uD83D\uDECD\uFE0F  NEW ORDER RECEIVED \u2014 NOIRE Luxury Fragrances',
        '',
        `Order Reference : ${orderRef}`,
        `Order Date      : ${orderDate}`,
        '',
        '\u2501'.repeat(36),
        'CUSTOMER DETAILS',
        '\u2501'.repeat(36),
        `Name            : ${custName}`,
        `Email           : ${custEmail}`,
        `Phone           : ${custPhone}`,
        `Shipping Address: ${custAddress}`,
        '',
        '\u2501'.repeat(36),
        'ORDER ITEMS',
        '\u2501'.repeat(36),
        itemLines,
        '',
        `GRAND TOTAL     : Rs. ${orderTotal.toLocaleString()}`,
        `Payment Method  : ${paymentMethod}`,
        '',
        '\u2501'.repeat(36),
        'Sent automatically by the NOIRE website.'
    ].join('\n');

    // --- Send to Gmail via Web3Forms (no library, no backend) ---
    if (WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
        fetch('https://api.web3forms.com/submit', {
            method  : 'POST',
            headers : { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body    : JSON.stringify({
                access_key : WEB3FORMS_ACCESS_KEY,
                subject    : `\uD83D\uDECD\uFE0F New NOIRE Order ${orderRef} \u2014 Rs. ${orderTotal.toLocaleString()}`,
                message    : emailBody,
                from_name  : `NOIRE Store \u2014 ${custName}`,
                replyto    : custEmail
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log('[NOIRE] \u2705 Order email sent to hamdantahir7759@gmail.com');
            } else {
                console.error('[NOIRE] Web3Forms error:', data.message);
            }
        })
        .catch(err => console.error('[NOIRE] Network error:', err));
    } else {
        console.warn('[NOIRE] \u26A0\uFE0F  Paste your Web3Forms key into WEB3FORMS_ACCESS_KEY in main.js');
    }

    closeCheckoutModal();

    // Reset form & cart
    if (checkoutForm) checkoutForm.reset();
    cart = [];
    updateCartUI();

    // Show success modal
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
}

// --- Scroll Animations (Intersection Observer) ---
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once visible
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

// --- FAQ Accordion ---
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-question');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.parentElement;
            parent.classList.toggle('active');
        });
    });
}

// --- Hero Background Canvas Particle Mist Animation ---
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.2 + 0.6,
            color: Math.random() > 0.35 ? '#C8A45D' : '#F4F1E8',
            alpha: Math.random() * 0.5 + 0.15,
            speedY: - (Math.random() * 0.4 + 0.15),
            speedX: (Math.random() - 0.5) * 0.25,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.008
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.pulse += p.pulseSpeed;

            const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.15;

            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#C8A45D';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// --- Contact Form Animation ---
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    const contactSuccessBox = document.getElementById('contactSuccessBox');
    const resetContactBtn = document.getElementById('resetContactBtn');
    const closeContactSuccessBtn = document.getElementById('closeContactSuccess');

    function resetFormView() {
        contactSuccessBox.classList.remove('active');
        if (contactForm) contactForm.reset();
        setTimeout(() => {
            if (contactForm) contactForm.classList.remove('hidden');
        }, 250);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactForm.classList.add('hidden');
            setTimeout(() => {
                contactSuccessBox.classList.add('active');
            }, 250);
        });
    }

    if (resetContactBtn) resetContactBtn.addEventListener('click', resetFormView);
    if (closeContactSuccessBtn) closeContactSuccessBtn.addEventListener('click', resetFormView);
}

// --- Olfactory Collection Showcase ---
const collectionDetails = {
    'office-men': {
        id: 'office-men',
        name: 'OFFICE MEN',
        subtitle: 'Eau de Parfum • 100ml',
        price: 1000,
        image: 'images/Office men.jpeg',
        description: 'A commanding, sophisticated blend designed for executives and modern professionals. Opens with crisp bergamot and settles into intense cedarwood.',
        topNotes: ['Bergamot', 'Grapefruit', 'Crisp Apple'],
        heartNotes: ['Lavender', 'Geranium', 'Pink Pepper'],
        baseNotes: ['Cedarwood', 'Vetiveryl', 'Rich Amber']
    },
    'white-oud': {
        id: 'white-oud',
        name: 'WHITE OUD',
        subtitle: 'Eau de Parfum • 100ml',
        price: 1000,
        image: 'images/White Oud.jpeg',
        description: 'An ethereal, luminous take on traditional Middle Eastern oud. Blended with delicate white florals and warm golden amber for pure luxury.',
        topNotes: ['White Rose', 'Bergamot', 'Saffron'],
        heartNotes: ['Jasmine', 'Cashmere Wood', 'Patchouli'],
        baseNotes: ['White Oud', 'Golden Amber', 'Musk']
    },
    'azure': {
        id: 'azure',
        name: 'AZURE',
        subtitle: 'Eau de Parfum • 100ml',
        price: 1000,
        image: 'images/Azure.jpeg',
        description: 'A fresh, invigorating aquatic masterpiece that captures the endless blue horizon and deep ocean breezes. Clean, vibrant, and alluring.',
        topNotes: ['Sea Breeze', 'Calabrian Lime', 'Melon'],
        heartNotes: ['Neroli', 'Ocean Breeze', 'Cardamom'],
        baseNotes: ['Driftwood', 'Ambroxan', 'White Musk']
    },
    'trio-pack': {
        id: 'trio-pack',
        name: 'PACK OF 3 (TRIO BUNDLE)',
        subtitle: 'Special Bundle Edition • 3 x 100ml Bottles',
        price: 2500,
        image: 'images/pack of 3 (2).png',
        description: 'Experience the complete NOIRE fragrance trilogy. Includes full 100ml bottles of OFFICE MEN, WHITE OUD, and AZURE presented together in an exclusive signature offer.',
        topNotes: ['Crisp Citrus', 'White Rose', 'Ocean Breeze'],
        heartNotes: ['Lavender', 'Jasmine', 'Neroli'],
        baseNotes: ['Cedarwood', 'White Oud', 'Ambroxan']
    }
};

function setupCollectionTabs() {
    const tabBtns = document.querySelectorAll('.collection-tab-btn');
    const displayCard = document.getElementById('collectionDisplayCard');
    if (!displayCard) return;

    function renderFragranceShowcase(fragranceId) {
        const item = collectionDetails[fragranceId];
        if (!item) return;

        displayCard.innerHTML = `
            <div class="showcase-img-container">
                <img src="${item.image}" alt="${item.name}" class="showcase-img">
            </div>
            <div class="showcase-details">
                <div class="showcase-header">
                    <h3>${item.name}</h3>
                    <p class="showcase-subtitle">${item.subtitle}</p>
                </div>
                <div class="showcase-price">Rs. ${item.price.toLocaleString()}</div>
                <p class="showcase-desc">${item.description}</p>
                
                <div class="notes-pyramid">
                    <div class="note-group">
                        <span class="note-label">Top Notes</span>
                        <div class="note-tags">${item.topNotes.map(n => `<span class="note-tag">${n}</span>`).join('')}</div>
                    </div>
                    <div class="note-group">
                        <span class="note-label">Heart</span>
                        <div class="note-tags">${item.heartNotes.map(n => `<span class="note-tag">${n}</span>`).join('')}</div>
                    </div>
                    <div class="note-group">
                        <span class="note-label">Base Notes</span>
                        <div class="note-tags">${item.baseNotes.map(n => `<span class="note-tag">${n}</span>`).join('')}</div>
                    </div>
                </div>

                <div class="showcase-actions">
                    <button class="cta-btn primary-btn" onclick="addToCart('${item.id}', 1)">Add to Cart</button>
                    <button class="cta-btn outline-btn" onclick="openModal('${item.id}')">View Details</button>
                </div>
            </div>
        `;
    }

    // Initial render
    renderFragranceShowcase('office-men');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const fragranceId = btn.getAttribute('data-fragrance');
            renderFragranceShowcase(fragranceId);
        });
    });
}

// Run init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', () => {
    setTimeout(() => window.scrollTo(0, 0), 10);
});
