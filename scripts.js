function chamarBarraLateral(){
    document.querySelector(".barra-lateral").classList.add("barra-lateral-efeito")
    document.querySelector(".background-preto-transparente").classList.add("background-preto-transparente-efeito")
    document.querySelector(".background-preto-transparente").setAttribute("onclick","retornarParaOChat()")
}

function retornarParaOChat(){
    document.querySelector(".barra-lateral").classList.remove("barra-lateral-efeito")
    document.querySelector(".background-preto-transparente").classList.remove("background-preto-transparente-efeito")
}