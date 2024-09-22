// popup.js

document.addEventListener('DOMContentLoaded', function() {
    const channelInput = document.getElementById('channelInput');
    const addChannelButton = document.getElementById('addChannelButton');
    const blacklist = document.getElementById('blacklist');
    const searchBox = document.getElementById('searchBox');

    let blacklistedChannels = []; // Variable to store channels for search filtering

    // Function to update the blacklist display
    function updateBlacklist(searchQuery = '') {
        // Clear current list
        blacklist.innerHTML = '';

        // Filter channels based on search query
        const filteredChannels = blacklistedChannels.filter(channel =>
            channel.toLowerCase().includes(searchQuery.toLowerCase())
        ).reverse(); // Reverse the order before displaying;

        // Update the counter with the total number of filtered channels
        const counter = document.getElementById('counter');
        counter.textContent = filteredChannels.length;

        filteredChannels.forEach(channel => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.textContent = channel;

            // Add a remove button
            const removeButton = document.createElement('button');
            removeButton.className = 'btn btn-info btn-sm';
            removeButton.textContent = 'Restore';
            removeButton.onclick = function() {
                removeChannel(channel);
            };

            listItem.appendChild(removeButton);
            blacklist.appendChild(listItem);
        });
    }

    // Function to load channels from storage
    function loadChannels() {
        chrome.storage.sync.get(['blacklistedChannels'], function(result) {
            blacklistedChannels = result.blacklistedChannels || [];
            updateBlacklist(); // Initial load without filtering
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

        if (!blacklistedChannels.includes(channelName)) {
            blacklistedChannels.push(channelName);
            chrome.storage.sync.set({ blacklistedChannels }, function() {
                // Update the list and clear input
                updateBlacklist();
                channelInput.value = '';
                showAlert('Channel added to blacklist.', 'success');
            });
        } else {
            showAlert('Channel is already in the blacklist.', 'warning');
        }
    }

    // Function to remove a channel from the blacklist
    function removeChannel(channel) {
        blacklistedChannels = blacklistedChannels.filter(c => c !== channel);
        chrome.storage.sync.set({ blacklistedChannels }, function() {
            // Update the list
            updateBlacklist();
        });
    }

    // Function to display Bootstrap alerts
    function showAlert(message, type) {
        const alertContainer = document.createElement('div');
        alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
        alertContainer.role = 'alert';
        alertContainer.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-dismiss="alert" aria-label="Close">
            </button>
        `;

        // Add the alert to the top of the container
        const container = document.querySelector('.container');
        container.insertBefore(alertContainer, container.firstChild);

        // Auto-dismiss alert after 3 seconds
        setTimeout(() => {
            alertContainer.classList.remove('show');
            alertContainer.classList.add('fade');

            // Use a timeout to remove the element from the DOM after fade transition
            setTimeout(() => {
                alertContainer.remove();
            }, 150); // Matches the CSS transition duration for fade
        }, 3000);
    }

    // Event listener for search input
    searchBox.addEventListener('input', function() {
        const searchQuery = searchBox.value.trim();
        updateBlacklist(searchQuery);
    });

    // Event listeners
    addChannelButton.addEventListener('click', addChannel);

    // Initial load
    loadChannels();
});
