const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('medicineDesktop', {
  login: (username, password) => ipcRenderer.invoke('auth:login', username, password),
  saveRecord: record => ipcRenderer.invoke('storage:save-record', record),
  listRecords: () => ipcRenderer.invoke('storage:list-records'),
  deleteRecord: fileName => ipcRenderer.invoke('storage:delete-record', fileName),
  listUsers: () => ipcRenderer.invoke('admin:list-users'),
  createUser: (username, password) => ipcRenderer.invoke('admin:create-user', username, password),
  resetPassword: (username, password) => ipcRenderer.invoke('admin:reset-password', username, password),
  getDataFolder: () => ipcRenderer.invoke('app:data-folder')
});
