document.addEventListener("DOMContentLoaded", () => {
    const volumeSlider = document.getElementById("volumeSlider");
    const volumeText = document.getElementById("volumeText");
    const darkModeToggle = document.getElementById("darkModeToggle");

    // Check local storage for dark mode preference
    chrome.storage.local.get('darkMode', (data) => {
        if (data.darkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true; // Set the toggle state
        } else {
            document.body.classList.add('light-mode');
        }
    });

    // Toggle dark mode
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            chrome.storage.local.set({ darkMode: true });
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            chrome.storage.local.set({ darkMode: false });
        }
    });

    chrome.storage.local.get("defaultVolume", (data) => {
        const initialVolume = data.defaultVolume !== undefined ? data.defaultVolume : 0.2; // Default volume
        volumeSlider.value = initialVolume;
        volumeText.textContent = `Volume: ${Math.round(initialVolume * 100)}%`;
    });
    
    // Get the current tab's hostname to use as a key
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentHost = new URL(tabs[0].url).hostname;

        // Load the saved volume level from storage using the hostname as the key
        chrome.storage.local.get(currentHost, (data) => {
            const initialVolume = (data[currentHost] !== undefined) ? data[currentHost] : 0.2; // Default volume
            volumeSlider.value = initialVolume;
            volumeText.textContent = `Volume: ${Math.round(initialVolume * 100)}%`; // Display the percentage

            // Set the volume on active media elements immediately
            chrome.tabs.sendMessage(tabs[0].id, { action: "setVolume", volume: initialVolume });
        });
    });

    volumeSlider.addEventListener("input", () => {
        const volume = parseFloat(volumeSlider.value);
        
        // Update the displayed volume percentage
        volumeText.textContent = `Volume: ${Math.round(volume * 100)}%`;
        
        // Save the volume level to storage using the hostname as the key
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentHost = new URL(tabs[0].url).hostname;
            chrome.storage.local.set({ [currentHost]: volume }, () => {
                console.log(`Volume for ${currentHost} saved: ${volume}`);
            });

            // Set the volume on the active media elements immediately
            chrome.tabs.sendMessage(tabs[0].id, { action: "setVolume", volume }, (response) => {
                console.log(response.status);
            });
        });
    });
});
