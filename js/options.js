document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['openas', 'newline', 'includeTitle'], (result) => {
        if (result.openas) {
            document.querySelector(`input[name="openas"][value="${result.openas}"]`).checked = true;
        }
        if (result.newline) {
            document.getElementById('newline').checked = result.newline;
        }
        if (result.includeTitle !== undefined) {
            document.getElementById('includeTitle').checked = result.includeTitle;
        }
    });

    chrome.commands.getAll((commands) => {
        const shareCurrentTabCommand = commands.find(command => command.name === 'share-current-tab');
        if (shareCurrentTabCommand) {
            document.getElementById('shortcut-value').textContent = shareCurrentTabCommand.shortcut;
        }
    });

    document.querySelectorAll('input[name="openas"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            const openas = document.querySelector('input[name="openas"]:checked').value;
            chrome.storage.sync.set({ openas }, () => {
                displayMessage('Options saved.');
            });
        });
    });

    document.getElementById('newline').addEventListener('change', () => {
        const newline = document.getElementById('newline').checked;
        chrome.storage.sync.set({ newline }, () => {
            displayMessage('Options saved.');
        });
    });

    document.getElementById('includeTitle').addEventListener('change', () => {
        const includeTitle = document.getElementById('includeTitle').checked;
        chrome.storage.sync.set({ includeTitle }, () => {
            displayMessage('Options saved.');
        });
    });

    document.getElementById('check-updates').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'checkForUpdates' }, (response) => {
            if (response.success) {
                displayMessage('Update check completed.');
            } else {
                displayMessage('Error checking for updates.');
            }
        });
    });

    document.getElementById('change-shortcut').addEventListener('click', () => {
        chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    });
});

function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    setTimeout(() => {
        messageElement.textContent = '';
    }, 1300);
}