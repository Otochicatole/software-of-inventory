import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import { startServer, stopServer } from './utils/server';
import { setupDatabase } from './utils/database';

const isDev = process.env.NODE_ENV === 'development';
const PORT = process.env.PORT || 3000;

let mainWindow: BrowserWindow | null = null;

function showErrorDialog(title: string, message: string) {
    const { dialog } = require('electron');
    dialog.showErrorBox(title, message);
}

async function createWindow() {
    Menu.setApplicationMenu(null);
    
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        show: false,
        backgroundColor: '#ffffff',
        autoHideMenuBar: true,
        title: 'Etheon - Product Management',
    });

    mainWindow.once('ready-to-show', () => {
        console.log('[Main] Window ready to show');
        mainWindow?.show();
    });

    if (isDev) {
        const serverUrl = `http://localhost:${PORT}`;
        console.log('[Main] Loading development server:', serverUrl);
        mainWindow.loadURL(serverUrl);
        mainWindow.webContents.openDevTools();
    } else {
        try {
            console.log('[Main] Starting production server...');
            const actualPort = await startServer(PORT as number);
            const serverUrl = `http://localhost:${actualPort}`;
            console.log('[Main] Loading production server:', serverUrl);
            await mainWindow.loadURL(serverUrl);
        } catch (error) {
            console.error('[Main] Failed to start server:', error);
            showErrorDialog('Error al iniciar', `No se pudo iniciar el servidor:\n${error}`);
            app.quit();
        }
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('[Main] Failed to load:', errorCode, errorDescription);
        if (!isDev) {
            showErrorDialog('Error de carga', `No se pudo cargar la aplicación:\n${errorDescription}`);
        }
    });
}

app.whenReady().then(async () => {
    try {
        console.log('[Main] App ready, initializing...');
        console.log('[Main] App path:', app.getAppPath());
        console.log('[Main] User data:', app.getPath('userData'));
        console.log('[Main] Is packaged:', app.isPackaged);
        
        await setupDatabase();
        await createWindow();

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    } catch (error) {
        console.error('[Main] Error starting application:', error);
        showErrorDialog('Error Fatal', `No se pudo iniciar la aplicación:\n${error}`);
        app.quit();
    }
});

app.on('window-all-closed', () => {
    console.log('[Main] All windows closed');
    if (process.platform !== 'darwin') {
        stopServer();
        app.quit();
    }
});

app.on('before-quit', () => {
    console.log('[Main] App quitting...');
    stopServer();
});

process.on('uncaughtException', (error) => {
    console.error('[Main] Uncaught Exception:', error);
    showErrorDialog('Error inesperado', `Ocurrió un error inesperado:\n${error.message}`);
});

process.on('unhandledRejection', (error) => {
    console.error('[Main] Unhandled Rejection:', error);
});

