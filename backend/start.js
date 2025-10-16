const { spawn } = require('child_process');
const path = require('path');

console.log('Starting BGF Backend...');
console.log('Current directory:', __dirname);
console.log('Node version:', process.version);

// Check if dist directory exists
const fs = require('fs');
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
    console.error('Dist directory not found. Building project...');
    const build = spawn('npm', ['run', 'build'], { 
        stdio: 'inherit',
        cwd: __dirname 
    });
    
    build.on('close', (code) => {
        if (code === 0) {
            startServer();
        } else {
            console.error('Build failed');
            process.exit(1);
        }
    });
} else {
    startServer();
}

function startServer() {
    console.log('Starting server from:', path.join(__dirname, 'dist', 'server.js'));
    const server = spawn('node', ['dist/server.js'], { 
        stdio: 'inherit',
        cwd: __dirname 
    });
    
    server.on('close', (code) => {
        console.log(`Server process exited with code ${code}`);
        process.exit(code);
    });
}