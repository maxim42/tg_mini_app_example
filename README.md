# Telegram Mini App - Storage Features Demo

This Telegram Mini App demonstrates the usage of `DeviceStorage` and `SecureStorage` features introduced in Bot API 9.0.

## Features Demonstrated

*   **DeviceStorage:**
    *   Saving key-value pairs to the user's device (persistent, non-sensitive data).
    *   Loading values by key.
    *   Removing specific key-value pairs.
    *   Clearing all data stored by the app in `DeviceStorage`.
*   **SecureStorage:**
    *   Saving key-value pairs to the user's device in a secure, encrypted manner (for sensitive data like tokens).
    *   Loading values by key.
    *   Restoring values by key (may require user permission if the item was stored on the same device previously but is not directly accessible).
    *   Removing specific key-value pairs.
    *   Clearing all data stored by the app in `SecureStorage`.

## Files

*   `index.html`: The main HTML structure of the Mini App.
*   `style.css`: Basic CSS for styling the app. It uses Telegram theme variables for better integration.
*   `app.js`: JavaScript code that handles:
    *   Initialization of the Telegram Web App SDK.
    *   Event listeners for UI elements.
    *   Interaction with `DeviceStorage` and `SecureStorage` APIs.
    *   Displaying results and error messages.

## How to Deploy and Test

1.  **Create a Telegram Bot:**
    *   Talk to `@BotFather` on Telegram.
    *   Create a new bot using `/newbot`.
    *   Note down the HTTP API token you receive.

2.  **Host the Mini App Files:**
    *   You need to host `index.html`, `style.css`, and `app.js` on a web server accessible via HTTPS. Services like GitHub Pages, Netlify, Vercel, or any simple static hosting will work.

3.  **Set the Mini App URL for your Bot:**
    *   Go back to `@BotFather`.
    *   Use the `/mybots` command, select your bot.
    *   Go to "Bot Settings" > "Menu Button".
    *   You can either configure the menu button to launch your Mini App or set it up to be launched via an inline keyboard.
    *   For the Menu Button:
        *   Click "Configure Menu Button".
        *   Enter the HTTPS URL where your `index.html` is hosted.
        *   Give the button a name (e.g., "Open Storage Demo").
    *   Alternatively, you can send a message with an inline keyboard button that has a `web_app` URL pointing to your Mini App.

4.  **Test the Mini App:**
    *   Open a chat with your bot in Telegram.
    *   If you configured the menu button, it should appear in the message input area (or under the attachment menu, depending on the Telegram client). Click it.
    *   If using an inline button, send the message that contains it and click the button.
    *   The Mini App should launch, and you can test the `DeviceStorage` and `SecureStorage` functionalities.
    *   Use your browser's developer console (if testing on desktop or via debug mode on mobile) to see any console messages from `app.js`.

## Important Notes

*   `DeviceStorage` and `SecureStorage` are available as of **Bot API 9.0**. Ensure the Telegram client app you are testing on is updated to a version that supports this API level.
*   `SecureStorage` operations, especially `restoreItem`, might trigger native UI prompts for user permission.
*   The example uses basic error handling and UI feedback. A production app would require more robust error management and user experience considerations.
*   Always validate data received from `initData` on your backend if you were to use it for server-side operations (not applicable in this purely client-side demo).
