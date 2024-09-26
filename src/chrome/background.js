// background.js

chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage with an empty blacklist if not set
  chrome.storage.sync.get({ blacklistedChannels: [] }, function(data) {
    if (!data.blacklistedChannels) {
      chrome.storage.sync.set({ blacklistedChannels: [] });
    }
  });
});

// Function to add a channel to the blacklist
function addChannelToBlacklist(channel) {
  chrome.storage.sync.get({ blacklistedChannels: [] }, function(data) {
    const updatedList = [...data.blacklistedChannels, channel];
    chrome.storage.sync.set({ blacklistedChannels: updatedList });
  });
}

// Function to remove a channel from the blacklist
function removeChannelFromBlacklist(channel) {
  chrome.storage.sync.get({ blacklistedChannels: [] }, function(data) {
    const updatedList = data.blacklistedChannels.filter(c => c !== channel);
    chrome.storage.sync.set({ blacklistedChannels: updatedList });
  });
}