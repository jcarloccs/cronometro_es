const audio5minutos = new Audio("./assets/audios/encerramento_licao_5min.mp3");
const audio1minuto = new Audio("./assets/audios/encerramento_licao_1min_1.mp3");
const audioEncerramento = new Audio("./assets/audios/Beeper_Emergency_Call.mp3");

const textoTempo = document.getElementById("texto-tempo");

const informacoes = {
    horasRest: document.getElementById("horas"),
    minutosRest: document.getElementById("minutos"),
    segundosRest: document.getElementById("segundos"),
    doisPontos: document.querySelectorAll(".dois_pontos"),
    horario: document.querySelectorAll(".horarios"),
    textoLicao: document.getElementById("texto-licao")
}

const desenhoRelogio = {
    ponteiroMinutos: document.getElementById("ponteiro-minutos"),
    ponteiroSegundos: document.getElementById("ponteiro-segundos"),
    corCirculoExterno: document.getElementById("circulo-externo").querySelectorAll("stop"),
    corCirculoInterno: document.getElementById("circulo-interno").querySelector("circle"),
    bolinhas: document.getElementById("bolinhas")
}

const campos = {
    campoHoraTermino: document.getElementById("hora-termino"),
    campoTempoLimiteHora: document.getElementById("hora"),
    campoTempoLimiteMinuto: document.getElementById("minuto")
}

const controles = {
    horaLimite: document.getElementById("hora-alvo"),
    duracao: document.getElementById("duracao"),
    fullscreen: document.getElementById("fullscreen"),
    controles: document.getElementById("controles"),
    fieldsets: document.querySelectorAll("fieldset"),
    botaoEntrarFullscreen: document.getElementById("entrar-fullscreen"),
    botaoSairFullscreen: document.getElementById("sair-fullscreen"),
    zerar: document.getElementById("zerar"),
    onOff2Tela: document.getElementById("on-off-2-tela"),
    checker2Tela: document.getElementById("checker-2-tela"),
    text2Tela: document.getElementById("checker-2-tela")
}

let tempoRestante;
let mostrarControlesFullscreen = false;

// para a execução do código pra não mostrar tempo negativo
let continuar = true;

//enter nos inputs inicia o cronômetro
campos.campoHoraTermino.addEventListener("keyup", (x) => {
    if (x.key === "Enter") iniciarHoraTermino();
});
campos.campoTempoLimiteHora.addEventListener("keyup", (x) => {
    if (x.key === "Enter") iniciarDuracao();
});
campos.campoTempoLimiteMinuto.addEventListener("keyup", (x) => {
    if (x.key === "Enter") iniciarDuracao();
});
// fullscreens
document.addEventListener("keydown", (x) => {
    if (x.key === "f") {
        funcoesFullscreen.fullscreen();
    }
    else if (x.key === "Escape") {
        alternarBotoesFullScreen.visibBotoesFullScreen();
    }
});
controles.zerar.addEventListener("click", () => {
    location.reload();
})

const funcoesEletronJS = {
    mostrarMenu: () => {
        if (document.fullscreenElement && window.funcoesWinElectron) window.funcoesWinElectron.mostrarMenu();
    },
    ocultarMenu: () => {
        if (!document.fullscreenElement && window.funcoesWinElectron) window.funcoesWinElectron.ocultarMenu();
    },
    paraSegundaTela: () => {
        if (window.funcoesWinElectron && controles.checker2Tela.checked) {
            window.funcoesWinElectron.irParaSegundaTela();
        }
    },
    sairSegundaTela: () => {
        if (window.funcoesWinElectron && controles.checker2Tela.checked) {
            window.funcoesWinElectron.sairDaSegundaTela();
        }
    }
}

const funcoesFullscreen = {
    entrarFullscreen: function () {

        // coloca em tela cheia
        let elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }

        // altera visibilidade dos controles em tela cheia
        alternarBotoesFullScreen.mostrarBtnSairFullscreen();
        controles.onOff2Tela.style.removeProperty("display");
        controles.onOff2Tela.classList.add("ocultar");
        controles.zerar.style.removeProperty("display");
        controles.zerar.classList.add("ocultar");

        funcoesEletronJS.paraSegundaTela();
        funcoesEletronJS.ocultarMenu();

    },
    sairFullscreen: function () {

        // sai da tela cheia
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }

        // altera a visibilidade dos controles quando sai da tela cheia
        alternarBotoesFullScreen.mostrarBtnIrFullscreen();
        if (mostrarControlesFullscreen) {
            controles.onOff2Tela.style.display = "flex";
            controles.onOff2Tela.classList.remove("ocultar");
            controles.zerar.style.display = "flex";
            controles.zerar.classList.remove("ocultar");
        }

        funcoesEletronJS.sairSegundaTela();
        funcoesEletronJS.mostrarMenu();
    },
    fullscreen: function () {

        if (document.fullscreenElement) {
            funcoesFullscreen.sairFullscreen();
        } else {
            funcoesFullscreen.entrarFullscreen();
        }

    }
}

const alternarBotoesFullScreen = {
    mostrarBtnIrFullscreen: function () {
        controles.botaoEntrarFullscreen.classList.remove("ocultar");
        controles.botaoSairFullscreen.classList.add("ocultar");
    },
    mostrarBtnSairFullscreen: function () {
        controles.botaoEntrarFullscreen.classList.add("ocultar");
        controles.botaoSairFullscreen.classList.remove("ocultar");
    },
    // alterna a visibilidades dos botões de fullscreen
    visibBotoesFullScreen: async function () {
        if (document.fullscreenElement) {
            alternarBotoesFullScreen.mostrarBtnSairFullscreen();
        } else {
            alternarBotoesFullScreen.mostrarBtnIrFullscreen()
        }
    }
}

async function iniciarHoraTermino() {

    alternarBotoesFullScreen.visibBotoesFullScreen();

    if (campos.campoHoraTermino.value) {
        let horaTermino = campos.campoHoraTermino.value.split(":");
        iniciarCronometro([Number(horaTermino[0]), Number(horaTermino[1])]);
    }

}

async function iniciarDuracao() {

    alternarBotoesFullScreen.visibBotoesFullScreen();

    if ((campos.campoTempoLimiteHora.value > 0 || campos.campoTempoLimiteMinuto.value > 0) &&
        (campos.campoTempoLimiteHora.value || campos.campoTempoLimiteMinuto.value)) {

        let duracaoHora = campos.campoTempoLimiteHora.value;
        let duracaoMinuto = campos.campoTempoLimiteMinuto.value;

        let agora = new Date();

        agora = (agora.getHours() * 60) + agora.getMinutes();
        let limite = (Number(duracaoHora) * 60) + Number(duracaoMinuto);
        let horarioLimite = agora + limite;

        let hora = Math.trunc(horarioLimite / 60);
        let minuto = horarioLimite % 60;

        iniciarCronometro([hora, minuto]);

    }

}

async function iniciarCronometro(horaTermino) {

    // adiciona click duplo para colocar em tela cheia
    document.querySelector("body").addEventListener("dblclick", funcoesFullscreen.fullscreen);

    mostrarControlesFullscreen = true;

    let y = horaTermino[1];
    if (horaTermino[1] < 10) y = `0${horaTermino[1]}`;
    informacoes.horario[1].innerText = `Termina às ${horaTermino[0]}:${y}`;

    // mostrar ou ocultar os controles
    controles.horaLimite.classList.remove("organizar");
    controles.horaLimite.classList.add("ocultar");
    controles.duracao.classList.remove("organizar");
    controles.duracao.classList.add("ocultar");
    controles.fieldsets.forEach((x) => x.classList.add("ocultar"));
    controles.fullscreen.style.display = "flex";
    controles.fullscreen.classList.remove("ocultar");
    if (!document.fullscreenElement) {
        controles.onOff2Tela.style.display = "flex";
        controles.onOff2Tela.classList.remove("ocultar");
        controles.zerar.style.display = "flex";
        controles.zerar.classList.remove("ocultar");
    }
    controles.controles.style.height = "auto";
    informacoes.horario.forEach((x) => x.classList.remove("ocultar"));

    //atualizar cor de acordo com o tempo do início do cronômetro
    let horaAtual = new Date();
    animacoes.ajustarCores(horaAtual, horaTermino);

    while (true) {
        horaAtual;
        let retorno = new Promise((resolve, reject) => {
            horaAtual = new Date();
            let restante = 1000 - horaAtual.getMilliseconds();

            setTimeout(() => {

                imprimirRelogio(horaAtual, horaTermino);
                resolve();

            }, restante);
        });

        await retorno;
    }

}

function imprimirRelogio(horaAtual, horaTermino) {
    let horas = horaAtual.getHours();
    let minutos = horaAtual.getMinutes().toString().length == 1 ? `0${horaAtual.getMinutes().toString()}` : horaAtual.getMinutes();
    let segundos = horaAtual.getSeconds().toString().length == 1 ? `0${horaAtual.getSeconds().toString()}` : horaAtual.getSeconds();

    tempoRestante = calculoTempoRestante(horaAtual, horaTermino);

    if (tempoRestante >= 0 && continuar) {

        let horasRestantes = '0';
        let minutosRestantes = '00';
        let segundosRestantes = '00';

        horasRestantes = Math.trunc(tempoRestante / 3600);
        minutosRestantes = Math.trunc(tempoRestante / 60) % 60;
        segundosRestantes = tempoRestante % 60;

        if (minutosRestantes < 10) minutosRestantes = `0${minutosRestantes.toString()}`;
        if (segundosRestantes < 10) segundosRestantes = `0${segundosRestantes.toString()}`;

        animacoes.girarPonteiros(tempoRestante, segundosRestantes);

        animacoes.audioECores();

        if (horasRestantes == 0) {
            informacoes.horasRest.innerText = "";
            informacoes.doisPontos[0].classList.add("ocultar");
        }
        else {
            informacoes.horasRest.innerText = `${horasRestantes}`;
        }

        informacoes.minutosRest.innerText = `${minutosRestantes}`;
        informacoes.segundosRest.innerText = `${segundosRestantes}`;

        animacoes.piscarDoisPontos();
    }

    informacoes.horario[0].innerText = `Hora certa = ${horas}:${minutos}:${segundos}`;
}

function calculoTempoRestante(horas, horaTermino) {
    let tempo = horas.getSeconds() + (horas.getMinutes() * 60) + (horas.getHours() * 3600);
    let tempoTermino = (horaTermino[1] * 60) + (horaTermino[0] * 3600);

    if (tempoTermino >= tempo) {
        return tempoTermino - tempo;
    } else {
        return (tempoTermino + 86400) - tempo;
    }
}

const animacoes = {
    ajustarCores: async function (horaAtual, horaTermino) {
        if (calculoTempoRestante(horaAtual, horaTermino) <= 300) {
            desenhoRelogio.corCirculoExterno.forEach((x) => {
                x.style.stopColor = "#00ff00";
            });
            desenhoRelogio.corCirculoInterno.style.fill = "#00ff00";
        }
        if (calculoTempoRestante(horaAtual, horaTermino) <= 60) {
            desenhoRelogio.corCirculoExterno.forEach((x) => {
                x.style.stopColor = "#ffff00";
            });
            desenhoRelogio.corCirculoInterno.style.fill = "#ffff00";
        }
        if (calculoTempoRestante(horaAtual, horaTermino) <= 0) {
            desenhoRelogio.corCirculoExterno.forEach((x) => {
                x.style.stopColor = "#ff0000";
            });
            desenhoRelogio.corCirculoInterno.style.fill = "#ff0000";
        }
    },
    girarPonteiros: async function (tempoRestante) {

        let a = tempoRestante / 10;
        let b = tempoRestante * 6;

        desenhoRelogio.ponteiroMinutos.style.transform = `rotate(${a}deg)`;
        desenhoRelogio.ponteiroSegundos.style.transform = `rotate(${b}deg)`;
    },
    piscarDoisPontos: async function () {
        informacoes.doisPontos.forEach((x) => x.classList.remove("piscar_dois_pontos"));
        setTimeout(() => {
            if (tempoRestante > 0) {
                informacoes.doisPontos.forEach((x) => x.classList.add("piscar_dois_pontos"));
            }
        }, 500);
    },
    audioECores: async function () {
        if (tempoRestante >= 307 && tempoRestante <= 309) {
            audio5minutos.play();
            desenhoRelogio.corCirculoExterno.forEach((x) => {
                x.style.transition = "10s";
                x.style.stopColor = "#00ff00";
            });
            desenhoRelogio.corCirculoInterno.style.fill = "#00ff00";
            desenhoRelogio.corCirculoInterno.style.transition = "10s";
        }

        if (tempoRestante <= 68 && tempoRestante >= 66) {
            audio1minuto.play();
            desenhoRelogio.corCirculoExterno.forEach((x) => {
                x.style.transition = "10s";
                x.style.stopColor = "#ffff00";
            });
            desenhoRelogio.corCirculoInterno.style.fill = "#ffff00";
            desenhoRelogio.corCirculoInterno.style.transition = "10s";
        }

        if (tempoRestante <= 0 && tempoRestante >= -2) {
            audioEncerramento.play();
            desenhoRelogio.corCirculoExterno.forEach((x) => {
                x.style.transition = "5s";
                x.style.stopColor = "#ff0000";
            });
            desenhoRelogio.corCirculoInterno.style.fill = "#ff0000";
            desenhoRelogio.corCirculoInterno.style.transition = "5s";
            informacoes.textoLicao.innerText = "LIÇÃO DA ESCOLA SABATINA ENCERRADA";
            continuar = false;
        }
    }
}