const { app, BrowserWindow, ipcMain, screen} = require('electron')
const path = require('node:path')

let win;

// criar janela
const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
};

// dispara a criação da janela
app.whenReady().then(() => {
    createWindow();
});

//código para fechamento da janela no Windows
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// mostrar ou ocultar barra de menu
ipcMain.handle('ocultar', () => {
    win.setMenuBarVisibility(false);
});
ipcMain.handle('mostrar', () => {
    win.setMenuBarVisibility(true);
});

// ir ou voltar da tela extendida
ipcMain.handle('irParaSegundaTela', () => {
    win.restore();
    let displays = screen.getAllDisplays();
    let externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
    });
    if (externalDisplay) {
        win.setPosition(externalDisplay.bounds.x + 50, externalDisplay.bounds.y + 50);
    }
});
ipcMain.handle('sairDaSegundaTela', () => {
    win.restore();
    win.setPosition(50, 50);
});

// comando para fechar a janela automaticamente
ipcMain.handle('autoClose', () => app.quit());