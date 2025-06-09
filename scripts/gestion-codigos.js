// JavaScript específico para gestión de códigos
class GestionCodigosManager extends HansWeb {
    constructor() {
        super();
        this.initializeGestionCodigos();
    }

    initializeGestionCodigos() {
        this.setupAnimations();
        this.setupFAQInteractions();
    }

    setupAnimations() {
        // Animar elementos al entrar en viewport
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        // Observar elementos animados
        document.querySelectorAll('.platform-card, .security-item, .faq-item').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    setupFAQInteractions() {
        // Interacciones con FAQ items
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                // Efecto de click
                item.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    item.style.transform = 'translateY(-3px)';
                }, 150);
            });

            item.addEventListener('mouseenter', () => {
                // Animar el icono
                const icon = item.querySelector('h3::before');
                if (icon) {
                    item.querySelector('h3').style.transform = 'scale(1.05)';
                }
            });

            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('h3');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
            });
        });
    }

    // Función para mostrar notificaciones
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const colors = {
            success: 'var(--success)',
            error: 'var(--danger)', 
            info: 'var(--primary-color)',
            warning: 'var(--warning)'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Mostrar notificación
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Ocultar notificación
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Inicializar el manager al cargar la página
let gestionCodigosManager;
document.addEventListener('DOMContentLoaded', () => {
    gestionCodigosManager = new GestionCodigosManager();
    
    // Efecto de parallax suave en scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.codes-intro, .platform-header');
        
        parallaxElements.forEach(element => {
            const speed = 0.1;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
});