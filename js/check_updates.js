const GITHUB_API_URL = 'https://api.github.com/repos/2b-zipper/Share-on-Bluesky/releases/latest';

chrome.alarms.create('checkForUpdates', { periodInMinutes: 360 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkForUpdates') {
        checkForUpdates(false);
    }
});

chrome.runtime.onStartup.addListener(() => {
    checkForUpdates(true);
});

function checkForUpdates(showNotification) {
    return fetch(GITHUB_API_URL)
        .then(response => response.json())
        .then(data => {
            let latestVersion = data.tag_name;
            return getCurrentVersion().then(currentVersion => {
                if (isNewerVersion(latestVersion, currentVersion)) {
                    if (showNotification) {
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: chrome.runtime.getURL('images/128.png'),
                            title: 'Share on Bluesky Update',
                            message: `A new version (${latestVersion}) is available! Please update your extension.`,
                            buttons: [{ title: 'Update Now' }],
                            priority: 2
                        });
                    }
                } else {
                    if (showNotification && !chrome.runtime.onStartup.hasListener()) {
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: chrome.runtime.getURL('images/128.png'),
                            title: 'Share on Bluesky',
                            message: 'You are using the latest version.',
                            priority: 2
                       });
                    }
                }
            });
        })
        .catch(error => console.error('Error checking for updates:', error));
}

function getCurrentVersion() {
    return fetch(chrome.runtime.getURL('manifest.json'))
        .then(response => response.json())
        .then(manifest => manifest.version)
        .catch(error => console.error('Error getting current version:', error));
}

function isNewerVersion(latest, current) {
    const latestParts = latest.split('.').map(Number);
    const currentParts = current.split('.').map(Number);
    for (let i = 0; i < latestParts.length; i++) {
        if (latestParts[i] > currentParts[i]) return true;
        if (latestParts[i] < currentParts[i]) return false;
    }
    return false;
}

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
        chrome.tabs.create({ url: 'https://github.com/2b-zipper/Share-on-Bluesky/releases/latest' });
    }
});