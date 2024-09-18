// popup.js

document.addEventListener('DOMContentLoaded', function() {
    const channelInput = document.getElementById('channelInput');
    const addChannelButton = document.getElementById('addChannelButton');
    const blacklist = document.getElementById('blacklist');

    // Function to update the blacklist display
    function updateBlacklist() {
        // Clear current list
        blacklist.innerHTML = '';

        // Retrieve blacklisted channels from storage
        chrome.storage.sync.get(['blacklistedChannels'], function(result) {
            const channels = result.blacklistedChannels || [];
            channels.forEach(channel => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                listItem.textContent = channel;

                // Add a remove button
                const removeButton = document.createElement('button');
                removeButton.className = 'btn btn-danger btn-sm';
                removeButton.textContent = 'Remove';
                removeButton.onclick = function() {
                    removeChannel(channel);
                };

                listItem.appendChild(removeButton);
                blacklist.appendChild(listItem);
            });
        });
    }

    // Function to add a channel to the blacklist
    function addChannel() {
        const channelName = channelInput.value.trim();
        if (channelName === '') {
            // Use Bootstrap alert to show error
            showAlert('Please enter a channel name.', 'danger');
            return;
        }

        chrome.storage.sync.get(['blacklistedChannels'], function(result) {
            let channels = result.blacklistedChannels || [];
            if (!channels.includes(channelName)) {
                channels.push(channelName);
                chrome.storage.sync.set({ blacklistedChannels: channels }, function() {
                    // Update the list and clear input
                    updateBlacklist();
                    channelInput.value = '';
                    showAlert('Channel added to blacklist.', 'success');
                });
            } else {
                showAlert('Channel is already in the blacklist.', 'warning');
            }
        });
    }

    // Function to remove a channel from the blacklist
    function removeChannel(channel) {
        chrome.storage.sync.get(['blacklistedChannels'], function(result) {
            let channels = result.blacklistedChannels || [];
            channels = channels.filter(c => c !== channel);
            chrome.storage.sync.set({ blacklistedChannels: channels }, function() {
                // Update the list
                updateBlacklist();
            });
        });
    }

    // Event listeners
    addChannelButton.addEventListener('click', addChannel);

    // Initial load
    updateBlacklist();
});
