const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const seedDbPath = path.join(__dirname, '..', 'prisma', 'seed.db');
const tempDbUrl = `file:${seedDbPath}`;

if (fs.existsSync(seedDbPath)) {
    fs.unlinkSync(seedDbPath);
    console.log('Removed existing seed database');
}

process.env.DATABASE_URL = tempDbUrl;

console.log('Creating seed database...');
execSync('npx prisma db push --accept-data-loss', {
    stdio: 'inherit',
    env: {
        ...process.env,
        DATABASE_URL: tempDbUrl
    }
});

console.log('Seed database created successfully at:', seedDbPath);

