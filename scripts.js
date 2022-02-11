inserirSeuNome()
solicitarUsuariosOnline()
// setInterval(usuariosOnline, 10000)

function inserirSeuNome() {
    // let nomeDoUsuario = prompt("Qual o seu nome?")
    let nomeDoUsuario = 'umNomeAleatórioAí'
    const objetoNome = {
        name: nomeDoUsuario
    }
    let promessaLogin = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', objetoNome)
    promessaLogin.then(solicitarDadosServidor)
}



function solicitarDadosServidor() {
    const promessaMensagens = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promessaMensagens.then(processarResposta)
}



let LugarParacolocarDadosDoServidorNoChat = null;
function processarResposta(resposta) {

    let respostaObjetivo = resposta.data
    LugarParacolocarDadosDoServidorNoChat = document.querySelector("section");

    for (let i = 0; i < respostaObjetivo.length; i++) {

        if (respostaObjetivo[i].type === 'status') {
            LugarParacolocarDadosDoServidorNoChat.innerHTML = LugarParacolocarDadosDoServidorNoChat.innerHTML + `
                <p class="fundo-cinza"><time> (${respostaObjetivo[i].time}) </time> <strong> ${respostaObjetivo[i].from} </strong> ${respostaObjetivo[i].text}</p>
    
            `
        }
        else if (respostaObjetivo[i].type === 'message') {
            LugarParacolocarDadosDoServidorNoChat.innerHTML = LugarParacolocarDadosDoServidorNoChat.innerHTML + `
            <p class="fundo-branco"><time> (${respostaObjetivo[i].time}) </time> <strong> ${respostaObjetivo[i].from} </strong> para <strong>  ${respostaObjetivo[i].to} </strong> ${respostaObjetivo[i].text}</p>

            `
        }
        else if (respostaObjetivo[i].type === 'private_message') {
            LugarParacolocarDadosDoServidorNoChat.innerHTML = LugarParacolocarDadosDoServidorNoChat.innerHTML + `
            <p class="fundo-rosa"><time> (${respostaObjetivo[i].time}) </time> <strong> ${respostaObjetivo[i].from} </strong> para <strong>  ${respostaObjetivo[i].to} </strong> ${respostaObjetivo[i].text}</p>

            `
        }
    };
}


function solicitarUsuariosOnline(){
    const promessaUsuariosOnline = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants')
    promessaUsuariosOnline.then(usuariosOnline)
}

let LugarParacolocarQuemEstaOnline = document.querySelector(".usuarios-online ")
function usuariosOnline(resposta){
    let respostaObjetivo = resposta.data
    console.log(resposta, resposta.data)

    for (let i = 0; i < respostaObjetivo.length; i++){
        LugarParacolocarQuemEstaOnline.innerHTML = LugarParacolocarQuemEstaOnline.innerHTML + `
        
        <div class="contato-enviar-mensagem">
            <ion-icon name="people"></ion-icon>
                <h3>
                    ${respostaObjetivo[i].name}
                    <ion-icon name="checkmark-outline" class="escondido"></ion-icon>
                </h3>
        </div>

        `
    }

}





function chamarBarraLateral() {
    document.querySelector(".barra-lateral").classList.add("barra-lateral-efeito")
    document.querySelector(".background-preto-transparente").classList.add("background-preto-transparente-efeito")
    document.querySelector(".background-preto-transparente").setAttribute("onclick", "retornarParaOChat()")
}

function retornarParaOChat() {
    document.querySelector(".barra-lateral").classList.remove("barra-lateral-efeito")
    document.querySelector(".background-preto-transparente").classList.remove("background-preto-transparente-efeito")
}


let publicoOuPrivadoChack = document.querySelectorAll(".visibilidade h3 ion-icon")
function selecionarVisibilidade(elemento, indice){
    if (indice === 1){
        publicoOuPrivadoChack[1].classList.add("escondido")
        console.log(publicoOuPrivadoChack[1])
        elemento.querySelector("h3 ion-icon").classList.remove("escondido")
    } else /*indice == 2*/{
        publicoOuPrivadoChack[0].classList.add("escondido")
        console.log(publicoOuPrivadoChack[0])
        elemento.querySelector("h3 ion-icon").classList.remove("escondido")
    }
}

// elemento.querySelector("h3 ion-icon").classList.contains("escondido")