let currentVolume = 0.2; // Default volume

function setVolume(volume) {
    currentVolume = volume;
    const mediaElements = document.querySelectorAll("audio, video");
    mediaElements.forEach(media => {
        media.volume = currentVolume; // Set the volume directly
    });
}

function applyVolumeToMedia() {
    const mediaElements = document.querySelectorAll("audio, video");
    mediaElements.forEach(media => {
        media.volume = currentVolume;
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setVolume") {
        setVolume(request.volume);
        sendResponse({ status: "success" });
    }
});

document.addEventListener("play", (event) => {
    if (event.target.tagName === "VIDEO" || event.target.tagName === "AUDIO") {
        event.target.volume = currentVolume;
    }
}, true);

const observer = new MutationObserver(applyVolumeToMedia);
observer.observe(document.body, { childList: true, subtree: true });

applyVolumeToMedia();
