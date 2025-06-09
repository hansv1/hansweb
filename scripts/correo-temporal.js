/**
 * TempMail Pro - Correos Temporales
 * Completamente funcional con botones NUEVO y ELIMINAR
 * No guarda estado entre páginas
 */

class TempEmailManager {
    constructor() {
        this.API_KEY = 'e769cbfe-db59-4af7-97d3-74703239d385';
        this.NAMESPACE = 'wjlcs';
        this.BASE_URL = 'https://api.testmail.app/api/json';

        this.currentTag = null;
        this.currentEmail = null;
        this.refreshInterval = null;
        this.emails = [];

        this.elements = {
            aliasInput: document.getElementById('aliasInput'),
            generateBtn: document.getElementById('generateBtn'),
            randomBtn: document.getElementById('randomBtn'),
            customizeSection: document.getElementById('customizeSection'),
            emailReadySection: document.getElementById('emailReadySection'),
            emailDisplay: document.getElementById('emailDisplay'),
            copyBtn: document.getElementById('copyBtn'),
            refreshBtn: document.getElementById('refreshBtn'),
            refreshInterval: document.getElementById('refreshInterval'),
            newBtn: document.getElementById('newBtn'),
            deleteBtn: document.getElementById('deleteBtn'),
            statusDot: document.getElementById('statusDot'),
            statusText: document.getElementById('statusText'),
            inboxSection: document.getElementById('inboxSection'),
            inboxContent: document.getElementById('inboxContent'),
            emailModal: document.getElementById('emailModal'),
            modalSubject: document.getElementById('modalSubject'),
            modalBody: document.getElementById('modalBody'),
            modalMeta: document.getElementById('modalMeta')
        };

        this.initializeEventListeners();
        this.reset();
    }

    initializeEventListeners() {
        console.log('Inicializando event listeners...');
        
        // Botón generar
        if (this.elements.generateBtn) {
            this.elements.generateBtn.addEventListener('click', () => this.generateEmail());
            console.log('Event listener para generateBtn agregado');
        }
        
        // Input alias
        if (this.elements.aliasInput) {
            this.elements.aliasInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.generateEmail();
            });
            this.elements.aliasInput.addEventListener('input', () => this.validateAlias());
            console.log('Event listeners para aliasInput agregados');
        }

        // Botón aleatorio
        if (this.elements.randomBtn) {
            this.elements.randomBtn.addEventListener('click', () => this.generateRandomAlias());
            console.log('Event listener para randomBtn agregado');
        }

        // Botón copiar
        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', () => this.copyEmail());
            console.log('Event listener para copyBtn agregado');
        }

        // Botón refresh
        if (this.elements.refreshBtn) {
            this.elements.refreshBtn.addEventListener('click', () => this.fetchEmails());
            console.log('Event listener para refreshBtn agregado');
        }

        // Intervalo de refresh
        if (this.elements.refreshInterval) {
            this.elements.refreshInterval.addEventListener('change', () => this.updateRefreshInterval());
            console.log('Event listener para refreshInterval agregado');
        }

        // BOTONES NUEVO Y ELIMINAR - MÚLTIPLES MÉTODOS
        this.setupActionButtons();

        // Modal events
        if (this.elements.emailModal) {
            this.elements.emailModal.addEventListener('click', (e) => {
                if (e.target === this.elements.emailModal) this.closeModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });

        // Cerrar modal con botón X
        const closeBtn = document.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
    }

    setupActionButtons() {
        console.log('Configurando botones de acción...');
        
        // Método 1: Event listeners directos
        if (this.elements.newBtn) {
            this.elements.newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botón NUEVO clickeado (directo)');
                this.newEmail();
            });
            console.log('Event listener directo para newBtn agregado');
        }

        if (this.elements.deleteBtn) {
            this.elements.deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botón ELIMINAR clickeado (directo)');
                this.deleteEmail();
            });
            console.log('Event listener directo para deleteBtn agregado');
        }

        // Método 2: Event delegation para múltiples selectores
        document.addEventListener('click', (e) => {
            // Botón nuevo - múltiples selectores
            if (e.target.matches('#newBtn') || 
                e.target.matches('.new-btn') || 
                e.target.closest('#newBtn') ||
                e.target.closest('.new-btn') ||
                e.target.textContent.includes('Nuevo') ||
                e.target.textContent.includes('NUEVO')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botón NUEVO clickeado (delegation)');
                this.newEmail();
                return;
            }
            
            // Botón eliminar - múltiples selectores
            if (e.target.matches('#deleteBtn') || 
                e.target.matches('.delete-btn') ||
                e.target.closest('#deleteBtn') ||
                e.target.closest('.delete-btn') ||
                e.target.textContent.includes('Eliminar') ||
                e.target.textContent.includes('ELIMINAR')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botón ELIMINAR clickeado (delegation)');
                this.deleteEmail();
                return;
            }
        });

        // Método 3: Buscar botones por diferentes selectores
        setTimeout(() => {
            const possibleNewButtons = [
                document.getElementById('newBtn'),
                document.querySelector('.new-btn'),
                document.querySelector('[onclick*="newEmail"]'),
                ...document.querySelectorAll('button')
            ].filter(btn => btn && (
                btn.textContent.includes('Nuevo') || 
                btn.textContent.includes('NUEVO') ||
                btn.id === 'newBtn' ||
                btn.classList.contains('new-btn')
            ));

            const possibleDeleteButtons = [
                document.getElementById('deleteBtn'),
                document.querySelector('.delete-btn'),
                document.querySelector('[onclick*="deleteEmail"]'),
                ...document.querySelectorAll('button')
            ].filter(btn => btn && (
                btn.textContent.includes('Eliminar') || 
                btn.textContent.includes('ELIMINAR') ||
                btn.id === 'deleteBtn' ||
                btn.classList.contains('delete-btn')
            ));

            possibleNewButtons.forEach(btn => {
                if (btn && !btn.hasAttribute('data-listener-added')) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Botón NUEVO clickeado (búsqueda)');
                        this.newEmail();
                    });
                    btn.setAttribute('data-listener-added', 'true');
                    console.log('Listener agregado a botón nuevo encontrado:', btn);
                }
            });

            possibleDeleteButtons.forEach(btn => {
                if (btn && !btn.hasAttribute('data-listener-added')) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Botón ELIMINAR clickeado (búsqueda)');
                        this.deleteEmail();
                    });
                    btn.setAttribute('data-listener-added', 'true');
                    console.log('Listener agregado a botón eliminar encontrado:', btn);
                }
            });
        }, 1000);
    }

    validateAlias() {
        if (!this.elements.aliasInput) return false;
        
        const alias = this.elements.aliasInput.value.trim();
        const regex = /^[a-zA-Z0-9._-]+$/;
        
        if (!alias) return false;
        
        if (alias.length > 30) {
            this.showNotification('El alias no puede exceder 30 caracteres', 'error');
            return false;
        }
        
        if (!regex.test(alias)) {
            this.showNotification('Solo se permiten letras, números, puntos, guiones y guiones bajos', 'error');
            return false;
        }
        
        if (alias.startsWith('.') || alias.endsWith('.') || alias.includes('..')) {
            this.showNotification('Los puntos no pueden estar al inicio, final o ser consecutivos', 'error');
            return false;
        }
        
        return true;
    }

    generateRandomAlias() {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        let alias = '';
        for (let i = 0; i < 5; i++) {
            alias += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (this.elements.aliasInput) {
            this.elements.aliasInput.value = alias;
            this.showNotification('Alias aleatorio generado', 'info');
        }
        this.generateEmail();
    }

    async generateEmail() {
        if (!this.elements.aliasInput) return;
        
        const alias = this.elements.aliasInput.value.trim();
        if (!this.validateAlias()) {
            this.elements.aliasInput.focus();
            return;
        }

        try {
            this.showLoading('Generando correo temporal...');
            
            this.currentTag = alias;
            this.currentEmail = `${this.NAMESPACE}.${alias}@inbox.testmail.app`;
            
            if (this.elements.emailDisplay) {
                this.elements.emailDisplay.textContent = this.currentEmail;
            }
            
            // Mostrar secciones
            if (this.elements.customizeSection) {
                this.elements.customizeSection.style.display = 'none';
            }
            if (this.elements.emailReadySection) {
                this.elements.emailReadySection.style.display = 'block';
            }
            if (this.elements.inboxSection) {
                this.elements.inboxSection.style.display = 'block';
            }

            this.emails = [];
            this.renderEmails();
            this.startRefreshInterval();
            await this.fetchEmails();
            
            this.showNotification('¡Email temporal generado exitosamente!', 'success');

            // Re-configurar botones después de mostrar secciones
            setTimeout(() => {
                this.setupActionButtons();
            }, 500);

            // Scroll automático
            setTimeout(() => {
                if (this.elements.emailReadySection) {
                    this.elements.emailReadySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 150);

        } catch (error) {
            console.error('Error generating email:', error);
            this.showNotification('Error al generar el email temporal', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async copyEmail() {
        if (!this.currentEmail) return;
        
        try {
            await navigator.clipboard.writeText(this.currentEmail);
            this.showNotification('Email copiado al portapapeles', 'success');
            
            if (this.elements.copyBtn) {
                this.elements.copyBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.elements.copyBtn.style.transform = '';
                }, 150);
            }
        } catch (error) {
            this.fallbackCopyEmail();
        }
    }

    fallbackCopyEmail() {
        const textArea = document.createElement('textarea');
        textArea.value = this.currentEmail;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Email copiado al portapapeles', 'success');
        } catch (error) {
            this.showNotification('No se pudo copiar el email', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    // FUNCIÓN NUEVO EMAIL - COMPLETAMENTE FUNCIONAL
    newEmail() {
        console.log('=== EJECUTANDO NUEVO EMAIL ===');
        console.log('Estado actual:', {
            currentEmail: this.currentEmail,
            currentTag: this.currentTag,
            hasRefreshInterval: !!this.refreshInterval
        });
        
        this.reset();
        this.showNotification('🆕 Nuevo correo temporal - Ingresa un alias', 'info');
        
        // Focus en el input con delay
        setTimeout(() => {
            if (this.elements.aliasInput) {
                this.elements.aliasInput.focus();
                this.elements.aliasInput.select();
                console.log('Focus establecido en alias input');
            }
        }, 200);
        
        console.log('=== NUEVO EMAIL COMPLETADO ===');
    }

    // FUNCIÓN ELIMINAR EMAIL - COMPLETAMENTE FUNCIONAL
    deleteEmail() {
        console.log('=== EJECUTANDO ELIMINAR EMAIL ===');
        console.log('Estado actual:', {
            currentEmail: this.currentEmail,
            currentTag: this.currentTag,
            hasRefreshInterval: !!this.refreshInterval
        });
        
        if (!this.currentEmail) {
            this.showNotification('No hay correo temporal activo para eliminar', 'warning');
            return;
        }
        
        if (confirm('¿Estás seguro de que quieres eliminar este correo temporal?\n\nEsta acción no se puede deshacer.')) {
            const emailToDelete = this.currentEmail;
            this.reset();
            this.showNotification(`🗑️ Correo eliminado: ${emailToDelete}`, 'warning');
            
            // Focus en el input con delay
            setTimeout(() => {
                if (this.elements.aliasInput) {
                    this.elements.aliasInput.focus();
                    console.log('Focus establecido en alias input después de eliminar');
                }
            }, 200);
            
            console.log('=== ELIMINAR EMAIL COMPLETADO ===');
        } else {
            console.log('Eliminación cancelada por el usuario');
        }
    }

    async fetchEmails() {
        if (!this.currentTag) return;
        
        try {
            this.updateStatus('Buscando correos...', false);
            
            const response = await fetch(
                `https://api.testmail.app/api/json?apikey=${this.API_KEY}&namespace=${this.NAMESPACE}&tag=${this.currentTag}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.emails = data.emails || [];
            this.renderEmails();
            
            if (this.emails.length) {
                this.updateStatus(`Activo - ${this.emails.length} correo(s) recibido(s)`, true);
            } else {
                this.updateStatus('Activo - Esperando correos...', true);
            }
        } catch (error) {
            console.error('Error fetching emails:', error);
            this.updateStatus('Error al conectar con el servidor', false);
            this.showNotification('Error al buscar correos', 'error');
        }
    }

    renderEmails() {
        if (!this.elements.inboxContent) return;

        if (this.emails.length === 0) {
            this.elements.inboxContent.innerHTML = `
                <div class="empty-inbox">
                    <div class="empty-inbox-icon">📮</div>
                    <h4>No hay correos recibidos aún</h4>
                    <p>Los nuevos mensajes aparecerán aquí automáticamente</p>
                </div>
            `;
            return;
        }

        const emailList = document.createElement('div');
        emailList.className = 'email-list';

        emailList.innerHTML = this.emails.map(email => `
            <div class="email-item" onclick="tempEmailManager.openEmailModal('${email.id}')">
                <div class="email-header">
                    <div class="email-from">${this.escapeHtml(email.from || 'Desconocido')}</div>
                    <div class="email-date">${this.formatDate(email.timestamp)}</div>
                </div>
                <div class="email-subject">${this.escapeHtml(email.subject || 'Sin asunto')}</div>
                <div class="email-preview">${this.getEmailPreview(email)}</div>
            </div>
        `).join('');

        this.elements.inboxContent.innerHTML = '';
        this.elements.inboxContent.appendChild(emailList);
    }

    openEmailModal(emailId) {
        const email = this.emails.find(e => e.id === emailId);
        if (!email) return;

        if (this.elements.modalSubject) {
            this.elements.modalSubject.textContent = email.subject || 'Sin asunto';
        }

        if (this.elements.modalBody) {
            if (email.html) {
                const iframe = document.createElement('iframe');
                iframe.srcdoc = email.html;
                iframe.style.width = '100%';
                iframe.style.minHeight = '400px';
                iframe.style.border = '1px solid #ddd';
                iframe.style.borderRadius = '8px';
                this.elements.modalBody.innerHTML = '';
                this.elements.modalBody.appendChild(iframe);
            } else if (email.text) {
                this.elements.modalBody.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit;">${this.escapeHtml(email.text)}</pre>`;
            } else {
                this.elements.modalBody.innerHTML = '<p style="color: #666; font-style: italic;">Este email no tiene contenido.</p>';
            }
        }

        if (this.elements.modalMeta) {
            this.elements.modalMeta.innerHTML = `
                <div class="meta-item">
                    <div class="meta-label">De:</div>
                    <div>${this.escapeHtml(email.from || 'Desconocido')}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Para:</div>
                    <div>${this.currentEmail}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Fecha:</div>
                    <div>${this.formatDate(email.timestamp, true)}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Asunto:</div>
                    <div>${this.escapeHtml(email.subject || 'Sin asunto')}</div>
                </div>
            `;
        }

        if (this.elements.emailModal) {
            this.elements.emailModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        if (this.elements.emailModal) {
            this.elements.emailModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    updateRefreshInterval() {
        if (!this.elements.refreshInterval) return;
        
        const interval = parseInt(this.elements.refreshInterval.value);
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        if (this.currentTag) {
            this.refreshInterval = setInterval(() => this.fetchEmails(), interval);
        }
    }

    startRefreshInterval() {
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        const interval = this.elements.refreshInterval ? parseInt(this.elements.refreshInterval.value) : 15000;
        this.refreshInterval = setInterval(() => this.fetchEmails(), interval);
    }

    updateStatus(text, isActive) {
        if (this.elements.statusText) {
            this.elements.statusText.textContent = text;
        }
        if (this.elements.statusDot) {
            if (isActive) {
                this.elements.statusDot.classList.add('active');
            } else {
                this.elements.statusDot.classList.remove('active');
            }
        }
    }

    getEmailPreview(email) {
        let preview = '';
        if (email.text) {
            preview = email.text.replace(/\s+/g, ' ').trim();
        } else if (email.html) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = email.html;
            preview = tempDiv.textContent || tempDiv.innerText || '';
            preview = preview.replace(/\s+/g, ' ').trim();
        }
        if (preview.length > 120) {
            preview = preview.substring(0, 120) + '...';
        }
        return this.escapeHtml(preview) || '<em>Sin contenido de vista previa</em>';
    }

    formatDate(timestamp, detailed = false) {
        if (!timestamp) return 'Fecha desconocida';
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (detailed) {
            return date.toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        if (diffDays === 0) {
            return date.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else if (diffDays === 1) {
            return 'Ayer';
        } else if (diffDays < 7) {
            return `Hace ${diffDays} días`;
        } else {
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short'
            });
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    showLoading(message) {
        console.log('Loading:', message);
        // Aquí podrías agregar un indicador visual de carga
    }

    hideLoading() {
        console.log('Loading finished');
        // Aquí podrías ocultar el indicador visual de carga
    }

    showNotification(message, type = 'info') {
        console.log(`Notification [${type}]:`, message);
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const colors = {
            success: '#28a745',
            error: '#dc3545', 
            info: '#17a2b8',
            warning: '#ffc107'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            font-weight: 500;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    reset() {
        console.log('=== EJECUTANDO RESET ===');
        
        // LIMPIAR TODO sin guardar estado
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
            console.log('Refresh interval limpiado');
        }
        
        this.currentTag = null;
        this.currentEmail = null;
        this.emails = [];
        
        if (this.elements.aliasInput) {
            this.elements.aliasInput.value = '';
            console.log('Alias input limpiado');
        }
        
        if (this.elements.customizeSection) {
            this.elements.customizeSection.style.display = 'block';
            console.log('Customize section mostrada');
        }
        if (this.elements.emailReadySection) {
            this.elements.emailReadySection.style.display = 'none';
            console.log('Email ready section ocultada');
        }
        if (this.elements.inboxSection) {
            this.elements.inboxSection.style.display = 'none';
            console.log('Inbox section ocultada');
        }
        
        this.closeModal();
        
        // NUNCA guardar en localStorage - siempre empezar limpio
        localStorage.removeItem('hansWebTempEmail');
        console.log('LocalStorage limpiado');
        
        // Scroll arriba inmediato
        window.scrollTo({ top: 0, behavior: "auto" });
        console.log('Scroll reseteado');
        
        console.log('=== RESET COMPLETADO ===');
    }
}

// Inicializar siempre limpio
let tempEmailManager;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Inicializando TempEmailManager');
    tempEmailManager = new TempEmailManager();
    window.tempEmailManager = tempEmailManager;
    tempEmailManager.reset();
    console.log('TempEmailManager inicializado y asignado a window');
});

// Limpiar al cambiar de página
window.addEventListener('beforeunload', () => {
    console.log('Before unload - Limpiando recursos');
    if (tempEmailManager && tempEmailManager.refreshInterval) {
        clearInterval(tempEmailManager.refreshInterval);
    }
    localStorage.removeItem('hansWebTempEmail');
});

// Funciones globales para los botones (múltiples métodos de acceso)
window.newEmail = function() {
    console.log('newEmail() llamada globalmente');
    if (window.tempEmailManager) {
        window.tempEmailManager.newEmail();
    } else {
        console.error('tempEmailManager no disponible');
    }
};

window.deleteEmail = function() {
    console.log('deleteEmail() llamada globalmente');
    if (window.tempEmailManager) {
        window.tempEmailManager.deleteEmail();
    } else {
        console.error('tempEmailManager no disponible');
    }
};

// Métodos adicionales de acceso
window.tempMailNewEmail = window.newEmail;
window.tempMailDeleteEmail = window.deleteEmail;

// Debugging helper
window.debugTempMail = function() {
    console.log('=== DEBUG TEMP MAIL ===');
    console.log('tempEmailManager:', window.tempEmailManager);
    console.log('Estado actual:', {
        currentEmail: window.tempEmailManager?.currentEmail,
        currentTag: window.tempEmailManager?.currentTag,
        hasRefreshInterval: !!window.tempEmailManager?.refreshInterval,
        emailsCount: window.tempEmailManager?.emails?.length || 0
    });
    console.log('Elementos:', window.tempEmailManager?.elements);
    console.log('=== FIN DEBUG ===');
};

console.log('Script de correo temporal cargado completamente');