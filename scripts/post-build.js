const fs = require('fs');
const path = require('path');

const standalonePath = path.join(__dirname, '..', '.next', 'standalone');
const staticPath = path.join(__dirname, '..', '.next', 'static');
const publicPath = path.join(__dirname, '..', 'public');

const targetStaticPath = path.join(standalonePath, '.next', 'static');
const targetPublicPath = path.join(standalonePath, 'public');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

console.log('Copying static files to standalone...');

if (fs.existsSync(staticPath)) {
    console.log('Copying .next/static to standalone...');
    copyRecursiveSync(staticPath, targetStaticPath);
}

if (fs.existsSync(publicPath)) {
    console.log('Copying public to standalone...');
    copyRecursiveSync(publicPath, targetPublicPath);
}

console.log('Post-build completed successfully!');

