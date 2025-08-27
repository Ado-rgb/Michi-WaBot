import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, generateWAMessageFromContent, proto } from "@whiskeysockets/baileys";
import qrcode from "qrcode";
import NodeCache from "node-cache";
import fs from "fs";
import path from "path";
import pino from 'pino';
import chalk from 'chalk';
import util from 'util';
import * as ws from 'ws';
const { child, spawn, exec } = await import('child_process');
const { CONNECTING } = ws;
import { makeWASocket } from '../lib/simple.js';
import { fileURLToPath } from 'url';

let crm1 = "Y2QgcGx1Z2lucy";
let crm2 = "A7IG1kNXN1b";
let crm3 = "SBpbmZvLWRvbmFyLmpz";
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz";
let drm1 = "";
let drm2 = "";

let rtx = `
🎋 𝗩𝗶𝗻𝗰𝘂𝗹𝗮𝗰𝗶𝗼́𝗻 𝗽𝗼𝗿 𝗖𝗼́𝗱𝗶𝗴𝗼 𝗤𝗥

📌 𝗣𝗮𝘀𝗼𝘀 𝗽𝗮𝗿𝗮 𝘃𝗶𝗻𝗰𝘂𝗹𝗮𝗿 𝘁𝘂 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:
1️⃣ Abre 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 en tu teléfono
2️⃣ Pulsa ⋮ Más opciones → Dispositivos vinculados
3️⃣ Presiona "Vincular un dispositivo"
4️⃣ Escanea el código QR que se mostrará aquí
`.trim();

let rtx2 = `
🍁 𝗩𝗶𝗻𝗰𝘂𝗹𝗮𝗰𝗶𝗼́𝗻 𝗽𝗼𝗿 𝗖𝗼́𝗱𝗶𝗴𝗼 𝗠𝗮𝗻𝘂𝗮𝗹 (8 dígitos)

📌 𝗣𝗮𝘀𝗼𝘀 𝗽𝗮𝗿𝗮 𝗵𝗮𝗰𝗲𝗿𝗹𝗼:
1️⃣ Abre 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 en tu teléfono
2️⃣ Pulsa ⋮ Más opciones → Dispositivos vinculados
3️⃣ Presiona "Vincular un dispositivo"
4️⃣ Selecciona "Vincular con el número de teléfono" e introduce el código mostrado

⚠️ 𝗜𝗺𝗽𝗼𝗿𝘁𝗮𝗻𝘁𝗲:
Algunos grupos pueden fallar al generar el código.
Recomendado: Solicítalo por privado al bot.
⏳ El código es válido solo para este número y expira en pocos segundos.
`.trim();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const yukiJBOptions = {};

if (global.conns instanceof Array) console.log();
else global.conns = [];

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    let time = global.db.data.users[m.sender].Subs + 120000;

    const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
    const subBotsCount = subBots.length;
    if (subBotsCount === 100) {
        return m.reply("No se han encontrado espacios para *Sub-Bots* disponibles.");
    }

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let id = `${who.split('@')[0]}`;
    let pathYukiJadiBot = path.join(`./${global.authFile}/`, id);
    if (!fs.existsSync(pathYukiJadiBot)) {
        fs.mkdirSync(pathYukiJadiBot, { recursive: true });
    }
    yukiJBOptions.pathYukiJadiBot = pathYukiJadiBot;
    yukiJBOptions.m = m;
    yukiJBOptions.conn = conn;
    yukiJBOptions.args = args;
    yukiJBOptions.usedPrefix = usedPrefix;
    yukiJBOptions.command = command;
    yukiJBOptions.fromCommand = true;
    yukiJadiBot(yukiJBOptions);
    global.db.data.users[m.sender].Subs = new Date * 1;
};
handler.help = ['qr', 'code'];
handler.tags = ['serbot'];
handler.command = ['qr', 'code'];
export default handler;

export async function yukiJadiBot(options) {
    let { pathYukiJadiBot, m, conn, args, usedPrefix, command } = options;
    if (command === 'code') {
        command = 'qr';
        args.unshift('code');
    }
    const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false;
    let txtQR;
    if (mcode) {
        args[0] = args[0].replace(/^--code$|^code$/, "").trim();
        if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim();
        if (args[0] == "") args[0] = undefined;
    }
    const pathCreds = path.join(pathYukiJadiBot, "creds.json");
    if (!fs.existsSync(pathYukiJadiBot)) {
        fs.mkdirSync(pathYukiJadiBot, { recursive: true });
    }
    try {
        if (args[0] && args[0] != undefined) {
            fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t'));
        }
    } catch (e) {
        conn.reply(m.chat, `[❗] Use correctamente el comando » ${usedPrefix + command} code`, m);
        return;
    }

    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64");
    exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
        const drmer = Buffer.from(drm1 + drm2, 'base64');

        let { version, isLatest } = await fetchLatestBaileysVersion();
        const msgRetry = (MessageRetryMap) => {};
        const msgRetryCache = new NodeCache();
        const { state, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot);

        const connectionOptions = {
            logger: pino({ level: "fatal" }),
            printQRInTerminal: false,
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
            msgRetry,
            msgRetryCache,
            browser: mcode ? ['Ubuntu', 'Chrome', '20.0.04'] : ['Michi Wa [ Prem Bot ]', 'Chrome', '2.0.0'],
            version: version,
            generateHighQualityLinkPreview: true
        };

        let sock = makeWASocket(connectionOptions);
        sock.isInit = false;
        let isInit = true;

        async function connectionUpdate(update) {
            const { connection, lastDisconnect, isNewLogin, qr } = update;
            if (isNewLogin) sock.isInit = false;

            if (qr && !mcode) {
                if (m?.chat) {
                    txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim() }, { quoted: m });
                } else {
                    return;
                }
                if (txtQR && txtQR.key) {
                    setTimeout(() => { conn.sendMessage(m.chat, { delete: txtQR.key }); }, 30000);
                }
                return;
            }

            if (qr && mcode) {
                let secret = await sock.requestPairingCode(m.sender.split('@')[0]);
                let formattedSecret = secret.match(/.{1,4}/g)?.join(' ') || secret;
                
                const caption = `${rtx2}\n\n*Tu código es:*\n*${formattedSecret}*`;
                const copyCode = secret.replace(/\s/g, '');

                const buttonMsg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [{
                                        name: 'cta_copy',
                                        buttonParamsJson: JSON.stringify({
                                            display_text: 'Copiar Código',
                                            copy_code: copyCode
                                        })
                                    }]
                                })
                            })
                        }
                    }
                }, { userJid: m.sender, quoted: m });

                await conn.relayMessage(m.chat, buttonMsg.message, { messageId: buttonMsg.key.id });

                if (buttonMsg.key) {
                    setTimeout(() => {
                        conn.sendMessage(m.chat, { delete: buttonMsg.key });
                    }, 30000);
                }
            }
            
            const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
            if (connection === 'close') {
                if (reason === 428) {
                    console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathYukiJadiBot)}) fue cerrada inesperadamente. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));
                    await creloadHandler(true).catch(console.error);
                } else if (reason === 401) {
                    console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La sesión (+${path.basename(pathYukiJadiBot)}) fue cerrada. Credenciales no válidas o dispositivo desconectado manualmente.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));
                    fs.rmSync(pathYukiJadiBot, { recursive: true, force: true });
                } else {
                     console.log(chalk.bold.redBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Conexión cerrada inesperadamente para (+${path.basename(pathYukiJadiBot)}), Razón: ${DisconnectReason[reason] || reason}\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));
                     fs.rmSync(pathYukiJadiBot, { recursive: true, force: true });
                }
            }

            if (global.db.data == null) loadDatabase();
            if (connection == 'open') {
                if (!global.db.data?.users) loadDatabase();
                let userName = sock.authState.creds.me.name || 'Anónimo';
                let userJid = sock.authState.creds.me.id.split(':')[0] || `${path.basename(pathYukiJadiBot)}`;
                console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${userJid}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`));
                sock.isInit = true;
                global.conns.push(sock);
                await joinChannels(sock);
            }
        }

        setInterval(async () => {
            if (!sock.user) {
                try { sock.ws.close(); } catch (e) {}
                sock.ev.removeAllListeners();
                let i = global.conns.indexOf(sock);
                if (i < 0) return;
                delete global.conns[i];
                global.conns.splice(i, 1);
            }
        }, 60000);

        let handler = await import('../handler.js');
        let creloadHandler = async function (restatConn) {
            try {
                const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error);
                if (Object.keys(Handler || {}).length) handler = Handler;
            } catch (e) {
                console.error('Nuevo error: ', e);
            }
            if (restatConn) {
                const oldChats = sock.chats;
                try { sock.ws.close(); } catch {}
                sock.ev.removeAllListeners();
                sock = makeWASocket(connectionOptions, { chats: oldChats });
                isInit = true;
            }
            if (!isInit) {
                sock.ev.off("messages.upsert", sock.handler);
                sock.ev.off("connection.update", sock.connectionUpdate);
                sock.ev.off('creds.update', sock.credsUpdate);
            }

            sock.handler = handler.handler.bind(sock);
            sock.connectionUpdate = connectionUpdate.bind(sock);
            sock.credsUpdate = saveCreds.bind(sock, true);
            sock.ev.on("messages.upsert", sock.handler);
            sock.ev.on("connection.update", sock.connectionUpdate);
            sock.ev.on("creds.update", sock.credsUpdate);
            isInit = false;
            return true;
        };
        creloadHandler(false);
    });
}

async function joinChannels(conn) {
    for (const channelId of Object.values(global.ch)) {
        await conn.newsletterFollow(channelId).catch(() => {});
    }
}
