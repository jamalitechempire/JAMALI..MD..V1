// sila/autostatus.js
// ╔══════════════════════════════════════════════════════════════╗
// ║                                                              ║
// ║      ███████╗██╗██╗      █████╗    ███╗   ███╗██████╗      ║
// ║      ██╔════╝██║██║     ██╔══██╗   ████╗ ████║██╔══██╗     ║
// ║      ███████╗██║██║     ███████║   ██╔████╔██║██║  ██║     ║
// ║      ╚════██║██║██║     ██╔══██║   ██║╚██╔╝██║██║  ██║     ║
// ║      ███████║██║███████╗██║  ██║   ██║ ╚═╝ ██║██████╔╝     ║
// ║      ╚══════╝╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝     ╚═╝╚═════╝      ║
// ║                                                              ║
// ║         𝚂𝚃𝙰𝚃𝚄𝚂 & 𝙽𝙴𝚆𝚂𝙻𝙴𝚃𝚃𝙴𝚁 - 𝚂𝙸𝙻𝙰 𝙼𝙸𝙽𝙸                ║
// ║                                                              ║
// ║         📦 GitHub: https://github.com/Sila-Md              ║
// ║         📺 YouTube: https://youtube.com/@silatrix22        ║
// ║         📱 Channel: https://whatsapp.com/channel/          ║
// ║              0029VbBG4gfISTkCpKxyMH02                      ║
// ║         👨‍💻 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚                         ║
// ║                                                              ║
// ╚══════════════════════════════════════════════════════════════╝

const { downloadContentFromMessage, delay } = require('@whiskeysockets/baileys');

// ==================== CONFIGURATION ====================
const STATUS_CONFIG = {
    // Auto Status Settings
    AUTO_VIEW_STATUS: 'true',
    AUTO_LIKE_STATUS: 'true',
    AUTO_RECORDING: 'true',
    AUTO_LIKE_EMOJI: ['💗', '🔥', '❤️', '👍', '😎', '💫', '👑', '⭐', '🎉', '🤩'],
    
    // Newsletter Settings (if you want to move newsletter here)
    AUTO_REACT_NEWSLETTERS: 'true',
    NEWSLETTER_JIDS: ['120363402325089913@newsletter', '120363422610520277@newsletter'],
    NEWSLETTER_REACT_EMOJIS: ['❤️', '😗', '🩷', '🔥', '💫', '👑'],
    
    // Retry Settings
    MAX_RETRIES: 3,
    
    // Status Save Translations (kiswahili & english)
    SAVE_TRANSLATIONS: ['save', 'save it', 'send', 'send it', 'okoa', 'tuma', 'status', 'hifadhi', 'toa', 'nisaidie']
};

// ==================== NEWSLETTER HANDLER ====================
async function setupNewsletterHandlers(socket) {
    if (!socket) return;
    
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message?.key) return;

        const isNewsletter = STATUS_CONFIG.NEWSLETTER_JIDS.some(jid =>
            message.key.remoteJid === jid ||
            message.key.remoteJid?.includes(jid)
        );

        if (!isNewsletter || STATUS_CONFIG.AUTO_REACT_NEWSLETTERS !== 'true') return;

        try {
            const randomEmoji = STATUS_CONFIG.NEWSLETTER_REACT_EMOJIS[
                Math.floor(Math.random() * STATUS_CONFIG.NEWSLETTER_REACT_EMOJIS.length)
            ];
            const messageId = message.newsletterServerId;

            if (!messageId) {
                console.warn('⚠️ No valid newsletterServerId found for newsletter:', message.key.remoteJid);
                return;
            }

            let retries = STATUS_CONFIG.MAX_RETRIES;
            while (retries > 0) {
                try {
                    await socket.newsletterReactMessage(
                        message.key.remoteJid,
                        messageId.toString(),
                        randomEmoji
                    );
                    console.log(`✅ 𝙰𝚞𝚝𝚘-𝚛𝚎𝚊𝚌𝚝𝚎𝚍 𝚝𝚘 𝚗𝚎𝚠𝚜𝚕𝚎𝚝𝚝𝚎𝚛 ${message.key.remoteJid}: ${randomEmoji}`);
                    break;
                } catch (error) {
                    retries--;
                    console.warn(`⚠️ 𝙽𝚎𝚠𝚜𝚕𝚎𝚝𝚝𝚎𝚛 𝚛𝚎𝚊𝚌𝚝𝚒𝚘𝚗 𝚏𝚊𝚒𝚕𝚎𝚍, 𝚛𝚎𝚝𝚛𝚒𝚎𝚜: ${retries}`);
                    if (retries === 0) {
                        console.error(`❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚛𝚎𝚊𝚌𝚝 𝚝𝚘 𝚗𝚎𝚠𝚜𝚕𝚎𝚝𝚝𝚎𝚛:`, error.message);
                    }
                    await delay(2000 * (STATUS_CONFIG.MAX_RETRIES - retries));
                }
            }
        } catch (error) {
            console.error('❌ 𝙽𝚎𝚠𝚜𝚕𝚎𝚝𝚝𝚎𝚛 𝚛𝚎𝚊𝚌𝚝𝚒𝚘𝚗 𝚎𝚛𝚛𝚘𝚛:', error);
        }
    });
}

// ==================== STATUS HANDLER (Auto View & Like) ====================
async function setupStatusHandlers(socket) {
    if (!socket) return;
    
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message?.key || message.key.remoteJid !== 'status@broadcast' || !message.key.participant) return;

        try {
            // Auto Recording presence
            if (STATUS_CONFIG.AUTO_RECORDING === 'true') {
                try {
                    await socket.sendPresenceUpdate("recording", message.key.remoteJid);
                } catch (err) {
                    // Silent fail
                }
            }

            // Auto View Status
            if (STATUS_CONFIG.AUTO_VIEW_STATUS === 'true') {
                let retries = STATUS_CONFIG.MAX_RETRIES;
                while (retries > 0) {
                    try {
                        await socket.readMessages([message.key]);
                        console.log(`👁️ 𝙰𝚞𝚝𝚘-𝚟𝚒𝚎𝚠𝚎𝚍 𝚜𝚝𝚊𝚝𝚞𝚜 𝚏𝚛𝚘𝚖 ${message.key.participant}`);
                        break;
                    } catch (error) {
                        retries--;
                        if (retries === 0) throw error;
                        await delay(1000 * (STATUS_CONFIG.MAX_RETRIES - retries));
                    }
                }
            }

            // Auto Like Status
            if (STATUS_CONFIG.AUTO_LIKE_STATUS === 'true') {
                const randomEmoji = STATUS_CONFIG.AUTO_LIKE_EMOJI[
                    Math.floor(Math.random() * STATUS_CONFIG.AUTO_LIKE_EMOJI.length)
                ];
                let retries = STATUS_CONFIG.MAX_RETRIES;
                while (retries > 0) {
                    try {
                        await socket.sendMessage(
                            message.key.remoteJid,
                            { react: { text: randomEmoji, key: message.key } },
                            { statusJidList: [message.key.participant] }
                        );
                        console.log(`👍 𝙰𝚞𝚝𝚘-𝚕𝚒𝚔𝚎𝚍 𝚜𝚝𝚊𝚝𝚞𝚜 𝚠𝚒𝚝𝚑 ${randomEmoji}`);
                        break;
                    } catch (error) {
                        retries--;
                        console.warn(`⚠️ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚕𝚒𝚔𝚎 𝚜𝚝𝚊𝚝𝚞𝚜, 𝚛𝚎𝚝𝚛𝚒𝚎𝚜: ${retries}`);
                        if (retries === 0) throw error;
                        await delay(1000 * (STATUS_CONFIG.MAX_RETRIES - retries));
                    }
                }
            }
        } catch (error) {
            console.error('❌ 𝚂𝚝𝚊𝚝𝚞𝚜 𝚑𝚊𝚗𝚍𝚕𝚎𝚛 𝚎𝚛𝚛𝚘𝚛:', error.message);
        }
    });
}

// ==================== STATUS SAVER (Send status to user) ====================
async function setupStatusSavers(socket) {
    if (!socket) return;
    
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];

        try {
            // Detect reply to status
            if (message.message?.extendedTextMessage?.contextInfo) {
                const replyText = message.message.extendedTextMessage.text?.trim().toLowerCase();
                const quotedInfo = message.message.extendedTextMessage.contextInfo;

                // Check if reply matches save translations & is to a status
                if (
                    STATUS_CONFIG.SAVE_TRANSLATIONS.includes(replyText) &&
                    quotedInfo?.participant?.endsWith('@s.whatsapp.net') &&
                    quotedInfo?.remoteJid === "status@broadcast"
                ) {
                    const senderJid = message.key?.remoteJid;
                    if (!senderJid || !senderJid.includes('@')) return;

                    const quotedMsg = quotedInfo.quotedMessage;
                    const originalMessageId = quotedInfo.stanzaId;

                    if (!quotedMsg || !originalMessageId) {
                        console.warn("⚠️ 𝚂𝚔𝚒𝚙𝚙𝚒𝚗𝚐: 𝙼𝚒𝚜𝚜𝚒𝚗𝚐 𝚚𝚞𝚘𝚝𝚎𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎");
                        return;
                    }

                    const mediaType = Object.keys(quotedMsg || {})[0];
                    if (!mediaType || !quotedMsg[mediaType]) return;

                    // Extract caption
                    let statusCaption = "";
                    if (quotedMsg[mediaType]?.caption) {
                        statusCaption = quotedMsg[mediaType].caption;
                    } else if (quotedMsg?.conversation) {
                        statusCaption = quotedMsg.conversation;
                    }

                    // Download media
                    const stream = await downloadContentFromMessage(
                        quotedMsg[mediaType],
                        mediaType.replace("Message", "")
                    );
                    let buffer = Buffer.from([]);
                    for await (const chunk of stream) {
                        buffer = Buffer.concat([buffer, chunk]);
                    }
                    
                    const savetex = `*╭━━〔 🐢 𝚂𝚃𝙰𝚃𝚄𝚂 𝚂𝙰𝚅𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • 𝚂𝙸𝙻𝙰-𝙼𝙳-𝚂𝚃𝙰𝚃𝚄𝚂-𝚂𝙰𝚅𝙴𝚁*
*╰━━━━━━━━━━━━━━━┈⊷*

*> 🐢 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

                    // Send via bot
                    if (mediaType === "imageMessage") {
                        await socket.sendMessage(senderJid, { 
                            image: buffer, 
                            caption: `${savetex}\n\n${statusCaption || ""}` 
                        });
                    } else if (mediaType === "videoMessage") {
                        await socket.sendMessage(senderJid, { 
                            video: buffer, 
                            caption: `${savetex}\n\n${statusCaption || ""}` 
                        });
                    } else if (mediaType === "audioMessage") {
                        await socket.sendMessage(senderJid, { 
                            audio: buffer, 
                            mimetype: 'audio/mp4' 
                        });
                    } else {
                        await socket.sendMessage(senderJid, { 
                            text: `${savetex}\n\n${statusCaption || "𝚂𝚝𝚊𝚝𝚞𝚜 𝚜𝚊𝚟𝚎𝚍!"}` 
                        });
                    }

                    console.log(`✅ 𝚂𝚝𝚊𝚝𝚞𝚜 𝚏𝚛𝚘𝚖 ${quotedInfo.participant} 𝚜𝚊𝚟𝚎𝚍 & 𝚜𝚎𝚗𝚝 𝚝𝚘 ${senderJid}`);
                }
            }
        } catch (error) {
            console.error('❌ 𝚂𝚝𝚊𝚝𝚞𝚜 𝚜𝚊𝚟𝚎 𝚑𝚊𝚗𝚍𝚕𝚎𝚛 𝚎𝚛𝚛𝚘𝚛:', error.message);
        }
    });
}

// ==================== MAIN FUNCTION TO SETUP ALL ====================
async function setupAutoStatus(socket) {
    if (!socket) {
        console.error('❌ Invalid socket provided to setupAutoStatus');
        return;
    }

    // Setup all status handlers
    await setupStatusHandlers(socket);
    await setupStatusSavers(socket);
    await setupNewsletterHandlers(socket);
    
    console.log('✅ 𝙰𝚞𝚝𝚘-𝚂𝚝𝚊𝚝𝚞𝚜 𝙷𝚊𝚗𝚍𝚕𝚎𝚛𝚜 𝚂𝚎𝚝𝚞𝚙 𝙲𝚘𝚖𝚙𝚕𝚎𝚝𝚎!');
}

// ==================== FUNCTION TO UPDATE CONFIG ====================
function updateAutoStatusConfig(newConfig) {
    if (newConfig.AUTO_VIEW_STATUS !== undefined) {
        STATUS_CONFIG.AUTO_VIEW_STATUS = newConfig.AUTO_VIEW_STATUS;
    }
    if (newConfig.AUTO_LIKE_STATUS !== undefined) {
        STATUS_CONFIG.AUTO_LIKE_STATUS = newConfig.AUTO_LIKE_STATUS;
    }
    if (newConfig.AUTO_RECORDING !== undefined) {
        STATUS_CONFIG.AUTO_RECORDING = newConfig.AUTO_RECORDING;
    }
    if (newConfig.AUTO_LIKE_EMOJI && Array.isArray(newConfig.AUTO_LIKE_EMOJI)) {
        STATUS_CONFIG.AUTO_LIKE_EMOJI = newConfig.AUTO_LIKE_EMOJI;
    }
    if (newConfig.AUTO_REACT_NEWSLETTERS !== undefined) {
        STATUS_CONFIG.AUTO_REACT_NEWSLETTERS = newConfig.AUTO_REACT_NEWSLETTERS;
    }
    if (newConfig.NEWSLETTER_JIDS && Array.isArray(newConfig.NEWSLETTER_JIDS)) {
        STATUS_CONFIG.NEWSLETTER_JIDS = newConfig.NEWSLETTER_JIDS;
    }
    if (newConfig.NEWSLETTER_REACT_EMOJIS && Array.isArray(newConfig.NEWSLETTER_REACT_EMOJIS)) {
        STATUS_CONFIG.NEWSLETTER_REACT_EMOJIS = newConfig.NEWSLETTER_REACT_EMOJIS;
    }
    
    console.log('✅ 𝙰𝚞𝚝𝚘-𝚂𝚝𝚊𝚝𝚞𝚜 𝚌𝚘𝚗𝚏𝚒𝚐 𝚞𝚙𝚍𝚊𝚝𝚎𝚍:', STATUS_CONFIG);
}

// ==================== EXPORTS ====================
module.exports = {
    STATUS_CONFIG,
    setupAutoStatus,
    setupStatusHandlers,
    setupStatusSavers,
    setupNewsletterHandlers,
    updateAutoStatusConfig
};
