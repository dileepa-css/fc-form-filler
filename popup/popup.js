document.getElementById('fill-companion-data').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'fillCompanionData'});
    });
});

document.getElementById('fill-creditcard-data').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'fillCreditCardData'});
    });
});
