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
      blacklistedChannels.forEach((channel) => {
        if (href.includes(`/@${channel}`)) {
          // Remove the video element from the DOM
          //videoElement.remove();
		  videoElement.style.visibility = "hidden";
		  videoElement.style.height = "0px";
        }
		else {
			// Re-show element if removed from blacklist
			videoElement.style.visibility = "visible";
			videoElement.style.height = "100%";
		};
      });
    }
  });
}

// Fetch the list of blacklisted channels from storage and remove the videos
chrome.storage.sync.get({ blacklistedChannels: [] }, function(data) {
  if (data.blacklistedChannels.length > 0) {
    deleteVideosByChannel(data.blacklistedChannels);
  }
});

// Optionally, re-run this script periodically or on page navigation
setInterval(() => {
  chrome.storage.sync.get({ blacklistedChannels: [] }, function(data) {
    if (data.blacklistedChannels.length > 0) {
      deleteVideosByChannel(data.blacklistedChannels);
    }
  });
}, 5000);
