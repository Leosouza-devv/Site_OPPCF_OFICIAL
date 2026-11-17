'use strict';

window.OPPCFCharts = (() => {
    const colors = ['#155e59', '#207f73', '#3f96d4', '#77b59d', '#28292a', '#7d927d'];
    let comparisonChart;
    let seriesChart;

    function ensureChart() {
        if (window.Chart) return true;
        throw new Error('A biblioteca de gráficos não carregou. Confira a conexão e tente novamente.');
    }

    function comparison(canvas, rows, indicator, selectedMunicipality) {
        ensureChart();
        const currentYear = document.querySelector('[data-period]')?.value;
        const current = rows.filter((row) => row.year === currentYear && row.value !== null);
        if (comparisonChart) comparisonChart.destroy();
        comparisonChart = new Chart(canvas, {
            type: 'bar',
            data: { labels: current.map((row) => row.municipality), datasets: [{ label: `${indicator.title} (${indicator.unitLabel})`, data: current.map((row) => row.value), backgroundColor: current.map((row) => row.municipalityId === selectedMunicipality ? '#155e59' : '#77b59d'), borderColor: '#155e59', borderWidth: 1, borderRadius: 6 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${new Intl.NumberFormat('pt-BR').format(context.raw)} ${indicator.unitLabel} · ${currentYear}` } } }, scales: { y: { beginAtZero: true, ticks: { callback: (value) => new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(value) }, grid: { color: '#e5e7eb' } }, x: { grid: { display: false } } } }
        });
    }

    function series(canvas, rows, indicator, municipalityId) {
        ensureChart();
        const current = rows.filter((row) => row.municipalityId === municipalityId).sort((a, b) => Number(a.year) - Number(b.year));
        if (seriesChart) seriesChart.destroy();
        seriesChart = new Chart(canvas, {
            type: 'line',
            data: { labels: current.map((row) => row.year), datasets: [{ label: `${indicator.title} (${indicator.unitLabel})`, data: current.map((row) => row.value), borderColor: colors[0], backgroundColor: 'rgba(32,127,115,.12)', pointBackgroundColor: colors[1], pointRadius: 4, tension: .25, fill: true, spanGaps: false }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => context.raw === null ? 'Dado indisponível' : `${new Intl.NumberFormat('pt-BR').format(context.raw)} ${indicator.unitLabel}` } } }, scales: { y: { beginAtZero: false, grid: { color: '#e5e7eb' } }, x: { grid: { display: false } } } }
        });
    }

    function destroy() { comparisonChart?.destroy(); seriesChart?.destroy(); }
    return { comparison, series, destroy };
})();
