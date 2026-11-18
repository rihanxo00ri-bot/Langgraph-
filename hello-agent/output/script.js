/* ==========================================================================
   KINETIX FOOTWEAR - INTERACTIVE APPLICATION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. PRODUCT DATABASE & STATE
    // --------------------------------------------------------------------------
    const PRODUCTS = [
        {
            id: 'prod-1',
            name: 'Hyper Velocity X1',
            category: 'running',
            categoryLabel: 'Performance Running',
            price: 219.00,
            rating: 4.9,
            reviewsCount: 142,
            badge: 'FLAGSHIP DROP',
            badgeClass: 'badge-hot',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
            description: 'Engineered with nitrogen-infused Nitro-Grid 2.0 foam and a curved 3K carbon plate for unprecedented propulsion and energy return.',
            techSpecs: ['210g Ultralight', '3K Carbon Plate', 'Nitro-Grid 2.0 Foam', 'Drop: 8mm'],
            colors: ['#ccff00', '#00f0ff', '#ff0055']
        },
        {
            id: 'prod-2',
            name: 'Cyber Matrix Runner',
            category: 'lifestyle',
            categoryLabel: 'Urban Lifestyle',
            price: 189.00,
            rating: 4.8,
            reviewsCount: 98,
            badge: 'BESTSELLER',
            badgeClass: '',
            image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
            description: 'Futuristic urban silhouette featuring a deconstructed mesh upper and dual-density shock absorbing heel chamber.',
            techSpecs: ['Deconstructed Upper', 'Gel Cushioning', 'Biomorphic Lock'],
            colors: ['#0f172a', '#f8fafc', '#3b82f6']
        },
        {
            id: 'prod-3',
            name: 'Terra Force Trail Pro',
            category: 'trail',
            categoryLabel: 'Trail & Outdoor',
            price: 205.00,
            rating: 4.9,
            reviewsCount: 76,
            badge: 'NEW RELEASE',
            badgeClass: 'badge-limited',
            image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80',
            description: 'Built to conquer alpine trails and wet terrain. Features waterproof RipStop outer weave and sticky GripMax lugs.',
            techSpecs: ['GripMax Outsole', 'Waterproof Membrane', 'Rock Protection Plate'],
            colors: ['#f97316', '#334155', '#ccff00']
        },
        {
            id: 'prod-4',
            name: 'Aero Glide Shift',
            category: 'running',
            categoryLabel: 'Performance Running',
            price: 175.00,
            rating: 4.7,
            reviewsCount: 115,
            badge: 'POPULAR',
            badgeClass: '',
            image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
            description: 'Daily mileage worker designed for plush comfort and effortless transition over long distances.',
            techSpecs: ['Max Cushioning', 'Breathable Knit', 'Reflective Accents'],
            colors: ['#8b5cf6', '#00f0ff', '#f8fafc']
        },
        {
            id: 'prod-5',
            name: 'Void Stealth 00',
            category: 'limited',
            categoryLabel: 'Limited Drop',
            price: 260.00,
            rating: 5.0,
            reviewsCount: 44,
            badge: 'LIMITED 500 PAIRS',
            badgeClass: 'badge-hot',
            image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
            description: 'Monochromatic obsidian edition with matte finish carbon fiber side walls and custom laser-engraved heel serial number.',
            techSpecs: ['Laser Serialized', 'Full Carbon Shell', 'Obsidian Rubber'],
            colors: ['#0f172a', '#1e293b']
        },
        {
            id: 'prod-6',
            name: 'Pulse Quantum Low',
            category: 'lifestyle',
            categoryLabel: 'Urban Lifestyle',
            price: 160.00,
            rating: 4.6,
            reviewsCount: 89,
            badge: '',
            badgeClass: '',
            image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
            description: 'Low-profile court sneaker upgraded with dynamic foam insert for all-day comfort and timeless street aesthetic.',
            techSpecs: ['Premium Nappa Leather', 'Memory Foam Insole', 'Vulcanized Outsole'],
            colors: ['#f8fafc', '#ff0055', '#ccff00']
        },
        {
            id: 'prod-7',
            name: 'Kinetix Apex Marathon',
            category: 'running',
            categoryLabel: 'Performance Running',
            price: 240.00,
            rating: 4.9,
            reviewsCount: 210,
            badge: 'WORLD RECORD TECH',
            badgeClass: 'badge-hot',
            image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
            description: 'Race-day legal super shoe tested with world class marathoners to yield maximum fatigue reduction over 42.2km.',
            techSpecs: ['Race Spec Carbon', 'Sub-200g Weight', 'Minimal Mesh Upper'],
            colors: ['#ccff00', '#00f0ff']
        },
        {
            id: 'prod-8',
            name: 'Nomad Horizon GTX',
            category: 'trail',
            categoryLabel: 'Trail & Outdoor',
            price: 195.00,
            rating: 4.8,
            reviewsCount: 63,
            badge: 'GORE-TEX SHIELD',
            badgeClass: 'badge-limited',
            image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80',
            description: 'Weatherproof high-top crossover designed for all-season trail explorations and wet urban commutes.',
            techSpecs: ['Gore-Tex Shield', 'High Ankle Support', 'Deep Lug Traction'],
            colors: ['#475569', '#f97316', '#0f172a']
        }
    ];

    // State Management
    let cart = [];
    let wishlist = new Set();
    let appliedPromo = false;
    let promoDiscountPercent = 0;
    const FREE_SHIPPING_THRESHOLD = 200.00;

    // Customizer State
    let customState = {
        activePart: 'upper',
        colors: {
            upper: '#0f172a',
            sole: '#ccff00',
            accent: '#ccff00',
            laces: '#ffffff',
            heel: '#334155'
        },
        engraving: 'KINETIX LAB',
        size: '9'
    };

    // --------------------------------------------------------------------------
    // 2. HERO INTERACTIVE COLORWAY & 3D TILT EFFECT
    // --------------------------------------------------------------------------
    const heroSwatches = document.querySelectorAll('.hero-swatches .swatch-btn');
    const heroColorName = document.getElementById('heroColorName');
    const svgSole = document.getElementById('svg-sole');
    const svgUpper = document.getElementById('svg-upper');
    const svgAccent = document.getElementById('svg-accent');

    const heroColorMap = {
        neon: { name: 'Cyber Neon Glow', sole: '#ccff00', accent: '#ccff00', upper: '#0f172a' },
        cyan: { name: 'Electric Cyan Tide', sole: '#00f0ff', accent: '#00f0ff', upper: '#0a192f' },
        crimson: { name: 'Crimson Volt Red', sole: '#ff0055', accent: '#ff0055', upper: '#1f0910' },
        stealth: { name: 'Obsidian Stealth White', sole: '#f8fafc', accent: '#f8fafc', upper: '#1e293b' }
    };

    heroSwatches.forEach(btn => {
        btn.addEventListener('click', () => {
            heroSwatches.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const colorKey = btn.dataset.color;
            const config = heroColorMap[colorKey];

            if (config) {
                heroColorName.textContent = config.name;
                
                // Smooth GSAP Color Morphing
                if (window.gsap) {
                    gsap.to(svgSole, { fill: config.sole, duration: 0.5 });
                    gsap.to(svgAccent, { fill: config.accent, duration: 0.5 });
                    gsap.to(svgUpper, { fill: config.upper, duration: 0.5 });
                } else {
                    svgSole.setAttribute('fill', config.sole);
                    svgAccent.setAttribute('fill', config.accent);
                    svgUpper.setAttribute('fill', config.upper);
                }
            }
        });
    });

    // Dynamic 3D Parallax Tilt for Hero Visual
    const heroVisualCard = document.querySelector('.hero-visual-card');
    const heroShoeStage = document.getElementById('heroShoeStage');

    if (heroShoeStage && heroVisualCard) {
        heroShoeStage.addEventListener('mousemove', (e) => {
            const rect = heroShoeStage.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (-y / rect.height) * 20;
            const rotateY = (x / rect.width) * 25;

            heroVisualCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });

        heroShoeStage.addEventListener('mouseleave', () => {
            heroVisualCard.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    }

    // Dynamic Hero Canvas Particle Background
    const canvas = document.getElementById('heroParticleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(204, 255, 0, ${p.alpha})`;
                ctx.fill();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // --------------------------------------------------------------------------
    // 3. CATALOG RENDERING & FILTERING
    // --------------------------------------------------------------------------
    const productGrid = document.getElementById('productGrid');
    const filterTabs = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');

    function renderProducts(items) {
        if (!productGrid) return;
        productGrid.innerHTML = '';

        if (items.length === 0) {
            productGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
                    <i class="fa-solid fa-shoe-prints" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-dim);"></i>
                    <p>No sneakers found matching this criteria.</p>
                </div>
            `;
            return;
        }

        items.forEach(prod => {
            const isWishlisted = wishlist.has(prod.id);
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-category', prod.category);

            card.innerHTML = `
                ${prod.badge ? `<span class="product-badge ${prod.badgeClass}">${prod.badge}</span>` : ''}
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${prod.id}" title="Add to Wishlist">
                    <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
                <div class="product-image-box">
                    <img src="${prod.image}" alt="${prod.name}" class="product-img" loading="lazy">
                </div>
                <div class="product-details">
                    <span class="product-cat">${prod.categoryLabel}</span>
                    <h3 class="product-name">${prod.name}</h3>
                    <div class="product-price-row">
                        <span class="product-price">$${prod.price.toFixed(2)}</span>
                        <div class="product-rating">
                            <i class="fa-solid fa-star"></i>
                            <span>${prod.rating} (${prod.reviewsCount})</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="quick-add-btn" data-id="${prod.id}">
                            <i class="fa-solid fa-plus"></i> Add to Cart
                        </button>
                        <button class="quick-view-btn" data-id="${prod.id}" title="Quick View">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </div>
            `;

            productGrid.appendChild(card);
        });

        attachCardEvents();
    }

    function attachCardEvents() {
        // Quick Add Button
        document.querySelectorAll('.quick-add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prodId = btn.dataset.id;
                const prod = PRODUCTS.find(p => p.id === prodId);
                if (prod) {
                    addToCart({
                        id: prod.id,
                        name: prod.name,
                        price: prod.price,
                        size: '9.5',
                        image: prod.image,
                        qty: 1
                    });
                }
            });
        });

        // Quick View Button
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prodId = btn.dataset.id;
                openQuickView(prodId);
            });
        });

        // Wishlist Toggle
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prodId = btn.dataset.id;
                if (wishlist.has(prodId)) {
                    wishlist.delete(prodId);
                    btn.classList.remove('active');
                    btn.querySelector('i').className = 'fa-regular fa-heart';
                    showToast('Removed from Wishlist', 'info');
                } else {
                    wishlist.add(prodId);
                    btn.classList.add('active');
                    btn.querySelector('i').className = 'fa-solid fa-heart';
                    showToast('Saved to Wishlist!', 'success');
                }
                updateWishlistBadge();
            });
        });
    }

    function updateWishlistBadge() {
        const badge = document.querySelector('.wishlist-count');
        if (badge) {
            badge.textContent = wishlist.size;
        }
    }

    // Filter Tabs Logic
    filterTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            filterTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            let filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
            
            // Apply sorting if active
            filtered = sortProductsList(filtered, sortSelect.value);
            renderProducts(filtered);
        });
    });

    // Sort Select Logic
    sortSelect?.addEventListener('change', () => {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        let filtered = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter);
        filtered = sortProductsList(filtered, sortSelect.value);
        renderProducts(filtered);
    });

    function sortProductsList(items, sortKey) {
        let copy = [...items];
        if (sortKey === 'price-low') {
            copy.sort((a, b) => a.price - b.price);
        } else if (sortKey === 'price-high') {
            copy.sort((a, b) => b.price - a.price);
        } else if (sortKey === 'rating') {
            copy.sort((a, b) => b.rating - a.rating);
        }
        return copy;
    }

    // Initial Catalog Render
    renderProducts(PRODUCTS);

    // --------------------------------------------------------------------------
    // 4. TECH LAB INTERACTIVE ACCORDION & HOTSPOTS
    // --------------------------------------------------------------------------
    const accItems = document.querySelectorAll('.accordion-item');
    const hotspotPins = document.querySelectorAll('.hotspot-pin');
    const hotspotTitle = document.getElementById('hotspotTitle');
    const hotspotDesc = document.getElementById('hotspotDesc');

    accItems.forEach(item => {
        item.querySelector('.accordion-header').addEventListener('click', () => {
            accItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    hotspotPins.forEach(pin => {
        pin.addEventListener('click', () => {
            const title = pin.dataset.title;
            const desc = pin.dataset.desc;
            if (hotspotTitle && hotspotDesc) {
                hotspotTitle.textContent = title;
                hotspotDesc.textContent = desc;
            }
            showToast(`Inspecting: ${title}`, 'info');
        });
    });

    // --------------------------------------------------------------------------
    // 5. 3D CUSTOMIZER STUDIO ENGINE
    // --------------------------------------------------------------------------
    const compTabs = document.querySelectorAll('#componentTabs .comp-tab');
    const colorPickers = document.querySelectorAll('#customColorGrid .color-pick-btn');
    const engravingInput = document.getElementById('engravingInput');
    const customEngravingText = document.getElementById('customEngravingText');
    const customSizeChips = document.querySelectorAll('#customSizeSelector .size-chip');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const addCustomToCartBtn = document.getElementById('addCustomToCartBtn');

    // Component Tab Selector
    compTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            compTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            customState.activePart = tab.dataset.part;
        });
    });

    // Color Picker Button
    colorPickers.forEach(picker => {
        picker.addEventListener('click', () => {
            colorPickers.forEach(p => p.classList.remove('active'));
            picker.classList.add('active');

            const color = picker.dataset.color;
            customState.colors[customState.activePart] = color;
            applyCustomizerColors();
        });
    });

    function applyCustomizerColors() {
        const partUpper = document.getElementById('part-upper');
        const partSole = document.getElementById('part-sole');
        const partAccent = document.getElementById('part-accent');
        const partLaces = document.getElementById('part-laces');
        const partHeel = document.getElementById('part-heel');

        if (window.gsap) {
            if (partUpper) gsap.to(partUpper, { fill: customState.colors.upper, duration: 0.3 });
            if (partSole) gsap.to(partSole, { fill: customState.colors.sole, duration: 0.3 });
            if (partAccent) gsap.to(partAccent, { fill: customState.colors.accent, duration: 0.3 });
            if (partLaces) gsap.to(partLaces, { stroke: customState.colors.laces, duration: 0.3 });
            if (partHeel) gsap.to(partHeel, { fill: customState.colors.heel, duration: 0.3 });
        } else {
            if (partUpper) partUpper.setAttribute('fill', customState.colors.upper);
            if (partSole) partSole.setAttribute('fill', customState.colors.sole);
            if (partAccent) partAccent.setAttribute('fill', customState.colors.accent);
            if (partLaces) partLaces.setAttribute('stroke', customState.colors.laces);
            if (partHeel) partHeel.setAttribute('fill', customState.colors.heel);
        }
    }

    // Heel Engraving Input
    engravingInput?.addEventListener('input', (e) => {
        const text = e.target.value.toUpperCase() || 'KINETIX LAB';
        customState.engraving = text;
        if (customEngravingText) {
            customEngravingText.textContent = text;
        }
    });

    // Custom Size Chips
    customSizeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            customSizeChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            customState.size = chip.dataset.size;
        });
    });

    // Customizer Presets
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            if (preset === 'cyberpunk') {
                customState.colors = { upper: '#0f172a', sole: '#ccff00', accent: '#00f0ff', laces: '#ff0055', heel: '#8b5cf6' };
            } else if (preset === 'stealth') {
                customState.colors = { upper: '#0f172a', sole: '#1e293b', accent: '#475569', laces: '#f8fafc', heel: '#0f172a' };
            } else if (preset === 'solar') {
                customState.colors = { upper: '#1f0910', sole: '#f97316', accent: '#ccff00', laces: '#ffffff', heel: '#ff0055' };
            }
            applyCustomizerColors();
            showToast(`Loaded ${preset.toUpperCase()} preset!`, 'success');
        });
    });

    // Add Custom Pair to Cart
    addCustomToCartBtn?.addEventListener('click', () => {
        addToCart({
            id: `custom-${Date.now()}`,
            name: `Custom KINETIX X-LAB (${customState.engraving})`,
            price: 249.00,
            size: customState.size,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
            qty: 1
        });
        showToast('Custom pair added to cart!', 'success');
    });

    // --------------------------------------------------------------------------
    // 6. FIT FINDER CALCULATOR WIZARD
    // --------------------------------------------------------------------------
    const wizSteps = document.querySelectorAll('.wizard-step');
    const wizNextBtns = document.querySelectorAll('.wiz-next-btn');
    const wizBackBtns = document.querySelectorAll('.wiz-back-btn');
    const calculateFitBtn = document.getElementById('calculateFitBtn');
    const wizResult = document.getElementById('wizResult');
    const recResetBtn = document.getElementById('recResetBtn');
    const recViewBtn = document.getElementById('recViewBtn');

    let fitAnswers = { use: 'running', width: 'standard', size: '9' };

    // Option Button Selectors
    document.querySelectorAll('.wiz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.parentElement;
            parent.querySelectorAll('.wiz-opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (btn.dataset.val) {
                if (parent.closest('[data-step="1"]')) fitAnswers.use = btn.dataset.val;
                if (parent.closest('[data-step="2"]')) fitAnswers.width = btn.dataset.val;
            }
        });
    });

    document.querySelectorAll('.wiz-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.wiz-size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            fitAnswers.size = btn.dataset.size;
        });
    });

    wizNextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = btn.dataset.next;
            showWizardStep(nextStep);
        });
    });

    wizBackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const backStep = btn.dataset.back;
            showWizardStep(backStep);
        });
    });

    function showWizardStep(stepNum) {
        wizSteps.forEach(s => s.classList.remove('active'));
        const target = document.querySelector(`.wizard-step[data-step="${stepNum}"]`);
        if (target) target.classList.add('active');
    }

    calculateFitBtn?.addEventListener('click', () => {
        wizSteps.forEach(s => s.classList.remove('active'));
        if (wizResult) wizResult.classList.remove('hidden');

        // Dynamic Recommendation output
        const recShoeTitle = document.getElementById('recShoeTitle');
        const recShoeDesc = document.getElementById('recShoeDesc');

        let recModel = 'Hyper Velocity X1';
        let recSize = parseFloat(fitAnswers.size);

        if (fitAnswers.width === 'wide') recSize += 0.5;
        if (fitAnswers.use === 'trail') recModel = 'Terra Force Trail Pro';
        if (fitAnswers.use === 'lifestyle') recModel = 'Cyber Matrix Runner';

        if (recShoeTitle && recShoeDesc) {
            recShoeTitle.textContent = `${recModel} - Size US ${recSize}`;
            recShoeDesc.textContent = `Optimized for ${fitAnswers.use} with a ${fitAnswers.width} foot fit profile. Gives optimal toe-box expansion and max propulsion efficiency.`;
        }

        if (window.confetti) {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        }
    });

    recResetBtn?.addEventListener('click', () => {
        if (wizResult) wizResult.classList.add('hidden');
        showWizardStep('1');
    });

    recViewBtn?.addEventListener('click', () => {
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    });

    // --------------------------------------------------------------------------
    // 7. CART DRAWER & STATE ENGINE
    // --------------------------------------------------------------------------
    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartCountEl = document.getElementById('cartCount');
    const cartDrawerCount = document.getElementById('cartDrawerCount');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const shippingProgress = document.getElementById('shippingProgress');
    const shippingText = document.getElementById('shippingText');
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoCodeInput = document.getElementById('promoCodeInput');
    const discountRow = document.getElementById('discountRow');
    const discountAmountEl = document.getElementById('discountAmount');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function openCart() {
        cartOverlay.classList.add('active');
    }

    function closeCart() {
        cartOverlay.classList.remove('active');
    }

    cartToggleBtn?.addEventListener('click', openCart);
    closeCartBtn?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', (e) => {
        if (e.target === cartOverlay) closeCart();
    });

    function addToCart(item) {
        const existing = cart.find(i => i.id === item.id && i.size === item.size);
        if (existing) {
            existing.qty += item.qty || 1;
        } else {
            cart.push(item);
        }
        updateCartUI();
        openCart();
        showToast(`Added ${item.name} to Cart`, 'success');
    }

    function updateCartUI() {
        const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);
        if (cartCountEl) cartCountEl.textContent = totalItems;
        if (cartDrawerCount) cartDrawerCount.textContent = totalItems;

        // Render Cart Items
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty-state">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <p>Your bag is currently empty.</p>
                </div>
            `;
        } else {
            cart.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-meta">Size: US ${item.size} • $${item.price.toFixed(2)}</div>
                        <div class="qty-controls">
                            <button class="qty-btn minus-btn" data-index="${index}">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn plus-btn" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="remove-cart-item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        // Attach Cart Item Listeners
        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                if (cart[idx].qty > 1) {
                    cart[idx].qty--;
                } else {
                    cart.splice(idx, 1);
                }
                updateCartUI();
            });
        });

        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                cart[idx].qty++;
                updateCartUI();
            });
        });

        document.querySelectorAll('.remove-cart-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                cart.splice(idx, 1);
                updateCartUI();
                showToast('Item removed from cart', 'info');
            });
        });

        // Totals & Shipping Calculation
        const rawSubtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
        let finalTotal = rawSubtotal;

        if (appliedPromo && promoDiscountPercent > 0) {
            const discountVal = rawSubtotal * (promoDiscountPercent / 100);
            finalTotal = rawSubtotal - discountVal;
            if (discountRow) discountRow.classList.remove('hidden');
            if (discountAmountEl) discountAmountEl.textContent = `-$${discountVal.toFixed(2)}`;
        } else {
            if (discountRow) discountRow.classList.add('hidden');
        }

        if (cartSubtotalEl) cartSubtotalEl.textContent = `$${finalTotal.toFixed(2)}`;

        // Free Shipping Progress
        const progressPct = Math.min(100, (rawSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
        if (shippingProgress) shippingProgress.style.width = `${progressPct}%`;

        if (shippingText) {
            if (rawSubtotal >= FREE_SHIPPING_THRESHOLD) {
                shippingText.innerHTML = `🎉 You unlocked <strong>FREE Express Shipping!</strong>`;
            } else {
                const diff = FREE_SHIPPING_THRESHOLD - rawSubtotal;
                shippingText.innerHTML = `Add $${diff.toFixed(2)} more for <strong>FREE Express Shipping</strong>`;
            }
        }
    }

    // Promo Code Application
    applyPromoBtn?.addEventListener('click', () => {
        const code = promoCodeInput.value.trim().toUpperCase();
        if (code === 'KINETIX15') {
            appliedPromo = true;
            promoDiscountPercent = 15;
            updateCartUI();
            showToast('15% Promo Discount Applied!', 'success');
        } else {
            showToast('Invalid promo code. Try KINETIX15', 'error');
        }
    });

    // Checkout Action
    checkoutBtn?.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty!', 'error');
            return;
        }

        if (window.confetti) {
            confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
        }

        showToast('Processing order... Thank you for shopping with KINETIX!', 'success');
        cart = [];
        updateCartUI();
        setTimeout(closeCart, 1500);
    });

    // --------------------------------------------------------------------------
    // 8. QUICK VIEW MODAL
    // --------------------------------------------------------------------------
    const quickViewModal = document.getElementById('quickViewModal');
    const closeQuickView = document.getElementById('closeQuickView');
    const quickViewContent = document.getElementById('quickViewContent');

    function openQuickView(prodId) {
        const prod = PRODUCTS.find(p => p.id === prodId);
        if (!prod || !quickViewContent) return;

        quickViewContent.innerHTML = `
            <div style="text-align: center;">
                <img src="${prod.image}" alt="${prod.name}" class="modal-shoe-img">
            </div>
            <div>
                <span class="sub-heading">${prod.categoryLabel}</span>
                <h2 style="font-family: var(--font-heading); font-size: 2rem; margin: 0.4rem 0;">${prod.name}</h2>
                <div style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--accent-neon); margin-bottom: 1rem;">
                    $${prod.price.toFixed(2)}
                </div>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.95rem;">${prod.description}</p>
                
                <div style="margin-bottom: 1.5rem;">
                    <label class="control-label" style="margin-bottom: 0.5rem;">Select Size (US):</label>
                    <div class="custom-size-selector" id="modalSizeSelector">
                        <button class="size-chip">8</button>
                        <button class="size-chip active">9</button>
                        <button class="size-chip">10</button>
                        <button class="size-chip">11</button>
                    </div>
                </div>

                <button class="btn btn-primary btn-block btn-glow" id="modalAddToCart">
                    <i class="fa-solid fa-plus"></i> Add to Cart - $${prod.price.toFixed(2)}
                </button>
            </div>
        `;

        // Attach internal Modal Events
        const modalSizeChips = quickViewContent.querySelectorAll('#modalSizeSelector .size-chip');
        let selectedSize = '9';

        modalSizeChips.forEach(chip => {
            chip.addEventListener('click', () => {
                modalSizeChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                selectedSize = chip.textContent;
            });
        });

        document.getElementById('modalAddToCart')?.addEventListener('click', () => {
            addToCart({
                id: prod.id,
                name: prod.name,
                price: prod.price,
                size: selectedSize,
                image: prod.image,
                qty: 1
            });
            quickViewModal.classList.remove('active');
        });

        quickViewModal.classList.add('active');
    }

    closeQuickView?.addEventListener('click', () => {
        quickViewModal.classList.remove('active');
    });

    quickViewModal?.addEventListener('click', (e) => {
        if (e.target === quickViewModal) quickViewModal.classList.remove('active');
    });

    // --------------------------------------------------------------------------
    // 9. SEARCH OVERLAY
    // --------------------------------------------------------------------------
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchBtn?.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });

    closeSearch?.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    searchInput?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            searchResults.innerHTML = `<div class="search-hint">Type to search sneakers by name, category, or feature...</div>`;
            return;
        }

        const matches = PRODUCTS.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.categoryLabel.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            searchResults.innerHTML = `<div class="search-hint">No results found for "${query}"</div>`;
        } else {
            searchResults.innerHTML = matches.map(m => `
                <div class="cart-item" style="cursor: pointer; margin-bottom: 0.75rem;" onclick="location.href='#catalog'">
                    <img src="${m.image}" class="cart-item-img">
                    <div>
                        <h4 style="font-family: var(--font-heading);">${m.name}</h4>
                        <span style="font-size: 0.8rem; color: var(--accent-neon);">$${m.price.toFixed(2)} • ${m.categoryLabel}</span>
                    </div>
                </div>
            `).join('');
        }
    });

    // --------------------------------------------------------------------------
    // 10. MOBILE NAV DRAWER
    // --------------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileMenuBtn?.addEventListener('click', () => mobileMenu.classList.add('active'));
    closeMobileMenu?.addEventListener('click', () => mobileMenu.classList.remove('active'));
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });

    // --------------------------------------------------------------------------
    // 11. NEWSLETTER FORM
    // --------------------------------------------------------------------------
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterFeedback = document.getElementById('newsletterFeedback');

    newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletterEmail').value;
        if (newsletterFeedback) {
            newsletterFeedback.innerHTML = `
                <span class="text-accent"><i class="fa-solid fa-circle-check"></i> Thanks for joining! Use promo code <strong>"KINETIX15"</strong> at checkout for 15% off.</span>
            `;
        }
        if (window.confetti) {
            confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
        }
        newsletterForm.reset();
    });

    // --------------------------------------------------------------------------
    // 12. TOAST NOTIFICATION UTILITY
    // --------------------------------------------------------------------------
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'fa-info-circle text-cyan';
        if (type === 'success') icon = 'fa-circle-check text-accent';
        if (type === 'error') icon = 'fa-triangle-exclamation text-red';

        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --------------------------------------------------------------------------
    // 13. GSAP SCROLL REVEAL ANIMATIONS
    // --------------------------------------------------------------------------
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%'
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        gsap.from('.hero-content > *', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        });

        gsap.from('.hero-visual-card', {
            scale: 0.85,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
    }

});
