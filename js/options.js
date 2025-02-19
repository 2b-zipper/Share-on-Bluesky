document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['openas'], (result) => {
        if (result.openas) {
            document.querySelector(`input[name="openas"][value="${result.openas}"]`).checked = true;
        }
    });

    document.getElementById('save').addEventListener('click', () => {
        const openas = document.querySelector('input[name="openas"]:checked').value;
        chrome.storage.local.set({ openas }, () => {
            alert('Options saved');
        });
    });
});