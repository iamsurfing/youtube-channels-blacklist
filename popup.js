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
            const channels = result.blacklistedChannels.reverse() || [];

            // Update the counter with the total number of channels
            const counter = document.getElementById('counter');
            counter.textContent = channels.length;

            channels.forEach(channel => {
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
	
	// Function to display Bootstrap alerts
	function showAlert(message, type) {
		const alertContainer = document.createElement('div');
		alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
		alertContainer.role = 'alert';
		alertContainer.innerHTML = `
			${message}
			<button type="button" class="btn-close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
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

    const supportMeLink = document.getElementById('supportMeLink');
    const supportOptions = document.getElementById('supportOptions');
    const lightningLink = document.getElementById('lightningLink');
    const lightningOptions = document.getElementById('lightningOptions');
    const bitcoinLink = document.getElementById('bitcoinLink');
    const bitcoinOptions = document.getElementById('bitcoinOptions');

    supportMeLink.addEventListener('click', function() {
        // Toggle the collapse manually
        supportOptions.classList.toggle('show');
    });
    lightningLink.addEventListener('click', function() {
        // Toggle the collapse manually
        lightningOptions.classList.toggle('show');
    });
    bitcoinLink.addEventListener('click', function() {
        // Toggle the collapse manually
        bitcoinOptions.classList.toggle('show');
    });
    

});
