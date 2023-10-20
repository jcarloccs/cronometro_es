const { app, BrowserWindow } = require('electron')
const path = require('node:path')

// criar janela
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    //win.setMenuBarVisibility(false);
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