// bot.js
const TelegramBot = require('node-telegram-bot-api');

// Replace with your actual bot token
const token = 'YOUR_BOT_TOKEN_HERE';
// Replace with the URL where your Mini App (index.html) will be accessible
// For local testing, this will likely be an ngrok URL or similar.
const miniAppUrl = 'YOUR_MINI_APP_URL_HERE';

if (token === 'YOUR_BOT_TOKEN_HERE' || miniAppUrl === 'YOUR_MINI_APP_URL_HERE') {
    console.error("Please replace YOUR_BOT_TOKEN_HERE and YOUR_MINI_APP_URL_HERE in bot.js with your actual bot token and Mini App URL.");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const replyMarkup = {
        inline_keyboard: [
            [
                {
                    text: 'Open Mini App Demo',
                    web_app: { url: miniAppUrl }
                }
            ]
        ]
    };
    bot.sendMessage(chatId, 'Welcome! Click the button below to open the Mini App demo.', {
        reply_markup: replyMarkup
    });
});

bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error.code} - ${error.message}`);
});

bot.on('webhook_error', (error) => {
     console.error(`Webhook error: ${error.code} - ${error.message}`);
});

console.log('Bot started... Send /start to see the Mini App button.');
console.log(`Make sure your Mini App is being served at: ${miniAppUrl}`);
