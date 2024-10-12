// Открыть/закрыть гамбургерное меню
function toggleMenu() {
    const menu = document.getElementById('side-menu');
    if (menu.style.width === '250px') {
        menu.style.width = '0';
    } else {
        menu.style.width = '250px';
    }
}

function closeMenu() {
    document.getElementById('side-menu').style.width = '0';
}

// Получить список приложений из папки репозитория
async function fetchApps() {
    const appList = document.getElementById('app-list');
    appList.innerHTML = ''; // Очищаем перед новым поиском

    // Адрес GitHub API для получения списка приложений
    const repoApiUrl = 'https://api.github.com/repos/username/repository-name/contents/Apps';

    try {
        const response = await fetch(repoApiUrl);
        const apps = await response.json();

        // Проходим по каждой папке приложения
        for (let app of apps) {
            if (app.type === 'dir') {
                // Извлекаем данные о приложении (иконку, версию, название)
                const appData = await fetchAppData(app.name);
                if (appData) {
                    const appCard = document.createElement('div');
                    appCard.className = 'app-card';
                    appCard.onclick = () => window.location.href = appData.url;

                    const appIcon = document.createElement('img');
                    appIcon.src = appData.icon;
                    appIcon.className = 'app-icon';

                    const appInfo = document.createElement('div');
                    appInfo.className = 'app-info';

                    const appName = document.createElement('h2');
                    appName.textContent = appData.name;

                    const appVersion = document.createElement('p');
                    appVersion.textContent = `Версия: ${appData.version}`;

                    appInfo.appendChild(appName);
                    appInfo.appendChild(appVersion);
                    appCard.appendChild(appIcon);
                    appCard.appendChild(appInfo);
                    appList.appendChild(appCard);

                    const separator = document.createElement('div');
                    separator.className = 'separator';
                    appList.appendChild(separator);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching apps:', error);
    }
}

// Получение данных приложения из папки (иконка, версия и ссылка на страницу)
async function fetchAppData(appFolder) {
    const folderUrl = `https://api.github.com/repos/username/repository-name/contents/Apps/${appFolder}`;

    try {
        const response = await fetch(folderUrl);
        const files = await response.json();

        // Найти иконку приложения
        const iconFile = files.find(file => file.name === 'Icon.png');
        const iconUrl = iconFile ? iconFile.download_url : '';

        // Найти версию приложения
        const versionFile = files.find(file => file.name.endsWith('.ver'));
        const version = versionFile ? versionFile.name.replace('.ver', '') : 'N/A';

        // URL страницы приложения (index.html в папке приложения)
        const appUrl = `https://username.github.io/repository-name/Apps/${appFolder}/index.html`;

        return {
            name: appFolder, // Название приложения — это название папки
            icon: iconUrl,
            version: version,
            url: appUrl
        };
    } catch (error) {
        console.error(`Error fetching app data for ${appFolder}:`, error);
        return null;
    }
}

// Поиск приложений по названию
function searchApps() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const appCards = document.getElementsByClassName('app-card');

    Array.from(appCards).forEach(card => {
        const appName = card.querySelector('h2').textContent.toLowerCase();
        card.style.display = appName.includes(searchInput) ? 'block' : 'none';
    });
}

// Выполняем начальную загрузку приложений
fetchApps();
