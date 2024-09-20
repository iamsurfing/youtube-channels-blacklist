function deleteVideosByChannel(blacklistedChannels) {
  // Select all relevant video elements including ytd-compact-video-renderer
  const videoElements = document.querySelectorAll([
    'ytd-video-renderer.style-scope.ytd-item-section-renderer',
    'ytd-video-renderer.style-scope.ytd-vertical-list-renderer',
    'ytd-compact-video-renderer.style-scope.ytd-item-section-renderer',
    'ytd-compact-video-renderer.style-scope.ytd-compact-video-renderer', 
    'ytd-playlist-renderer.style-scope.ytd-item-section-renderer',
  ].join(', '));

  // Loop through each video element
  videoElements.forEach((videoElement) => {
    // Find the channel name element within the video renderer
    const channelLink = videoElement.querySelector('ytd-channel-name a');
    const channelText = videoElement.querySelector('ytd-channel-name yt-formatted-string');

    // Extract the channel name
    let channelName = '';
    if (channelLink) {
      channelName = channelLink.textContent.trim();
    } else if (channelText) {
      channelName = channelText.textContent.trim();
    }

    if (channelName) {
      let isBlacklisted = false;
      blacklistedChannels.forEach((channel) => {
        if (channelName === channel) {
          isBlacklisted = true;
        }
      });

      if (isBlacklisted) {
        // Hide the video element if blacklisted
        videoElement.style.visibility = "hidden";
        videoElement.style.height = "0px";
      } else {
        // Show the video element if not blacklisted
        videoElement.style.visibility = "visible";
        videoElement.style.height = "100%";
      }
    }
  });
}

// Function to fetch blacklisted channels and apply the filter
function updateVideoList() {
  chrome.storage.sync.get({ blacklistedChannels: [] }, function(data) {
    deleteVideosByChannel(data.blacklistedChannels);
  });
}

// Initial check
updateVideoList();

// Re-run this script periodically or on page navigation
setInterval(updateVideoList, 5000);

// Listen for changes in the blacklist
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === 'sync' && changes.blacklistedChannels) {
    updateVideoList();
  }
});
