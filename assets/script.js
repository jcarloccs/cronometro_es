let audio5minutos;
let audio1minuto;
let audioEncerramento;

async function relogio(horaTermino) {
    
    audio5minutos = document.getElementById('audio5min');
    audio1minuto = document.getElementById('audio1min');
    audioEncerramento = document.getElementById('audioEncer');
    
    while(true) {
        let hora;
        let retorno = new Promise((resolve, reject) => {
            hora = new Date();
            let restante = 1000 - hora.getMilliseconds();

            setTimeout(() => {
                imprimirRelogio(hora, horaTermino);
                resolve();
            }, restante);
        });

        await retorno;
    
    }
}

function imprimirRelogio(hora, horaTermino) {
    const horas = hora.getHours();
    const minutos = hora.getMinutes().toString().length == 1 ? `0${hora.getMinutes().toString()}` : hora.getMinutes();
    const segundos = hora.getSeconds().toString().length == 1 ? `0${hora.getSeconds().toString()}` : hora.getSeconds();;

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

    if (tempoRestante <= 308 && tempoRestante >= 306) {
        audio5minutos.play();
    }

    if (tempoRestante <= 68 && tempoRestante >= 66) {
        audio1minuto.play();
    }

    if (tempoRestante <= 0 && tempoRestante >= -2) {
        audioEncerramento.play();
    }

    document.getElementById('tempo_restante').innerHTML = `${horasRestantes}:${minutosRestantes}:${segundosRestantes}`;
    document.getElementById('hora').innerHTML = `${horas}:${minutos}:${segundos}`;
}