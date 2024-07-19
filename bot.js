const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const path = require('path');
const fs = require('fs');

// Replace 'your-telegram-bot-token-here' with your actual Telegram bot token
const TELEGRAM_TOKEN = '6841935411:AAG6xC5JiKnYeVtOZYGce__9QEUbPPKO9Tw';

// Specify the admin's chat ID
const ADMIN_CHAT_ID = 5782873898; // Replace this with the actual admin chat ID

// Create a bot instance
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Path to the JSON file where chat IDs will be stored
const chatIdsFilePath = path.join(__dirname, 'users.json');

// Helper function to read chat IDs from the JSON file
const readChatIds = () => {
  if (fs.existsSync(chatIdsFilePath)) {
    const data = fs.readFileSync(chatIdsFilePath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

// Helper function to write chat IDs to the JSON file
const writeChatIds = (chatIds) => {
  fs.writeFileSync(chatIdsFilePath, JSON.stringify(chatIds, null, 2), 'utf-8');
};

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const photoPath = path.join(__dirname, 'images/shree.jpg'); // Ensure this path is correct

  // Read existing chat IDs
  const chatIds = readChatIds();

  // Add the new chat ID if it doesn't exist
  if (!chatIds.includes(chatId)) {
    chatIds.push(chatId);
    writeChatIds(chatIds);
  }

  const message = `<b> 🎭ᴊᴀɪ sʜʀᴇᴇ ᴋʀɪsʜɴᴀ ${msg.from.first_name} ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ,\n <blockquote>ɪ'ᴍ ᴛʜᴇ ᴍᴏsᴛ ᴀᴅᴠᴀɴᴄᴇ ᴀɪ ᴘᴏᴡᴇʀᴅ 🤖 ᴀᴜᴛᴏ ғɪʟᴛᴇʀ ʙᴏᴛ..\nsᴇɴᴅ ᴍᴇ ᴀɴʏ ᴍᴏᴠɪᴇ ᴏʀ sᴇʀɪᴇs ɴᴀᴍᴇ ᴀɴᴅ sᴇᴇ ᴍʏ ᴍᴀɢɪᴄ..✨</blockquote>\n<blockquote>ғᴏʀ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴜsᴇ ᴛʜᴇ ʙᴜᴛᴛᴏɴs ʙᴇʟᴏᴡ 🤞</blockquote>\n\nᴍᴀɪɴᴛᴀɪɴᴇᴅ ʙʏ : <a href="https://t.me/Aadishranjan">ᴀᴀᴅɪꜱʜ ʀᴀɴᴊᴀɴ</a> </b>`;

  bot.sendPhoto(chatId, photoPath, {
    caption: message,
    parse_mode: 'HTML'
  });
});

// Handle /admin command
bot.onText(/\/admin (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const adminMessage = match[1]; // The message sent by the admin after the command

  // Check if the user is the admin
  if (chatId === ADMIN_CHAT_ID) {
    bot.sendMessage(chatId, "ᴡᴇʟᴄᴏᴍᴇ, ᴀᴅᴍɪɴ! sᴇɴᴅɪɴɢ ᴍᴇssᴀɢᴇ ᴛᴏ ᴀʟʟ ᴜsᴇʀs.");

    // Read existing chat IDs
    const chatIds = readChatIds();

    // Send the admin's message to all users
    chatIds.forEach(id => {
      bot.sendMessage(id, `<b>Question</b>\n\n${adminMessage}`, { parse_mode: 'HTML' });
    });
  } else {
    bot.sendMessage(chatId, "ᴏɴʟʏ ᴀᴅᴍɪɴ ʜᴀᴠᴇ ᴘᴇʀᴍɪꜱꜱɪᴏɴ ᴛᴏ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ");
  }
});


// Handle all incoming messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Check if the message is not a command (i.e., does not start with '/')
  if (msg.text && !msg.text.startsWith('/')) {
    const user_movie = msg.text.trim().toLowerCase();
    // Add your movie search logic here
    bot.sendMessage(chatId, `You asked for the movie/series: ${user_movie}`);
  }
});

// Create an HTTP server to keep the bot running on a specific port
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running...\n');
}).listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
