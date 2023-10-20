const func = () => {

    document.querySelector("body").addEventListener("dblclick", () => {
        alternarMenu();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key == "f") {
            alternarMenu();
        }

        if (e.key == "Escape" && document.fullscreenElement) {
            mostrarMenu();
        }
    });

    document.getElementById("entrar-fullscreen").addEventListener("click", () => {
        alternarMenu();
    });

    document.getElementById("sair-fullscreen").addEventListener("click", () => {
        alternarMenu();
    });

    document.getElementById("botao-voltar").addEventListener("click", () => {
        if (document.fullscreenElement) {
            mostrarMenu();
        }
    });

}

function alternarMenu() {
    if (document.fullscreenElement) {
        mostrarMenu();
    } else if (!document.fullscreenElement) {
        ocultarMenu();
    }
}

function mostrarMenu() {
    window.funcoesWinElectron.mostrarMenu();
    sairSegundaTela();
}

function ocultarMenu() {
    window.funcoesWinElectron.ocultarMenu();
    paraSegundaTela();
}

function paraSegundaTela() {
    window.funcoesWinElectron.irParaSegundaTela();
}
function sairSegundaTela() {
    window.funcoesWinElectron.sairDaSegundaTela();
}

func()
