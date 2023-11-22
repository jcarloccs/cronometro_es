const audio5minutos = new Audio("./assets/audios/encerramento_licao_5min.mp3");
const audio1minuto = new Audio("./assets/audios/encerramento_licao_1min_1.mp3");
const audioEncerramento = new Audio("./assets/audios/Beeper_Emergency_Call.mp3");

const informacoes = {
    horasRest: document.getElementById("horas"),
    minutosRest: document.getElementById("minutos"),
    segundosRest: document.getElementById("segundos"),
    doisPontos: document.querySelectorAll(".dois_pontos"),
    horarios: document.querySelectorAll(".horarios"),
    textoLicao: document.getElementById("texto-licao")
}

const cronometro = {
    desenhos: document.getElementById("desenhos"),
    relogio: document.getElementById("relogio")
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
    text2Tela: document.getElementById("checker-2-tela"),
    botaoAjuda: document.getElementById("botao-ajuda"),
    controlesFuncionando: document.getElementById("controles-funcionando"),
    controles1Tela: document.getElementById("controles-1-tela")
}

let tempoRestante;
let mostrarControlesFullscreen = false;

// pára a execução do código pra não mostrar tempo negativo
let continuar = true;

const electronJS = {
    paraSegundaTela: async () => {
        if (window.funcoesWinElectron && controles.checker2Tela.checked) {
            window.funcoesWinElectron.irParaSegundaTela();
        }
    },
    sairSegundaTela: async () => {
        if (window.funcoesWinElectron && controles.checker2Tela.checked) {
            window.funcoesWinElectron.sairDaSegundaTela();
        }
    },
    abrirAjuda: async () => {
        if (window.funcoesWinElectron) {
            window.funcoesWinElectron.abrirAjuda();
        } else {
            window.open("./help.html", "Ajuda", "height=499,width=520");
        }
    },
    progressBar: async (t) => {
        if (window.funcoesWinElectron) {
            window.funcoesWinElectron.progressBar(t);
        }
    },
    autoClose: async (tempo) => {
        if (window.funcoesWinElectron) {
            window.funcoesWinElectron.autoClose(tempo);
            
            const segundos = Math.trunc((tempo / 1000) % 60);
            let corpo = `O cronômetro irá fechar em ${Math.trunc(tempo / 1000 / 60)} minuto(s)`;
            if (segundos > 0) corpo = corpo.concat(` e ${segundos} segundo(s)`)

            electronJS.notificacao('Cronômetro ES', corpo);
        }
    },
    cancelAutoClose: async () => {
        if (window.funcoesWinElectron) {
            window.funcoesWinElectron.cancelAutoClose();
        }
    },
    notificacao: async (titulo, corpo) => {
        if (window.funcoesWinElectron) {
            window.funcoesWinElectron.notificacoes(titulo, corpo);
        }
    },
    abrirFerramentasDev: async () => {
        if (window.funcoesWinElectron) {
            window.funcoesWinElectron.abrirFerramentasDev();
        }
    }
}

const funcoesFullscreen = {
    entrarFullscreen: function () {

        electronJS.paraSegundaTela();

        // coloca em tela cheia
        let elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }

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
        controles.botaoEntrarFullscreen.classList.remove("display-none");
        controles.botaoSairFullscreen.classList.add("display-none");
    },
    mostrarBtnSairFullscreen: function () {
        controles.botaoEntrarFullscreen.classList.add("display-none");
        controles.botaoSairFullscreen.classList.remove("display-none");
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

const animacoes = {
    ajustarCores: async function (horaAtual, horaTermino) {
        if (calculoTempoRestante(horaAtual, horaTermino) <= 307 && calculoTempoRestante(horaAtual, horaTermino) > 66) {
            desenhoRelogio.corCirculoExterno.forEach((x) => {
                x.style.stopColor = "#00ff00";
            });
            desenhoRelogio.corCirculoInterno.style.fill = "#00ff00";
        }
        else if (calculoTempoRestante(horaAtual, horaTermino) <= 66 && calculoTempoRestante(horaAtual, horaTermino) > 0) {
            desenhoRelogio.corCirculoExterno.forEach((x) => {
                x.style.stopColor = "#ffff00";
            });
            desenhoRelogio.corCirculoInterno.style.fill = "#ffff00";
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

        else if (tempoRestante <= 68 && tempoRestante >= 66) {
            audio1minuto.play();
            desenhoRelogio.corCirculoExterno.forEach((x) => {
                x.style.transition = "10s";
                x.style.stopColor = "#ffff00";
            });
            desenhoRelogio.corCirculoInterno.style.fill = "#ffff00";
            desenhoRelogio.corCirculoInterno.style.transition = "10s";
        }

        else if (tempoRestante <= 0 && tempoRestante >= -2) {
            audioEncerramento.volume = 0.5;
            audioEncerramento.play();
            desenhoRelogio.corCirculoExterno.forEach((x) => {
                x.style.transition = "5s";
                x.style.stopColor = "#ff0000";
            });
            desenhoRelogio.corCirculoInterno.style.fill = "#ff0000";
            desenhoRelogio.corCirculoInterno.style.transition = "5s";
            informacoes.textoLicao.innerText = "LIÇÃO DA ESCOLA SABATINA ENCERRADA";
            continuar = false;

            //fecha o programa após um tempo
            electronJS.autoClose(60000);
        }
    }
}

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
// atalhos de teclado
document.addEventListener("keydown", async (x) => {
    if ((x.key === "d" || x.key === "D") && x.altKey) {
        electronJS.abrirFerramentasDev();
    }
});
// fullscreens
document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        alternarBotoesFullScreen.mostrarBtnSairFullscreen();
        // altera visibilidade dos controles em tela cheia
        controles.controles1Tela.classList.add("display-none");
        controles.botaoAjuda.classList.add("display-none");
    }
    else if (!document.fullscreenElement) {
        alternarBotoesFullScreen.mostrarBtnIrFullscreen();
        // altera a visibilidade dos controles quando sai da tela cheia
        if (mostrarControlesFullscreen) {
            controles.controles1Tela.classList.remove("display-none");
        }
        controles.botaoAjuda.classList.remove("display-none");
        electronJS.sairSegundaTela();
    }
});
controles.zerar.addEventListener("click", () => {
    electronJS.progressBar(0);
    electronJS.cancelAutoClose();
    location.reload();
});


function mostrarCronometro() {
    cronometro.relogio.style.opacity = 1;
    cronometro.desenhos.style.opacity = 1;
}

async function iniciarHoraTermino() {

    if (campos.campoHoraTermino.value) {
        mostrarCronometro();
        alternarBotoesFullScreen.visibBotoesFullScreen();

        let horaTermino = campos.campoHoraTermino.value.split(":");
        iniciarCronometro([Number(horaTermino[0]), Number(horaTermino[1])]);
    }

}

async function iniciarDuracao() {

    if ((campos.campoTempoLimiteHora.value > 0 || campos.campoTempoLimiteMinuto.value > 0) &&
        (campos.campoTempoLimiteHora.value || campos.campoTempoLimiteMinuto.value)) {

        mostrarCronometro();
        alternarBotoesFullScreen.visibBotoesFullScreen();

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

    // adiciona click duplo e tecla F para colocar em tela cheia
    document.querySelector("body").addEventListener("dblclick", funcoesFullscreen.fullscreen);
    document.addEventListener("keydown", async (x) => {
        if (x.key === "f" || x.key === "F") {
            funcoesFullscreen.fullscreen();
        }
    });

    mostrarControlesFullscreen = true;

    let y = horaTermino[1].toString().padStart(2, 0);
    informacoes.horarios[1].innerText = `Termina às ${horaTermino[0]}:${y}`;

    // mostrar ou ocultar os controles
    controles.fieldsets.forEach((x) => x.classList.add("display-none"));
    controles.controlesFuncionando.classList.remove("display-none");

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
    let minutos = horaAtual.getMinutes().toString().padStart(2, 0);
    let segundos = horaAtual.getSeconds().toString().padStart(2, 0);

    tempoRestante = calculoTempoRestante(horaAtual, horaTermino);
    
    if (tempoRestante >= 0 && continuar) {

        let horasRestantes = Math.trunc(tempoRestante / 3600);
        let minutosRestantes = (Math.trunc(tempoRestante / 60) % 60).toString().padStart(2, 0);
        let segundosRestantes = (tempoRestante % 60).toString().padStart(2, 0);

        electronJS.progressBar(tempoRestante);
        animacoes.girarPonteiros(tempoRestante, segundosRestantes);
        animacoes.audioECores();
        if (tempoRestante === 360) {
            electronJS.notificacao('Cronômetro ES', 'Próximo de 5 minutos');
        }
        
        imprimirTempoRestante(horasRestantes, minutosRestantes, segundosRestantes);
        animacoes.piscarDoisPontos();

    }

    informacoes.horarios[0].innerText = `Hora certa = ${horas}:${minutos}:${segundos}`;
}

async function imprimirTempoRestante(horasRestantes, minutosRestantes, segundosRestantes) {
    if (horasRestantes == 0) {
        informacoes.horasRest.innerText = "";
        informacoes.doisPontos[0].classList.add("display-none");
    }
    else {
        informacoes.horasRest.innerText = `${horasRestantes}`;
    }
    informacoes.minutosRest.innerText = `${minutosRestantes}`;
    informacoes.segundosRest.innerText = `${segundosRestantes}`;
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