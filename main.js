const { app, BrowserWindow, ipcMain, screen, Notification } = require('electron')
const path = require('node:path')

let win;
let help;
let tempoFechar;

// criar janela
const createWindow = () => {

    win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'src/assets/imgs/favicon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.removeMenu(true);

    win.loadFile('./src/index.html');
}

const createWindowHelp = () => {
    if (help) help.destroy();
    help = new BrowserWindow({
        parent: win,
        width: 520,
        height: 499,
        maximizable: false,
        minimizable: false,
        useContentSize: true,
        fullscreenable: false,
        icon: path.join(__dirname, 'src/assets/imgs/favicon.ico'),
    });
    help.setMenuBarVisibility(false);
    help.loadFile('./src/help.html');
}

// dispara a criação da janela
app.whenReady().then(() => {
    createWindow();
    comunicMainRenderer();
});

//código para fechamento da janela no Windows
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

function comunicMainRenderer() {

    // ir ou voltar da tela extendida
    ipcMain.on('irParaSegundaTela', () => {
        win.restore();
        let displays = screen.getAllDisplays();
        let externalDisplay = displays.find((display) => {
            return display.bounds.x !== 0 || display.bounds.y !== 0
        });
        if (externalDisplay) {
            win.setPosition(externalDisplay.bounds.x + 50, externalDisplay.bounds.y + 50);
        }
    });
    ipcMain.on('sairDaSegundaTela', () => {
        win.restore();
        win.setPosition(0, 0);
        win.center();
    });

    ipcMain.on('abrir-ajuda', () => {
        createWindowHelp();
    });

    // comando para fechar a janela automaticamente
    ipcMain.on('autoClose', (event, tempo) => {
        tempoFechar = setTimeout(() => {
            app.quit();
        }, tempo);
    });

    ipcMain.on('cancelAutoClose', () => {
        if (tempoFechar) clearTimeout(tempoFechar);
    });

    // progresso na barra
    ipcMain.on('progressBar', (event, t) => {
        if (t < 1800 && t > 0) {
            win.setProgressBar(1 - t / 1800);
        } else win.setProgressBar(0);
    });

    ipcMain.on('notificacoes', (event, titulo, corpo) => {
        if (Notification.isSupported()) {
            new Notification({
                title: titulo,
                body: corpo,
                silent: true
            }).show();
        }
        console.log(titulo, corpo)
    });

    ipcMain.on('abrirFerramentasDev', () => {
        win.webContents.openDevTools();
    });
}