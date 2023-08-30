/**
 * Udemy Course Progress and Metadata Fetcher
 * -------------------------------------------
 *
 * Author: lundeen-bryan (GitHub)
 *
 * Description:
 * This script performs two main functions on a Udemy course page:
 * 1. It calculates the remaining duration based on unwatched video lectures.
 *    If all sections are marked as completed, it indicates course completion.
 *    The script expands all sections to locate unwatched video timings, calculates
 *    the total remaining duration, collapses the sections back, and displays the result
 *    in the "About this course" > "By the numbers" section, highlighted in yellow.
 *    It also logs the result to the console.
 * 2. It fetches the course metadata, including title, URL, and description from the page's
 *    meta tags. This metadata can be used later for sharing or other functionalities.
 *
 * Parameters:
 * None. The script operates on the current Udemy course webpage.
 *
 * Returns:
 * 1. Displays the remaining time or course completion status on the course webpage.
 * 2. Fetches and stores the course title, URL, and description for potential further use.
 * 3. Logs the calculated time left or course completion status to the console.
 *
 * Notes:
 * The efficiency and success of this script hinge on Udemy's current webpage structure.
 * If the layout or class names undergo changes in the future, this script might need updates.
 */

(function() {

    // ========================
    // Section to handle course metadata fetching
    // ========================

    /**
     * Fetches the content of a meta tag based on its name attribute.
     * @param {string} name - The name attribute of the meta tag.
     * @returns {string} - The content of the meta tag.
     */
    function getMetaContentByName(name) {
        const element = document.querySelector(`meta[name="${name}"]`);
        return element && element.getAttribute("content");
    }

    // Fetch and store meta tag data for course title, URL, and description.
    const title = getMetaContentByName("twitter:title");
    const url = getMetaContentByName("twitter:url");
    const description = getMetaContentByName("twitter:description");

    // Assuming we have a method to store these (like using Chrome's storage API):
    chrome.storage.local.set({ 'courseTitle': title, 'courseURL': url, 'courseDescription': description });

    // ========================
    // Section to handle time calculation and display
    // ========================

    // Store the initial scroll position.
    const SCROLL_TOP_VALUE = window.scrollY;

    // List to keep track of sections that need to be opened for processing.
    const unopenedSections = [];

    // Expand unopened sections to access the timings of unwatched videos.
    document
        .querySelectorAll(".section--section--BukKG > span")
        .forEach((section) => {
            const isExpanded =
                section.getAttribute("data-checked") === "checked";
            if (!isExpanded) {
                const accordionTitle = section.parentNode.querySelector(
                    ".ud-accordion-panel-heading"
                );
                if (accordionTitle) {
                    accordionTitle.click();
                    unopenedSections.push(section);
                } else {
                    console.warn(
                        "Could not find the accordion panel heading for one of the sections. The website structure might have changed."
                    );
                }
            }
        });

    // Calculate the total minutes left based on unwatched video timings.
    let totalMinutes = 0;
    let allSectionsCompleted = true;

    document
        .querySelectorAll(".item-link.ud-custom-focus-visible")
        .forEach((item) => {
            const isChecked = item.querySelector(
                ".ud-real-toggle-input"
            ).checked;

            if (!isChecked) {
                allSectionsCompleted = false;
                const timer = item.querySelector(".ud-text-xs span");
                if (timer) {
                    let time = parseInt(
                        timer.innerText.replace("min", "").trim(),
                        10
                    );
                    totalMinutes += isNaN(time) ? 0 : time;
                }
            }
        });

    // Collapse the sections that were expanded for processing.
    unopenedSections.forEach((section) => {
        const accordionTitle = section.parentNode.querySelector(
            ".ud-accordion-panel-heading"
        );
        if (accordionTitle) {
            accordionTitle.click();
        } else {
            console.warn(
                "Could not find the accordion panel heading for one of the sections while trying to collapse. The website structure might have changed."
            );
        }
    });

    // Restore the original scroll position.
    window.scrollTo({ top: SCROLL_TOP_VALUE });

    // Display the calculated time in the 'About this course' section.
    const displayArea = document.querySelector('dd[data-purpose="course-additional-stats"]');
    if (displayArea) {
        let timeElement = displayArea.querySelector('.udemy-time-remaining');
        let displayText = "";

        if (allSectionsCompleted) {
            displayText = "It looks like you completed the entire course.";
        } else {
            const hours = String(Math.trunc(totalMinutes / 60)).padStart(2, "0");
            const minutes = String(totalMinutes % 60).padStart(2, "0");
            displayText = `Time Remaining (HH:MM): ${hours}:${minutes}`;
        }

        if (timeElement) {
            timeElement.textContent = displayText;
        } else {
            timeElement = document.createElement("div");
            timeElement.textContent = displayText;
            timeElement.className = 'udemy-time-remaining';
            timeElement.style.backgroundColor = "yellow";
            displayArea.appendChild(timeElement);
        }
    }

    // Log the calculated time for debugging purposes.
    if (!allSectionsCompleted) {
        const hours = String(Math.trunc(totalMinutes / 60)).padStart(2, "0");
        const minutes = String(totalMinutes % 60).padStart(2, "0");
        console.log(`Time left (HH:MM): ${hours}:${minutes}`);
    } else {
        console.log("It looks like you completed the entire course.");
    }

})();

