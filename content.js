function deleteVideosByChannel(blacklistedChannels) {
	
  // Select all video elements within the section
  const videoElements = document.querySelectorAll('ytd-video-renderer.style-scope.ytd-item-section-renderer, ytd-video-renderer.style-scope.ytd-vertical-list-renderer');

  // Loop through each video element
  videoElements.forEach((videoElement) => {
    // Find the <a> tag inside the video element that contains the channel href
    const channelLink = videoElement.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string[href]');

    if (channelLink) {
      const href = channelLink.getAttribute('href');
      // Check if the href exists in the blacklisted channels
      let isBlacklisted = false;
      blacklistedChannels.forEach((channel) => {
        if (href.includes(`/@${channel}`)) {
          isBlacklisted = true;
        }
      });

      if (isBlacklisted) {
        // Hide the video element
        videoElement.style.visibility = "hidden";
        videoElement.style.height = "0px";
      } else {
        // Re-show element if not blacklisted
        videoElement.style.visibility = "visible";
        videoElement.style.height = "100%";
      }
    }
  });
}

// Function to fetch blacklisted channels and apply the filter
function updateVideoList() {
  chrome.storage.sync.get({ blacklistedChannels: [] }, function(data) {
    //if (data.blacklistedChannels.length > 0) {
      deleteVideosByChannel(data.blacklistedChannels);
    //}

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
