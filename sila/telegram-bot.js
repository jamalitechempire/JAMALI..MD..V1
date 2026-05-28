// JAMALI MD Telegram Bot
const { Telegraf, Markup } = require('telegraf');
const config = require('../config');
const axios = require('axios');

let bot = null;
let isRunning = false;

async function startTelegramBot() {
    if (!config.TELEGRAM_BOT_TOKEN) return console.log('⚠️ Telegram token missing');
    if (isRunning) return;

    bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);
    bot.start(async (ctx) => {
        await ctx.replyWithMarkdown(`🤖 *JAMALI MD – Pairing Bot* 🤖\n\nWelcome! Use /pair <number> to connect your WhatsApp bot.\n\n👑 Owner: JAMALI TECH TZ\n📢 Channel: ${config.CHANNEL_LINK}\n\n> Powered by JAMALI TECH TZ`);
    });

    bot.command('pair', async (ctx) => {
        const args = ctx.message.text.split(' ');
        if (args.length < 2) return ctx.reply('❌ Usage: /pair 255784062158');
        let number = args[1].replace(/\D/g, '');
        if (number.length < 9) return ctx.reply('Invalid number');
        const msg = await ctx.reply(`⏳ Generating pairing code for +${number}...`);
        try {
            const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8000}`;
            const res = await axios.get(`${base}/code?number=${number}`);
            const data = res.data;
            if (data.code) {
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null,
                    `✅ *Pairing code:* \`${data.code}\`\n\nEnter this code in WhatsApp → Linked Devices.\n\n_Valid for 20 seconds._`);
            } else if (data.status === 'already_connected') {
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `ℹ️ Bot already connected for +${number}`);
            } else {
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `❌ Failed: ${data.error || 'Unknown error'}`);
            }
        } catch (err) {
            await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `❌ Server error. Make sure bot server is running.`);
        }
    });

    bot.command('owner', (ctx) => ctx.replyWithMarkdown(`👑 *JAMALI TECH TZ*\n📞 WhatsApp: [Click](https://wa.me/255784062158)\n📢 Channel: ${config.CHANNEL_LINK}`));
    bot.command('menu', (ctx) => ctx.replyWithMarkdown(`/pair <number> – Get pairing code\n/owner – Owner info\n/status – Bot status`));
    bot.command('status', (ctx) => ctx.reply(`✅ JAMALI MD Telegram Bot online`));

    bot.launch();
    isRunning = true;
    console.log('🤖 JAMALI MD Telegram Bot started');
}

function stopTelegramBot() { if (bot && isRunning) { bot.stop('SIGINT'); isRunning = false; } }
module.exports = { startTelegramBot, stopTelegramBot };
