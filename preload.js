const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('funcoesWinElectron', {
  ocultarMenu: () => ipcRenderer.send('ocultar'),
  mostrarMenu: () => ipcRenderer.send('mostrar'),
  irParaSegundaTela: () => ipcRenderer.send('irParaSegundaTela'),
  sairDaSegundaTela: () => ipcRenderer.send('sairDaSegundaTela'),
  autoClose: () => ipcRenderer.send('autoClose'),
  isMenuBarVisible: () => ipcRenderer.invoke('isMenuBarVisible'),
  abrirAjuda: () => ipcRenderer.send('abrir-ajuda'),
  progressBar: (t) => ipcRenderer.send('progressBar', t)
});