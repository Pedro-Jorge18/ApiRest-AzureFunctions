require('dotenv').config();
const FtpSrv = require('ftp-srv');
const path = require('path');
const fs = require('fs');

const ftpRoot = path.join(__dirname, 'ftp-data');
if (!fs.existsSync(ftpRoot)) {
    fs.mkdirSync(ftpRoot, { recursive: true });
}

const ftpServer = new FtpSrv({
    url: 'ftp://0.0.0.0:2121',
    pasv_url: '127.0.0.1',
    pasv_min: 8881,
    pasv_max: 8889,
    anonymous: false
});

ftpServer.on('login', ({ connection, username, password }, resolve, reject) => {
    if (username === 'ftpuser' && password === 'ftppass123') {
        console.log(`[${new Date().toLocaleTimeString()}] FTP Login: ${username}`);
        resolve({ root: ftpRoot });
    } else {
        reject(new Error('Invalid credentials'));
    }
});

ftpServer.listen().then(() => {
    console.log('FTP Server listening on port 2121');
});
