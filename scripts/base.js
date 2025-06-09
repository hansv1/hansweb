// Funciones base para todas las páginas
class HansWeb {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('hansWebCart')) || [];
        this.initializeNavigation();
        this.updateCartDisplay();
    }

    // Inicializar navegación
    initializeNavigation() {
        // Mobile menu toggle (si se implementa)
        const mobileToggle = document.querySelector('.mobile-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', this.toggleMobileMenu);
        }

        // Smooth scrolling para enlaces internos
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
    }

    // Gestión del carrito
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showCartNotification(`${product.name} agregado al carrito`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('hansWebCart', JSON.stringify(this.cart));
    }

    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        const itemCount = this.getCartItemCount();
        
        if (cartCount) {
            cartCount.textContent = itemCount;
            cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
        }
    }

    // Mostrar notificación del carrito
    showCartNotification(message) {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--success);
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Mostrar notificación
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Ocultar notificación
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Generar mensaje de WhatsApp
    generateWhatsAppMessage(products = null) {
        const itemsToProcess = products || this.cart;
        if (itemsToProcess.length === 0) return '';

        let message = '¡Hola! Me interesa comprar los siguientes productos de HANS WEB:\n\n';
        let total = 0;

        itemsToProcess.forEach(item => {
            const subtotal = item.price * item.quantity;
            message += `• ${item.name}\n`;
            message += `  Cantidad: ${item.quantity}\n`;
            message += `  Precio: S/ ${item.price.toFixed(2)}\n`;
            message += `  Subtotal: S/ ${subtotal.toFixed(2)}\n\n`;
            total += subtotal;
        });

        message += `💰 Total: S/ ${total.toFixed(2)}\n\n`;
        message += 'Por favor, confírmenme la disponibilidad y el proceso de compra. ¡Gracias!';

        return encodeURIComponent(message);
    }

    // Redirigir a WhatsApp
    redirectToWhatsApp(products = null) {
        const phoneNumber = '51965485348';
        const message = this.generateWhatsAppMessage(products);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }

    // Formatear fecha a horario peruano
    formatDateToPeru(date) {
        const peruTime = new Date(date).toLocaleString('es-PE', {
            timeZone: 'America/Lima',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        return peruTime;
    }

    // Copiar texto al portapapeles
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showCartNotification('Copiado al portapapeles');
        } catch (err) {
            console.error('Error al copiar:', err);
            // Fallback para navegadores más antiguos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showCartNotification('Copiado al portapapeles');
        }
    }

    // Generar ID único
    generateId() {
        return 'hans_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // Validar email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.toggle('mobile-active');
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.hansWeb = new HansWeb();
});

// Exportar para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HansWeb;
}