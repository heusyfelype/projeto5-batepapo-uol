inserirSeuNome()

function inserirSeuNome() {
    let nomeDoUsuario = prompt("Qual o seu nome?")

    const objetoNome = {
        name: nomeDoUsuario
    }

    let promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', objetoNome)
    promessa.then(solicitarDadosServidor)
}

function solicitarDadosServidor() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promessa.then(processarResposta)
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


function chamarBarraLateral() {

    document.querySelector(".barra-lateral").classList.add("barra-lateral-efeito")
    document.querySelector(".background-preto-transparente").classList.add("background-preto-transparente-efeito")
    document.querySelector(".background-preto-transparente").setAttribute("onclick", "retornarParaOChat()")
}

function retornarParaOChat() {

    document.querySelector(".barra-lateral").classList.remove("barra-lateral-efeito")

    document.querySelector(".background-preto-transparente").classList.remove("background-preto-transparente-efeito")
}