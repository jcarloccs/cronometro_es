const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('funcoesWinElectron', {
  ocultarMenu: () => ipcRenderer.send('ocultar'),
  mostrarMenu: () => ipcRenderer.send('mostrar'),
  irParaSegundaTela: () => ipcRenderer.send('irParaSegundaTela'),
  sairDaSegundaTela: () => ipcRenderer.send('sairDaSegundaTela'),
  autoClose: (tempo) => ipcRenderer.send('autoClose', tempo),
  isMenuBarVisible: () => ipcRenderer.invoke('isMenuBarVisible'),
  abrirAjuda: () => ipcRenderer.send('abrir-ajuda'),
  progressBar: (t) => ipcRenderer.send('progressBar', t),
  notificacao: (titulo, corpo) => ipcRenderer.send('notificacao', titulo, corpo),
  cancelAutoClose: () => ipcRenderer.send('cancelAutoClose')
});