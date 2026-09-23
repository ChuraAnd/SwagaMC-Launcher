# SwagaMC Launcher 🚀

Лаунчер для модового сервера SwagaMC

## ✨ Возможности

-  Minecraft 1.21.1 + NeoForge 21.1.248
- 📦 Автоматическая загрузка всех модов
- 🎨 Красивый интерфейс с погодными эффектами
- 🌈 Выбор цветовой палитры (6 тем)
- 🔧 Гибкие настройки (память, путь к игре)
- 🌐 Оффлайн режим (без лицензии)
- 📰 Новости сервера прямо в лаунчере

## 📥 Установка

1. Скачай последнюю версию из [Releases](https://github.com/ChuraAnd/SwagaMC-Launcher/releases)
2. Запусти установщик `SwagaMC Launcher Setup X.X.X.exe`
3. Выбери папку для установки
4. Запусти лаунчер
5. Введи никнейм и нажми "ИГРАТЬ"

При первом запуске лаунчер автоматически скачает все моды и конфиги!

## 🖼️ Скриншоты

![Главный экран](screenshots/bg1.jpg)

##  Для разработчиков

### Установка

```bash
git clone https://github.com/ChuraAnd/SwagaMC-Launcher.git
cd SwagaMC-Launcher
npm install
npm start
Команда полного обновления manifest.json
node generate-manifest.js
Команда сборки .exe файла
npm run dist

структура

SwagaMC-Launcher/
├── .gitignore
├── package.json
├── main.js
├── index.html
├── style.css
├── renderer.js
├── generate-manifest.js
├── update-toml-only.js
├── build/
│   ── icon.ico
├── screenshots/
│   ├── bg1.jpg
│   ├── bg2.jpg
│   └── bg3.jpg
── data/                          ← НОВЫЕ ФАЙЛЫ ДЛЯ ИНТЕРФЕЙСА
│   ├── news.json                  ← Новости
│   ├── socials.json               ← Соцсети
│   ├── media.json                 ← Стримеры и видео
│   └── server.json                ← IP сервера
└── modpack/                       ← КЛИЕНТСКАЯ СБОРКА
    ├── manifest.json              ← Список всех модов и конфигов
    ├── mods/                      ← .jar файлы модов
    │   ├── mod1.jar
    │   └── mod2.jar
    ── config/                    ← Файлы настроек
        ├── config1.toml
        └── config2.json
