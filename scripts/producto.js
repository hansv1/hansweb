// JavaScript específico para páginas de productos individuales
class ProductoManager extends HansWeb {
    constructor(productData) {
        super();
        this.product = productData;
        this.initializeProducto();
    }

    initializeProducto() {
        this.initializeCartSidebar();
        this.initializeAnimations();
        this.initializeImageEffects();
    }

    initializeAnimations() {
        // Animar elementos al cargar la página
        const animatedElements = document.querySelectorAll('.highlight-item, .included-item, .faq-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    initializeImageEffects() {
        const productImage = document.querySelector('.product-image-large');
        if (productImage) {
            // Efecto de paralaje suave en scroll
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.1;
                productImage.style.transform = `translateY(${parallax}px)`;
            });
        }
    }

    addToCart() {
        super.addToCart(this.product);
        this.updateCartSidebar();
        this.showAddToCartAnimation();
    }

    buyNow() {
        const products = [this.product];
        super.redirectToWhatsApp(products);
    }

    showAddToCartAnimation() {
        const button = document.querySelector('.btn-add-cart');
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '✓ ¡Agregado!';
            button.style.backgroundColor = 'var(--success)';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.backgroundColor = 'var(--primary-color)';
            }, 2000);
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
                    <button class="quantity-btn" onclick="productoManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="productoManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="remove-item" onclick="productoManager.removeFromCart('${item.id}')">Eliminar</button>
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

// Smooth scroll mejorado para FAQ y características
document.addEventListener('DOMContentLoaded', () => {
    // Agregar índice interactivo para FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Expandir/contraer efecto
            const isExpanded = item.classList.contains('expanded');
            
            // Cerrar todos los demás
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('expanded');
            });
            
            // Alternar el actual
            if (!isExpanded) {
                item.classList.add('expanded');
            }
        });
    });

    // Destacar características al hacer hover
    const highlightItems = document.querySelectorAll('.highlight-item');
    highlightItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#e3f2fd';
            item.style.borderLeft = '4px solid var(--primary-color)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'var(--light-gray)';
            item.style.borderLeft = 'none';
        });
    });
});

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