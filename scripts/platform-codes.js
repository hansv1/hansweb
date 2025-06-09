/**
 * Platform Codes Manager - CORREGIDO
 * Modal funcional al 100%
 */

class PlatformCodesManager {
    constructor(platformName) {
        this.platformName = platformName;
        this.API_KEY = 'e769cbfe-db59-4af7-97d3-74703239d385';
        this.NAMESPACE = 'wjlcs';
        this.BASE_URL = 'https://api.testmail.app/api/json';
        
        this.currentEmail = null;
        this.currentAlias = null;
        this.currentTag = null;
        this.refreshInterval = null;
        this.emails = [];

        this.elements = {
            emailInput: document.getElementById('platformEmailInput'),
            consultBtn: document.getElementById('consultBtn'),
            inputSection: document.getElementById('emailInputSection'),
            activeSection: document.getElementById('emailActiveSection'),
            emailDisplay: document.getElementById('emailDisplay'),
            copyBtn: document.getElementById('copyBtn'),
            refreshBtn: document.getElementById('refreshBtn'),
            refreshInterval: document.getElementById('refreshInterval'),
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
        
        // Asignar a window para acceso global
        window[`${platformName.toLowerCase()}Manager`] = this;
        console.log(`Manager asignado a window.${platformName.toLowerCase()}Manager`);
    }

    initializeEventListeners() {
        console.log(`Inicializando event listeners para ${this.platformName}...`);
        
        if (this.elements.consultBtn) {
            this.elements.consultBtn.addEventListener('click', () => this.consultEmail());
        }
        
        if (this.elements.emailInput) {
            this.elements.emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.consultEmail();
            });
            this.elements.emailInput.addEventListener('input', (e) => {
                this.validateEmailInput(e.target.value);
            });
        }

        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', () => this.copyEmail());
        }

        if (this.elements.refreshBtn) {
            this.elements.refreshBtn.addEventListener('click', () => this.fetchEmails());
        }

        if (this.elements.refreshInterval) {
            this.elements.refreshInterval.addEventListener('change', () => this.updateRefreshInterval());
        }

        // Modal events
        if (this.elements.emailModal) {
            this.elements.emailModal.addEventListener('click', (e) => {
                if (e.target === this.elements.emailModal) {
                    this.closeModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Event delegation para el modal close
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal-close') || e.target.closest('.modal-close')) {
                this.closeModal();
            }
            
            if (e.target.matches('.change-btn') || e.target.closest('.change-btn')) {
                this.changeEmail();
            }
        });
    }

    validateEmailInput(email) {
        if (!this.elements.emailInput || !this.elements.consultBtn) return;

        const isValid = this.isValidEmail(email);
        this.elements.consultBtn.disabled = !isValid;

        if (email && isValid) {
            this.elements.emailInput.className = 'platform-email-input valid';
        } else if (email) {
            this.elements.emailInput.className = 'platform-email-input invalid';
        } else {
            this.elements.emailInput.className = 'platform-email-input';
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async consultEmail() {
        if (!this.elements.emailInput) return;

        const email = this.elements.emailInput.value.trim();
        if (!email) {
            this.showNotification('Por favor, ingresa un correo electrónico', 'error');
            this.elements.emailInput.focus();
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('Por favor, ingresa un correo electrónico válido', 'error');
            this.elements.emailInput.focus();
            return;
        }

        try {
            this.showLoading('Consultando datos del correo...');
            this.updateConnectionStatus('connecting');

            const alias = await this.findAliasInSheets(email);
            
            if (!alias) {
                throw new Error('Correo no encontrado en el sistema');
            }

            this.currentEmail = email;
            this.currentAlias = alias;
            
            // Extraer el tag del alias
            const parts = alias.split('.');
            if (parts.length >= 2) {
                this.currentTag = parts[1].split('@')[0];
            } else {
                throw new Error('Formato de alias inválido');
            }

            this.showEmailActive();
            this.startRefreshInterval();
            await this.fetchEmails();
            this.updateConnectionStatus('connected');
            this.showNotification('¡Conexión establecida exitosamente!', 'success');

        } catch (error) {
            console.error('Error consulting email:', error);
            this.updateConnectionStatus('disconnected');
            this.showNotification(
                error.message || 'Error al consultar el correo. Verifica que esté registrado en el sistema.',
                'error'
            );
        } finally {
            this.hideLoading();
        }
    }

    async findAliasInSheets(email) {
        const GOOGLE_SHEETS_API_KEY = 'AIzaSyB5RSXmO9GCgXs-e-0TxeLRYeM1emLwA28';
        const SPREADSHEET_ID = '1QGTPBquKHQbO0sTO5pZr9w--mCWNNMjO1Mh9GC8q2eU';
        const RANGE = 'Hoja1!A:C';
        
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${GOOGLE_SHEETS_API_KEY}`;

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const rows = data.values || [];
            
            console.log('Buscando en Google Sheets:', { email, platformName: this.platformName, rows });
            
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (!row || row.length < 3) continue;
                
                const platform = (row[0] || '').toString().trim().toLowerCase();
                const sheetEmail = (row[1] || '').toString().trim().toLowerCase();
                const alias = (row[2] || '').toString().trim();

                if (platform === this.platformName.toLowerCase() && 
                    sheetEmail === email.toLowerCase() && 
                    alias) {
                    console.log('¡Encontrado!', alias);
                    return alias;
                }
            }

            return null;
        } catch (error) {
            console.error('Error fetching from Google Sheets:', error);
            throw new Error('Error al acceder a la base de datos: ' + error.message);
        }
    }

    showEmailActive() {
        if (this.elements.inputSection) {
            this.elements.inputSection.style.display = 'none';
        }

        if (this.elements.activeSection) {
            this.elements.activeSection.style.display = 'block';
        }

        if (this.elements.emailDisplay) {
            this.elements.emailDisplay.textContent = this.currentEmail;
        }

        if (this.elements.inboxSection) {
            this.elements.inboxSection.style.display = 'block';
        }

        this.updateStatus('Activo - Esperando correos...', true);

        setTimeout(() => {
            if (this.elements.activeSection) {
                this.elements.activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 150);
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

    changeEmail() {
        if (confirm('¿Estás seguro de que quieres cambiar de correo?\n\nSe perderá la sesión actual.')) {
            this.reset();
            this.showNotification('Puedes ingresar un nuevo correo', 'info');
            
            setTimeout(() => {
                if (this.elements.emailInput) {
                    this.elements.emailInput.focus();
                    this.elements.emailInput.select();
                }
            }, 200);
        }
    }

    async fetchEmails() {
        if (!this.currentTag) return;
        
        try {
            this.updateStatus('Buscando correos...', false);
            
            if (this.elements.refreshBtn) {
                this.elements.refreshBtn.innerHTML = '🔄 Actualizando...';
                this.elements.refreshBtn.disabled = true;
            }

            const response = await fetch(
                `https://api.testmail.app/api/json?apikey=${this.API_KEY}&namespace=${this.NAMESPACE}&tag=${this.currentTag}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.emails = data.emails || [];
            
            console.log('Emails received:', this.emails);
            
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
            this.updateConnectionStatus('disconnected');
        } finally {
            if (this.elements.refreshBtn) {
                this.elements.refreshBtn.innerHTML = '🔄 Actualizar';
                this.elements.refreshBtn.disabled = false;
            }
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

        // CORREGIDO: Usar el nombre del manager correcto y método directo
        emailList.innerHTML = this.emails.map((email, index) => `
            <div class="email-item" onclick="openPlatformEmailModal('${email.id}', '${this.platformName}')" data-email-id="${email.id}" style="animation-delay: ${index * 0.1}s">
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

        // También agregar event listeners directos por si el onclick falla
        setTimeout(() => {
            const emailItems = emailList.querySelectorAll('.email-item');
            emailItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    const emailId = item.getAttribute('data-email-id');
                    console.log('Email item clicked:', emailId);
                    this.openEmailModal(emailId);
                });
            });
        }, 100);
    }

    // FUNCIÓN PRINCIPAL PARA ABRIR MODAL - CORREGIDA
    openEmailModal(emailId) {
        console.log(`=== ABRIENDO MODAL PARA EMAIL ${emailId} ===`);
        console.log('Emails disponibles:', this.emails.map(e => e.id));
        
        const email = this.emails.find(e => e.id === emailId);
        if (!email) {
            console.error('Email no encontrado:', emailId);
            this.showNotification('Email no encontrado', 'error');
            return;
        }

        console.log('Email encontrado:', email);

        // Verificar que existe el modal
        if (!this.elements.emailModal) {
            console.error('Modal no encontrado en el DOM');
            this.showNotification('Error: Modal no disponible', 'error');
            return;
        }

        // Configurar subject
        if (this.elements.modalSubject) {
            this.elements.modalSubject.textContent = email.subject || 'Sin asunto';
            console.log('Subject configurado:', email.subject);
        }

        // Configurar body - MEJORADO
        if (this.elements.modalBody) {
            console.log('Configurando contenido del modal...');
            
            if (email.html && email.html.trim()) {
                console.log('Mostrando contenido HTML');
                // Crear iframe para contenido HTML
                const iframe = document.createElement('iframe');
                iframe.style.cssText = `
                    width: 100%;
                    min-height: 500px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background: white;
                `;
                
                // Sanitizar y configurar el HTML
                const sanitizedHtml = email.html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                iframe.srcdoc = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body { 
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                                line-height: 1.6; 
                                margin: 20px; 
                                color: #333;
                            }
                            img { max-width: 100%; height: auto; }
                            table { width: 100%; border-collapse: collapse; }
                            a { color: #007bff; text-decoration: none; }
                            a:hover { text-decoration: underline; }
                        </style>
                    </head>
                    <body>${sanitizedHtml}</body>
                    </html>
                `;
                
                this.elements.modalBody.innerHTML = '';
                this.elements.modalBody.appendChild(iframe);
                
            } else if (email.text && email.text.trim()) {
                console.log('Mostrando contenido de texto');
                this.elements.modalBody.innerHTML = `
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 1.5rem; border: 1px solid #dee2e6;">
                        <pre style="white-space: pre-wrap; font-family: inherit; margin: 0; font-size: 0.95rem; line-height: 1.6; color: #333;">${this.escapeHtml(email.text)}</pre>
                    </div>
                `;
            } else {
                console.log('Email sin contenido');
                this.elements.modalBody.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: #666;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                        <h3 style="margin: 0 0 0.5rem 0; color: #333;">Sin contenido</h3>
                        <p style="margin: 0;">Este email no contiene texto ni HTML.</p>
                    </div>
                `;
            }
        }

        // Configurar metadata
        if (this.elements.modalMeta) {
            this.elements.modalMeta.innerHTML = `
                <div class="meta-item">
                    <div class="meta-label">De:</div>
                    <div>${this.escapeHtml(email.from || 'Desconocido')}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Para:</div>
                    <div>${this.escapeHtml(this.currentAlias || this.currentEmail)}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Fecha:</div>
                    <div>${this.formatDate(email.timestamp, true)}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Plataforma:</div>
                    <div>${this.platformName}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">ID:</div>
                    <div style="font-family: monospace; font-size: 0.8rem;">${email.id}</div>
                </div>
            `;
        }

        // Mostrar modal
        this.elements.emailModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Agregar clase para animación
        this.elements.emailModal.classList.add('modal-opening');
        setTimeout(() => {
            if (this.elements.emailModal) {
                this.elements.emailModal.classList.remove('modal-opening');
            }
        }, 300);

        console.log('=== MODAL MOSTRADO EXITOSAMENTE ===');
    }

    closeModal() {
        console.log('=== CERRANDO MODAL ===');
        
        if (this.elements.emailModal) {
            // Animación de cierre
            this.elements.emailModal.classList.add('modal-closing');
            setTimeout(() => {
                this.elements.emailModal.style.display = 'none';
                this.elements.emailModal.classList.remove('modal-closing');
                document.body.style.overflow = 'auto';
            }, 200);
        }
        
        console.log('=== MODAL CERRADO ===');
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

    updateConnectionStatus(status) {
        let statusDiv = document.querySelector('.connection-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.className = 'connection-status';
            document.body.appendChild(statusDiv);
        }

        statusDiv.className = `connection-status ${status}`;
        
        switch (status) {
            case 'connected':
                statusDiv.textContent = '🟢 Conectado';
                break;
            case 'connecting':
                statusDiv.textContent = '🟡 Conectando...';
                break;
            case 'disconnected':
                statusDiv.textContent = '🔴 Desconectado';
                break;
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
        
        if (detailed) {
            return date.toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Lima'
            });
        }
        
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return date.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit',
                timeZone: 'America/Lima'
            });
        } else if (diffDays === 1) {
            return 'Ayer';
        } else if (diffDays < 7) {
            return `Hace ${diffDays} días`;
        } else {
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                timeZone: 'America/Lima'
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
    }

    hideLoading() {
        console.log('Loading finished');
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
        console.log(`=== EJECUTANDO RESET ${this.platformName} ===`);
        
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        this.currentEmail = null;
        this.currentAlias = null;
        this.currentTag = null;
        this.emails = [];
        
        if (this.elements.emailInput) {
            this.elements.emailInput.value = '';
            this.elements.emailInput.className = 'platform-email-input';
        }
        
        if (this.elements.consultBtn) {
            this.elements.consultBtn.disabled = true;
        }
        
        if (this.elements.inputSection) {
            this.elements.inputSection.style.display = 'block';
        }
        if (this.elements.activeSection) {
            this.elements.activeSection.style.display = 'none';
        }
        if (this.elements.inboxSection) {
            this.elements.inboxSection.style.display = 'none';
        }
        
        this.closeModal();
        this.updateConnectionStatus('disconnected');
        
        localStorage.removeItem(`hansWeb${this.platformName}Session`);
        window.scrollTo({ top: 0, behavior: "auto" });
        
        console.log(`=== RESET ${this.platformName} COMPLETADO ===`);
    }
}

// FUNCIÓN GLOBAL PARA ABRIR MODAL - CORREGIDA
window.openPlatformEmailModal = function(emailId, platformName) {
    console.log(`Función global llamada: openPlatformEmailModal(${emailId}, ${platformName})`);
    
    const managerName = `${platformName.toLowerCase()}Manager`;
    const manager = window[managerName];
    
    if (manager && typeof manager.openEmailModal === 'function') {
        console.log(`Llamando a ${managerName}.openEmailModal(${emailId})`);
        manager.openEmailModal(emailId);
    } else {
        console.error(`Manager no encontrado: ${managerName}`, window[managerName]);
        console.log('Managers disponibles:', Object.keys(window).filter(key => key.includes('Manager')));
    }
};

// Funciones adicionales para debugging
window.debugModal = function(platformName) {
    const managerName = `${platformName.toLowerCase()}Manager`;
    const manager = window[managerName];
    
    console.log('=== DEBUG MODAL ===');
    console.log('Platform:', platformName);
    console.log('Manager name:', managerName);
    console.log('Manager exists:', !!manager);
    console.log('Emails count:', manager?.emails?.length || 0);
    console.log('Modal element:', manager?.elements?.emailModal);
    console.log('=== FIN DEBUG ===');
};

window.testModal = function(platformName) {
    const managerName = `${platformName.toLowerCase()}Manager`;
    const manager = window[managerName];
    
    if (manager && manager.emails && manager.emails.length > 0) {
        console.log('Probando abrir modal con el primer email...');
        manager.openEmailModal(manager.emails[0].id);
    } else {
        console.log('No hay emails para probar el modal');
    }
};

// Limpiar al cambiar de página
window.addEventListener('beforeunload', () => {
    localStorage.clear();
});

console.log('Script de platform codes cargado completamente - Modal corregido');