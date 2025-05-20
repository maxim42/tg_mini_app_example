// Main script for the Telegram Mini App Demo
// Handles initialization, theme management, and feature integrations for DeviceStorage, SecureStorage, Fullscreen, and Geolocation.
console.log("Telegram WebApp script loaded:", window.Telegram);

document.addEventListener('DOMContentLoaded', function () {
    const WebApp = window.Telegram.WebApp;

    // --- App Ready ---
    // Signal to Telegram that the Mini App is ready to be displayed.
    // This should be called once the initial UI is ready.
    if (WebApp && typeof WebApp.ready === 'function') {
        WebApp.ready();
        console.log("WebApp.ready() called.");
    }

    // --- Theme Handling ---
    // Handles applying and responding to Telegram theme changes.
    const colorSchemeDisplay = document.getElementById('colorSchemeDisplay');
    const bgColorDisplay = document.getElementById('bgColorDisplay');
    const textColorDisplay = document.getElementById('textColorDisplay');

    // Function to apply styles based on Telegram theme parameters and update display elements.
    function applyThemeStyles() {
        if (!WebApp || !WebApp.themeParams) {
            console.warn("Theme params not available for styling.");
            if(colorSchemeDisplay) colorSchemeDisplay.textContent = 'N/A (Error)';
            if(bgColorDisplay) bgColorDisplay.textContent = 'N/A (Error)';
            if(textColorDisplay) textColorDisplay.textContent = 'N/A (Error)';
            return;
        }

        const themeParams = WebApp.themeParams; // Access theme parameters provided by Telegram
        console.log("Applying theme. ThemeParams:", themeParams);
        console.log("Current color scheme:", WebApp.colorScheme); // Access current color scheme (e.g., 'light', 'dark')

        // Apply body styles using theme parameters
        if (themeParams.bg_color) {
            document.body.style.backgroundColor = themeParams.bg_color;
        }
        if (themeParams.text_color) {
            document.body.style.color = themeParams.text_color;
        }

        // Update UI elements displaying theme information
        if(colorSchemeDisplay) {
            colorSchemeDisplay.textContent = WebApp.colorScheme || 'N/A';
        }
        if(bgColorDisplay) {
            bgColorDisplay.textContent = themeParams.bg_color || 'N/A';
        }
        if(textColorDisplay) {
            textColorDisplay.textContent = themeParams.text_color || 'N/A';
        }
    }

    // Apply initial theme settings as soon as the app loads.
    applyThemeStyles();

    // Listen for theme changes from Telegram and re-apply styles.
    if (WebApp && typeof WebApp.onEvent === 'function') {
        // 'themeChanged' event is triggered when the user changes the Telegram theme.
        WebApp.onEvent('themeChanged', applyThemeStyles);
        console.log("'themeChanged' event listener registered.");
    }


    // --- DeviceStorage ---
    // Manages interactions with Telegram's non-persistent key-value storage.
    // Data stored here might be cleared by the system when under storage pressure.
    const dsKeyInput = document.getElementById('dsKey');
    const dsValueInput = document.getElementById('dsValue');
    const dsResultSpan = document.getElementById('dsResult');

    const dsSetItemButton = document.getElementById('dsSetItem');
    const dsGetItemButton = document.getElementById('dsGetItem');
    const dsRemoveItemButton = document.getElementById('dsRemoveItem');
    const dsClearAllButton = document.getElementById('dsClearAll');

    // Check if DeviceStorage API is available and disable UI elements if not.
    if (!WebApp || !WebApp.DeviceStorage) {
        if(dsResultSpan) dsResultSpan.textContent = 'DeviceStorage API is not available.';
        if(dsSetItemButton) dsSetItemButton.disabled = true;
        if(dsGetItemButton) dsGetItemButton.disabled = true;
        if(dsRemoveItemButton) dsRemoveItemButton.disabled = true;
        if(dsClearAllButton) dsClearAllButton.disabled = true;
        // No return here, allow other modules to load if DeviceStorage is not available
    } else {
        const deviceStorage = WebApp.DeviceStorage;

        // Handler for setting an item in DeviceStorage.
        if(dsSetItemButton) {
            dsSetItemButton.addEventListener('click', function () {
                const key = dsKeyInput.value;
                const value = dsValueInput.value;
                if (!key) {
                    if(dsResultSpan) dsResultSpan.textContent = 'Error: Key cannot be empty for setItem.';
                    return;
                }
                // Store a key-value pair.
                deviceStorage.setItem(key, value, function (error, stored) {
                    if (error) {
                        if(dsResultSpan) dsResultSpan.textContent = 'Error setting item: ' + error;
                    } else if (stored) {
                        if(dsResultSpan) dsResultSpan.textContent = 'Item set successfully. Key: ' + key;
                        if(dsKeyInput) dsKeyInput.value = '';
                        if(dsValueInput) dsValueInput.value = '';
                    } else {
                        if(dsResultSpan) dsResultSpan.textContent = 'Failed to set item (unknown reason).';
                    }
                });
            });
        }

        // Handler for getting an item from DeviceStorage.
        if(dsGetItemButton) {
            dsGetItemButton.addEventListener('click', function () {
                const key = dsKeyInput.value;
                if (!key) {
                    if(dsResultSpan) dsResultSpan.textContent = 'Error: Key cannot be empty for getItem.';
                    return;
                }
                // Retrieve a value by its key.
                deviceStorage.getItem(key, function (error, value) {
                    if (error) {
                        if(dsResultSpan) dsResultSpan.textContent = 'Error getting item: ' + error;
                    } else if (value === null || typeof value === 'undefined') {
                        if(dsResultSpan) dsResultSpan.textContent = 'Item not found for key: ' + key;
                    }
                    else {
                        if(dsResultSpan) dsResultSpan.textContent = 'Got item. Key: ' + key + ', Value: ' + value;
                    }
                });
            });
        }

        // Handler for removing an item from DeviceStorage.
        if(dsRemoveItemButton) {
            dsRemoveItemButton.addEventListener('click', function () {
                const key = dsKeyInput.value;
                if (!key) {
                    if(dsResultSpan) dsResultSpan.textContent = 'Error: Key cannot be empty for removeItem.';
                    return;
                }
                // Remove a value by its key.
                deviceStorage.removeItem(key, function (error, removed) {
                    if (error) {
                        if(dsResultSpan) dsResultSpan.textContent = 'Error removing item: ' + error;
                    } else if (removed) {
                        if(dsResultSpan) dsResultSpan.textContent = 'Item removed successfully. Key: ' + key;
                        if(dsKeyInput) dsKeyInput.value = '';
                    } else {
                        if(dsResultSpan) dsResultSpan.textContent = 'Failed to remove item or item not found. Key: ' + key;
                    }
                });
            });
        }

        // Handler for clearing all items in DeviceStorage.
        if(dsClearAllButton) {
            dsClearAllButton.addEventListener('click', function () {
                // Clear all data from DeviceStorage.
                deviceStorage.clear(function (error, cleared) {
                    if (error) {
                        if(dsResultSpan) dsResultSpan.textContent = 'Error clearing storage: ' + error;
                    } else if (cleared) {
                        if(dsResultSpan) dsResultSpan.textContent = 'Device storage cleared successfully.';
                        if(dsKeyInput) dsKeyInput.value = '';
                        if(dsValueInput) dsValueInput.value = '';
                    } else {
                        if(dsResultSpan) dsResultSpan.textContent = 'Failed to clear storage or storage was already empty.';
                    }
                });
            });
        }
    }


    // --- SecureStorage ---
    // Manages interactions with Telegram's secure, persistent key-value storage for sensitive data.
    // Data is stored encrypted on the user's device and synchronized across devices via Telegram cloud.
    const ssKeyInput = document.getElementById('ssKey');
    const ssValueInput = document.getElementById('ssValue');
    const ssResultSpan = document.getElementById('ssResult');

    const ssSetItemButton = document.getElementById('ssSetItem');
    const ssGetItemButton = document.getElementById('ssGetItem');
    const ssRemoveItemButton = document.getElementById('ssRemoveItem');
    const ssClearAllButton = document.getElementById('ssClearAll');

    // Check if SecureStorage API is available and disable UI elements if not.
    if (!WebApp || !WebApp.SecureStorage) {
        if (ssResultSpan) ssResultSpan.textContent = 'SecureStorage API is not available.';
        if (ssSetItemButton) ssSetItemButton.disabled = true;
        if (ssGetItemButton) ssGetItemButton.disabled = true;
        if (ssRemoveItemButton) ssRemoveItemButton.disabled = true;
        if (ssClearAllButton) ssClearAllButton.disabled = true;
    } else {
        const secureStorage = WebApp.SecureStorage;

        // Handler for setting an item in SecureStorage.
        if (ssSetItemButton) {
            ssSetItemButton.addEventListener('click', function () {
                const key = ssKeyInput.value;
                const value = ssValueInput.value;
                if (!key) {
                    if(ssResultSpan) ssResultSpan.textContent = 'Error: Key cannot be empty for setItem (Secure).';
                    return;
                }
                // Store a key-value pair securely.
                secureStorage.setItem(key, value, function (error, stored) {
                    if (error) {
                        if(ssResultSpan) ssResultSpan.textContent = 'Error setting secure item: ' + error;
                    } else if (stored) {
                        if(ssResultSpan) ssResultSpan.textContent = 'Secure item set successfully. Key: ' + key;
                        if(ssKeyInput) ssKeyInput.value = '';
                        if(ssValueInput) ssValueInput.value = '';
                    } else {
                        if(ssResultSpan) ssResultSpan.textContent = 'Failed to set secure item (unknown reason).';
                    }
                });
            });
        }

        // Handler for getting an item from SecureStorage.
        if (ssGetItemButton) {
            ssGetItemButton.addEventListener('click', function () {
                const key = ssKeyInput.value;
                if (!key) {
                    if(ssResultSpan) ssResultSpan.textContent = 'Error: Key cannot be empty for getItem (Secure).';
                    return;
                }
                // Retrieve a securely stored value by its key.
                // The value is typically passed to the callback as a string.
                secureStorage.getItem(key, function (error, value) {
                    if (error) {
                        if(ssResultSpan) ssResultSpan.textContent = 'Error getting secure item: ' + error;
                    } else if (value === null || typeof value === 'undefined') {
                        if(ssResultSpan) ssResultSpan.textContent = 'Secure item not found for key: ' + key;
                    } else {
                        // For security reasons, sensitive data from SecureStorage should not be displayed directly in the UI.
                        // It's logged to the console here for demonstration purposes.
                        console.log('SecureStorage Item for key "' + key + '":', value);
                        if(ssResultSpan) ssResultSpan.textContent = 'Secure item for key "' + key + '" retrieved. Check console.';
                    }
                });
            });
        }

        // Handler for removing an item from SecureStorage.
        if (ssRemoveItemButton) {
            ssRemoveItemButton.addEventListener('click', function () {
                const key = ssKeyInput.value;
                if (!key) {
                    if(ssResultSpan) ssResultSpan.textContent = 'Error: Key cannot be empty for removeItem (Secure).';
                    return;
                }
                // Remove a securely stored value by its key.
                secureStorage.removeItem(key, function (error, removed) {
                    if (error) {
                        if(ssResultSpan) ssResultSpan.textContent = 'Error removing secure item: ' + error;
                    } else if (removed) {
                        if(ssResultSpan) ssResultSpan.textContent = 'Secure item removed successfully. Key: ' + key;
                        if(ssKeyInput) ssKeyInput.value = '';
                    } else {
                        if(ssResultSpan) ssResultSpan.textContent = 'Failed to remove secure item or item not found. Key: ' + key;
                    }
                });
            });
        }

        // Handler for clearing all items in SecureStorage.
        if (ssClearAllButton) {
            ssClearAllButton.addEventListener('click', function () {
                // Clear all data from SecureStorage.
                secureStorage.clear(function (error, cleared) {
                    if (error) {
                        if(ssResultSpan) ssResultSpan.textContent = 'Error clearing secure storage: ' + error;
                    } else if (cleared) {
                        if(ssResultSpan) ssResultSpan.textContent = 'Secure storage cleared successfully.';
                        if(ssKeyInput) ssKeyInput.value = '';
                        if(ssValueInput) ssValueInput.value = '';
                    } else {
                        if(ssResultSpan) ssResultSpan.textContent = 'Failed to clear secure storage or storage was already empty.';
                    }
                });
            });
        }
    }

    // --- Fullscreen Mode ---
    // Manages entering and exiting fullscreen mode, and displaying related safe area information.
    const requestFullscreenButton = document.getElementById('requestFullscreen');
    const exitFullscreenButton = document.getElementById('exitFullscreen');
    const fullscreenStatusSpan = document.getElementById('fullscreenStatus');
    const safeAreaTopSpan = document.getElementById('safeAreaTop');
    const safeAreaBottomSpan = document.getElementById('safeAreaBottom');
    const contentSafeAreaTopSpan = document.getElementById('contentSafeAreaTop');
    const contentSafeAreaBottomSpan = document.getElementById('contentSafeAreaBottom');

    // Function to update UI elements with current fullscreen status and safe area insets.
    function updateFullscreenData() {
        if (!WebApp) {
            if(fullscreenStatusSpan) fullscreenStatusSpan.textContent = 'Telegram WebApp not available.';
            return;
        }

        // WebApp.isFullscreen indicates if the Mini App is currently in fullscreen mode.
        if(fullscreenStatusSpan) fullscreenStatusSpan.textContent = WebApp.isFullscreen ? 'Yes' : 'No';
        
        // WebApp.safeAreaInset provides information about the safe area insets (e.g., for notches or system bars).
        if(WebApp.safeAreaInset) {
            if(safeAreaTopSpan) safeAreaTopSpan.textContent = WebApp.safeAreaInset.top !== null ? WebApp.safeAreaInset.top + 'px' : 'N/A';
            if(safeAreaBottomSpan) safeAreaBottomSpan.textContent = WebApp.safeAreaInset.bottom !== null ? WebApp.safeAreaInset.bottom + 'px' : 'N/A';
        } else {
            if(safeAreaTopSpan) safeAreaTopSpan.textContent = 'N/A (API not supported)';
            if(safeAreaBottomSpan) safeAreaBottomSpan.textContent = 'N/A (API not supported)';
        }

        // WebApp.contentSafeAreaInset provides information about the safe area for content placement.
        if(WebApp.contentSafeAreaInset) {
            if(contentSafeAreaTopSpan) contentSafeAreaTopSpan.textContent = WebApp.contentSafeAreaInset.top !== null ? WebApp.contentSafeAreaInset.top + 'px' : 'N/A';
            if(contentSafeAreaBottomSpan) contentSafeAreaBottomSpan.textContent = WebApp.contentSafeAreaInset.bottom !== null ? WebApp.contentSafeAreaInset.bottom + 'px' : 'N/A';
        } else {
            if(contentSafeAreaTopSpan) contentSafeAreaTopSpan.textContent = 'N/A (API not supported)';
            if(contentSafeAreaBottomSpan) contentSafeAreaBottomSpan.textContent = 'N/A (API not supported)';
        }
    }

    // Check if Fullscreen API methods are available and disable UI elements if not.
    if (!WebApp || typeof WebApp.requestFullscreen !== 'function' || typeof WebApp.exitFullscreen !== 'function') {
        if(fullscreenStatusSpan) fullscreenStatusSpan.textContent = 'Fullscreen API not available.';
        if(requestFullscreenButton) requestFullscreenButton.disabled = true;
        if(exitFullscreenButton) exitFullscreenButton.disabled = true;
    } else {
        // Update fullscreen data initially on load.
        updateFullscreenData();

        // Handler to request fullscreen mode.
        if(requestFullscreenButton) {
            requestFullscreenButton.addEventListener('click', function() {
                // Requests the Mini App to enter fullscreen mode.
                WebApp.requestFullscreen();
            });
        }

        // Handler to exit fullscreen mode.
        if(exitFullscreenButton) {
            exitFullscreenButton.addEventListener('click', function() {
                // Requests the Mini App to exit fullscreen mode.
                WebApp.exitFullscreen();
            });
        }

        // Listen for fullscreen state changes.
        // 'fullscreenChanged' event is triggered when the Mini App enters or exits fullscreen mode.
        WebApp.onEvent('fullscreenChanged', updateFullscreenData);
        // 'fullscreenFailed' event is triggered if a fullscreen request fails.
        WebApp.onEvent('fullscreenFailed', function() {
            if(fullscreenStatusSpan) fullscreenStatusSpan.textContent = 'Fullscreen request failed.';
        });
        // Listen for changes in safe area insets.
        // 'safeAreaChanged' event is triggered when the safe area insets change.
        WebApp.onEvent('safeAreaChanged', updateFullscreenData);
        // Listen for changes in content safe area insets.
        // 'contentSafeAreaChanged' event is triggered when the content safe area insets change.
        WebApp.onEvent('contentSafeAreaChanged', updateFullscreenData);
    }

    // --- Geolocation ---
    // Manages requesting and displaying user's geolocation data.
    // Requires user permission.
    const requestLocationButton = document.getElementById('requestLocation');
    const locationStatusSpan = document.getElementById('locationStatus');
    const latitudeSpan = document.getElementById('latitude');
    const longitudeSpan = document.getElementById('longitude');
    const altitudeSpan = document.getElementById('altitude');
    const accuracySpan = document.getElementById('accuracy');

    // Check if Geolocation API (LocationManager) is available and disable UI elements if not.
    if (!WebApp || !WebApp.LocationManager ||
        typeof WebApp.LocationManager.getLocation !== 'function' ||
        typeof WebApp.LocationManager.init !== 'function') {
        if(locationStatusSpan) locationStatusSpan.textContent = 'Geolocation API not available.';
        if(requestLocationButton) requestLocationButton.disabled = true;
    } else {
        const LocationManager = WebApp.LocationManager;

        // Initialize the LocationManager. This should be called before other LocationManager methods.
        try {
            LocationManager.init();
        } catch (e) {
            if(locationStatusSpan) locationStatusSpan.textContent = 'Error initializing LocationManager: ' + e.message;
            if(requestLocationButton) requestLocationButton.disabled = true;
            // If init fails, don't proceed to add listeners for location events.
            // Consider how to handle this error more gracefully in a production app.
        }

        // Handler for requesting the user's current location.
        if(requestLocationButton) {
            requestLocationButton.addEventListener('click', function() {
                if(locationStatusSpan) locationStatusSpan.textContent = 'Requesting location...';
                if(latitudeSpan) latitudeSpan.textContent = 'N/A';
                if(longitudeSpan) longitudeSpan.textContent = 'N/A';
                if(altitudeSpan) altitudeSpan.textContent = 'N/A';
                if(accuracySpan) accuracySpan.textContent = 'N/A';

                // Request current location. The callback receives location data or null if access is denied/failed.
                LocationManager.getLocation(function(locationData) {
                    if (!locationData) {
                        if(locationStatusSpan) locationStatusSpan.textContent = 'Access denied or error fetching location.';
                        return;
                    }
                    
                    // Update UI with received location data.
                    if(locationStatusSpan) locationStatusSpan.textContent = 'Success';
                    if(latitudeSpan) latitudeSpan.textContent = locationData.latitude !== undefined ? locationData.latitude : 'N/A';
                    if(longitudeSpan) longitudeSpan.textContent = locationData.longitude !== undefined ? locationData.longitude : 'N/A';
                    if(altitudeSpan) altitudeSpan.textContent = locationData.altitude !== undefined ? locationData.altitude : 'N/A';
                    
                    let accuracyText = '';
                    if (locationData.horizontal_accuracy !== undefined) {
                        accuracyText += 'Horiz: ' + locationData.horizontal_accuracy + 'm';
                    } else {
                        accuracyText += 'Horiz: N/A';
                    }
                    if (locationData.vertical_accuracy !== undefined) {
                        accuracyText += ' / Vert: ' + locationData.vertical_accuracy + 'm';
                    } else {
                        accuracyText += ' / Vert: N/A';
                    }
                    if(accuracySpan) accuracySpan.textContent = accuracyText;
                });
            });
        }

        // Listen for updates to the LocationManager state (e.g., permission changes).
        // 'locationManagerUpdated' event provides the current status of location access.
        WebApp.onEvent('locationManagerUpdated', function() {
            console.log('LocationManager state updated. Current access granted:', LocationManager.isAccessGranted);
            if(locationStatusSpan) locationStatusSpan.textContent = 'Location manager state updated (access: ' + LocationManager.isAccessGranted + ').';
        });

        // Listen for when a location request is processed.
        // 'locationRequested' event is triggered after a call to getLocation, providing the result.
        // The primary handling of location data is done in the getLocation callback for this demo.
        WebApp.onEvent('locationRequested', function(eventData) {
            console.log('locationRequested event received:', eventData);
            if (eventData && eventData.locationData) {
                 console.log('Location data from event:', eventData.locationData);
            } else {
                console.log('locationRequested event, but no locationData or access denied.');
            }
        });
    }
});
