'use strict';

(() => {
    const USERS_KEY = 'oppcf_demo_users_v1';
    const SESSION_KEY = 'oppcf_demo_session_v1';
    const EMPTY = 'Não informado';
    const normalizeEmail = (value) => value.trim().toLocaleLowerCase('pt-BR');

    function readUsers() {
        try {
            const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            return Array.isArray(users) ? users : [];
        } catch (_) { return []; }
    }

    function getSessionUser() {
        try {
            const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
            if (!session || typeof session.userId !== 'string') return null;
            const user = readUsers().find((item) => item.id === session.userId);
            if (!user || !user.name || !user.email) {
                sessionStorage.removeItem(SESSION_KEY);
                return null;
            }
            return user;
        } catch (_) { return null; }
    }

    function bytesToBase64(bytes) {
        return btoa(String.fromCharCode(...new Uint8Array(bytes)));
    }

    function base64ToBytes(value) {
        return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
    }

    async function hashPassword(password, salt) {
        const encodedSalt = salt || bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
        const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
        const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: base64ToBytes(encodedSalt), iterations: 120000, hash: 'SHA-256' }, key, 256);
        return { salt: encodedSalt, hash: bytesToBase64(bits) };
    }

    async function verifyPassword(password, credentials) {
        const result = await hashPassword(password, credentials.salt);
        const expected = base64ToBytes(credentials.hash);
        const actual = base64ToBytes(result.hash);
        return expected.length === actual.length && expected.every((byte, index) => byte === actual[index]);
    }

    function showFeedback(node, message, isError) {
        if (!node) return;
        node.textContent = message;
        node.classList.toggle('erro', Boolean(isError));
        node.classList.toggle('sucesso', Boolean(message) && !isError);
    }

    function fieldError(input, message) {
        const group = input.closest('.form-group');
        let hint = group && group.querySelector('.mensagem-campo');
        if (group && !hint) {
            hint = document.createElement('small');
            hint.className = 'mensagem-campo';
            hint.id = `${input.id}-erro`;
            group.append(hint);
        }
        input.classList.toggle('campo-invalido', Boolean(message));
        if (message) {
            hint.textContent = message;
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', hint.id);
        } else {
            hint?.remove();
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
        }
    }

    function switchTab(tab) {
        const target = document.querySelector(`[data-tab="${tab}"]`);
        if (target) target.click();
    }

    function displayValue(value) { return value ? String(value) : EMPTY; }

    function updateHeader() {
        const user = getSessionUser();
        document.querySelectorAll('[data-user-root]').forEach((root) => {
            const access = root.querySelector('[data-user-access]');
            const auth = root.querySelector('[data-user-auth]');
            if (access) access.hidden = Boolean(user);
            if (auth) auth.hidden = !user;
            if (!user) return;
            root.querySelector('[data-user-name]').textContent = user.name.split(/\s+/)[0];
            root.querySelector('[data-profile-name]').textContent = user.name;
            root.querySelector('[data-profile-email]').textContent = user.email;
            root.querySelector('[data-user-initial]').textContent = user.name.trim().charAt(0).toLocaleUpperCase('pt-BR');
            root.querySelector('[data-profile-birth]').textContent = displayValue(user.birthDate);
            root.querySelector('[data-profile-gender]').textContent = displayValue(user.genderLabel);
            root.querySelector('[data-profile-city]').textContent = displayValue(user.city);
            root.querySelector('[data-profile-race]').textContent = displayValue(user.raceLabel);
        });
    }

    function closeMenus() {
        document.querySelectorAll('[data-profile-menu]').forEach((menu) => { menu.hidden = true; });
        document.querySelectorAll('[data-profile-toggle]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
    }

    function bindProfileMenu() {
        document.querySelectorAll('[data-profile-toggle]').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const menu = button.parentElement.querySelector('[data-profile-menu]');
                const shouldOpen = menu.hidden;
                closeMenus();
                menu.hidden = !shouldOpen;
                button.setAttribute('aria-expanded', String(shouldOpen));
            });
        });
        document.addEventListener('click', (event) => {
            if (!event.target.closest('[data-user-root]')) closeMenus();
        });
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenus(); });
        document.querySelectorAll('[data-user-logout]').forEach((button) => button.addEventListener('click', () => {
            sessionStorage.removeItem(SESSION_KEY);
            closeMenus();
            updateHeader();
            window.location.assign(new URL('index.html', document.baseURI).href);
        }));
    }

    function bindAccessForms() {
        const registration = document.querySelector('[data-register-form]');
        if (registration) {
            const feedback = document.querySelector('[data-register-feedback]');
            registration.querySelectorAll('input, select').forEach((input) => {
                input.addEventListener('input', () => fieldError(input, ''));
                input.addEventListener('change', () => fieldError(input, ''));
            });
            registration.addEventListener('submit', async (event) => {
                event.preventDefault();
                showFeedback(feedback, '', false);
                const name = registration.elements.nome_completo.value.trim();
                const emailInput = registration.elements.email;
                const email = normalizeEmail(emailInput.value);
                const birthDate = registration.elements.data_nascimento.value;
                const gender = registration.elements.genero.value;
                const city = registration.elements.cidade_estado.value.trim();
                const race = registration.elements.raca_cor.value;
                const passwordInput = registration.elements.senha;
                const confirmInput = registration.elements.confirmar_senha;
                let valid = true;
                const required = [[registration.elements.nome_completo, name], [emailInput, email], [registration.elements.data_nascimento, birthDate], [registration.elements.genero, gender], [registration.elements.cidade_estado, city], [registration.elements.raca_cor, race], [passwordInput, passwordInput.value], [confirmInput, confirmInput.value]];
                required.forEach(([input, value]) => {
                    const message = value ? '' : 'Este campo é obrigatório.';
                    fieldError(input, message);
                    if (message) valid = false;
                });
                if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fieldError(emailInput, 'Informe um e-mail válido.'); valid = false; }
                const birth = birthDate ? new Date(`${birthDate}T00:00:00`) : null;
                if (birthDate && (Number.isNaN(birth.getTime()) || birth > new Date() || birth.getFullYear() < 1900)) { fieldError(registration.elements.data_nascimento, 'Informe uma data de nascimento válida.'); valid = false; }
                if (passwordInput.value && passwordInput.value.length < 8) { fieldError(passwordInput, 'A senha deve ter pelo menos 8 caracteres.'); valid = false; }
                if (confirmInput.value && confirmInput.value !== passwordInput.value) { fieldError(confirmInput, 'As senhas não coincidem.'); valid = false; }
                if (!registration.elements.aceite_termos.checked) {
                    showFeedback(feedback, 'É necessário concordar com os termos para continuar.', true);
                    valid = false;
                }
                let users;
                try { users = readUsers(); localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
                catch (_) { showFeedback(feedback, 'O armazenamento local está indisponível neste navegador.', true); return; }
                if (email && users.some((user) => normalizeEmail(user.email) === email)) { fieldError(emailInput, 'Já existe uma conta demonstrativa com este e-mail.'); valid = false; }
                if (!valid) return;
                if (!crypto.subtle || !crypto.getRandomValues) { showFeedback(feedback, 'Este navegador não oferece a API criptográfica necessária. Abra a página em HTTPS ou localhost.', true); return; }
                try {
                    const credential = await hashPassword(passwordInput.value);
                    const user = { id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`, name, email, birthDate, gender, genderLabel: registration.elements.genero.selectedOptions[0].textContent.trim(), city, race, raceLabel: registration.elements.raca_cor.selectedOptions[0].textContent.trim(), password: credential, createdAt: new Date().toISOString() };
                    users.push(user);
                    localStorage.setItem(USERS_KEY, JSON.stringify(users));
                    registration.reset();
                    switchTab('login');
                    document.querySelector('#login-email').value = email;
                    showFeedback(document.querySelector('[data-login-feedback]'), 'Cadastro demonstrativo criado. Entre com seu e-mail e senha.', false);
                } catch (_) { showFeedback(feedback, 'Não foi possível salvar o cadastro neste navegador.', true); }
            });
        }

        const login = document.querySelector('[data-login-form]');
        if (login) {
            const feedback = document.querySelector('[data-login-feedback]');
            login.addEventListener('submit', async (event) => {
                event.preventDefault();
                showFeedback(feedback, '', false);
                const emailInput = login.elements.login_email;
                const passwordInput = login.elements.login_senha;
                const email = normalizeEmail(emailInput.value);
                fieldError(emailInput, email ? '' : 'Informe seu e-mail.');
                fieldError(passwordInput, passwordInput.value ? '' : 'Informe sua senha.');
                if (!email || !passwordInput.value) return;
                let users;
                try { users = readUsers(); } catch (_) { users = []; }
                const user = users.find((item) => normalizeEmail(item.email) === email);
                let matches = false;
                try { matches = Boolean(user && user.password && await verifyPassword(passwordInput.value, user.password)); } catch (_) { matches = false; }
                if (!matches) { showFeedback(feedback, 'Não foi possível entrar. Verifique seu e-mail e sua senha.', true); return; }
                try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id })); }
                catch (_) { showFeedback(feedback, 'Não foi possível iniciar a sessão neste navegador.', true); return; }
                window.location.assign(new URL('index.html', document.baseURI).href);
            });
        }

        const params = new URLSearchParams(window.location.search);
        const registrationTab = document.querySelector('[data-tab="cadastro"]');
        if (params.get('tab') === 'cadastro') {
            if (registrationTab) registrationTab.click();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateHeader();
        bindProfileMenu();
        bindAccessForms();
        window.addEventListener('storage', updateHeader);
    });
})();
