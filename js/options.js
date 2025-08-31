document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['openas', 'newline', 'includeTitle'], (result) => {
        if (result.openas) {
            document.querySelector(`input[name="openas"][value="${result.openas}"]`).checked = true;
            updateRadioOptionUI();
        }
        if (result.newline) {
            document.getElementById('newline').checked = result.newline;
        }
        if (result.includeTitle !== undefined) {
            document.getElementById('includeTitle').checked = result.includeTitle;
            document.getElementById('newline').disabled = !result.includeTitle;
        }
        updateCheckboxUI();
    });

    chrome.commands.getAll((commands) => {
        const shareCurrentTabCommand = commands.find(command => command.name === 'share-current-tab');
        if (shareCurrentTabCommand && shareCurrentTabCommand.shortcut) {
            document.getElementById('shortcut-value').textContent = shareCurrentTabCommand.shortcut;
        } else {
            document.getElementById('shortcut-value').textContent = 'None';
        }
    });

    document.querySelectorAll('input[name="openas"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            const openas = document.querySelector('input[name="openas"]:checked').value;
            chrome.storage.sync.set({ openas }, () => {
                displayMessage('Settings saved successfully!');
            });
            updateRadioOptionUI();
        });
    });

    document.querySelectorAll('.radio-option').forEach((option) => {
        option.addEventListener('click', () => {
            const radio = option.querySelector('input[type="radio"]');
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
        });
    });

    document.getElementById('newline').addEventListener('change', () => {
        const newline = document.getElementById('newline').checked;
        chrome.storage.sync.set({ newline }, () => {
            displayMessage('Settings saved successfully!');
        });
        updateCheckboxUI();
    });

    document.getElementById('includeTitle').addEventListener('change', () => {
        const includeTitle = document.getElementById('includeTitle').checked;
        document.getElementById('newline').disabled = !includeTitle;
        chrome.storage.sync.set({ includeTitle }, () => {
            displayMessage('Settings saved successfully!');
        });
        updateCheckboxUI();
    });

    document.querySelectorAll('.checkbox-option').forEach((option) => {
        option.addEventListener('click', (e) => {
            if (e.target.type !== 'checkbox') {
                const checkbox = option.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    });

    document.getElementById('change-shortcut').addEventListener('click', () => {
        chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    });

    updateRadioOptionUI();
    updateCheckboxUI();
});

function updateRadioOptionUI() {
    document.querySelectorAll('.radio-option').forEach((option) => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio.checked) {
            option.classList.add('checked');
        } else {
            option.classList.remove('checked');
        }
    });
}

function updateCheckboxUI() {
    document.querySelectorAll('.checkbox-option').forEach((option) => {
        const checkbox = option.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            option.classList.add('checked');
        } else {
            option.classList.remove('checked');
        }
    });
}

let messageTimeoutId = null;
let messageClearId = null;
function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.classList.add('show');
    if (messageTimeoutId) clearTimeout(messageTimeoutId);
    if (messageClearId) clearTimeout(messageClearId);
    messageTimeoutId = setTimeout(() => {
        messageElement.classList.remove('show');
    }, 2000);
    messageClearId = setTimeout(() => {
        messageElement.textContent = '';
    }, 2300);
}