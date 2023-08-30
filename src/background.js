'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GREETINGS') {
        const message = `Hi ${
            sender.tab ? 'Con' : 'Pop'
        }, my name is Bac. I am from Background. It's great to hear from you.`;

        // Log message coming from the `request` parameter
        console.log(request.payload.message);
        // Send a response message
        sendResponse({
            message,
        });
    }
});

// This listens for when the browser extension icon is clicked.
chrome.action.onClicked.addListener((tab) => {
    // This checks if the current tab's URL matches Udemy course pages, and if so, injects the script.
    if (tab.url && tab.url.includes('udemy.com/course/')) {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['contentScript.js']
        });
    }
});
