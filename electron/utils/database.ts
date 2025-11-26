import { app } from 'electron';
import path from 'path';
import fs from 'fs';

export async function setupDatabase(): Promise<void> {
    const isDev = process.env.NODE_ENV === 'development';
    
    console.log('[Database] Setting up database...');
    console.log('[Database] Development mode:', isDev);
    
    if (isDev) {
        const devDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
        console.log('[Database] Using dev database:', devDbPath);
        return;
    }

    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'database.db');
    const isNewDb = !fs.existsSync(dbPath);
    
    console.log('[Database] User data path:', userDataPath);
    console.log('[Database] Database path:', dbPath);
    console.log('[Database] Is new database:', isNewDb);
    
    if (!fs.existsSync(userDataPath)) {
        console.log('[Database] Creating user data directory...');
        fs.mkdirSync(userDataPath, { recursive: true });
    }

    if (isNewDb) {
        console.log('[Database] New database detected, copying seed database...');
        const isPackaged = app.isPackaged;
        const appPath = isPackaged ? process.resourcesPath : app.getAppPath();
        const seedDbPath = isPackaged 
            ? path.join(appPath, 'app', 'prisma', 'seed.db')
            : path.join(appPath, 'prisma', 'seed.db');
        
        console.log('[Database] Seed database path:', seedDbPath);
        
        if (fs.existsSync(seedDbPath)) {
            fs.copyFileSync(seedDbPath, dbPath);
            console.log('[Database] Seed database copied successfully');
        } else {
            console.warn('[Database] Seed database not found, creating empty database');
            fs.writeFileSync(dbPath, '');
        }
    }

    process.env.DATABASE_URL = `file:${dbPath}`;
    
    console.log('[Database] Database URL set:', process.env.DATABASE_URL);
}

export function getDatabasePath(): string {
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
        return path.join(process.cwd(), 'prisma', 'dev.db');
    }
    
    return path.join(app.getPath('userData'), 'database.db');
}

