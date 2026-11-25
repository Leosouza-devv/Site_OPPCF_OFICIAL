'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const indicators = window.OPPCF_INDICATORS;
    const municipalitySelect = document.querySelector('[data-municipality]');
    const indicatorSelect = document.querySelector('[data-indicator]');
    const categorySelect = document.querySelector('[data-category]');
    const searchInput = document.querySelector('[data-search]');
    const periodSelect = document.querySelector('[data-period]');
    const status = document.querySelector('[data-status]');
    const errorPanel = document.querySelector('[data-error]');
    const rowsBody = document.querySelector('[data-table-body]');
    const rowsCache = new Map();
    let controller;
    let currentRows = [];
    let currentIndicator;

    const selectedMunicipalityIds = () => [...municipalitySelect.selectedOptions].map((option) => option.value);
    const formatValue = (value, unit) => value === null ? 'Indisponível' : `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value)} ${unit}`;

    function setStatus(message) { status.textContent = message; status.hidden = !message; }
    function setError(message) {
        errorPanel.hidden = !message;
        document.querySelector('[data-error-message]').textContent = message || '';
        if (message) setStatus('');
    }

    function setPeriods(indicator, periods) {
        const available = new Set(periods.map((item) => String(item.id)));
        const years = indicator.years.filter((year) => available.has(year));
        indicatorSelect.querySelectorAll('option').forEach((option) => {
            const configured = indicators[option.value];
            if (configured) option.textContent = `${configured.title} (${configured.years.filter((year) => available.has(year)).join(', ') || 'sem períodos'})`;
        });
        periodSelect.replaceChildren();
        if (!years.length) {
            const option = document.createElement('option'); option.value = ''; option.textContent = 'Período indisponível'; periodSelect.append(option); return;
        }
        for (const year of years) { const option = document.createElement('option'); option.value = year; option.textContent = year; periodSelect.append(option); }
        periodSelect.value = indicator.id === 'population' ? '2022' : years.at(-1);
    }

    function updateSummary(rows) {
        const summary = document.querySelector('[data-summary]');
        const year = periodSelect.value;
        const primaryMunicipality = selectedMunicipalityIds()[0];
        const row = rows.find((item) => item.municipalityId === primaryMunicipality && item.year === year);
        summary.replaceChildren();
        const card = document.createElement('article'); card.className = 'dados-card dados-indicador';
        const label = document.createElement('p'); label.textContent = currentIndicator.title;
        const value = document.createElement('strong'); value.textContent = formatValue(row?.value ?? null, currentIndicator.unitLabel);
        const detail = document.createElement('span'); detail.textContent = `${row?.municipality || 'Município selecionado'} · ${year || 'sem período'}`;
        const source = document.createElement('small'); source.textContent = `Fonte: IBGE · ${currentIndicator.survey}`;
        card.append(label, value, detail, source); summary.append(card);
    }

    function updatePeriodValue(rows) {
        if (!rows.length) return;
        const selected = periodSelect.value;
        const selectedRows = rows.filter((row) => row.year === selected);
        updateSummary(rows);
        const comparisonRows = selectedRows;
        try {
            OPPCFCharts.comparison(document.querySelector('[data-chart]'), comparisonRows, currentIndicator, municipalitySelect.value);
            OPPCFCharts.series(document.querySelector('[data-series]'), rows, currentIndicator, municipalitySelect.value);
        } catch (error) { setError(error.message); }
    }

    function updateVisuals(rows) {
        currentRows = rows;
        updateSummary(rows);
        document.querySelector('[data-chart-title]').textContent = `Comparação entre municípios · ${currentIndicator.title}`;
        document.querySelector('[data-unit]').textContent = currentIndicator.unitLabel;
        const sourceNode = document.querySelector('[data-source]');
        sourceNode.replaceChildren(document.createTextNode(`Fonte: IBGE, ${currentIndicator.survey}; tabela `));
        const sourceLink = document.createElement('a'); sourceLink.href = currentIndicator.tableUrl; sourceLink.target = '_blank'; sourceLink.rel = 'noopener noreferrer'; sourceLink.textContent = `SIDRA ${currentIndicator.table}`;
        sourceNode.append(sourceLink, document.createTextNode(`. Unidade: ${currentIndicator.unit}.`));
        document.querySelector('[data-series-source]').textContent = `Fonte: IBGE, ${currentIndicator.survey} · tabela SIDRA ${currentIndicator.table} · ${currentIndicator.unit}.`;
        document.querySelector('[data-metadata]').textContent = `${currentIndicator.description} Variável ${currentIndicator.variable} · Tabela ${currentIndicator.table} · Unidade: ${currentIndicator.unit}.`;
        document.querySelector('[data-table-caption]').textContent = `${currentIndicator.title} (${currentIndicator.unit}) por município e ano`;
        const renderTable = () => OPPCFTables.render(rowsBody, currentRows.filter((row) => selectedMunicipalityIds().includes(row.municipalityId) && row.municipality.toLocaleLowerCase('pt-BR').includes(searchInput.value.trim().toLocaleLowerCase('pt-BR'))), currentIndicator);
        renderTable();
        try {
            const comparisonRows = rows.filter((row) => row.year === periodSelect.value);
            OPPCFCharts.comparison(document.querySelector('[data-chart]'), comparisonRows, currentIndicator, municipalitySelect.value);
            OPPCFCharts.series(document.querySelector('[data-series]'), rows, currentIndicator, selectedMunicipalityIds()[0]);
        } catch (error) { setError(error.message); }
    }

    async function load() {
        controller?.abort(); controller = new AbortController();
        const signal = controller.signal;
        currentIndicator = indicators[indicatorSelect.value];
        setError(''); setStatus('Consultando metadados e valores publicados pelo IBGE…');
        try {
            const [meta, periodData] = await Promise.all([SidraAPI.metadata(currentIndicator, signal), SidraAPI.periods(currentIndicator, signal)]);
            const periodList = Array.isArray(periodData.data) ? periodData.data : [];
            setPeriods(currentIndicator, periodList);
            const ids = selectedMunicipalityIds();
            if (!ids.length) throw new Error('Selecione ao menos um município para consultar.');
            const key = `${currentIndicator.id}|${[...ids].sort().join(',')}|${currentIndicator.years.join(',')}`;
            let result = rowsCache.get(key);
            if (!result) { result = await SidraAPI.municipalSeries(currentIndicator, [...ids].sort(), currentIndicator.years, signal); rowsCache.set(key, result); }
            if (signal.aborted) return;
            const metadata = meta.data;
            const verifiedVariable = metadata.variaveis?.find((variable) => String(variable.id) === String(currentIndicator.variable));
            const verified = metadata.id === currentIndicator.table && verifiedVariable?.unidade === currentIndicator.unit;
            if (!verified) throw new Error('Os metadados recebidos não correspondem à variável configurada. Dados não foram exibidos.');
            const publishedYears = new Set(periodList.map((item) => String(item.id)));
            const unsupportedYears = currentIndicator.years.filter((year) => !publishedYears.has(year));
            if (unsupportedYears.length) {
                currentIndicator.years = currentIndicator.years.filter((year) => publishedYears.has(year));
                if (!currentIndicator.years.length) throw new Error('A API do SIDRA não anunciou períodos disponíveis para esta tabela.');
                setPeriods(currentIndicator, periodList);
            }
            if (!result.rows.length) throw new Error('O SIDRA não retornou dados para os municípios desta lista. Tente novamente mais tarde.');
            const sourceDates = [meta.savedAt, periodData.savedAt, result.savedAt].filter(Boolean);
            updateVisuals(result.rows);
            document.querySelector('[data-updated]').textContent = `Consulta realizada em ${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(Math.max(...sourceDates)))}${result.cached || meta.cached ? ' (inclui resultado em cache local de até 6 horas)' : ''}.`;
            setStatus(`${result.rows.filter((row) => row.value !== null).length} valores disponíveis nesta consulta · dados oficiais do IBGE/SIDRA.`);
        } catch (error) {
            if (signal.aborted) return;
            currentRows = [];
            document.querySelector('[data-summary]').replaceChildren();
            rowsBody.innerHTML = '<tr><td colspan="5">Dados indisponíveis para esta consulta.</td></tr>';
            OPPCFCharts.destroy();
            setError(error.message || 'Não foi possível consultar o IBGE. Verifique sua conexão e tente novamente.');
        }
    }

    function filterIndicators() {
        const available = Object.values(indicators).filter((indicator) => indicator.category === categorySelect.value);
        indicatorSelect.replaceChildren(...available.map((indicator) => { const option = document.createElement('option'); option.value = indicator.id; option.textContent = indicator.title; return option; }));
        indicatorSelect.value = available[0]?.id || '';
        load();
    }
    categorySelect.addEventListener('change', filterIndicators);
    indicatorSelect.addEventListener('change', load);
    municipalitySelect.addEventListener('change', load);
    periodSelect.addEventListener('change', () => updatePeriodValue(currentRows));
    searchInput.addEventListener('input', () => OPPCFTables.render(rowsBody, currentRows.filter((row) => selectedMunicipalityIds().includes(row.municipalityId) && row.municipality.toLocaleLowerCase('pt-BR').includes(searchInput.value.trim().toLocaleLowerCase('pt-BR'))), currentIndicator));
    document.querySelector('[data-reset]').addEventListener('click', () => { categorySelect.value = 'Demografia'; municipalitySelect.querySelectorAll('option').forEach((option) => { option.selected = true; }); searchInput.value = ''; filterIndicators(); });
    document.querySelector('[data-retry]').addEventListener('click', load);
    document.querySelector('[data-export]').addEventListener('click', () => OPPCFTables.exportCsv(currentRows, currentIndicator));
    OPPCFTables.bindSort(document.querySelectorAll('[data-sort]'), () => OPPCFTables.render(rowsBody, currentRows, currentIndicator));
    load();
});
