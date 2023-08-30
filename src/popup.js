function sendTweet(courseTitle, remainingTime, courseDescription, courseUrl) {
    const tweetText = encodeURIComponent(
        `I've only got ${remainingTime} left to finish ${courseTitle} on Udemy! Learn ${courseDescription}! ${courseUrl}`
    );
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterUrl, '_blank');
}

document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.executeScript({
        file: 'udemyTimeCalculator.js'
    }, ([results] = []) => {
        if (results) {
            const { title, description, remainingTime, url } = results;

            document.getElementById('courseTitle').textContent = title;
            document.getElementById('courseDescription').textContent = description;
            document.getElementById('remainingTime').textContent = remainingTime;

            const twitterShareElement = document.getElementById('twitterShare');
            twitterShareElement.addEventListener('click', (e) => {
                e.preventDefault(); // Prevents the default link behavior
                sendTweet(title, remainingTime, description, url);
            });
        } else {
            const errorMessageElement = document.getElementById('errorMessage');
            errorMessageElement.style.display = "block";
            errorMessageElement.textContent = "Unable to fetch course details. Please ensure you're on a valid Udemy course page.";
        }
    });
});

