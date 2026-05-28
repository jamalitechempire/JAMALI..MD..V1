const config = require('./config');
const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' });
}

module.exports = {
    // ===========================================================
    // 1. BASIC CONFIGURATION (Session & Database)
    // ===========================================================
    SESSION_ID: process.env.SESSION_ID || "JAMALI-MD", 
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://kxshrii:i7sgjXF6SO2cTJwU@kelumxz.zggub8h.mongodb.net/',
    
    // ===========================================================
    // 2. BOT INFORMATION
    // ===========================================================
    PREFIX: process.env.PREFIX || '.',
    OWNER_NUMBER: process.env.OWNER_NUMBER || '255784062158',
    BOT_NAME: "JAMALI MD",
    BOT_FOOTER: '> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐉𝐀𝐌𝐀𝐋𝐈 𝐓𝐄𝐂𝐇 𝐓𝐙',
    
    // Work mode: public, private, group, inbox
    WORK_TYPE: process.env.WORK_TYPE || "public", 
    
    // ===========================================================
    // 3. AUTOMATIC FEATURES (STATUS)
    // ===========================================================
    AUTO_VIEW_STATUS: process.env.AUTO_VIEW_STATUS || 'true', // Automatically view statuses
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'true', // Automatically like statuses
    AUTO_LIKE_EMOJI: ['🙌', '🫡', '🔥', '🫵', '💀', '🤓', '☠️', '❤️', '💗', '🤍', '🖤', '👀', '😎', '✅', '💚'], 
    
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'false', // Reply to statuses
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || '🖥️', // Reply message
    
    // ===========================================================
    // 4. CHAT & PRESENCE FEATURES
    // ===========================================================
    READ_MESSAGE: process.env.READ_MESSAGE || 'false', // Mark messages as read (Blue Tick)
    AUTO_TYPING: process.env.AUTO_TYPING || 'false', // Show "Typing..."
    AUTO_RECORDING: process.env.AUTO_RECORDING || 'false', // Show "Recording..."
    VIEWONCE_DETECT: process.env.VIEWONCE_DETECT || 'true',
    
    // ===========================================================
    // 5. GROUP MANAGEMENT
    // ===========================================================
    WELCOME_ENABLE: process.env.WELCOME_ENABLE || 'true',
    GOODBYE_ENABLE: process.env.GOODBYE_ENABLE || 'true',
    WELCOME_MSG: process.env.WELCOME_MSG || 'true',
    GOODBYE_MSG: process.env.GOODBYE_MSG || 'true', 
    GROUP_EVENTS: process.env.GROUP_EVENTS || 'false',
    WELCOME_IMAGE: process.env.WELCOME_IMAGE || null, 
    GOODBYE_IMAGE: process.env.GOODBYE_IMAGE || null,
    
    // Anti-links and anti-delete default settings
    // Antilink settings
    LINK_WARN_LIMIT: '3',        // Number of warnings before action
    LINK_ACTION: 'mute',         // Action: 'kick' or 'mute'
    LINK_WHITELIST: 'whatsapp.com,chat.whatsapp.com,youtube.com,youtu.be,instagram.com,facebook.com,tiktok.com',
    ANTI_DELETE: process.env.ANTI_DELETE || 'false',
    
    // Custom anti-link warning message
    ANTI_LINK_MSG: process.env.ANTI_LINK_MSG || '❌ *ANTI-LINK ACTIVATED*\n\n@{sender}, sending links is not allowed in this group!\n\n*Group:* {group}\n*Link Type:* {linkType}\n*Action:* Message Deleted',
    
    GROUP_INVITE_LINK: process.env.GROUP_INVITE_LINK || 'https://chat.whatsapp.com/GPdlJ8ip88K39E5Hok7rJh',
    
    // ===========================================================
    // 6. SECURITY & ANTI-CALL
    // ===========================================================
    ANTI_CALL: process.env.ANTI_CALL || 'false', // Reject calls
    REJECT_MSG: process.env.REJECT_MSG || '🔒 NO CALLS ALLOWED 🔒',
    
    // ===========================================================
    // 7. IMAGES & LINKS
    // ===========================================================
    IMAGE_PATH: 'https://files.catbox.moe/0e3rok.jpg',
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbC7AgJK5cD71vGIpO3h',
    GROUP_LINK_1: 'https://chat.whatsapp.com/GPdlJ8ip88K39E5Hok7rJh',
    GROUP_LINK_2: 'https://chat.whatsapp.com/GPdlJ8ip88K39E5Hok7rJh',
    
    // ===========================================================
    // 8. CHANNEL JIDS (NEWSLETTER/CHANNEL)
    // ===========================================================
    CHANNEL_JID_1: '120363425061263455@newsletter',
    CHANNEL_JID_2: '120363425061263455@newsletter', // Same as user provided
    // Newsletter reaction settings
    NEWSLETTER_AUTO_FOLLOW: process.env.NEWSLETTER_AUTO_FOLLOW || 'true',
    NEWSLETTER_REACTION_EMOJIS: ['⚔️', '🔥', '⚡', '💀', '🩸', '🛡️', '🎯', '💣', '🏹', '🔪', '🗡️', '🏆', '💎', '🌟', '💥', '🌪️', '☠️', '👑', '⚙️', '🔰', '💢', '💫', '🌀', '❤️', '💗', '🤍', '🖤', '👀', '😎', '✅', '😁', '🌙', '☄️', '🌠', '🌌', '💚'],
    
    // ===========================================================
    // 9. AUTO-BIO SETTINGS
    // ===========================================================
    AUTO_BIO: process.env.AUTO_BIO || 'true',
    BIO_LIST: [
        "🔐 JAMALI MD BOT - Your ultimate WhatsApp bot",
        "🚀 Powered by JAMALI TECH TZ",
        "💫 Always at your service!",
        "🎯 Fast, Secure & Reliable",
        "🤖 JAMALI MD - Your digital assistant",
        "⚡ Multi-device bot with MongoDB",
        "🔒 Secure & Private Bot",
        "🌟 Version 1.0.0 - New Features!"
    ],
    
    // ===========================================================
    // 11. EXTERNAL API (Optional)
    // ===========================================================
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '8526421940:AAFU39FEU61U3ORKIe8NuqzBACydzqcOgSI',
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '7303596375',
    
    // ===========================================================
    // 12. BUTTON & LIST MESSAGE SETTINGS
    // ===========================================================
    BUTTON_FOOTER: process.env.BUTTON_FOOTER || '> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐉𝐀𝐌𝐀𝐋𝐈 𝐓𝐄𝐂𝐇 𝐓𝐙',
    LIST_TITLE: process.env.LIST_TITLE || 'JAMALI MD BOT MENU',
    LIST_BUTTON_TEXT: process.env.LIST_BUTTON_TEXT || 'SELECT OPTION',
    
    // ===========================================================
    // 14. AUTO-REPLY MESSAGES
    // ===========================================================
    AUTO_REPLY_ENABLE: process.env.AUTO_REPLY_ENABLE || 'true',
    AUTO_REPLIES: {
        'hi': '*👋 Hello! How can I help you today?*',
        'mambo': '*💫 Poa sana! Nikusaidie kuhusu?*',
        'hey': '*⚡ Hey there! Use .menu for commands*',
        'vip': '*👑 Hello VIP! How can I assist you?*',
        'mkuu': '*🔥 Hey mkuu! Nikusaidie kuhusu?*',
        'boss': '*🎯 Yes boss! How can I help you?*',
        'habari': '*🌟 Nzuri sana! Habari yako?*',
        'hello': '*🤖 Hi there! Use .menu for commands*',
        'bot': '*⚙️ Yes, I am JAMALI MD BOT! How can I assist you?*',
        'menu': '*📜 Type .menu for all commands!*',
        'owner': '*👑 Contact owner using .owner*',
        'thanks': '*✨ You\'re welcome!*',
        'thank you': '*💫 Anytime! Let me know if you need help*'
    }
};
