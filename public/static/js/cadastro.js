'use strict';

document.addEventListener('DOMContentLoaded', function () {
    
    // Exemplo apenas
    fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: 'vini', email: 'b', senha_hash: 'ihqebgidb', id_acesso: 0 })
        }
    )


    const abas = document.querySelectorAll('.aba-acesso');
    const paineis = document.querySelectorAll('.painel-acesso');

    abas.forEach(function (aba) {
        aba.addEventListener('click', function () {
            const alvo = aba.dataset.tab;

            abas.forEach(function (item) {
                const ativa = item === aba;
                item.classList.toggle('active', ativa);
                item.setAttribute('aria-selected', String(ativa));
            });

            paineis.forEach(function (painel) {
                const ativo = painel.id === `painel-${alvo}`;
                painel.classList.toggle('active', ativo);
                painel.hidden = !ativo;
            });
        });
    });
});
