document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['openas', 'newline'], (result) => {
        if (result.openas) {
            document.querySelector(`input[name="openas"][value="${result.openas}"]`).checked = true;
        }
        if (result.newline) {
            document.getElementById('newline').checked = result.newline;
        }
    });

    document.querySelectorAll('input[name="openas"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            const openas = document.querySelector('input[name="openas"]:checked').value;
            chrome.storage.local.set({ openas }, () => {
                displayMessage('Options saved.');
            });
        });
    });

    document.getElementById('newline').addEventListener('change', () => {
        const newline = document.getElementById('newline').checked;
        chrome.storage.local.set({ newline }, () => {
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
});

function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    setTimeout(() => {
        messageElement.textContent = '';
    }, 1300);
}