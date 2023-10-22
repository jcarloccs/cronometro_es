const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('funcoesWinElectron', {
  ocultarMenu: () => ipcRenderer.invoke('ocultar'),
  mostrarMenu: () => ipcRenderer.invoke('mostrar'),
  irParaSegundaTela: () => ipcRenderer.invoke('irParaSegundaTela'),
  sairDaSegundaTela: () => ipcRenderer.invoke('sairDaSegundaTela'),
  autoClose: () => ipcRenderer.invoke('autoClose')
})