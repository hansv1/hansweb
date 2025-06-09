// JavaScript específico para la tienda
class TiendaManager extends HansWeb {
    constructor() {
        super();
        this.productos = this.getProductosDestacados();
        this.initializeTienda();
    }

    initializeTienda() {
        this.loadFeaturedProducts();
        this.initializeCartSidebar();
    }

    // Productos destacados de ejemplo
    getProductosDestacados() {
        return [
            {
                id: 'win11-pro',
                name: 'Windows 11 Pro Retail Key Global',
                price: 16.00,
                image: '💻',
                category: 'windows-office',
                url: 'Tienda/Windows-Office/windows11pro.html'
            },
            {
                id: 'office-365',
                name: 'Microsoft Office 365 Personal',
                price: 24.00,
                image: '📊',
                category: 'windows-office',
                url: 'Tienda/Windows-Office/office365.html'
            },
            {
                id: 'netflix-premium',
                name: 'Netflix Premium 1 Mes',
                price: 12.00,
                image: '🎬',
                category: 'streaming',
                url: 'Tienda/Streaming/netflix.html'
            },
            {
                id: 'antivirus-kaspersky',
                name: 'Kaspersky Total Security 2024',
                price: 35.00,
                image: '🛡️',
                category: 'programas',
                url: 'Tienda/Programas/kaspersky.html'
            },
            {
                id: 'adobe-photoshop',
                name: 'Adobe Photoshop CC 2024',
                price: 45.00,
                image: '🎨',
                category: 'programas',
                url: 'Tienda/Programas/photoshop.html'
            },
            {
                id: 'spotify-premium',
                name: 'Spotify Premium 3 Meses',
                price: 18.00,
                image: '🎵',
                category: 'streaming',
                url: 'Tienda/Streaming/spotify.html'
            }
        ];
    }

    loadFeaturedProducts() {
        const container = document.getElementById('featuredProducts');
        if (!container) return;

        container.innerHTML = '';
        
        this.productos.forEach(producto => {
            const productCard = this.createProductCard(producto);
            container.appendChild(productCard);
        });
    }

    createProductCard(producto) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-image">${producto.image}</div>
            <div class="product-content">
                <h3 class="product-title">${producto.name}</h3>
                <div class="product-price">S/ ${producto.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="tiendaManager.handleAddToCart('${producto.id}', event)">
                    Agregar al Carrito
                </button>
            </div>
        `;

        // Click en la tarjeta para ir al producto (excepto en el botón)
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart-btn')) {
                window.location.href = producto.url;
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
                    <button class="quantity-btn" onclick="tiendaManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="tiendaManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="remove-item" onclick="tiendaManager.removeFromCart('${item.id}')">Eliminar</button>
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

// Funciones globales para el carrito
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
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

// Inicializar el manager de la tienda
let tiendaManager;
document.addEventListener('DOMContentLoaded', () => {
    tiendaManager = new TiendaManager();
});