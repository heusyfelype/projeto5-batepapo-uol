let nomeDoUsuario = "um Nome Aleatorio Aí"

// ************ O CODIGO COMECA EFETIVAMENTE AQUI ************
function enviarNomeUsuario() {
    nomeDoUsuario = document.querySelector(".tela-login input").value
    nomeDoUsuarioObjeto = {
        name: nomeDoUsuario
    }
    console.log(nomeDoUsuario, nomeDoUsuarioObjeto)
    let promessaLogin = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', nomeDoUsuarioObjeto)
    promessaLogin.then(solicitarDadosServidor)
    promessaLogin.catch(function(){
        alert("nome já em uso")
    })
}


function solicitarDadosServidor() {
    document.querySelector(".tela-login").classList.add("esconder-tela-login")
    solicitarUsuariosOnline(document.querySelector(".tela-login"))
    const promessaMensagens = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promessaMensagens.then(processarMensagensIniciais)
    setInterval(informarEstouOnline, 5000, nomeDoUsuarioObjeto)
}


let lugarParacolocarDadosDoServidorNoChat = null;
let horaUltimaMensagem = "";
let arrayComInformacoesMensagem = null;

function processarMensagensIniciais(resposta) {
    setInterval(solicitarMensagensPeriodicamente, 3000)

    arrayComInformacoesMensagem = resposta.data;
    horaUltimaMensagem = arrayComInformacoesMensagem[arrayComInformacoesMensagem.length - 1].time;


    lugarParacolocarDadosDoServidorNoChat = document.querySelector("section");

    for (let i = 0; i < arrayComInformacoesMensagem.length; i++) {

        if (arrayComInformacoesMensagem[i].type === 'status') {
            lugarParacolocarDadosDoServidorNoChat.innerHTML = lugarParacolocarDadosDoServidorNoChat.innerHTML + `
                <p class="fundo-cinza"><time> (${arrayComInformacoesMensagem[i].time}) </time> <strong> ${arrayComInformacoesMensagem[i].from} </strong> ${arrayComInformacoesMensagem[i].text}</p>
                `
        }
        else if (arrayComInformacoesMensagem[i].type === 'message') {
            lugarParacolocarDadosDoServidorNoChat.innerHTML = lugarParacolocarDadosDoServidorNoChat.innerHTML + `
            <p class="fundo-branco"><time> (${arrayComInformacoesMensagem[i].time}) </time> <strong> ${arrayComInformacoesMensagem[i].from} </strong> para <strong>  ${arrayComInformacoesMensagem[i].to}: </strong> ${arrayComInformacoesMensagem[i].text}</p>
            `
        }
        else if (arrayComInformacoesMensagem[i].type === 'private_message' && arrayComInformacoesMensagem[i].to === nomeDoUsuario) {
            lugarParacolocarDadosDoServidorNoChat.innerHTML = lugarParacolocarDadosDoServidorNoChat.innerHTML + `
            <p class="fundo-rosa"><time> (${arrayComInformacoesMensagem[i].time}) </time> <strong> ${arrayComInformacoesMensagem[i].from} </strong> reservadamente para <strong>  ${arrayComInformacoesMensagem[i].to} </strong> ${arrayComInformacoesMensagem[i].text}</p>
            `
        }
    }
    lugarParacolocarDadosDoServidorNoChat.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function solicitarMensagensPeriodicamente() {
    const promessaMensagens = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promessaMensagens.then(atualizarMensagens);
}

function atualizarMensagens(resposta) {
    let respostaObjetivo = resposta.data;
    let podeImprimir = false;
    let indiceDaUlttimaMensagemAntesDeAtualizar = respostaObjetivo.length - 1;

    for (let i = 0; i < respostaObjetivo.length; i++) {
        if (respostaObjetivo[i].time == horaUltimaMensagem) {
            podeImprimir = true;
            indiceDaUlttimaMensagemAntesDeAtualizar = i;
        }
        if (podeImprimir == true && i > indiceDaUlttimaMensagemAntesDeAtualizar) {
            imprimirNovasMensagens(respostaObjetivo[i])
        }
        if (i == respostaObjetivo.length - 1) {
            horaUltimaMensagem = respostaObjetivo[i].time;
        }

    }
}

// function atualizarListaDeContatosAutomaticamente(contatoAserAdicionadoOuExcluido){
//     console.log(contatoAserAdicionadoOuExcluido)
//     if(contatoAserAdicionadoOuExcluido.text === 'entra na sala...'){
//         LugarParacolocarQuemEstaOnline = document.querySelector(".usuarios-online")
//         LugarParacolocarQuemEstaOnline.innerHTML = LugarParacolocarQuemEstaOnline.innerHTML + `
//     <div class="contato-enviar-mensagem ${contatoAserAdicionadoOuExcluido.from}">
//         <ion-icon name="person-circle"></ion-icon>
//             <h3 onclick="selecionarUsuarioParaEnviarMensagem(this)">
//                 <p> ${contatoAserAdicionadoOuExcluido.from} </p>
//                 <ion-icon name="checkmark-outline" class="botao-check escondido"></ion-icon>
//             </h3>
//     </div>
//     `
//     } else if(contatoAserAdicionadoOuExcluido.text === 'sai da sala...'){
//        let quemSAiu = document.querySelector("." + contatoAserAdicionadoOuExcluido.from)
//        console.log(quemSAiu)
//        quemSAiu.remove()
       
//     }
// }

function imprimirNovasMensagens(objetoMensagem) {
    lugarParacolocarDadosDoServidorNoChat = document.querySelector("section");
    arrayComInformacoesMensagem = objetoMensagem.data;


    if (objetoMensagem.type === 'status') {
        lugarParacolocarDadosDoServidorNoChat.innerHTML = lugarParacolocarDadosDoServidorNoChat.innerHTML + `
                <p class="fundo-cinza"><time> (${objetoMensagem.time}) </time> <strong> ${objetoMensagem.from} </strong> ${objetoMensagem.text}</p>
                `
        // atualizarListaDeContatosAutomaticamente(objetoMensagem);
    }
    else if (objetoMensagem.type === 'message') {
        lugarParacolocarDadosDoServidorNoChat.innerHTML = lugarParacolocarDadosDoServidorNoChat.innerHTML + `
            <p class="fundo-branco"><time> (${objetoMensagem.time}) </time> <strong> ${objetoMensagem.from} </strong> para <strong>  ${objetoMensagem.to}: </strong> ${objetoMensagem.text}</p>
            `
    }
    else if (objetoMensagem.type == 'private_message' && objetoMensagem.to == nomeDoUsuario || objetoMensagem.from == nomeDoUsuario) {
        lugarParacolocarDadosDoServidorNoChat.innerHTML = lugarParacolocarDadosDoServidorNoChat.innerHTML + `
            <p class="fundo-rosa"><time> (${objetoMensagem.time}) </time> <strong> ${objetoMensagem.from} </strong> reservadamente para <strong>  ${objetoMensagem.to} </strong> ${objetoMensagem.text}</p>
            `
    }
    lugarParacolocarDadosDoServidorNoChat.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' })
}


function solicitarUsuariosOnline() {
    const promessaUsuariosOnline = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants')
    promessaUsuariosOnline.then(publicarUsuariosOnline)
}

let LugarParacolocarQuemEstaOnline = document.querySelector(".usuarios-online")
function publicarUsuariosOnline(resposta) {
    setInterval(solicitarUsuariosOnline, 10000)
    let respostaObjetivo = resposta.data
    // console.log(resposta, resposta.data)
    LugarParacolocarQuemEstaOnline.innerHTML = `
        <div class="contato-enviar-mensagem">
            <ion-icon name="people"></ion-icon>
            <div class="nome-usuario" onclick="selecionarUsuarioParaEnviarMensagem(this)">
                <p>Todos</p>
                <ion-icon name="checkmark-outline" class="botao-check"></ion-icon>
            </div>
        </div>
    `
    for (let i = 0; i < respostaObjetivo.length; i++) {
        LugarParacolocarQuemEstaOnline.innerHTML = LugarParacolocarQuemEstaOnline.innerHTML + `
        
        <div class="contato-enviar-mensagem">
            <ion-icon name="person-circle"></ion-icon>
                <div class="nome-usuario" onclick="selecionarUsuarioParaEnviarMensagem(this)">
                    <p> ${respostaObjetivo[i].name} </p>
                    <ion-icon name="checkmark-outline" class="botao-check escondido"></ion-icon>
                </div>
        </div>
        `
    }

}

let nomeDeQuemVaiReceberAMensagem = "Todos"
function selecionarUsuarioParaEnviarMensagem(oUsuarioQueVaiReceberAMensagem) {
    nomeDeQuemVaiReceberAMensagem = oUsuarioQueVaiReceberAMensagem.querySelector("p").innerHTML;
    console.log(typeof(nomeDeQuemVaiReceberAMensagem), nomeDeQuemVaiReceberAMensagem)
    let todosETodosQueEstaoOnline = document.querySelectorAll(".botao-check")
    for (let i = 0; i < todosETodosQueEstaoOnline.length; i++) {
        if (!todosETodosQueEstaoOnline[i].classList.contains("escondido")) {
            todosETodosQueEstaoOnline[i].classList.add("escondido")
        }
    }
    oUsuarioQueVaiReceberAMensagem.querySelector(".botao-check").classList.remove("escondido")
    document.querySelector(".pessoa-que-a-mensagem-eh-direcionada").innerHTML = nomeDeQuemVaiReceberAMensagem;
}

function enviarMensagem(teste) {
    let textoMensagem = document.querySelector(".escrever-mensagens textarea").value;
    document.querySelector(".escrever-mensagens textarea").value = ""
    enviarMensagemParaOServidor(textoMensagem)
}

function enviarMensagemParaOServidor(aMensagem) {
    let aMensagemObjeto = {
        from: nomeDoUsuario,
        to: nomeDeQuemVaiReceberAMensagem,
        text: aMensagem,
        type: tipoDePrivacidadeDaMensagem
    }

    console.log(aMensagemObjeto)
    let promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', aMensagemObjeto)
    promessa.then(solicitarMensagensPeriodicamente)
    promessa.catch(avisarUsuarioEstaOfline)
}
function avisarUsuarioEstaOfline(){
    alert('A pessoa que você queria enviar a mesnsagem está offline')
    setTimeout(recarregarPagina, 3500)
}

function recarregarPagina(){
    window.location.reload()
}


let tipoDePrivacidadeDaMensagem = "message"
let publicoOuPrivadoChack = document.querySelectorAll(".visibilidade h3 ion-icon")
function selecionarVisibilidade(elemento, indice) {
    console.log(elemento)
    if (indice === 1) {
        publicoOuPrivadoChack[1].classList.add("escondido")
        tipoDePrivacidadeDaMensagem = "message"
        console.log(elemento.querySelector("h3 ion-icon"))
        elemento.querySelector("h3 ion-icon").classList.remove("escondido")
        document.querySelector(".informar-visibilidade").innerHTML = 'Público'
    } else /*indice == 2*/ {
        publicoOuPrivadoChack[0].classList.add("escondido")
        tipoDePrivacidadeDaMensagem = "private_message"
        elemento.querySelector("h3 ion-icon").classList.remove("escondido")
        document.querySelector(".informar-visibilidade").innerHTML = 'Reservadamente'
    }
}

// elemento.querySelector("h3 ion-icon").classList.contains("escondido")

function informarEstouOnline(usuarioEstaOnline) {
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', usuarioEstaOnline)
    console.log('estou online')
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