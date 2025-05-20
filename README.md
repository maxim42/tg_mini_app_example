# Telegram Mini App Demo

This project demonstrates several features of Telegram Mini Apps, including DeviceStorage, SecureStorage, Fullscreen Mode, and Geolocation.

## Mini App Files
- `index.html`: The main HTML file for the Mini App.
- `style.css`: Basic styles for the Mini App.
- `app.js`: JavaScript logic for the Mini App features.

## Bot Backend
- `bot.js`: A simple Node.js Telegram bot to launch the Mini App.
- `package.json`: Defines dependencies for the bot.

## Setup and Running

### 1. Mini App Frontend
1.  Serve the `index.html`, `style.css`, and `app.js` files using a local HTTP server. For example, you can use Python's built-in server:
    ```bash
    python -m http.server 8000 
    ```
    Or use a tool like `live-server` for Node.js.
2.  Expose your local server to the internet using a tunneling service like ngrok:
    ```bash
    ngrok http 8000
    ```
    Take note of the HTTPS URL provided by ngrok (e.g., `https://your-unique-id.ngrok.io`). This will be your `MINI_APP_URL`.

### 2. Telegram Bot Setup (with BotFather)
1.  Open Telegram and search for `@BotFather`.
2.  Start a chat with BotFather and create a new bot by sending the `/newbot` command.
3.  Follow the instructions to choose a name and username for your bot. BotFather will give you an **API token**. This is your `BOT_TOKEN`.
4.  Enable inline mode for your bot by sending `/setinline` to BotFather and providing a placeholder text (e.g., "Search...").
5.  Configure the Mini App for your bot by sending `/myapps` to BotFather.
    *   Select your bot.
    *   Choose "Create a new app".
    *   Provide a name for your Mini App (e.g., "DemoApp").
    *   Provide a short description.
    *   Upload an icon if you wish.
    *   When asked for the "Web App URL", provide the HTTPS URL from ngrok (e.g., `https://your-unique-id.ngrok.io/index.html` or just `https://your-unique-id.ngrok.io/` if your server serves `index.html` by default for the root path).

### 3. Bot Backend Setup
1.  Open `bot.js` in a text editor.
2.  Replace `YOUR_BOT_TOKEN_HERE` with your actual bot API token.
3.  Replace `YOUR_MINI_APP_URL_HERE` with the HTTPS URL from ngrok (the same one you gave to BotFather).
4.  Install dependencies:
    ```bash
    npm install
    ```
5.  Run the bot:
    ```bash
    npm start
    ```

### 4. Testing
1.  Open Telegram and find the bot you created.
2.  Send the `/start` command to the bot.
3.  The bot should reply with a message and an inline button "Open Mini App Demo".
4.  Click the button to launch your Mini App.
5.  Test the DeviceStorage, SecureStorage, Fullscreen, and Geolocation features.
    *   Remember that SecureStorage retrieval logs to the browser console.
    *   Geolocation might require granting permissions.
6.  Use your browser's developer console (and Telegram's debug mode if needed) for troubleshooting.
