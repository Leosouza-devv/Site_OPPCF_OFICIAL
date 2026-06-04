'use strict'

/*(INICIO)programação para interação do menu hamburguer */


function menu() {
    let section_none = document.getElementById('informacoes');
    let a_none = document.querySelector('.mob_a');
    let menu_mobile = document.querySelector('.menu_mobile');
    let botaoMenu = document.getElementById('abrir');
    let rodape = document.getElementById('rodape');
    


    if (menu_mobile.classList.contains('open')) {
        menu_mobile.classList.remove('open');
        section_none.classList.remove('invisivel');
        a_none.classList.remove('a_none')
        botaoMenu.classList.remove('fechar');
        rodape.classList.remove('rodape_none');

    }
    else {
        menu_mobile.classList.add('open');
        section_none.classList.add('invisivel');
        a_none.classList.add('a_none');
        window.scrollTo({
            top: 0
        })
        botaoMenu.classList.add('fechar');
        rodape.classList.add('rodape_none');





    }
}


function menu_icones() {
    menu_mobile.classList.remove('open');
    section_none.classList.remove('invisivel');
    a_none.classList.remove('a_none')
    fechar.classList.remove('fechar');
}




/*(FIM)programação para interação do menu hamburguer */



/*(INICIO)programação do cabeçalho fixo */
window.addEventListener('scroll', function () {

    let menu_fixo = document.querySelector('.cabecalho');
    menu_fixo.classList.toggle('cabecalho_fixo', window.scrollY >= 20);

})
/*(FIM)programação do cabeçalho fixo */