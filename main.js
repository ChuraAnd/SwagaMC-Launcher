const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const { Launch } = require('minecraft-java-core');
const path = require('path');

let win;
let gamePath = path.join(__dirname, 'minecraft');

function createWindow() {
    win = new BrowserWindow({
        width: 1024,
        height: 650,
        resizable: false,
        movable: true,
        frame: false,
        backgroundColor: '#0f0f0f',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            nativeWindowOpen: true
        }
    });
    win.loadFile('index.html');
    win.setMenu(null);
}

app.whenReady().then(createWindow);

ipcMain.on('window-minimize', () => win.minimize());
ipcMain.on('window-maximize', () => win.maximize());
ipcMain.on('window-close', () => win.close());

ipcMain.on('open-external', (event, url) => {
    shell.openExternal(url);
});

ipcMain.on('select-game-path', async () => {
    const result = await dialog.showOpenDialog(win, {
        properties: ['openDirectory'],
        title: 'Выберите папку для Minecraft'
    });
    if (!result.canceled && result.filePaths.length > 0) {
        gamePath = result.filePaths[0];
        win.webContents.send('game-path-selected', gamePath);
    }
});

ipcMain.on('get-game-path', () => {
    win.webContents.send('game-path-selected', gamePath);
});

function getOfflineUUID(username) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const https = require('https');

// URL твоего GitHub репозитория (замени на свой)
const GITHUB_REPO = 'https://raw.githubusercontent.com/ChuraAnd/SwagaMC-Launcher/main';

// Функция скачивания файла
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                https.get(response.headers.location, (redirectResponse) => {
                    redirectResponse.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve();
                    });
                });
            } else {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

// Функция проверки и загрузки модов/конфигов
async function syncModpack(gamePath) {
    try {
        // Скачиваем manifest.json
        const manifestUrl = `${GITHUB_REPO}/modpack/manifest.json`;
        const manifestResponse = await fetch(manifestUrl);
        const manifest = await manifestResponse.json();
        
        const modsDir = path.join(gamePath, 'mods');
        const configDir = path.join(gamePath, 'config');
        
        // Создаём папки если их нет
        if (!fs.existsSync(modsDir)) fs.mkdirSync(modsDir, { recursive: true });
        if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
        
        // Проверяем и скачиваем каждый файл
        for (const file of manifest.files) {
            const destPath = file.type === 'mod' 
                ? path.join(modsDir, file.name)
                : path.join(configDir, file.name);
            
            // Проверяем, есть ли файл и актуален ли он
            let needsDownload = true;
            if (fs.existsSync(destPath)) {
                const stats = fs.statSync(destPath);
                if (stats.size === file.size) {
                    needsDownload = false; // Файл уже скачан
                }
            }
            
            if (needsDownload) {
                console.log(`Скачивание: ${file.name}`);
                await downloadFile(file.url, destPath);
            }
        }
        
        console.log('✅ Модпак синхронизирован!');
        return true;
    } catch (error) {
        console.error('Ошибка синхронизации модпака:', error);
        return false;
    }
}
ipcMain.on('launch-game', async (event, data) => {
    const launcher = new Launch();
    const { nickname, memory } = data;
    
    // СИНХРОНИЗАЦИЯ МОДПАКА ПЕРЕД ЗАПУСКОМ
    win.webContents.send('launch-status', { action: 'Синхронизация', file: 'Проверка модов...' });
    await syncModpack(gamePath);
    win.webContents.send('launch-status', { action: 'Синхронизация', file: 'Моды обновлены!' });
    
    const opts = {
        path: gamePath,
        authenticator: {
            access_token: '0',
            client_token: '0',
            uuid: getOfflineUUID(nickname),
            name: nickname,
            user_properties: '{}',
            meta: { type: 'mojang', offline: true }
        },
        version: '1.21.1',
        loader: { 
            type: 'neoforge', 
            build: '21.1.248',
            enable: true 
        },
        memory: { min: `${memory}G`, max: `${memory}G` },
        downloadFileMultiple: 8,
        verify: false,
        JVM_ARGS: [`-Xmx${memory}G`, `-Xms${memory}G`, '-XX:+UseG1GC']
    };

    let currentAction = 'Инициализация...';
    let currentFile = '';
    
    const sendStatus = (action, file = '') => {
        win.webContents.send('launch-status', { action, file });
    };

    const safeBasename = (file) => typeof file === 'string' ? path.basename(file) : String(file);

    launcher.on('progress', (progress, size) => {
        const percent = ((progress / size) * 100).toFixed(1);
        win.webContents.send('download-progress', { percent, action: currentAction });
    });

    launcher.on('check', (file) => {
        currentAction = 'Проверка';
        currentFile = safeBasename(file);
        sendStatus('Проверка', currentFile);
    });

    launcher.on('download', (file) => {
        currentAction = 'Загрузка';
        currentFile = safeBasename(file);
        sendStatus('Загрузка', currentFile);
    });

    launcher.on('extract', (file) => {
        currentAction = 'Распаковка';
        currentFile = safeBasename(file);
        sendStatus('Распаковка', currentFile);
    });
    
    launcher.on('patch', (status) => {
        currentAction = 'Установка';
        currentFile = typeof status === 'string' ? status : String(status);
        sendStatus('Установка', currentFile);
    });

    launcher.on('data', (line) => {
        if (line.includes('ERROR') || line.includes('Exception')) {
            win.webContents.send('console-log', { message: line, type: 'error' });
        }
    });

    launcher.on('close', (code) => {
        win.webContents.send('game-closed', code);
    });

    launcher.on('error', (err) => {
        console.error('LAUNCH ERROR:', err);
        win.webContents.send('launch-error', err.message || String(err));
    });

    try {
        sendStatus('Подготовка', 'Проверка версии Minecraft...');
        await launcher.Launch(opts);
        win.webContents.send('game-launched');
    } catch (error) {
        console.error('CATCH ERROR:', error);
        win.webContents.send('launch-error', error.message);
    }
});