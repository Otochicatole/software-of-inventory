import { spawn, ChildProcess, execSync } from 'child_process';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';
import net from 'net';

let serverProcess: ChildProcess | null = null;

export { serverProcess };

async function getAvailablePort(startPort: number): Promise<number> {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.unref();
        server.on('error', () => {
            resolve(getAvailablePort(startPort + 1));
        });
        server.listen(startPort, '0.0.0.0', () => {
            const { port } = server.address() as net.AddressInfo;
            server.close(() => {
                resolve(port);
            });
        });
    });
}

export async function startServer(port: number): Promise<number> {
    return new Promise(async (resolve, reject) => {
        const isDev = process.env.NODE_ENV === 'development';
        
        if (isDev) {
            console.log('[Server] Development mode - using external server');
            resolve(port);
            return;
        }

        const availablePort = await getAvailablePort(port);
        console.log('[Server] Using port:', availablePort);

        const isPackaged = app.isPackaged;
        const appPath = isPackaged ? process.resourcesPath : app.getAppPath();
        
        const serverPath = isPackaged 
            ? path.join(appPath, 'app', 'server.js')
            : path.join(appPath, '.next', 'standalone', 'server.js');
        
        const serverDir = isPackaged 
            ? path.join(appPath, 'app')
            : path.join(appPath, '.next', 'standalone');
        
        console.log('[Server] App path:', appPath);
        console.log('[Server] Server path:', serverPath);
        console.log('[Server] Server dir:', serverDir);
        console.log('[Server] Is packaged:', isPackaged);
        
        if (!fs.existsSync(serverPath)) {
            console.error('[Server] Server file not found at:', serverPath);
            
            const altServerPath = path.join(appPath, 'server.js');
            if (fs.existsSync(altServerPath)) {
                console.log('[Server] Found alternative server at:', altServerPath);
            } else {
                reject(new Error(`Server file not found. Tried: ${serverPath} and ${altServerPath}`));
                return;
            }
        }
        
        console.log('[Server] Starting Next.js server on port', availablePort);
        
        const staticPath = isPackaged 
            ? path.join(appPath, 'app', '.next', 'static')
            : path.join(appPath, '.next', 'static');
            
        const publicPath = isPackaged
            ? path.join(appPath, 'app', 'public')
            : path.join(appPath, 'public');
        
        console.log('[Server] Static path:', staticPath);
        console.log('[Server] Public path:', publicPath);
        
        serverProcess = spawn('node', [serverPath], {
            env: {
                ...process.env,
                PORT: availablePort.toString(),
                NODE_ENV: 'production',
                HOSTNAME: '0.0.0.0',
                __NEXT_PRIVATE_STANDALONE_CONFIG: JSON.stringify({
                    staticAssetPath: path.join(appPath, 'app', '.next', 'static')
                })
            },
            cwd: serverDir,
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        let serverReady = false;

        serverProcess.stdout?.on('data', (data) => {
            const output = data.toString();
            console.log('[Next.js Server]:', output);
            
            if ((output.includes('Ready') || output.includes('started server') || output.includes('Local:')) && !serverReady) {
                serverReady = true;
                console.log('[Server] Server is ready!');
                setTimeout(() => resolve(availablePort), 1000);
            }
        });

        serverProcess.stderr?.on('data', (data) => {
            console.error('[Next.js Server Error]:', data.toString());
        });

        serverProcess.on('error', (error) => {
            console.error('[Server] Failed to start server:', error);
            reject(error);
        });

        serverProcess.on('close', (code) => {
            console.log(`[Server] Server process exited with code ${code}`);
            serverProcess = null;
        });

        setTimeout(() => {
            if (!serverReady) {
                console.log('[Server] Timeout reached, assuming server is ready');
                resolve(availablePort);
            }
        }, 8000);
    });
}

export function stopServer(): void {
    if (serverProcess) {
        console.log('[Server] Stopping Next.js server...');
        const pid = serverProcess.pid;
        
        try {
            if (process.platform === 'win32' && pid) {
                console.log('[Server] Killing process tree on Windows, PID:', pid);
                try {
                    execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
                } catch (error) {
                    console.log('[Server] Process already terminated or not found');
                }
            } else {
                serverProcess.kill('SIGTERM');
                
                setTimeout(() => {
                    if (serverProcess && !serverProcess.killed) {
                        try {
                            serverProcess.kill('SIGKILL');
                        } catch (err) {
                            console.log('[Server] Process already terminated');
                        }
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('[Server] Error stopping server:', error);
        }
        
        serverProcess = null;
        console.log('[Server] Server stopped');
    }
}

