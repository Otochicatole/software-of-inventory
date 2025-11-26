const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

const staticSource = path.join(__dirname, '..', '.next', 'static');
const staticDest = path.join(__dirname, '..', '.next', 'standalone', '.next', 'static');

const publicSource = path.join(__dirname, '..', 'public');
const publicDest = path.join(__dirname, '..', '.next', 'standalone', 'public');

console.log('Copying static files...');
if (fs.existsSync(staticSource)) {
    copyRecursiveSync(staticSource, staticDest);
    console.log('✓ Static files copied');
} else {
    console.log('✗ Static source not found:', staticSource);
}

console.log('Copying public files...');
if (fs.existsSync(publicSource)) {
    copyRecursiveSync(publicSource, publicDest);
    console.log('✓ Public files copied');
} else {
    console.log('✗ Public source not found:', publicSource);
}

console.log('Done!');

