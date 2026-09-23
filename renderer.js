const { ipcRenderer } = require('electron');
const path = require('path');

const storage = {
    get(key, defaultValue = null) {
        try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : defaultValue; } 
        catch { return defaultValue; }
    },
    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
    }
};

document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (target && target.href && (target.href.startsWith('http://') || target.href.startsWith('https://'))) {
        e.preventDefault();
        ipcRenderer.send('open-external', target.href);
    }
});

const NEWS_DATA = [
    { id: 1, title: 'Открытие сервера SwagaMC!', text: 'Мы запустили новый модовый сервер на версии 1.21.1 с загрузчиком NeoForge. Присоединяйтесь!', category: 'Главное', date: '24 Сентября 2026', icon: 'fa-rocket', image: null, author: 'Администрация' },
    { id: 2, title: 'Уникальные моды', text: 'В ближайшее время добавим моды на магию, технику и улучшенное строительство.', category: 'Скоро', date: 'Скоро', icon: 'fa-magic', image: null, author: 'Разработчики' },
    { id: 3, title: 'Обновление лаунчера v1.0.0', text: 'Первый релиз лаунчера с поддержкой NeoForge, оффлайн-режима и кастомных настроек.', category: 'Обновление', date: '24 Сентября 2026', icon: 'fa-download', image: null, author: 'ChuraAnd' },
    { id: 4, title: 'Планы на развитие', text: 'В планах: новые измерения, боссы, квесты и система кланов.', category: 'Планы', date: 'Октябрь 2026', icon: 'fa-road', image: null, author: 'Администрация' },
    { id: 5, title: 'Турнир по PvP', text: 'В эту субботу проведём первый турнир по PvP с призами.', category: 'Событие', date: '27 Сентября 2026', icon: 'fa-trophy', image: null, author: 'Модераторы' },
    { id: 6, title: 'Новый мод на магию', text: 'Добавлен мод Ars Nouveau с уникальными заклинаниями.', category: 'Моды', date: '22 Сентября 2026', icon: 'fa-hat-wizard', image: null, author: 'Разработчики' },
    { id: 7, title: 'Оптимизация сервера', text: 'Проведена оптимизация, теперь TPS стабильно держится на 20.', category: 'Техническое', date: '20 Сентября 2026', icon: 'fa-server', image: null, author: 'Администрация' },
    { id: 8, title: 'Конкурс построек', text: 'Запущен конкурс на лучшую базу месяца. Приз - VIP статус!', category: 'Конкурс', date: '18 Сентября 2026', icon: 'fa-home', image: null, author: 'Модераторы' }
];

const SOCIALS_DATA = [
    { name: 'Discord', desc: 'Наш сервер в Discord', url: 'https://discord.gg/swagamc', icon: 'fab fa-discord', color: 'discord' },
    { name: 'Telegram', desc: 'Новости и обновления', url: 'https://t.me/swagamc', icon: 'fab fa-telegram', color: 'telegram' },
    { name: 'YouTube', desc: 'Видео и гайды', url: 'https://youtube.com/@swagamc', icon: 'fab fa-youtube', color: 'youtube' },
    { name: 'Twitch', desc: 'Стримы разработчиков', url: 'https://twitch.tv/swagamc', icon: 'fab fa-twitch', color: 'twitch' },
    { name: 'VK', desc: 'Группа ВКонтакте', url: 'https://vk.com/swagamc', icon: 'fab fa-vk', color: 'vk' },
    { name: 'GitHub', desc: 'Исходный код лаунчера', url: 'https://github.com/ChuraAnd/SwagaMC-Launcher', icon: 'fab fa-github', color: 'github' }
];

const STREAMERS_DATA = [
    { name: 'ChuraAnd', desc: 'Основатель сервера', url: 'https://twitch.tv/churaand', avatar: null, platform: 'twitch' },
    { name: 'SwagaMC_Official', desc: 'Официальный канал', url: 'https://twitch.tv/swagamc_official', avatar: null, platform: 'twitch' }
];

const VIDEOS_DATA = [
    { title: 'Обзор сервера SwagaMC', channel: 'ChuraAnd', url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', thumbnail: null },
    { title: 'Как начать играть', channel: 'SwagaMC_Official', url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', thumbnail: null }
];

document.getElementById('minimize-btn').addEventListener('click', () => ipcRenderer.send('window-minimize'));
document.getElementById('maximize-btn').addEventListener('click', () => ipcRenderer.send('window-maximize'));
document.getElementById('close-btn').addEventListener('click', () => ipcRenderer.send('window-close'));

const navItems = document.querySelectorAll('.nav-item');
const tabs = document.querySelectorAll('.tab');

function switchTab(tabId) {
    navItems.forEach(n => n.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) activeTab.classList.add('active');
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const tabId = item.getAttribute('data-tab');
        if (tabId) switchTab(tabId);
    });
});

let currentBg = 0;
const bgSlides = document.querySelectorAll('.bg-slide');
function nextBackground() {
    if (bgSlides.length === 0) return;
    bgSlides[currentBg].classList.remove('active');
    currentBg = (currentBg + 1) % bgSlides.length;
    bgSlides[currentBg].classList.add('active');
}
setInterval(nextBackground, 10000);

function initShineText() {
    const logoText = document.getElementById('logo-text');
    logoText.innerHTML = '';
    'SwagaMC'.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char;
        logoText.appendChild(span);
    });
    startShineAnimation();
}

function startShineAnimation() {
    const letters = document.querySelectorAll('.letter');
    let currentIndex = 0;
    setInterval(() => {
        letters.forEach(l => l.classList.remove('shine'));
        if (letters[currentIndex]) letters[currentIndex].classList.add('shine');
        currentIndex = (currentIndex + 1) % letters.length;
    }, 400);
}

function renderNews() {
    const homeTiles = document.getElementById('home-news-tiles');
    if (homeTiles) {
        const newsToShow = NEWS_DATA.slice(0, 8);
        while (newsToShow.length < 8) {
            newsToShow.push(NEWS_DATA[0]); 
        }

        homeTiles.innerHTML = newsToShow.map(news => `
            <div class="news-tile" data-news-id="${news.id}">
                <div class="news-tile-image">
                    ${news.image ? `<img src="${news.image}" alt="${news.title}">` : `<i class="fas ${news.icon}"></i>`}
                </div>
                <div class="news-tile-body">
                    <div class="news-tile-meta">
                        <span class="news-tile-category">${news.category}</span>
                        <span class="news-tile-date">${news.date}</span>
                    </div>
                    <div class="news-tile-title">${news.title}</div>
                    <div class="news-tile-text">${news.text}</div>
                </div>
            </div>
        `).join('');
        
        homeTiles.querySelectorAll('.news-tile').forEach(tile => {
            tile.addEventListener('click', () => openNewsModal(parseInt(tile.dataset.newsId)));
        });
    }
    
    const newsGrid = document.getElementById('news-grid');
    if (newsGrid) {
        newsGrid.innerHTML = NEWS_DATA.map(news => `
            <article class="news-card" data-news-id="${news.id}">
                <div class="news-card-image">${news.image ? `<img src="${news.image}">` : `<i class="fas ${news.icon}"></i>`}</div>
                <div class="news-card-body">
                    <div class="news-card-meta"><span class="news-card-category">${news.category}</span><span class="news-card-date">${news.date}</span></div>
                    <h3 class="news-card-title">${news.title}</h3>
                    <p class="news-card-text">${news.text}</p>
                </div>
                <div class="news-card-footer"><i class="fas fa-user"></i><span>${news.author}</span></div>
            </article>
        `).join('');
        newsGrid.querySelectorAll('.news-card').forEach(card => {
            card.addEventListener('click', () => openNewsModal(parseInt(card.dataset.newsId)));
        });
    }
}

function openNewsModal(id) {
    const news = NEWS_DATA.find(n => n.id === id);
    if (!news) return;
    document.getElementById('modal-image').innerHTML = news.image ? `<img src="${news.image}">` : `<i class="fas ${news.icon}"></i>`;
    document.getElementById('modal-category').textContent = news.category;
    document.getElementById('modal-date').textContent = news.date;
    document.getElementById('modal-title').textContent = news.title;
    document.getElementById('modal-text').textContent = news.text;
    document.getElementById('modal-author').textContent = news.author;
    document.getElementById('news-modal').style.display = 'flex';
}

document.getElementById('modal-close').addEventListener('click', () => document.getElementById('news-modal').style.display = 'none');
document.getElementById('news-modal').addEventListener('click', (e) => { if (e.target.id === 'news-modal') document.getElementById('news-modal').style.display = 'none'; });
document.getElementById('view-all-news').addEventListener('click', () => switchTab('news'));
document.getElementById('back-from-news').addEventListener('click', () => switchTab('home'));

function renderSocials() {
    const grid = document.getElementById('socials-grid');
    if (grid) {
        grid.innerHTML = SOCIALS_DATA.map(s => `
            <a href="${s.url}" class="social-card">
                <div class="social-icon ${s.color}"><i class="${s.icon}"></i></div>
                <div class="social-info"><div class="social-name">${s.name}</div><div class="social-desc">${s.desc}</div></div>
                <i class="fas fa-external-link-alt social-arrow"></i>
            </a>
        `).join('');
    }
}

function renderMedia() {
    const streamersGrid = document.getElementById('streamers-grid');
    if (streamersGrid) {
        streamersGrid.innerHTML = STREAMERS_DATA.map(s => `
            <a href="${s.url}" class="streamer-card">
                <div class="streamer-avatar">${s.avatar ? `<img src="${s.avatar}">` : `<i class="fab fa-twitch"></i>`}</div>
                <div class="streamer-info"><div class="streamer-name">${s.name}</div><div class="streamer-desc">${s.desc}</div></div>
                <i class="fab fa-twitch streamer-platform"></i>
            </a>
        `).join('');
    }
    const videosGrid = document.getElementById('videos-grid');
    if (videosGrid) {
        videosGrid.innerHTML = VIDEOS_DATA.map(v => `
            <a href="${v.url}" class="video-card">
                <div class="video-thumbnail">${v.thumbnail ? `<img src="${v.thumbnail}">` : ''}<div class="play-overlay"><i class="fas fa-play"></i></div></div>
                <div class="video-info"><div class="video-title">${v.title}</div><div class="video-channel">${v.channel}</div></div>
            </a>
        `).join('');
    }
}

function initPalette() {
    const paletteBtns = document.querySelectorAll('.palette-btn');
    const saved = storage.get('palette', 'orange');
    applySetting('palette', saved, paletteBtns);
    paletteBtns.forEach(btn => btn.addEventListener('click', () => {
        applySetting('palette', btn.dataset.palette, paletteBtns);
        storage.set('palette', btn.dataset.palette);
    }));
}

function initBgStyle() {
    const btns = document.querySelectorAll('.bg-style-btn');
    const saved = storage.get('bgStyle', 'solid');
    applySetting('bg', saved, btns);
    btns.forEach(btn => btn.addEventListener('click', () => {
        applySetting('bg', btn.dataset.bg, btns);
        storage.set('bgStyle', btn.dataset.bg);
    }));
}

function initBtnStyle() {
    const btns = document.querySelectorAll('.btn-style-btn');
    const saved = storage.get('btnStyle', 'solid');
    applySetting('btnstyle', saved, btns);
    btns.forEach(btn => btn.addEventListener('click', () => {
        applySetting('btnstyle', btn.dataset.btnstyle, btns);
        storage.set('btnStyle', btn.dataset.btnstyle);
    }));
}

function applySetting(prefix, value, btns) {
    document.body.className = document.body.className.replace(new RegExp(`${prefix}-\\w+`, 'g'), '').trim();
    document.body.classList.add(`${prefix}-${value}`);
    btns.forEach(b => b.classList.toggle('active', b.dataset[prefix === 'btnstyle' ? 'btnstyle' : (prefix === 'bg' ? 'bg' : 'palette')] === value));
    if (storage.get('blurEnabled')) document.body.classList.add('blur-enabled');
}

const nicknameInput = document.getElementById('nickname');
const playBtn = document.getElementById('play-btn');
const statusText = document.getElementById('status-text');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const memorySlider = document.getElementById('memory-slider');
const memoryValue = document.getElementById('memory-value');
const gamePathInput = document.getElementById('game-path-input');
const selectPathBtn = document.getElementById('select-path-btn');
const consoleOutput = document.getElementById('console-output');
const clearConsoleBtn = document.getElementById('clear-console');
const blurToggle = document.getElementById('blur-toggle');
const weatherToggle = document.getElementById('weather-toggle');

window.addEventListener('DOMContentLoaded', () => {
    initShineText();
    renderNews();
    renderSocials();
    renderMedia();
    initPalette();
    initBgStyle();
    initBtnStyle();
    initWeather();
    
    nicknameInput.value = storage.get('nickname', 'Player');
    memorySlider.value = storage.get('memory', 8);
    memoryValue.textContent = `${memorySlider.value} GB`;
    ipcRenderer.send('get-game-path');
    
    blurToggle.checked = storage.get('blurEnabled', false);
    if (blurToggle.checked) document.body.classList.add('blur-enabled');
    
    weatherToggle.checked = storage.get('weatherEnabled', false);
    if (weatherToggle.checked) startWeather();
});

nicknameInput.addEventListener('input', () => storage.set('nickname', nicknameInput.value));
memorySlider.addEventListener('input', (e) => {
    memoryValue.textContent = `${e.target.value} GB`;
    storage.set('memory', parseInt(e.target.value));
});
selectPathBtn.addEventListener('click', () => ipcRenderer.send('select-game-path'));
ipcRenderer.on('game-path-selected', (event, path) => {
    gamePathInput.value = path;
    storage.set('gamePath', path);
});

blurToggle.addEventListener('change', (e) => {
    storage.set('blurEnabled', e.target.checked);
    e.target.checked ? document.body.classList.add('blur-enabled') : document.body.classList.remove('blur-enabled');
});

weatherToggle.addEventListener('change', (e) => {
    storage.set('weatherEnabled', e.target.checked);
    e.target.checked ? startWeather() : stopWeather();
});

let consoleActive = false;
function addLog(message, type = 'info') {
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.innerHTML = `<span style="color:#666">[${new Date().toLocaleTimeString('ru-RU')}]</span> ${message}`;
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
    const dot = document.getElementById('console-dot');
    if (dot && !consoleActive) dot.style.display = 'block';
}
clearConsoleBtn?.addEventListener('click', () => { consoleOutput.innerHTML = ''; });
document.querySelector('[data-tab="console"]')?.addEventListener('click', () => {
    consoleActive = true;
    const dot = document.getElementById('console-dot');
    if (dot) dot.style.display = 'none';
});

function checkNewNews() {
    if (NEWS_DATA[0]?.id > (storage.get('lastViewedNews', 0))) {
        const dot = document.getElementById('news-dot');
        if (dot) dot.style.display = 'block';
    }
}
document.querySelector('[data-tab="news"]')?.addEventListener('click', () => {
    storage.set('lastViewedNews', NEWS_DATA[0]?.id || 0);
    const dot = document.getElementById('news-dot');
    if (dot) dot.style.display = 'none';
});
checkNewNews();

playBtn.addEventListener('click', () => {
    const nickname = nicknameInput.value.trim();
    if (nickname.length < 3) {
        statusText.textContent = '❌ Ник слишком короткий';
        statusText.style.color = 'var(--danger)';
        return;
    }
    const memory = parseInt(memorySlider.value);
    playBtn.disabled = true;
    playBtn.querySelector('.play-label').textContent = 'ЗАГРУЗКА...';
    progressBar.style.display = 'block';
    statusText.textContent = '🔄 Подготовка...';
    progressText.textContent = 'Проверка файлов...';
    
    const consoleDot = document.getElementById('console-dot');
    if (consoleDot) consoleDot.style.display = 'block';
    consoleActive = false;
    
    switchTab('console');
    addLog('=== ЗАПУСК ИГРЫ ===', 'success');
    addLog(`Ник: ${nickname}, Память: ${memory}GB`, 'info');
    ipcRenderer.send('launch-game', { nickname, memory });
});

ipcRenderer.on('launch-status', (event, data) => {
    const { action, file } = data;
    let emoji = '';
    switch(action) {
        case 'Проверка': emoji = '✓'; statusText.textContent = `Проверка файлов...`; break;
        case 'Загрузка': emoji = '⬇️'; statusText.textContent = `Загрузка: ${file}`; break;
        case 'Распаковка': emoji = '📦'; statusText.textContent = `Распаковка: ${file}`; break;
        case 'Установка': emoji = '🔧'; statusText.textContent = `Установка NeoForge...`; break;
        default: statusText.textContent = `${action}: ${file}`;
    }
    progressText.textContent = `${emoji} ${action}`;
    addLog(`${emoji} ${action}: ${file}`, 'info');
});

ipcRenderer.on('download-progress', (event, data) => {
    const { percent, action } = data;
    progressFill.style.width = `${percent}%`;
    let emoji = action === 'Загрузка' ? '⬇️' : (action === 'Распаковка' ? '📦' : (action === 'Установка' ? '🔧' : '⏳'));
    progressText.textContent = `${emoji} ${action}... ${percent}%`;
});

ipcRenderer.on('launch-error', (event, error) => {
    statusText.textContent = `❌ Ошибка: ${error}`;
    statusText.style.color = 'var(--danger)';
    progressText.textContent = 'Произошла ошибка';
    playBtn.querySelector('.play-label').textContent = 'ИГРАТЬ';
    playBtn.disabled = false;
    addLog(`❌ Ошибка: ${error}`, 'error');
    setTimeout(() => { progressBar.style.display = 'none'; progressFill.style.width = '0%'; }, 3000);
});

ipcRenderer.on('game-closed', () => {
    statusText.textContent = '✅ Игра закрыта';
    statusText.style.color = 'var(--success)';
    progressText.textContent = '';
    playBtn.querySelector('.play-label').textContent = 'ИГРАТЬ';
    playBtn.disabled = false;
    addLog('✅ Игра закрыта', 'success');
    const consoleDot = document.getElementById('console-dot');
    if (consoleDot) consoleDot.style.display = 'none';
    consoleActive = true;
    setTimeout(() => { progressBar.style.display = 'none'; progressFill.style.width = '0%'; }, 2000);
});

ipcRenderer.on('game-launched', () => {
    statusText.textContent = '🎮 Minecraft запущен!';
    statusText.style.color = 'var(--success)';
    progressText.textContent = 'Приятной игры!';
    addLog('🎮 Minecraft запущен!', 'success');
});

let weatherAnimationId = null;
const canvas = document.getElementById('weather-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(type) {
        this.type = type;
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        if (this.type === 'rain') {
            this.speed = Math.random() * 5 + 10;
            this.length = Math.random() * 20 + 10;
            this.opacity = Math.random() * 0.3 + 0.1;
        } else {
            this.speed = Math.random() * 1 + 0.5;
            this.size = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.drift = Math.random() * 1 - 0.5;
        }
    }
    update() {
        if (this.type === 'rain') {
            this.y += this.speed;
            if (this.y > canvas.height) this.reset();
        } else {
            this.y += this.speed;
            this.x += this.drift;
            if (this.y > canvas.height) this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        if (this.type === 'rain') {
            ctx.strokeStyle = `rgba(174, 194, 224, ${this.opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.length);
            ctx.stroke();
        } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function initWeather() {
    particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle(Math.random() > 0.5 ? 'rain' : 'snow'));
    }
}

function animateWeather() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    weatherAnimationId = requestAnimationFrame(animateWeather);
}

function startWeather() {
    if (!weatherAnimationId) animateWeather();
}

function stopWeather() {
    if (weatherAnimationId) {
        cancelAnimationFrame(weatherAnimationId);
        weatherAnimationId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}