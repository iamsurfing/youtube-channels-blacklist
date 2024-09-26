// background.js

browser.runtime.onInstalled.addListener(() => {
  // Initialize storage with an empty blacklist if not set
  browser.storage.sync.get({ blacklistedChannels: [] }, function(data) {
    if (!data.blacklistedChannels) {
      browser.storage.sync.set({ blacklistedChannels: [] });
    }
  });
});

// Function to add a channel to the blacklist
function addChannelToBlacklist(channel) {
  browser.storage.sync.get({ blacklistedChannels: [] }, function(data) {
    const updatedList = [...data.blacklistedChannels, channel];
    browser.storage.sync.set({ blacklistedChannels: updatedList });
  });
}

// Function to remove a channel from the blacklist
function removeChannelFromBlacklist(channel) {
  browser.storage.sync.get({ blacklistedChannels: [] }, function(data) {
    const updatedList = data.blacklistedChannels.filter(c => c !== channel);
    browser.storage.sync.set({ blacklistedChannels: updatedList });
  });
}