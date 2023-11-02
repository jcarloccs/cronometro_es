const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('funcoesWinElectron', {
  irParaSegundaTela: () => ipcRenderer.send('irParaSegundaTela'),
  sairDaSegundaTela: () => ipcRenderer.send('sairDaSegundaTela'),
  autoClose: (tempo) => ipcRenderer.send('autoClose', tempo),
  abrirAjuda: () => ipcRenderer.send('abrir-ajuda'),
  progressBar: (t) => ipcRenderer.send('progressBar', t),
  notificacoes: (titulo, corpo) => ipcRenderer.send('notificacoes', titulo, corpo),
  cancelAutoClose: () => ipcRenderer.send('cancelAutoClose'),
  abrirFerramentasDev: () => ipcRenderer.send('abrirFerramentasDev')
});