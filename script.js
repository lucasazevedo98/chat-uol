const UUID_PARTICIPANTE = "https://mock-api.driven.com.br/api/v6/uol/participants/b2ddb65a-f663-469e-b896-8881b95e1966"
const UUID_STATUS = "https://mock-api.driven.com.br/api/v6/uol/status/b2ddb65a-f663-469e-b896-8881b95e1966"
const UUID_MENSAGENS = "https://mock-api.driven.com.br/api/v6/uol/messages/b2ddb65a-f663-469e-b896-8881b95e1966"

let usuario = prompt("Qual seu nome?")

let mensagens = []

let usuariosAtivos = []

let outroUsuario = "Todos", tipoDaMsg = "message";


function entrar() {
    axios.post(UUID_PARTICIPANTE, { name: usuario }).catch(()=>{
        alert("Usuario em uso, digite um novo usuario para entrar!")
        window.location.reload()
    })
}

function manterAtivo() {
    axios.post(UUID_STATUS, { name: usuario })
}

function pegarMensagem() {
    axios.get(UUID_MENSAGENS).then((resposta) => {
        mensagens = resposta.data
    })
}

function pegarOutroUsuario(usuario) {
    let b = document.querySelector(".contatos .selecionado")

    if (b !== null) {
        b.classList.remove("selecionado")
    }

    usuario.classList.add("selecionado")

    outroUsuario = document.querySelector(".contatos .selecionado p").innerHTML
}

function pegarOTipo(tipo) {
    let b = document.querySelector(".visibilidade .selecionado")

    if (b !== null) {
        b.classList.remove("selecionado")
    }

    tipo.classList.add("selecionado")

    tipoDaMsg = document.querySelector(".visibilidade .selecionado p").innerHTML

    if (tipoDaMsg === "Reservadamente") {
        tipoDaMsg = "private_message"
    } else {
        tipoDaMsg = "message"
    }


}

function enviarMensagens() {

    let msg = document.querySelector(".enviar").value

    axios.post(UUID_MENSAGENS, {
        from: usuario,
        to: outroUsuario,
        text: msg,
        type: tipoDaMsg
    }).catch(()=>{
        alert("Você foi deslocado por falta de atividade, por favor, entre denovo")
        window.location.reload()
    })


    document.querySelector(".enviar").value = ""
}

function buscarParticipantes() {
    axios.get(UUID_PARTICIPANTE).then((resposta) => {
        usuariosAtivos = resposta.data
    })

    imprimirUsuarios()

}

function imprimirUsuarios() {

    let a = document.querySelector(".usuarios-ativos")
    a.innerHTML = ""
    for (let i = 0; i < usuariosAtivos.length; i++) {

        if(usuariosAtivos[i].name == usuario){

            continue

        } else {
            a.innerHTML += `
        
            <div class="opcoes" onclick="pegarOutroUsuario(this)">
                <ion-icon name="person-circle"></ion-icon>
                <p>${usuariosAtivos[i].name}</p>
            </div>        
        ` 
        }
        
    }
}


function imprimirMsg() {

    let chat = document.querySelector(".chat")

    chat.innerHTML = ""

    for (let i = 0; i < mensagens.length; i++) {

        if (mensagens[i].type === "status") {
            chat.innerHTML += `<div class="mensagens"><p>
            <span style="color: gray;">(${mensagens[i].time}) </span>
            <strong class="negrito">${mensagens[i].from}</strong>
            para
            <strong class="negrito">${mensagens[i].to}</strong>:
            ${mensagens[i].text}
            </p>
            </div>
            `
        } else if (mensagens[i].type === "message" || mensagens[i].to === "Todos") {
            chat.innerHTML += `<div class="mensagens-publica"><p>
            <span style="color: gray;">(${mensagens[i].time}) </span>
            <strong class="negrito">${mensagens[i].from}</strong>
            para
            <strong class="negrito">${mensagens[i].to}</strong>:
            ${mensagens[i].text}
            </p>
            </div>
            `
        }
        
        else if (mensagens[i].type === "private_message" && mensagens[i].from === usuario || mensagens[i].to === usuario) {
            chat.innerHTML += `<div class="mensagens-reservada"><p>
            <span style="color: gray;">(${mensagens[i].time}) </span>
            <strong class="negrito">${mensagens[i].from}</strong>
            reservadamente para
            <strong class="negrito">${mensagens[i].to}</strong>:
            ${mensagens[i].text}
            </p>
            </div>
            `
        }




    }


    let heightPage = document.body.scrollHeight;
    window.scrollTo(0, heightPage);

    let texto = document.querySelector(".texto")


    let a;
    if(tipoDaMsg === "message") {
        a = "público"
    } else {
        a = "Reservadamente" 
    }
    texto.innerHTML = `Enviando para ${outroUsuario}(${a})`


}

function fecharmodal() {
    document.querySelector(".modal").style.display = 'none'
    document.querySelector(".menu").style.display = 'none'

}

function exibirModal() {
    document.querySelector(".modal").style.display = 'flex'
    document.querySelector(".menu").style.display = 'flex'

}


entrar()

//Mantem conexão ativa
setInterval(manterAtivo, 5000)

//pegar msg ativa
setInterval(pegarMensagem, 2000)

//Busca participante
setInterval(buscarParticipantes, 5000)

//Busca participante
setInterval(imprimirMsg, 2000)


