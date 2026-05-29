// sila/telegram-bot.js
// Independent Telegram Bot - Separated from main sila.js

const { Telegraf, Markup } = require('telegraf');
const config = require('../config');
const fs = require('fs-extra');
const path = require('path');

// Create silatelegram directory
const silatelegramDir = path.join(__dirname, '../silatelegram');
if (!fs.existsSync(silatelegramDir)) {
    fs.mkdirSync(silategramDir, { recursive: true });
}

let bot = null;
let isRunning = false;

// Function to load telegram commands
function loadTelegramCommands() {
    try {
        const telegramFiles = fs.readdirSync(silatelegramDir).filter(file => file.endsWith('.js'));
        console.log(`📦 𝙻𝚘𝚊𝚍𝚒𝚗𝚐 ${telegramFiles.length} 𝚝𝚎𝚕𝚎𝚐𝚛𝚊𝚖 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜...`);
        
        for (const file of telegramFiles) {
            try {
                const command = require(path.join(silatelegramDir, file));
                if (command && command.command && command.function) {
                    bot.command(command.command, command.function);
                    console.log(`✅ 𝙻𝚘𝚊𝚍𝚎𝚍 𝚝𝚎𝚕𝚎𝚐𝚛𝚊𝚖 𝚌𝚘𝚖𝚖𝚊𝚗𝚍: /${command.command}`);
                }
            } catch (e) {
                console.error(`❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚕𝚘𝚊𝚍 𝚝𝚎𝚕𝚎𝚐𝚛𝚊𝚖 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 ${file}:`, e);
            }
        }
    } catch (error) {
        console.error('❌ 𝙴𝚛𝚛𝚘𝚛 𝚕𝚘𝚊𝚍𝚒𝚗𝚐 𝚝𝚎𝚕𝚎𝚐𝚛𝚊𝚖 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜:', error);
    }
}

// Function to start Telegram bot
async function startTelegramBot() {
    if (!config.TELEGRAM_BOT_TOKEN) {
        console.log('ℹ️ 𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 𝚋𝚘𝚝 𝚝𝚘𝚔𝚎𝚗 𝚗𝚘𝚝 𝚌𝚘𝚗𝚏𝚒𝚐𝚞𝚛𝚎𝚍. 𝚂𝚔𝚒𝚙𝚙𝚒𝚗𝚐...');
        return;
    }

    if (isRunning) {
        console.log('⚠️ 𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 𝚋𝚘𝚝 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚛𝚞𝚗𝚗𝚒𝚗𝚐');
        return;
    }

    try {
        bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

        bot.start((ctx) => {
            const welcomeMessage = `🤖 *𝙼𝙾𝙼𝚈-𝙺𝙸𝙳𝚈 𝙱𝙾𝚃 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝚂𝚈𝚂𝚃𝙴𝙼* 🤖

👋 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚝𝚘 𝙼𝙾𝙼𝚈-𝙺𝙸𝙳𝚈 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝙱𝚘𝚝 𝙿𝚊𝚒𝚛𝚒𝚗𝚐 𝚂𝚢𝚜𝚝𝚎𝚖!

📱 *𝙷𝚘𝚠 𝚝𝚘 𝚞𝚜𝚎:*
1️⃣ 𝚄𝚜𝚎 /𝚙𝚊𝚒𝚛 <𝚗𝚞𝚖𝚋𝚎𝚛> 𝚝𝚘 𝚙𝚊𝚒𝚛 𝚢𝚘𝚞𝚛 𝚋𝚘𝚝
2️⃣ 𝙸'𝚕𝚕 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚎 𝚊 𝚙𝚊𝚒𝚛𝚒𝚗𝚐 𝚌𝚘𝚍𝚎 𝚏𝚘𝚛 𝚢𝚘𝚞
3️⃣ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚑𝚎 𝚌𝚘𝚍𝚎 𝚒𝚗 𝚢𝚘𝚞𝚛 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙
4️⃣ 𝚈𝚘𝚞𝚛 𝚋𝚘𝚝 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍!

🚀 *𝚂𝚞𝚙𝚙𝚘𝚛𝚝 𝙻𝚒𝚗𝚔𝚜:*
• 𝙶𝚒𝚝𝙷𝚞𝚋: https://github.com/Sila-Md/SILA-MD
• 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝙲𝚑𝚊𝚗𝚗𝚎𝚕: ${config.CHANNEL_LINK || 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02'}

> © 𝐏𝐨𝐰𝐞𝐫𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡`;

            const buttons = Markup.inlineKeyboard([
                [
                    Markup.button.url('📢 𝙲𝚑𝚊𝚗𝚗𝚎𝚕', 'https://t.me/sila_tech2'),
                    Markup.button.url('👥 𝙶𝚛𝚘𝚞𝚙', 'https://t.me/sila_md')
                ],
                [
                    Markup.button.url('⭐ 𝙶𝚒𝚝𝙷𝚞𝚋', 'https://github.com/Sila-Md/SILA-MD'),
                    Markup.button.url('📱 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙', config.CHANNEL_LINK || 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02')
                ]
            ]);

            ctx.replyWithPhoto(
                { url: config.IMAGE_PATH || 'https://files.catbox.moe/natk49.jpg' },
                {
                    caption: welcomeMessage,
                    parse_mode: 'Markdown',
                    ...buttons
                }
            ).catch(() => {
                ctx.replyWithMarkdown(welcomeMessage, buttons);
            });
        });

        bot.command('pair', async (ctx) => {
            const args = ctx.message.text.split(' ');
            if (args.length < 2) {
                return ctx.reply('❌ *𝚄𝚜𝚊𝚐𝚎:* /𝚙𝚊𝚒𝚛 <𝚗𝚞𝚖𝚋𝚎𝚛>\n*𝙴𝚡𝚊𝚖𝚙𝚕𝚎:* /𝚙𝚊𝚒𝚛 255789661031', { parse_mode: 'Markdown' });
            }

            const number = args[1];
            const sanitizedNumber = number.replace(/[^0-9]/g, '');

            if (sanitizedNumber.length < 9) {
                return ctx.reply('❌ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚙𝚑𝚘𝚗𝚎 𝚗𝚞𝚖𝚋𝚎𝚛. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚗𝚞𝚖𝚋𝚎𝚛 𝚠𝚒𝚝𝚑 𝚌𝚘𝚞𝚗𝚝𝚛𝚢 𝚌𝚘𝚍𝚎.', { parse_mode: 'Markdown' });
            }

            ctx.reply(`⏳ *𝙿𝚊𝚒𝚛𝚒𝚗𝚐 𝚒𝚗 𝚙𝚛𝚘𝚐𝚛𝚎𝚜𝚜...*\n\n𝙽𝚞𝚖𝚋𝚎𝚛: +${sanitizedNumber}\n𝚂𝚝𝚊𝚝𝚞𝚜: 𝙸𝚗𝚒𝚝𝚒𝚊𝚝𝚒𝚗𝚐...\n\n⚠️ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚖𝚊𝚔𝚎 𝚜𝚞𝚛𝚎 𝚢𝚘𝚞𝚛 𝚆𝚎𝚋𝚜𝚒𝚝𝚎 𝙰𝙿𝙸 𝚒𝚜 𝚛𝚞𝚗𝚗𝚒𝚗𝚐!`, { parse_mode: 'Markdown' });
        });

        bot.command('ping', (ctx) => {
            ctx.reply('🏓 *𝙿𝙾𝙽𝙶!*\n\n𝙱𝚘𝚝 𝚒𝚜 𝚊𝚕𝚒𝚟𝚎 𝚊𝚗𝚍 𝚛𝚞𝚗𝚗𝚒𝚗𝚐!', { parse_mode: 'Markdown' });
        });

        bot.command('alive', (ctx) => {
            ctx.reply('✅ *𝙸 𝙰𝙼 𝙰𝙻𝙸𝚅𝙴!*\n\n🤖 𝙼𝙾𝙼𝚈-𝙺𝙸𝙳𝚈 𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 𝙱𝚘𝚝\n⚡ 𝚂𝚝𝚊𝚝𝚞𝚜: 𝙾𝚗𝚕𝚒𝚗𝚎\n📅 𝚅𝚎𝚛𝚜𝚒𝚘𝚗: 2.0.0', { parse_mode: 'Markdown' });
        });

        bot.command('owner', (ctx) => {
            ctx.reply('👑 *𝙾𝚠𝚗𝚎𝚛 𝙸𝚗𝚏𝚘*\n\n📱 𝙽𝚞𝚖𝚋𝚎𝚛: wa.me/255789661031\n💬 𝙲𝚘𝚗𝚝𝚊𝚌𝚝 𝚏𝚘𝚛 𝚜𝚞𝚙𝚙𝚘𝚛𝚝', { parse_mode: 'Markdown' });
        });

        // Load telegram commands
        loadTelegramCommands();

        // Start Telegram bot
        await bot.launch();
        isRunning = true;
        console.log('🤖 𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 𝚋𝚘𝚝 𝚜𝚝𝚊𝚛𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢!');

        // Enable graceful stop
        process.once('SIGINT', () => stopTelegramBot());
        process.once('SIGTERM', () => stopTelegramBot());

    } catch (error) {
        console.error('❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚜𝚝𝚊𝚛𝚝 𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 𝚋𝚘𝚝:', error);
    }
}

// Function to stop Telegram bot
async function stopTelegramBot() {
    if (bot && isRunning) {
        bot.stop('SIGINT');
        isRunning = false;
        console.log('🛑 𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 𝚋𝚘𝚝 𝚜𝚝𝚘𝚙𝚙𝚎𝚍');
    }
}

// Function to get bot status
function getTelegramBotStatus() {
    return {
        running: isRunning,
        tokenConfigured: !!config.TELEGRAM_BOT_TOKEN
    };
}

module.exports = {
    startTelegramBot,
    stopTelegramBot,
    getTelegramBotStatus
};
