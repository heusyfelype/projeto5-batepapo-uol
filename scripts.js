let nomeDoUsuario = "um Nome Aleatorio Aí"
let objetoNome = {
    name: ""
}

inserirSeuNome()
solicitarUsuariosOnline()


// setInterval(usuariosOnline, 10000)

function geraStringAleatoria(tamanho) {
    var stringAleatoria = '';
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (var i = 0; i < tamanho; i++) {
        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return stringAleatoria;
}

// ************ O CODIGO COMECA EFETIVAMENTE AQUI ************
function inserirSeuNome() {
    //nomeDoUsuario = prompt("Qual o seu nome?")
    // nomeDoUsuario = "um Nome Aleatorio Aí"
    objetoNome = {
        name: geraStringAleatoria(4)
    }
    console.log(objetoNome)
    nomeDoUsuario = objetoNome.name
    let promessaLogin = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', objetoNome)
    promessaLogin.then(solicitarDadosServidor)

}

function solicitarDadosServidor() {
    const promessaMensagens = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promessaMensagens.then(processarMensagensIniciais)
    setInterval(informarEstouOnline, 5000, objetoNome)
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
            <p class="fundo-branco"><time> (${arrayComInformacoesMensagem[i].time}) </time> <strong> ${arrayComInformacoesMensagem[i].from} </strong> para <strong>  ${arrayComInformacoesMensagem[i].to} </strong> ${arrayComInformacoesMensagem[i].text}</p>
            `
        }
        else if (arrayComInformacoesMensagem[i].type === 'private_message' && arrayComInformacoesMensagem[i].to === nomeDoUsuario) {
            lugarParacolocarDadosDoServidorNoChat.innerHTML = lugarParacolocarDadosDoServidorNoChat.innerHTML + `
            <p class="fundo-rosa"><time> (${arrayComInformacoesMensagem[i].time}) </time> <strong> ${arrayComInformacoesMensagem[i].from} </strong> para <strong>  ${arrayComInformacoesMensagem[i].to} </strong> ${arrayComInformacoesMensagem[i].text}</p>
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

function imprimirNovasMensagens(objetoMensagem) {
    lugarParacolocarDadosDoServidorNoChat = document.querySelector("section");
    arrayComInformacoesMensagem = objetoMensagem.data;


    if (objetoMensagem.type === 'status') {
        lugarParacolocarDadosDoServidorNoChat.innerHTML = lugarParacolocarDadosDoServidorNoChat.innerHTML + `
                <p class="fundo-cinza"><time> (${objetoMensagem.time}) </time> <strong> ${objetoMensagem.from} </strong> ${objetoMensagem.text}</p>
                `
    }
    else if (objetoMensagem.type === 'message') {
        lugarParacolocarDadosDoServidorNoChat.innerHTML = lugarParacolocarDadosDoServidorNoChat.innerHTML + `
            <p class="fundo-branco"><time> (${objetoMensagem.time}) </time> <strong> ${objetoMensagem.from} </strong> para <strong>  ${objetoMensagem.to} </strong> ${objetoMensagem.text}</p>
            `
    }
    else if (objetoMensagem.type == 'private_message' && objetoMensagem.to == nomeDoUsuario || objetoMensagem.from == nomeDoUsuario) {
        lugarParacolocarDadosDoServidorNoChat.innerHTML = lugarParacolocarDadosDoServidorNoChat.innerHTML + `
            <p class="fundo-rosa"><time> (${objetoMensagem.time}) </time> <strong> ${objetoMensagem.from} </strong> para <strong>  ${objetoMensagem.to} </strong> ${objetoMensagem.text}</p>
            `
    }
    lugarParacolocarDadosDoServidorNoChat.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' })
}


function solicitarUsuariosOnline() {
    const promessaUsuariosOnline = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants')
    promessaUsuariosOnline.then(usuariosOnline)
}

let LugarParacolocarQuemEstaOnline = document.querySelector(".usuarios-online")
function usuariosOnline(resposta) {
    let respostaObjetivo = resposta.data
    // console.log(resposta, resposta.data)
    LugarParacolocarQuemEstaOnline.innerHTML = `
        <div class="contato-enviar-mensagem">
            <ion-icon name="people"></ion-icon>
            <h3 onclick="selecionarUsuarioParaEnviarMensagem(this)">
                <p>Todos</p>
                <ion-icon name="checkmark-outline" class="botao-check"></ion-icon>
            </h3>
        </div>
    `
    for (let i = 0; i < respostaObjetivo.length; i++) {
        LugarParacolocarQuemEstaOnline.innerHTML = LugarParacolocarQuemEstaOnline.innerHTML + `
        
        <div class="contato-enviar-mensagem">
            <ion-icon name="person-circle"></ion-icon>
                <h3 onclick="selecionarUsuarioParaEnviarMensagem(this)">
                    <p> ${respostaObjetivo[i].name} </p>
                    <ion-icon name="checkmark-outline" class="botao-check escondido"></ion-icon>
                </h3>
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
    let textoMensagem = document.querySelector("footer textarea").value;
    document.querySelector("footer textarea").value = ""
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

let tipoDePrivacidadeDaMensagem = "message"
let publicoOuPrivadoChack = document.querySelectorAll(".visibilidade h3 ion-icon")
function selecionarVisibilidade(elemento, indice) {
    if (indice === 1) {
        publicoOuPrivadoChack[1].classList.add("escondido")
        tipoDePrivacidadeDaMensagem = "message"
        elemento.querySelector("h3 ion-icon").classList.remove("escondido")
        document.querySelector(".visibilidade").innerHTML = 'Público'
    } else /*indice == 2*/ {
        publicoOuPrivadoChack[0].classList.add("escondido")
        tipoDePrivacidadeDaMensagem = "private_message"
        elemento.querySelector("h3 ion-icon").classList.remove("escondido")
        document.querySelector(".visibilidade").innerHTML = 'Reservadamente'
    }
}

// elemento.querySelector("h3 ion-icon").classList.contains("escondido")

function informarEstouOnline(usuarioEstaOnline) {
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', usuarioEstaOnline)
    console.log('estou online')
}

