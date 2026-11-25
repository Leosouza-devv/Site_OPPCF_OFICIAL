'use strict';

window.OPPCF_INDICATORS = {
    population: {
        id: 'population', category: 'Demografia', title: 'População residente',
        table: 9514, variable: 93, unit: 'Pessoas', unitLabel: 'pessoas',
        survey: 'Censo Demográfico 2022', years: ['2022'],
        description: 'Total de pessoas residentes no município na data de referência do Censo 2022.',
        tableUrl: 'https://sidra.ibge.gov.br/tabela/9514', periodType: 'single'
    },
    estimate: {
        id: 'estimate', category: 'Demografia', title: 'População residente estimada',
        table: 6579, variable: 9324, unit: 'Pessoas', unitLabel: 'pessoas',
        survey: 'Estimativas de População', years: ['2023', '2024', '2025', '2026'],
        description: 'Estimativa anual de população residente; não é uma contagem censitária.',
        tableUrl: 'https://sidra.ibge.gov.br/tabela/6579', periodType: 'series'
    },
    gdp: {
        id: 'gdp', category: 'Economia', title: 'PIB a preços correntes',
        table: 5938, variable: 37, unit: 'Mil Reais', unitLabel: 'mil R$',
        survey: 'Produto Interno Bruto dos Municípios', years: ['2021', '2022', '2023'],
        description: 'Valor do PIB municipal a preços correntes. A unidade publicada é mil reais, sem conversão.',
        tableUrl: 'https://sidra.ibge.gov.br/tabela/5938', periodType: 'series'
    }
};
