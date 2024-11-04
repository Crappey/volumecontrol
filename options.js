document.addEventListener("DOMContentLoaded", () => {
    const defaultVolumeSlider = document.getElementById("defaultVolume");
    const volumeDisplay = document.getElementById("volumeDisplay");

    // Load the saved default volume
    chrome.storage.local.get("defaultVolume", (data) => {
        const savedVolume = data.defaultVolume !== undefined ? data.defaultVolume : 0.2; // Default to 0.2
        defaultVolumeSlider.value = savedVolume;
        volumeDisplay.textContent = `Current Default Volume: ${Math.round(savedVolume * 100)}%`;
    });

    // Update the volume display and save the new default volume
    defaultVolumeSlider.addEventListener("input", () => {
        const volume = parseFloat(defaultVolumeSlider.value);
        volumeDisplay.textContent = `Current Default Volume: ${Math.round(volume * 100)}%`;

        // Save the default volume to storage
        chrome.storage.local.set({ defaultVolume: volume });
    });
});
