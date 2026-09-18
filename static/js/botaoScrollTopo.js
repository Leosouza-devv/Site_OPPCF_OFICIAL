'use strict'

/*(INICIO)Programação do botão de scroll para o topo da pagina*/
window.addEventListener('scroll', function () {

    let scroll = document.querySelector('.botaoTopo');
    scroll.classList.toggle('active', window.scrollY >= 20);
})

function scrolltopo() {
    window.scrollTo({
        top: 0, behavior: 'smooth'
    })
}
/*(FIM)Programação do botão de scroll para o topo da pagina*/

