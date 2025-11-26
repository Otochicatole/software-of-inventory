const rcedit = require('rcedit');
const path = require('path');
const fs = require('fs');

const exePath = path.join(__dirname, '..', 'release', 'win-unpacked', 'Etheon - Management.exe');
const iconPath = path.join(__dirname, '..', 'public', 'logo.ico');

if (!fs.existsSync(exePath)) {
    console.error('ERROR: No se encontró el archivo .exe en:', exePath);
    process.exit(1);
}

if (!fs.existsSync(iconPath)) {
    console.error('ERROR: No se encontró el archivo logo.ico en:', iconPath);
    process.exit(1);
}

console.log('Aplicando ícono al ejecutable...');
console.log('EXE:', exePath);
console.log('ICON:', iconPath);

rcedit(exePath, {
    icon: iconPath
}).then(() => {
    console.log('✓ Ícono aplicado correctamente al ejecutable!');
}).catch((err) => {
    console.error('ERROR al aplicar el ícono:', err);
    process.exit(1);
});

