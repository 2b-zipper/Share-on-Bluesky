importScripts('check_updates.js');

chrome.action.onClicked.addListener((tab) => {
    post(tab.url, tab.title);
});

chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({"title": "Share page on Bluesky", "contexts":["page"], "id": "post-page"});
    chrome.contextMenus.create({"title": "Share link on Bluesky", "contexts":["link"], "id": "post-link"});
    chrome.contextMenus.create({"title": "Share selection on Bluesky", "contexts":["selection"], "id": "post-selection"});
    chrome.contextMenus.create({"title": "Share image on Bluesky", "contexts":["image"], "id": "post-image"});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "post-page") {
        post(tab.url, tab.title);
    } else if (info.menuItemId === "post-link") {
        post(info.linkUrl, "Link: " + (info.linkText || ""));
    } else if (info.menuItemId === "post-selection") {
        post(tab.url, info.selectionText);
    } else if (info.menuItemId === "post-image") {
        post(info.srcUrl, "Image: ");
    }
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "share-current-tab") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            let activeTab = tabs[0];
            post(activeTab.url, activeTab.title);
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkForUpdates') {
        checkForUpdates(true)
            .then(() => sendResponse({ success: true }))
            .catch(() => sendResponse({ success: false }));
        return true;
    }
});

function post(url, text) {
    chrome.storage.local.get(['openas', 'newline'], (result) => {
        let openas = result.openas || "popup";
        let newline = result.newline ? "%0A" : " ";
        let postUrl = "https://bsky.app/intent/compose?text=" + encodeURIComponent(text || "") + newline + encodeURIComponent(url || "");

        if (openas === "popup") {
            chrome.windows.create({ url: postUrl, width: 600, height: 430, type: "popup" });
        } else if (openas === "tab") {
            chrome.tabs.create({ url: postUrl });
        }
    });
}
