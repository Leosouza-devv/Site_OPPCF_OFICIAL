'use strict';

window.OPPCFTables = (() => {
    let sortBy = 'municipality';
    let direction = 1;

    function sorted(rows) {
        return [...rows].sort((a, b) => {
            const left = a[sortBy];
            const right = b[sortBy];
            if (sortBy === 'value') return ((left ?? -Infinity) - (right ?? -Infinity)) * direction;
            return String(left ?? '').localeCompare(String(right ?? ''), 'pt-BR', { numeric: true }) * direction;
        });
    }

    function render(body, rows, indicator, onSorted) {
        body.replaceChildren();
        const data = sorted(rows);
        if (!data.length) {
            const tr = document.createElement('tr'), td = document.createElement('td');
            td.colSpan = 5;
            td.textContent = 'Não há dados disponíveis para esta seleção.';
            tr.append(td); body.append(tr); return;
        }
        for (const item of data) {
            const tr = document.createElement('tr');
            const values = [item.municipality, item.year, item.value === null ? `Indisponível (${item.rawValue})` : new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(item.value), item.unit || indicator.unit, `IBGE · SIDRA ${indicator.table}`];
            for (const value of values) { const td = document.createElement('td'); td.textContent = value; tr.append(td); }
            body.append(tr);
        }
        onSorted?.(data);
    }

    function bindSort(buttons, onSort) {
        buttons.forEach((button) => button.addEventListener('click', () => {
            if (sortBy === button.dataset.sort) direction *= -1;
            else { sortBy = button.dataset.sort; direction = 1; }
            onSort();
        }));
    }

    function exportCsv(rows, indicator) {
        const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
        const lines = [['Município', 'Ano', 'Valor original SIDRA', 'Valor numérico', 'Unidade', 'Tabela SIDRA'], ...sorted(rows).map((row) => [row.municipality, row.year, row.rawValue, row.value ?? '', row.unit || indicator.unit, indicator.table])];
        const blob = new Blob(['\uFEFF' + lines.map((line) => line.map(escape).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url; link.download = `oppcf-sidra-${indicator.id}.csv`; link.click();
        URL.revokeObjectURL(url);
    }

    return { render, bindSort, exportCsv };
})();
