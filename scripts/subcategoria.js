// JavaScript para subcategorías de la tienda
class SubcategoriaManager extends HansWeb {
    constructor(categoria) {
        super();
        this.categoria = categoria;
        this.productos = this.getProductosPorCategoria(categoria);
        this.productosFiltrados = [...this.productos];
        this.currentSort = 'default';
        this.currentSearch = '';
        this.initializeSubcategoria();
    }

    initializeSubcategoria() {
        this.loadProducts();
        this.initializeCartSidebar();
        this.initializeFilters();
        this.initializeSearch();
    }

    getProductosPorCategoria(categoria) {
        const productosData = {
            windowsoffice: [
                {
                    id: 'win11-pro',
                    name: 'Windows 11 Pro Retail Key Global',
                    price: 16.00,
                    originalPrice: 25.00,
                    image: '💻',
                    category: 'windowsoffice',
                    url: 'Windows-Office/windows11pro.html',
                    features: ['Licencia original', 'Activación global', 'Soporte 24/7', 'Uso comercial'],
                    badge: 'Más vendido',
                    discount: 36
                },
                {
                    id: 'win11-home',
                    name: 'Windows 11 Home Retail Key Global',
                    price: 12.00,
                    image: '🏠',
                    category: 'windowsoffice',
                    url: 'Windows-Office/windows11home.html',
                    features: ['Licencia original', 'Activación global', 'Uso personal', 'Actualizaciones gratuitas']
                },
                {
                    id: 'office-365-personal',
                    name: 'Microsoft Office 365 Personal 1 Año',
                    price: 24.00,
                    originalPrice: 35.00,
                    image: '📊',
                    category: 'windowsoffice',
                    url: 'Windows-Office/office365personal.html',
                    features: ['1TB OneDrive', 'Apps Premium', 'Soporte técnico', 'Múltiples dispositivos'],
                    discount: 31
                },
                {
                    id: 'office-365-family',
                    name: 'Microsoft Office 365 Familia 1 Año',
                    price: 45.00,
                    originalPrice: 60.00,
                    image: '👨‍👩‍👧‍👦',
                    category: 'windowsoffice',
                    url: 'Windows-Office/office365family.html',
                    features: ['Hasta 6 usuarios', '6TB OneDrive', 'Apps Premium', 'Compartir familiar'],
                    badge: 'Mejor valor',
                    discount: 25
                },
                {
                    id: 'office-2021-pro',
                    name: 'Microsoft Office Professional 2021',
                    price: 55.00,
                    image: '🎯',
                    category: 'windowsoffice',
                    url: 'Windows-Office/office2021pro.html',
                    features: ['Licencia perpetua', 'Word, Excel, PowerPoint', 'Outlook, Publisher', 'Access incluido']
                },
                {
                    id: 'win10-pro',
                    name: 'Windows 10 Pro Retail Key Global',
                    price: 14.00,
                    image: '🔟',
                    category: 'windowsoffice',
                    url: 'Windows-Office/windows10pro.html',
                    features: ['Licencia original', 'Soporte extendido', 'BitLocker', 'Dominio empresarial']
                }
            ],
            programas: [
                {
                    id: 'antivirus-kaspersky',
                    name: 'Kaspersky Total Security 2024',
                    price: 35.00,
                    originalPrice: 50.00,
                    image: '🛡️',
                    category: 'programas',
                    url: 'Programas/kaspersky.html',
                    features: ['Protección completa', 'Anti-ransomware', 'VPN incluido', '3 dispositivos'],
                    badge: 'Recomendado',
                    discount: 30
                },
                {
                    id: 'adobe-photoshop',
                    name: 'Adobe Photoshop CC 2024',
                    price: 45.00,
                    image: '🎨',
                    category: 'programas',
                    url: 'Programas/photoshop.html',
                    features: ['Edición profesional', 'IA integrada', 'Cloud sync', 'Actualizaciones incluidas']
                },
                {
                    id: 'norton-360',
                    name: 'Norton 360 Deluxe',
                    price: 28.00,
                    image: '🔒',
                    category: 'programas',
                    url: 'Programas/norton360.html',
                    features: ['5 dispositivos', 'VPN ilimitado', 'Backup cloud', 'Control parental']
                },
                {
                    id: 'adobe-premiere',
                    name: 'Adobe Premiere Pro CC 2024',
                    price: 48.00,
                    image: '🎬',
                    category: 'programas',
                    url: 'Programas/premiere.html',
                    features: ['Edición 4K', 'Efectos avanzados', 'Colaboración cloud', 'Audio profesional']
                },
                {
                    id: 'malwarebytes',
                    name: 'Malwarebytes Premium',
                    price: 22.00,
                    originalPrice: 30.00,
                    image: '🦠',
                    category: 'programas',
                    url: 'Programas/malwarebytes.html',
                    features: ['Anti-malware', 'Protección web', 'Tiempo real', 'Sin ralentizar PC'],
                    discount: 27
                },
                {
                    id: 'adobe-illustrator',
                    name: 'Adobe Illustrator CC 2024',
                    price: 42.00,
                    image: '✏️',
                    category: 'programas',
                    url: 'Programas/illustrator.html',
                    features: ['Vectores profesionales', 'IA generativa', 'Templates premium', 'Multi-plataforma']
                }
            ],
            streaming: [
                {
                    id: 'netflix-premium',
                    name: 'Netflix Premium 1 Mes',
                    price: 12.00,
                    originalPrice: 18.00,
                    image: '🎬',
                    category: 'streaming',
                    url: 'Streaming/netflix.html',
                    features: ['4K Ultra HD', '4 pantallas', 'Sin anuncios', 'Descargas ilimitadas'],
                    badge: 'Más popular',
                    discount: 33
                },
                {
                    id: 'disney-plus',
                    name: 'Disney+ Premium 1 Mes',
                    price: 8.00,
                    image: '🏰',
                    category: 'streaming',
                    url: 'Streaming/disney.html',
                    features: ['Contenido Disney', 'Marvel y Star Wars', 'Pixar incluido', 'Nacional Geographic']
                },
                {
                    id: 'amazon-prime',
                    name: 'Amazon Prime Video 1 Mes',
                    price: 10.00,
                    image: '📦',
                    category: 'streaming',
                    url: 'Streaming/amazon.html',
                    features: ['Prime Video', 'Envíos gratis', 'Prime Music', 'Prime Reading']
                },
                {
                    id: 'spotify-premium',
                    name: 'Spotify Premium 3 Meses',
                    price: 18.00,
                    originalPrice: 25.00,
                    image: '🎵',
                    category: 'streaming',
                    url: 'Streaming/spotify.html',
                    features: ['Sin anuncios', 'Calidad alta', 'Descargas offline', 'Saltos ilimitados'],
                    discount: 28
                },
                {
                    id: 'hbo-max',
                    name: 'HBO Max 1 Mes',
                    price: 14.00,
                    image: '🎭',
                    category: 'streaming',
                    url: 'Streaming/hbo.html',
                    features: ['Contenido HBO', 'Warner Bros', 'Estrenos simultáneos', 'Contenido adulto']
                },
                {
                    id: 'youtube-premium',
                    name: 'YouTube Premium 2 Meses',
                    price: 15.00,
                    image: '📺',
                    category: 'streaming',
                    url: 'Streaming/youtube.html',
                    features: ['Sin anuncios', 'YouTube Music', 'Descargas', 'Reproducción en segundo plano']
                }
            ]
        };

        return productosData[categoria] || [];
    }

    loadProducts() {
        const container = document.getElementById('productsGrid');
        if (!container) return;

        container.innerHTML = '';
        
        if (this.productosFiltrados.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <div class="no-products-icon">📦</div>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta cambiar los filtros o términos de búsqueda</p>
                </div>
            `;
            return;
        }

        this.productosFiltrados.forEach((producto, index) => {
            const productCard = this.createProductCard(producto);
            productCard.style.animationDelay = `${(index % 4) * 0.1}s`;
            container.appendChild(productCard);
        });

        this.updateResultsCount();
    }

    createProductCard(producto) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const discountHtml = producto.discount ? 
            `<div class="product-badge discount">-${producto.discount}%</div>` : 
            (producto.badge ? `<div class="product-badge ${producto.badge === 'Más vendido' ? 'featured' : ''}">${producto.badge}</div>` : '');

        const originalPriceHtml = producto.originalPrice ? 
            `<span class="product-price-original">S/ ${producto.originalPrice.toFixed(2)}</span>
             ${producto.discount ? `<span class="product-discount">-${producto.discount}%</span>` : ''}` : '';

        const featuresHtml = producto.features ? 
            producto.features.slice(0, 3).map(feature => 
                `<div class="product-feature">${feature}</div>`
            ).join('') : '';

        card.innerHTML = `
            ${discountHtml}
            <div class="product-image">${producto.image}</div>
            <div class="product-content">
                <h3 class="product-title">${producto.name}</h3>
                ${featuresHtml ? `<div class="product-features">${featuresHtml}</div>` : ''}
                <div class="product-price-section">
                    <div class="product-price">S/ ${producto.price.toFixed(2)}</div>
                    ${originalPriceHtml}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="subcategoriaManager.handleAddToCart('${producto.id}', event)">
                        🛒 Agregar al Carrito
                    </button>
                    <button class="quick-view-btn" onclick="subcategoriaManager.goToProduct('${producto.url}', event)" title="Ver detalles">
                        👁️
                    </button>
                </div>
            </div>
        `;

        // Click en la tarjeta para ir al producto (excepto en botones)
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.product-actions')) {
                this.goToProduct(producto.url, e);
            }
        });

        return card;
    }

    handleAddToCart(productId, event) {
        event.stopPropagation();
        const producto = this.productos.find(p => p.id === productId);
        if (producto) {
            this.addToCart(producto);
            this.updateCartSidebar();
        }
    }

    goToProduct(url, event) {
        event.stopPropagation();
        window.location.href = url;
    }

    initializeFilters() {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortProducts();
            });
        }
    }

    initializeSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentSearch = e.target.value.toLowerCase();
                    this.filterProducts();
                }, 300);
            });
        }
    }

    sortProducts() {
        switch (this.currentSort) {
            case 'price-low':
                this.productosFiltrados.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.productosFiltrados.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.productosFiltrados.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Orden predeterminado: productos con badge primero, luego por ID
                this.productosFiltrados.sort((a, b) => {
                    if (a.badge && !b.badge) return -1;
                    if (!a.badge && b.badge) return 1;
                    return a.id.localeCompare(b.id);
                });
        }
        this.loadProducts();
    }

    filterProducts() {
        this.productosFiltrados = this.productos.filter(producto => {
            const matchesSearch = !this.currentSearch || 
                producto.name.toLowerCase().includes(this.currentSearch) ||
                (producto.features && producto.features.some(feature => 
                    feature.toLowerCase().includes(this.currentSearch)));
            
            return matchesSearch;
        });

        this.sortProducts();
    }

    updateResultsCount() {
        const resultsCount = document.querySelector('.results-count');
        if (resultsCount) {
            const total = this.productos.length;
            const showing = this.productosFiltrados.length;
            resultsCount.textContent = `Mostrando ${showing} de ${total} productos`;
        }
    }

    initializeCartSidebar() {
        this.updateCartSidebar();
    }

    updateCartSidebar() {
        const cartContent = document.getElementById('cartContent');
        const cartFooter = document.getElementById('cartFooter');
        const cartTotalAmount = document.getElementById('cartTotalAmount');

        if (!cartContent) return;

        if (this.cart.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <p>Tu carrito está vacío</p>
                    <small>Agrega productos para comenzar tu compra</small>
                </div>
            `;
            cartFooter.style.display = 'none';
        } else {
            cartContent.innerHTML = '';
            
            this.cart.forEach(item => {
                const cartItem = this.createCartItem(item);
                cartContent.appendChild(cartItem);
            });

            const total = this.getCartTotal();
            cartTotalAmount.textContent = total.toFixed(2);
            cartFooter.style.display = 'block';
        }

        this.updateCartDisplay();
    }

    createCartItem(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">${item.image || '📦'}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">S/ ${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="subcategoriaManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="subcategoriaManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="remove-item" onclick="subcategoriaManager.removeFromCart('${item.id}')">Eliminar</button>
                </div>
            </div>
        `;

        return cartItem;
    }

    removeFromCart(productId) {
        super.removeFromCart(productId);
        this.updateCartSidebar();
    }

    updateQuantity(productId, quantity) {
        super.updateQuantity(productId, quantity);
        this.updateCartSidebar();
    }
}

// Funciones globales
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
}

function sortProducts() {
    if (window.subcategoriaManager) {
        window.subcategoriaManager.sortProducts();
    }
}

// Cerrar carrito al hacer clic fuera
document.addEventListener('click', (e) => {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartBtn = document.querySelector('.cart-btn');
    
    if (cartSidebar && 
        cartSidebar.classList.contains('active') && 
        !cartSidebar.contains(e.target) && 
        !cartBtn.contains(e.target)) {
        cartSidebar.classList.remove('active');
    }
});

// Evitar que el clic dentro del carrito lo cierre
document.getElementById('cartSidebar')?.addEventListener('click', (e) => {
    e.stopPropagation();
});