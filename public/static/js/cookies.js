// === CODIGO EM HTML - MANIPULAÇÃO DO DOM COM JAVASCRIPT

// Aplicando código HTML manipulando o DOM em JS a fim de diminuir a quantidade de código nas paginas html para inserir o banner cookies 

const cookies_DOM = document.getElementById('cookies');

cookies_DOM.innerHTML = `

        <div id="cookieBanner" class="cookie-banner">
        <div class="cookie-content">
            <div class="cookie-icon">🍪</div>

            <div class="cookie-actions_container">
                <div class="cookie-text">
                    <div class="cookie-title">Nós usamos cookies</div>
                    <div class="cookie-description">
                        Este site utiliza cookies para melhorar sua experiência de navegação.
                        Você pode personalizar suas preferências ou aceitar todos os cookies.
                        <a href="#" class="cookie-link">Saiba mais</a>
                    </div>
                </div>
                <div class="cookie-actions">
                    <button class="cookie-btn btn-accept" onclick="acceptAllCookies()">
                        Aceitar Todos
                    </button>
                    <button class="cookie-btn btn-customize" onclick="showSettings()">
                        Personalizar
                    </button>
                    <button class="cookie-btn btn-reject" onclick="rejectCookies()">
                        Rejeitar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Cookies personalizados -->
    <div id="cookieSettings" class="cookie-settings">
        <div class="settings-modal">
            <div class="settings-header">
                <div class="settings-title">Configurações de Cookies</div>
                <div class="settings-subtitle">
                    Gerencie suas preferências de cookies. Você pode ativar ou desativar diferentes tipos de cookies
                    abaixo.
                </div>
            </div>
            <div class="settings-content">
                <div class="cookie-category">
                    <div>
                        <div class="category-header">
                            <div class="category-title">Cookies Essenciais</div>

                        </div>
                        <div class="category-description">
                            Estes cookies são necessários para o funcionamento básico do site e não podem ser
                            desativados.
                        </div>
                    </div>

                    <label class="toggle-switch">
                        <input type="checkbox" class="toggle-input" checked disabled>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="cookie-category">
                    <div>
                        <div class="category-header">
                            <div class="category-title">Cookies de Performance</div>

                        </div>
                        <div class="category-description">
                            Estes cookies nos ajudam a entender como você interage com o site, fornecendo informações
                            sobre
                            as páginas visitadas.
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" class="toggle-input" id="performance" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>


                <div class="cookie-category">
                    <div>
                        <div class="category-header">
                            <div class="category-title">Cookies de Funcionalidade</div>
                        </div>
                        <div class="category-description">
                            Estes cookies permitem que o site lembre de suas escolhas e forneça recursos aprimorados.
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" class="toggle-input" id="functionality" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            <div class="settings-footer">
                <button class="cookie-btn btn-reject" onclick="hideSettings()">
                    Cancelar
                </button>
                <button class="cookie-btn btn-accept" onclick="saveSettings()">
                    Salvar Preferências
                </button>
            </div>
        </div>
    </div>

    <!-- Notification -->
    <div id="notification" class="notification">
        Preferências de cookies salvas com sucesso!
    </div>



`;

// === CODIGO APENAS EM JS === //

// Cookie Manager - Versão Simplificada e Robusta
(function() {
    'use strict';
    
    // Configurações globais
    const CONFIG = {
        bannerDelay: 500,
        notificationDuration: 3000,
        cookieExpireDays: 365,
        storageKeys: {
            consent: 'cookieConsent',
            preferences: 'cookiePreferences',
            consentDate: 'cookieConsentDate'
        }
    };

    // Estado inicial - ajustado para corresponder ao HTML
    let preferences = {
        essential: true,
        performance: true,
        functionality: true
    };

    let isInitialized = false;

    // Utilitários de Storage
    const storage = {
        isAvailable: function() {
            try {
                const test = '__storage_test__';
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch(e) {
                return false;
            }
        },

        get: function(key) {
            if (!this.isAvailable()) return null;
            try {
                return localStorage.getItem(key);
            } catch(e) {
                console.warn('Storage get error:', e);
                return null;
            }
        },

        set: function(key, value) {
            if (!this.isAvailable()) return false;
            try {
                localStorage.setItem(key, value);
                return true;
            } catch(e) {
                console.warn('Storage set error:', e);
                return false;
            }
        },

        remove: function(key) {
            if (!this.isAvailable()) return false;
            try {
                localStorage.removeItem(key);
                return true;
            } catch(e) {
                console.warn('Storage remove error:', e);
                return false;
            }
        }
    };

    // Utilitários DOM
    const dom = {
        get: function(id) {
            return document.getElementById(id);
        },

        addClass: function(element, className) {
            if (element && element.classList) {
                element.classList.add(className);
            }
        },

        removeClass: function(element, className) {
            if (element && element.classList) {
                element.classList.remove(className);
            }
        },

        hasClass: function(element, className) {
            return element && element.classList && element.classList.contains(className);
        }
    };

    // Funções principais
    function hasValidConsent() {
        const consent = storage.get(CONFIG.storageKeys.consent);
        const consentDate = storage.get(CONFIG.storageKeys.consentDate);
        
        if (!consent || !consentDate) {
            return false;
        }

        const timestamp = parseInt(consentDate, 10);
        if (isNaN(timestamp)) {
            return false;
        }

        const daysDiff = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
        return daysDiff < CONFIG.cookieExpireDays;
    }

    function loadPreferences() {
        const saved = storage.get(CONFIG.storageKeys.preferences);
        if (!saved) return;

        try {
            const parsed = JSON.parse(saved);
            if (validatePreferences(parsed)) {
                preferences = Object.assign({}, preferences, parsed);
                updateSettingsUI();
            }
        } catch(e) {
            console.warn('Error parsing preferences:', e);
        }
    }

    function validatePreferences(prefs) {
        if (!prefs || typeof prefs !== 'object') return false;
        
        // Ajustado para as categorias que realmente existem no HTML
        const required = ['essential', 'performance', 'functionality'];
        return required.every(function(key) {
            return prefs.hasOwnProperty(key) && typeof prefs[key] === 'boolean';
        });
    }

    function savePreferences() {
        try {
            const success = storage.set(CONFIG.storageKeys.consent, 'true') &&
                           storage.set(CONFIG.storageKeys.consentDate, Date.now().toString()) &&
                           storage.set(CONFIG.storageKeys.preferences, JSON.stringify(preferences));

            if (success) {
                dispatchConsentEvent();
                return true;
            }
            return false;
        } catch(e) {
            console.error('Error saving preferences:', e);
            return false;
        }
    }

    function updateSettingsUI() {
        try {
            // Apenas os elementos que existem no HTML
            const elements = {
                performance: dom.get('performance'),
                functionality: dom.get('functionality')
            };

            console.log('Atualizando UI com preferências:', preferences);
            console.log('Elementos encontrados:', elements);

            for (const key in elements) {
                const element = elements[key];
                
                if (element) {
                    // Verificar se é um checkbox
                    if (element.type === 'checkbox') {
                        const value = preferences[key];
                        if (typeof value === 'boolean') {
                            element.checked = value;
                            console.log(`${key} definido para:`, value);
                        } else {
                            console.warn(`Valor inválido para ${key}:`, value);
                        }
                    } else {
                        console.warn(`Elemento ${key} não é um checkbox:`, element.type);
                    }
                } else {
                    console.warn(`Elemento ${key} não encontrado`);
                }
            }
        } catch(error) {
            console.error('Erro ao atualizar UI:', error);
        }
    }

    function showBanner() {
        const banner = dom.get('cookieBanner');
        if (!banner) return;

        setTimeout(function() {
            dom.addClass(banner, 'show');
        }, CONFIG.bannerDelay);
    }

    function hideBanner() {
        const banner = dom.get('cookieBanner');
        if (banner) {
            dom.removeClass(banner, 'show');
        }
    }

    function showSettings() {
        try {
            const settings = dom.get('cookieSettings');
            if (!settings) {
                console.error('Modal de configurações não encontrado');
                showNotification('Erro: modal de configurações não encontrado.');
                return;
            }

            console.log('Abrindo configurações...');

            // Atualizar UI antes de mostrar
            updateSettingsUI();
            
            // Mostrar modal
            dom.addClass(settings, 'show');

            // Focus no primeiro toggle - com verificação adicional
            setTimeout(function() {
                try {
                    const firstToggle = settings.querySelector('input[type="checkbox"]:not([disabled])');
                    if (firstToggle && typeof firstToggle.focus === 'function') {
                        firstToggle.focus();
                        console.log('Focus definido no primeiro toggle');
                    }
                } catch(focusError) {
                    console.warn('Erro ao definir focus:', focusError);
                }
            }, 150);

        } catch(error) {
            console.error('Erro ao mostrar configurações:', error);
            showNotification('Erro ao abrir configurações.');
        }
    }

    function hideSettings() {
        const settings = dom.get('cookieSettings');
        if (settings) {
            dom.removeClass(settings, 'show');
        }
    }

    function showNotification(message) {
        const notification = dom.get('notification');
        if (!notification) return;

        notification.textContent = message || '';
        dom.addClass(notification, 'show');

        setTimeout(function() {
            dom.removeClass(notification, 'show');
        }, CONFIG.notificationDuration);
    }

    function dispatchConsentEvent() {
        try {
            const event = document.createEvent('CustomEvent');
            event.initCustomEvent('cookieConsentChanged', true, true, {
                preferences: Object.assign({}, preferences),
                timestamp: Date.now()
            });
            window.dispatchEvent(event);
        } catch(e) {
            console.warn('Could not dispatch event:', e);
        }
    }

    function triggerCallback(action) {
        if (typeof window.cookieConsentCallback === 'function') {
            try {
                window.cookieConsentCallback({
                    action: action,
                    preferences: Object.assign({}, preferences)
                });
            } catch(e) {
                console.error('Callback error:', e);
            }
        }
    }

    // Ações principais
    function acceptAll() {
        preferences = {
            essential: true,
            performance: true,
            functionality: true
        };
        
        if (savePreferences()) {
            hideBanner();
            showNotification('Todos os cookies foram aceitos!');
            triggerCallback('accept-all');
        } else {
            showNotification('Erro ao salvar preferências.');
        }
    }

    function rejectOptional() {
        preferences = {
            essential: true,
            performance: false,
            functionality: false
        };
        
        if (savePreferences()) {
            hideBanner();
            showNotification('Apenas cookies essenciais foram aceitos.');
            triggerCallback('reject-optional');
        } else {
            showNotification('Erro ao salvar preferências.');
        }
    }

    function saveCustomSettings() {
        try {
            // Buscar apenas os elementos que existem no HTML
            const performanceEl = dom.get('performance');
            const functionalityEl = dom.get('functionality');

            // Log para debug
            console.log('Performance element:', performanceEl);
            console.log('Functionality element:', functionalityEl);

            // Verificar se os elementos existem
            const elements = [performanceEl, functionalityEl];
            const missingElements = elements.filter(el => !el);
            
            if (missingElements.length > 0) {
                console.error('Elementos não encontrados:', {
                    performance: !performanceEl,
                    functionality: !functionalityEl
                });
                showNotification('Erro: elementos do formulário não encontrados.');
                return;
            }

            // Verificar se são checkboxes válidos
            if (performanceEl.type !== 'checkbox' || functionalityEl.type !== 'checkbox') {
                console.error('Elementos não são checkboxes válidos');
                showNotification('Erro: elementos inválidos.');
                return;
            }

            const oldPrefs = JSON.stringify(preferences);
            
            // Criar novas preferências com valores dos checkboxes (sem marketing)
            const newPreferences = {
                essential: true,
                performance: Boolean(performanceEl.checked),
                functionality: Boolean(functionalityEl.checked)
            };

            console.log('Novas preferências:', newPreferences);

            // Atualizar preferências globais
            preferences = newPreferences;

            // Tentar salvar
            if (savePreferences()) {
                hideSettings();
                hideBanner();
                
                const changed = oldPrefs !== JSON.stringify(preferences);
                const message = changed ? 'Suas preferências foram atualizadas!' : 'Preferências mantidas!';
                
                showNotification(message);
                triggerCallback('customize');
                
                console.log('Preferências salvas com sucesso');
            } else {
                console.error('Falha ao salvar no localStorage');
                showNotification('Erro ao salvar preferências. Tente novamente.');
                
                // Reverter preferências em caso de erro
                try {
                    if (oldPrefs) {
                        preferences = JSON.parse(oldPrefs);
                    }
                } catch(e) {
                    console.warn('Erro ao reverter preferências:', e);
                }
            }
            
        } catch(error) {
            console.error('Erro em saveCustomSettings:', error);
            showNotification('Erro inesperado. Tente novamente.');
        }
    }

    function resetConsent() {
        storage.remove(CONFIG.storageKeys.consent);
        storage.remove(CONFIG.storageKeys.preferences);
        storage.remove(CONFIG.storageKeys.consentDate);
        
        preferences = {
            essential: true,
            performance: true,
            functionality: true
        };
        
        showBanner();
    }

    // Event Listeners
    function setupEventListeners() {
        // Modal click outside
        const modal = dom.get('cookieSettings');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    hideSettings();
                }
            });
        }

        // Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                hideSettings();
            }
        });

        // Storage changes
        window.addEventListener('storage', function(e) {
            if (e.key === CONFIG.storageKeys.preferences) {
                loadPreferences();
            }
        });
    }

    // Inicialização
    function init() {
        if (isInitialized) return;
        
        try {
            if (hasValidConsent()) {
                loadPreferences();
            } else {
                showBanner();
            }
            
            setupEventListeners();
            isInitialized = true;
        } catch(e) {
            console.error('Init error:', e);
            showBanner(); // Fallback
        }
    }

    // API Pública
    const CookieManager = {
        init: init,
        acceptAll: acceptAll,
        rejectOptional: rejectOptional,
        showSettings: showSettings,
        hideSettings: hideSettings,
        saveCustomSettings: saveCustomSettings,
        resetConsent: resetConsent,
        
        getPreferences: function() {
            return Object.assign({}, preferences);
        },
        
        isAllowed: function(cookieType) {
            return preferences[cookieType] === true;
        }
    };

    // Funções globais para compatibilidade com debug
    window.acceptAllCookies = function() {
        console.log('acceptAllCookies chamado');
        acceptAll();
    };
    
    window.rejectCookies = function() {
        console.log('rejectCookies chamado');
        rejectOptional();
    };
    
    window.showSettings = function() {
        console.log('showSettings chamado');
        showSettings();
    };
    
    window.hideSettings = function() {
        console.log('hideSettings chamado');
        hideSettings();
    };
    
    window.saveSettings = function() {
        console.log('saveSettings chamado');
        saveCustomSettings();
    };
    
    window.showCookieBanner = function() {
        console.log('showCookieBanner chamado');
        resetConsent();
    };

    // Exposição global
    window.CookieManager = CookieManager;

    // Auto-inicialização
    function autoInit() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            setTimeout(init, 100);
        }
    }

    autoInit();

})();