// JAMALI MD - Auto Status & Newsletter Handler (Single Channel)
const { downloadContentFromMessage, delay } = require('@whiskeysockets/baileys');
const config = require('../config');

const STATUS_CONFIG = {
    AUTO_VIEW_STATUS: 'true',
    AUTO_LIKE_STATUS: 'true',
    AUTO_RECORDING: 'true',
    AUTO_LIKE_EMOJI: ['💗', '🔥', '❤️', '👍', '😎', '💫', '👑', '⭐', '🎉', '🤩'],
    AUTO_REACT_NEWSLETTERS: 'true',
    NEWSLETTER_JIDS: [config.CHANNEL_JID || '120363425061263455@newsletter'],
    NEWSLETTER_REACT_EMOJIS: ['❤️', '🔥', '💫', '👑', '⚡', '🎯', '💀'],
    MAX_RETRIES: 3,
    SAVE_TRANSLATIONS: ['save', 'send', 'okoa', 'tuma', 'status', 'hifadhi']
};

async function setupNewsletterHandlers(socket) {
    if (!socket) return;
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message?.key) return;
        const isNewsletter = STATUS_CONFIG.NEWSLETTER_JIDS.some(jid => message.key.remoteJid === jid);
        if (!isNewsletter || STATUS_CONFIG.AUTO_REACT_NEWSLETTERS !== 'true') return;
        try {
            const emoji = STATUS_CONFIG.NEWSLETTER_REACT_EMOJIS[Math.floor(Math.random() * STATUS_CONFIG.NEWSLETTER_REACT_EMOJIS.length)];
            const msgId = message.newsletterServerId;
            if (!msgId) return;
            let retries = STATUS_CONFIG.MAX_RETRIES;
            while (retries--) {
                try {
                    await socket.newsletterReactMessage(message.key.remoteJid, msgId.toString(), emoji);
                    console.log(`✅ Reacted to newsletter ${message.key.remoteJid} with ${emoji}`);
                    break;
                } catch (e) {
                    if (retries === 0) console.error(`❌ Failed to react: ${e.message}`);
                    await delay(1000);
                }
            }
        } catch (e) { console.error('Newsletter react error:', e.message); }
    });
}

async function setupStatusHandlers(socket) {
    if (!socket) return;
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message?.key || message.key.remoteJid !== 'status@broadcast' || !message.key.participant) return;
        try {
            if (STATUS_CONFIG.AUTO_RECORDING === 'true') await socket.sendPresenceUpdate("recording", message.key.remoteJid).catch(()=>{});
            if (STATUS_CONFIG.AUTO_VIEW_STATUS === 'true') await socket.readMessages([message.key]);
            if (STATUS_CONFIG.AUTO_LIKE_STATUS === 'true') {
                const emoji = STATUS_CONFIG.AUTO_LIKE_EMOJI[Math.floor(Math.random() * STATUS_CONFIG.AUTO_LIKE_EMOJI.length)];
                await socket.sendMessage(message.key.remoteJid, { react: { text: emoji, key: message.key } }, { statusJidList: [message.key.participant] });
                console.log(`👍 Liked status with ${emoji}`);
            }
        } catch (e) { console.error('Status handler error:', e.message); }
    });
}

async function setupStatusSavers(socket) {
    if (!socket) return;
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message?.extendedTextMessage?.contextInfo) return;
        const replyText = msg.message.extendedTextMessage.text?.trim().toLowerCase();
        const quotedInfo = msg.message.extendedTextMessage.contextInfo;
        if (STATUS_CONFIG.SAVE_TRANSLATIONS.includes(replyText) && quotedInfo?.participant?.endsWith('@s.whatsapp.net') && quotedInfo?.remoteJid === "status@broadcast") {
            const senderJid = msg.key.remoteJid;
            const quotedMsg = quotedInfo.quotedMessage;
            const mediaType = Object.keys(quotedMsg || {})[0];
            if (!mediaType) return;
            const stream = await downloadContentFromMessage(quotedMsg[mediaType], mediaType.replace("Message", ""));
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            const caption = `*JAMALI MD Status Saver*\n\n> 🔥 Powered by JAMALI TECH TZ`;
            if (mediaType === "imageMessage") await socket.sendMessage(senderJid, { image: buffer, caption });
            else if (mediaType === "videoMessage") await socket.sendMessage(senderJid, { video: buffer, caption });
            else await socket.sendMessage(senderJid, { text: caption });
            console.log(`✅ Status saved for ${quotedInfo.participant}`);
        }
    });
}

async function setupAutoStatus(socket) {
    if (!socket) return;
    await setupStatusHandlers(socket);
    await setupStatusSavers(socket);
    await setupNewsletterHandlers(socket);
    console.log('✅ JAMALI MD Auto-Status & Newsletter handlers ready');
}

module.exports = { setupAutoStatus, STATUS_CONFIG };
