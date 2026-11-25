'use strict';

window.SidraAPI = (() => {
    const API_ROOT = 'https://servicodados.ibge.gov.br/api/v3/agregados';
    const SIDRA_VALUES = 'https://apisidra.ibge.gov.br/values';
    const CACHE_PREFIX = 'oppcf_sidra_cache_v1:';
    const CACHE_TTL = 6 * 60 * 60 * 1000;

    async function getJson(url, signal) {
        const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`O IBGE respondeu com status ${response.status}.`);
        return response.json();
    }

    async function cachedJson(url, signal) {
        const key = CACHE_PREFIX + url;
        try {
            const saved = JSON.parse(localStorage.getItem(key) || 'null');
            if (saved && Date.now() - saved.savedAt < CACHE_TTL) return { data: saved.data, savedAt: saved.savedAt, cached: true };
        } catch (_) { /* armazenamento indisponível: consulta sem cache */ }
        const data = await getJson(url, signal);
        const savedAt = Date.now();
        try { localStorage.setItem(key, JSON.stringify({ savedAt, data })); } catch (_) { /* cota ou privacidade do navegador */ }
        return { data, savedAt, cached: false };
    }

    function parseSidraValue(raw) {
        if (raw === null || raw === undefined) return null;
        const value = String(raw).trim();
        if (!value || value === '...' || value === '-' || value === 'X') return null;
        const parsed = Number(value.replace(/\s/g, '').replace(/,(?=\d{1,2}$)/, '.'));
        return Number.isFinite(parsed) ? parsed : null;
    }

    async function metadata(indicator, signal) {
        return cachedJson(`${API_ROOT}/${indicator.table}/metadados`, signal);
    }

    async function periods(indicator, signal) {
        return cachedJson(`${API_ROOT}/${indicator.table}/periodos`, signal);
    }

    async function municipalSeries(indicator, municipalityIds, years, signal) {
        const periodsPart = years.join('|');
        const locationsPart = municipalityIds.join(',');
        const url = `${API_ROOT}/${indicator.table}/periodos/${periodsPart}/variaveis/${indicator.variable}?localidades=N6[${locationsPart}]`;
        const result = await cachedJson(url, signal);
        const variableResult = Array.isArray(result.data) ? result.data.find((item) => String(item.id) === String(indicator.variable)) : result.data;
        const series = variableResult?.resultados?.flatMap((group) => group.series || []) || [];
        const rows = [];
        for (const item of series) {
            const municipality = item.localidade || {};
            const id = String(municipality.id || '').replace(/\D/g, '');
            const name = municipality.nome || 'Município';
            for (const [year, rawValue] of Object.entries(item.serie || {})) {
                rows.push({ municipalityId: id, municipality: name.replace(/ \(RJ\)$/, ''), year, rawValue: String(rawValue), value: parseSidraValue(rawValue), unit: variableResult.unidade || indicator.unit });
            }
        }
        return { rows, savedAt: result.savedAt, cached: result.cached };
    }

    async function singleValue(indicator, municipalityId, year, signal) {
        const url = `${SIDRA_VALUES}/t/${indicator.table}/n6/${municipalityId}/v/${indicator.variable}/p/${year}`;
        const result = await cachedJson(url, signal);
        const row = Array.isArray(result.data) ? result.data.slice(1).find((item) => String(item.D2C) === String(indicator.variable)) : null;
        return {
            row: row ? { municipalityId: row.D1C, municipality: row.D1N.replace(/ \(RJ\)$/, ''), year: row.D3C, rawValue: row.V, value: parseSidraValue(row.V), unit: row.MN || indicator.unit } : null,
            savedAt: result.savedAt, cached: result.cached
        };
    }

    return { metadata, periods, municipalSeries, singleValue, parseSidraValue };
})();
