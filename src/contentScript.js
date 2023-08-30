'use strict';

/**
 * ContentScript for Udemy Time Remaining Extension
 * ------------------------------------------------
 *
 * Description:
 * This content script checks if the user is on an Udemy course page,
 * then calculates the remaining time for all unwatched videos in the course.
 * The script responds to messages sent from the background script to initiate the calculation.
 *
 * Notes:
 * The success of this script relies on Udemy's webpage structure as of the last update.
 * If the layout or class names on Udemy's site change in the future, this script may require modifications.
 */

function isUdemyCoursePage() {
    /**
     * Check if the current page URL matches the pattern of a Udemy course page.
     *
     * Parameters:
     * None.
     *
     * Returns:
     * {boolean} True if the page is an Udemy course page, otherwise false.
     */

    return window.location.hostname === 'www.udemy.com' && window.location.pathname.includes('/course/');
}

function calculateUdemyTimeRemaining() {
    /**
     * Calculate the remaining time for all unwatched videos in the current Udemy course.
     * This function assumes it is run on an Udemy course page and may produce unexpected results otherwise.
     *
     * Parameters:
     * None.
     *
     * Returns:
     * None. The result is logged to the console.
     */

    if (!isUdemyCoursePage()) return;

    // (insert your entire time calculation code here)

    // This is just a summary line; replace with your actual code.
    console.log(`Time left (HH:MM): ${hours}:${minutes}`);
}

// Listen for message from background.js to initiate the calculation.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // If the message type matches our known command, run the time calculation.
    if (request.type === 'RUN_UDEMY_TIME_CALCULATION') {
        calculateUdemyTimeRemaining();
    }

    // Always return true to indicate that the response is handled asynchronously.
    return true;
});

