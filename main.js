const { app, BrowserWindow, ipcMain, screen, Menu, MenuItem } = require('electron')
const path = require('node:path')

let win;
let help;

// criar janela
const createWindow = () => {
    const isSingleInstance = app.requestSingleInstanceLock();

    win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'src/assets/imgs/favicon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.setMenuBarVisibility(false);

    win.loadFile('./src/index.html');
}

const createWindowHelp = () => {
    if (help) help.destroy();
    help = new BrowserWindow({
        parent: win,
        width: 500,
        height: 450,
        maximizable: false,
        minimizable: false,
        useContentSize: true,
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
    // mostrar ou ocultar barra de menu
    ipcMain.on('ocultar', () => {
        win.setMenuBarVisibility(false);
    });
    ipcMain.on('mostrar', () => {
        win.setMenuBarVisibility(true);
    });
    ipcMain.handle('isMenuBarVisible', () => {
        return win.isMenuBarVisible();
    });
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
        win.setPosition(50, 50);
    });
    ipcMain.on('abrir-ajuda', () => {
        createWindowHelp();
    });

    // comando para fechar a janela automaticamente
    ipcMain.on('autoClose', () => app.quit());
}