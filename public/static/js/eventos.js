'use strict';

(() => {
    const STORAGE_KEY = 'oppcf_demo_events_v1';
    const form = document.querySelector('[data-event-form]');
    const list = document.querySelector('[data-event-list]');
    if (!form || !list) return;

    const count = document.querySelector('[data-event-count]');
    const feedback = document.querySelector('[data-event-feedback]');
    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

    function readEvents() {
        try {
            const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            return Array.isArray(events) ? events.filter((event) => event && event.title && event.date) : [];
        } catch (_) {
            return [];
        }
    }

    function render() {
        const events = readEvents().sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''));
        count.textContent = `${events.length} ${events.length === 1 ? 'evento' : 'eventos'}`;
        if (!events.length) {
            list.innerHTML = '<article class="evento-vazio"><span aria-hidden="true">◎</span><h3>Nenhum evento cadastrado</h3><p>Quando uma atividade for adicionada, as informações aparecerão aqui.</p></article>';
            return;
        }
        list.innerHTML = events.map((event) => {
            const date = new Date(`${event.date}T00:00:00`);
            const formattedDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
            const link = event.link && /^https?:\/\//i.test(event.link) ? `<a class="evento-link" href="${escapeHtml(event.link)}" target="_blank" rel="noopener noreferrer">Acessar link <span aria-hidden="true">↗</span></a>` : '';
            return `<article class="evento-card"><div class="evento-data"><span>${escapeHtml(formattedDate)}</span>${event.time ? `<span>${escapeHtml(event.time)}</span>` : ''}</div><div class="evento-detalhes"><h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(event.description)}</p>${event.location ? `<p class="evento-local"><strong>Local:</strong> ${escapeHtml(event.location)}</p>` : ''}${link}</div></article>`;
        }).join('');
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        feedback.textContent = '';
        const values = new FormData(form);
        const title = String(values.get('title') || '').trim();
        const description = String(values.get('description') || '').trim();
        const date = String(values.get('date') || '');
        const time = String(values.get('time') || '');
        const location = String(values.get('location') || '').trim();
        const link = String(values.get('link') || '').trim();
        if (!title || !description || !date) return;
        const selectedDate = new Date(`${date}T00:00:00`);
        if (Number.isNaN(selectedDate.getTime())) {
            feedback.textContent = 'Informe uma data válida.';
            return;
        }
        const events = readEvents();
        events.push({ title, description, date, time, location, link, createdAt: new Date().toISOString() });
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
            form.reset();
            render();
            feedback.textContent = 'Evento adicionado neste navegador.';
        } catch (_) {
            feedback.textContent = 'Não foi possível salvar o evento neste navegador.';
        }
    });

    render();
})();
