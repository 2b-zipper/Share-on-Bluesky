chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'update') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: chrome.runtime.getURL('images/128.png'),
            title: 'Share on Bluesky Updated',
            message: 'Extension has been updated! Click to see what\'s new.',
            buttons: [{ title: 'View Release Notes' }],
            priority: 2
        });
    }
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
        chrome.tabs.create({ url: 'https://github.com/2b-zipper/Share-on-Bluesky/releases/latest' });
    }
});

chrome.notifications.onClicked.addListener((notificationId) => {
    chrome.tabs.create({ url: 'https://github.com/2b-zipper/Share-on-Bluesky/releases/latest' });
});