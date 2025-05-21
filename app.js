window.addEventListener('load', function() {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        console.log("Telegram WebApp SDK initialized");
    } else {
        console.error("Telegram WebApp SDK not found");
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const dsKeyInput = document.getElementById('dsKey');
    const dsValueInput = document.getElementById('dsValue');
    const dsSaveButton = document.getElementById('dsSave');
    const dsLoadButton = document.getElementById('dsLoad');
    const dsRemoveButton = document.getElementById('dsRemove');
    const dsClearAllButton = document.getElementById('dsClearAll');
    const dsResultDiv = document.getElementById('dsResult');

    const tg = window.Telegram.WebApp;

    if (!tg || !tg.DeviceStorage) {
        dsResultDiv.textContent = 'DeviceStorage API is not available or SDK not initialized properly.';
        // Disable buttons if API is not available
        if(dsSaveButton) dsSaveButton.disabled = true;
        if(dsLoadButton) dsLoadButton.disabled = true;
        if(dsRemoveButton) dsRemoveButton.disabled = true;
        if(dsClearAllButton) dsClearAllButton.disabled = true;
        // return; // Keep running for other functionalities if any
    }

    if (dsSaveButton) {
        dsSaveButton.addEventListener('click', function() {
            const key = dsKeyInput.value;
            const value = dsValueInput.value;
            if (!key) {
                dsResultDiv.textContent = 'DeviceStorage: Key cannot be empty for saving.';
                return;
            }
            tg.DeviceStorage.setItem(key, value, function(error, success) {
                if (error) {
                    dsResultDiv.textContent = 'DeviceStorage Error saving item: ' + error;
                } else if (success) {
                    dsResultDiv.textContent = 'DeviceStorage: Item saved successfully. Key: ' + key;
                    dsValueInput.value = ''; // Clear value input after saving
                } else {
                    dsResultDiv.textContent = 'DeviceStorage: Failed to save item. No error, but not successful. Key: ' + key;
                }
            });
        });
    }

    if (dsLoadButton) {
        dsLoadButton.addEventListener('click', function() {
            const key = dsKeyInput.value;
            if (!key) {
                dsResultDiv.textContent = 'DeviceStorage: Key cannot be empty for loading.';
                return;
            }
            tg.DeviceStorage.getItem(key, function(error, value) {
                if (error) {
                    dsResultDiv.textContent = 'DeviceStorage Error loading item: ' + error;
                } else if (value === null) {
                    dsResultDiv.textContent = 'DeviceStorage: Item not found for key: ' + key;
                } else {
                    dsResultDiv.textContent = 'DeviceStorage: Item loaded: ' + value + ' (Key: ' + key + ')';
                    dsValueInput.value = value; // Populate value input with loaded data
                }
            });
        });
    }

    if (dsRemoveButton) {
        dsRemoveButton.addEventListener('click', function() {
            const key = dsKeyInput.value;
            if (!key) {
                dsResultDiv.textContent = 'DeviceStorage: Key cannot be empty for removing.';
                return;
            }
            tg.DeviceStorage.removeItem(key, function(error, success) {
                if (error) {
                    dsResultDiv.textContent = 'DeviceStorage Error removing item: ' + error;
                } else if (success) {
                    dsResultDiv.textContent = 'DeviceStorage: Item removed successfully. Key: ' + key;
                } else {
                    dsResultDiv.textContent = 'DeviceStorage: Failed to remove item. Key: ' + key;
                }
            });
        });
    }

    if (dsClearAllButton) {
        dsClearAllButton.addEventListener('click', function() {
            tg.DeviceStorage.clear(function(error, success) {
                if (error) {
                    dsResultDiv.textContent = 'DeviceStorage Error clearing storage: ' + error;
                } else if (success) {
                    dsResultDiv.textContent = 'DeviceStorage: All items cleared successfully.';
                } else {
                    dsResultDiv.textContent = 'DeviceStorage: Failed to clear all items.';
                }
            });
        });
    }

    // SecureStorage Logic
    const ssKeyInput = document.getElementById('ssKey');
    const ssValueInput = document.getElementById('ssValue');
    const ssSaveButton = document.getElementById('ssSave');
    const ssLoadButton = document.getElementById('ssLoad');
    const ssRestoreButton = document.getElementById('ssRestore');
    const ssRemoveButton = document.getElementById('ssRemove');
    const ssClearAllButton = document.getElementById('ssClearAll');
    const ssResultDiv = document.getElementById('ssResult');

    if (!tg || !tg.SecureStorage) {
        if(ssResultDiv) ssResultDiv.textContent = 'SecureStorage API is not available or SDK not initialized properly.';
        // Disable buttons if API is not available
        if(ssSaveButton) ssSaveButton.disabled = true;
        if(ssLoadButton) ssLoadButton.disabled = true;
        if(ssRestoreButton) ssRestoreButton.disabled = true;
        if(ssRemoveButton) ssRemoveButton.disabled = true;
        if(ssClearAllButton) ssClearAllButton.disabled = true;
    } else {
        if (ssSaveButton) {
            ssSaveButton.addEventListener('click', function() {
                const key = ssKeyInput.value;
                const value = ssValueInput.value;
                if (!key) {
                    ssResultDiv.textContent = 'SecureStorage: Key cannot be empty for saving.';
                    return;
                }
                tg.SecureStorage.setItem(key, value, function(error, success) {
                    if (error) {
                        ssResultDiv.textContent = 'SecureStorage Error saving item: ' + error;
                    } else if (success) {
                        ssResultDiv.textContent = 'SecureStorage: Item saved successfully. Key: ' + key;
                        ssValueInput.value = ''; // Clear value input
                    } else {
                        ssResultDiv.textContent = 'SecureStorage: Failed to save item. Key: ' + key;
                    }
                });
            });
        }

        if (ssLoadButton) {
            ssLoadButton.addEventListener('click', function() {
                const key = ssKeyInput.value;
                if (!key) {
                    ssResultDiv.textContent = 'SecureStorage: Key cannot be empty for loading.';
                    return;
                }
                tg.SecureStorage.getItem(key, function(error, value, can_restore) {
                    if (error) {
                        ssResultDiv.textContent = 'SecureStorage Error loading item: ' + error;
                    } else if (value === null) {
                        let message = 'SecureStorage: Item not found for key: ' + key;
                        if (can_restore) {
                            message += '. This key might be restorable on this device.';
                        }
                        ssResultDiv.textContent = message;
                    } else {
                        ssResultDiv.textContent = 'SecureStorage: Item loaded: ' + value + ' (Key: ' + key + ')';
                        ssValueInput.value = value;
                    }
                });
            });
        }

        if (ssRestoreButton) {
            ssRestoreButton.addEventListener('click', function() {
                const key = ssKeyInput.value;
                if (!key) {
                    ssResultDiv.textContent = 'SecureStorage: Key cannot be empty for restoring.';
                    return;
                }
                // Note: SecureStorage.restoreItem might prompt the user.
                tg.SecureStorage.restoreItem(key, function(error, value) {
                    if (error) {
                        ssResultDiv.textContent = 'SecureStorage Error restoring item: ' + error;
                    } else if (value === null) {
                        // This case might not happen if error covers "not found" or "not restorable"
                        ssResultDiv.textContent = 'SecureStorage: Item could not be restored for key: ' + key + '. It might not exist or permission was denied.';
                    }
                    else {
                        ssResultDiv.textContent = 'SecureStorage: Item restored: ' + value + ' (Key: ' + key + ')';
                        ssValueInput.value = value;
                    }
                });
            });
        }
        
        if (ssRemoveButton) {
            ssRemoveButton.addEventListener('click', function() {
                const key = ssKeyInput.value;
                if (!key) {
                    ssResultDiv.textContent = 'SecureStorage: Key cannot be empty for removing.';
                    return;
                }
                tg.SecureStorage.removeItem(key, function(error, success) {
                    if (error) {
                        ssResultDiv.textContent = 'SecureStorage Error removing item: ' + error;
                    } else if (success) {
                        ssResultDiv.textContent = 'SecureStorage: Item removed successfully. Key: ' + key;
                    } else {
                        ssResultDiv.textContent = 'SecureStorage: Failed to remove item. Key: ' + key;
                    }
                });
            });
        }

        if (ssClearAllButton) {
            ssClearAllButton.addEventListener('click', function() {
                tg.SecureStorage.clear(function(error, success) {
                    if (error) {
                        ssResultDiv.textContent = 'SecureStorage Error clearing storage: ' + error;
                    } else if (success) {
                        ssResultDiv.textContent = 'SecureStorage: All items cleared successfully.';
                    } else {
                        ssResultDiv.textContent = 'SecureStorage: Failed to clear all items.';
                    }
                });
            });
        }
    }
});
