chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Ensure the page is fully loaded and check for the exact URL match
    if (changeInfo.status === "complete" && tab.url && tab.url.includes("rendezvousparis.hermes.com/client/register")) {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ["js/populate_form.js"]
        });
    }
});