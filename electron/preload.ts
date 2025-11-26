import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    platform: process.platform,
    env: {
        NODE_ENV: process.env.NODE_ENV,
    },
});

