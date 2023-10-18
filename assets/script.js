const audio5minutos = new Audio("./assets/audios/encerramento_licao_5min.mp3");
const audio1minuto = new Audio("./assets/audios/encerramento_licao_1min_1.mp3");
const audioEncerramento = new Audio("./assets/audios/Beeper_Emergency_Call.mp3");

const textoTempo = document.getElementById("texto_tempo");
const horarioElement = document.getElementById('hora');

const informacoes = {
    horasRest: document.getElementById("horas"),
    minutosRest: document.getElementById("minutos"),
    segundosRest: document.getElementById("segundos"),
    doisPontos: document.querySelectorAll(".dois_pontos"),
    horario: document.getElementById('hora')
}

async function relogio(horaTermino) {

    while (true) {
        let hora;
        let retorno = new Promise((resolve, reject) => {
            hora = new Date();
            let restante = 1000 - hora.getMilliseconds();

            setTimeout(() => {
                informacoes.doisPontos.forEach((x) => x.classList.remove("piscar_dois_pontos"));
                imprimirRelogio(hora, horaTermino);
                setTimeout(() => {
                    informacoes.doisPontos.forEach((x) => x.classList.add("piscar_dois_pontos"));
                }, 500);
                resolve();
            }, restante);
        });

        await retorno;

    }
}

function imprimirRelogio(hora, horaTermino) {
    let horas = hora.getHours();
    let minutos = hora.getMinutes().toString().length == 1 ? `0${hora.getMinutes().toString()}` : hora.getMinutes();
    let segundos = hora.getSeconds().toString().length == 1 ? `0${hora.getSeconds().toString()}` : hora.getSeconds();;

    let tempo = hora.getSeconds() + (hora.getMinutes() * 60) + (hora.getHours() * 3600);
    let tempoTermino = (horaTermino[1] * 60) + (horaTermino[0] * 3600);

    let tempoRestante = tempoTermino - tempo;

    let horasRestantes = '0';
    let minutosRestantes = '00';
    let segundosRestantes = '00';

    if (tempoRestante > 0) {
        horasRestantes = Math.trunc(tempoRestante / 3600);
        minutosRestantes = Math.trunc(tempoRestante / 60) % 60;
        segundosRestantes = tempoRestante % 60;

        if (minutosRestantes < 10) minutosRestantes = `0${minutosRestantes.toString()}`;
        if (segundosRestantes < 10) segundosRestantes = `0${segundosRestantes.toString()}`;
    }

    if (tempoRestante >= 307 && tempoRestante <= 309) {
        audio5minutos.play();
    }

    if (tempoRestante <= 68 && tempoRestante >= 66) {
        audio1minuto.play();
    }

    if (tempoRestante <= 0 && tempoRestante >= -2) {
        audioEncerramento.play();
    }

    if (horasRestantes == 0) {
        informacoes.horasRest.innerText = "";
        informacoes.doisPontos[0].classList.add("ocultar");
    }
    else {
        informacoes.horasRest.innerText = `${horasRestantes}`;
    }

    informacoes.minutosRest.innerText = `${minutosRestantes}`;
    informacoes.segundosRest.innerText = `${segundosRestantes}`;

    informacoes.horario.innerText = `${horas}:${minutos}`;
}