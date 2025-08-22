// ---> Código original de Michi-Wa 
// Hecho por Ado 


import { smsg } from './lib/simple.js';
import { format } from 'util';
import { fileURLToPath } from 'url';
import path, { join } from 'path';
import { unwatchFile, watchFile } from 'fs';
import chalk from 'chalk';
import fetch from 'node-fetch';

const { proto, jidDecode, areJidsSameUser } = (await import('@whiskeysockets/baileys')).default;


const DIGITS = (v) => (v || '').replace(/\D/g, '');
const numberToJid = (num) => `${DIGITS(num)}@s.whatsapp.net`;
const looksPhoneJid = (v) => typeof v === 'string' && /^\d+@s\.whatsapp\.net$/.test(v);

const normalizeJid = (id) => {
    if (!id) return id;
    if (typeof id === 'number') return numberToJid(String(id));
    if (id.endsWith('@s.whatsapp.net')) {
        const decoded = jidDecode(id);
        return `${decoded.user}@s.whatsapp.net`;
    }
    return numberToJid(id);
};

const sameUser = (a, b) => {
    if (!a || !b) return false;
    const normA = normalizeJid(a);
    const normB = normalizeJid(b);
    if (areJidsSameUser(normA, normB)) {
        return true;
    }
    return DIGITS(normA) === DIGITS(normB);
};


const isNumber = x => typeof x === 'number' && !isNaN(x);
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this);
    resolve();
}, ms));

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || [];
    this.uptime = this.uptime || Date.now();
    if (!chatUpdate) return;
    this.pushMessage(chatUpdate.messages).catch(console.error);
    let m = chatUpdate.messages[chatUpdate.messages.length - 1];
    if (!m) return;
    if (global.db.data == null) await global.loadDatabase();

    let settings; 

    try {
        m = smsg(this, m) || m;
        if (!m) return;
        
        //  SOLUCION LID :D
        const sender = normalizeJid(m.sender);
        const chat = normalizeJid(m.chat);
        const selfJid = normalizeJid(this.user?.id || this.user?.jid);
        
        // --- LÓGICA DE LECTURA RÁPIDA ---
        // Se coloca aquí para marcar como leído inmediatamente.
        const tempSettings = global.db.data.settings[selfJid] || {};
        if (tempSettings.autoread) {
           await this.readMessages([m.key]);
        }
        // --- FIN DE LECTURA RÁPIDA ---

        m.exp = 0;
        m.coin = false;

        try {
            let user = global.db.data.users[sender];
            if (typeof user !== 'object') global.db.data.users[sender] = {};
            if (user) {
                if (!isNumber(user.exp)) user.exp = 0;
                if (!isNumber(user.coin)) user.coin = 10;
                if (!isNumber(user.joincount)) user.joincount = 1;
                if (!isNumber(user.diamond)) user.diamond = 3;
                if (!isNumber(user.lastadventure)) user.lastadventure = 0;
                if (!isNumber(user.lastclaim)) user.lastclaim = 0;
                if (!isNumber(user.health)) user.health = 100;
                if (!isNumber(user.crime)) user.crime = 0;
                if (!isNumber(user.lastcofre)) user.lastcofre = 0;
                if (!isNumber(user.lastdiamantes)) user.lastdiamantes = 0;
                if (!isNumber(user.lastpago)) user.lastpago = 0;
                if (!isNumber(user.lastcode)) user.lastcode = 0;
                if (!isNumber(user.lastcodereg)) user.lastcodereg = 0;
                if (!isNumber(user.lastduel)) user.lastduel = 0;
                if (!isNumber(user.lastmining)) user.lastmining = 0;
                if (!('muto' in user)) user.muto = false;
                if (!('premium' in user)) user.premium = false;
                if (!user.premium) user.premiumTime = 0;
                if (!('registered' in user)) user.registered = false;
                if (!('genre' in user)) user.genre = '';
                if (!('birth' in user)) user.birth = '';
                if (!('marry' in user)) user.marry = '';
                if (!('description' in user)) user.description = '';
                if (!('packstickers' in user)) user.packstickers = null;
                if (!user.registered) {
                    if (!('name' in user)) user.name = m.name;
                    if (!isNumber(user.age)) user.age = -1;
                    if (!isNumber(user.regTime)) user.regTime = -1;
                }
                if (!isNumber(user.afk)) user.afk = -1;
                if (!('afkReason' in user)) user.afkReason = '';
                if (!('role' in user)) user.role = 'Nuv';
                if (!('banned' in user)) user.banned = false;
                if (!('useDocument' in user)) user.useDocument = false;
                if (!isNumber(user.level)) user.level = 0;
                if (!isNumber(user.bank)) user.bank = 0;
                if (!isNumber(user.warn)) user.warn = 0;
            } else {
                global.db.data.users[sender] = {
                    exp: 0, coin: 10, joincount: 1, diamond: 3, lastadventure: 0,
                    health: 100, lastclaim: 0, lastcofre: 0, lastdiamantes: 0,
                    lastcode: 0, lastduel: 0, lastpago: 0, lastmining: 0, lastcodereg: 0,
                    muto: false, registered: false, genre: '', birth: '', marry: '', description: '',
                    packstickers: null, name: m.name, age: -1, regTime: -1, afk: -1,
                    afkReason: '', banned: false, useDocument: false, bank: 0, level: 0,
                    role: 'Nuv', premium: false, premiumTime: 0,
                };
            }

            let chatDb = global.db.data.chats[chat];
            if (typeof chatDb !== 'object') global.db.data.chats[chat] = {};
            if (chatDb) {
                if (!('isBanned' in chatDb)) chatDb.isBanned = false;
                if (!('sAutoresponder' in chatDb)) chatDb.sAutoresponder = '';
                if (!('welcome' in chatDb)) chatDb.welcome = true;
                if (!('autolevelup' in chatDb)) chatDb.autolevelup = false;
                if (!('autoAceptar' in chatDb)) chatDb.autoAceptar = false;
                if (!('autosticker' in chatDb)) chatDb.autosticker = false;
                if (!('autoRechazar' in chatDb)) chatDb.autoRechazar = false;
                if (!('autoresponder' in chatDb)) chatDb.autoresponder = false;
                if (!('detect' in chatDb)) chatDb.detect = true;
                if (!('antiBot' in chatDb)) chatDb.antiBot = false;
                if (!('antiBot2' in chatDb)) chatDb.antiBot2 = false;
                if (!('modoadmin' in chatDb)) chatDb.modoadmin = false;
                if (!('antiLink' in chatDb)) chatDb.antiLink = true;
                if (!('reaction' in chatDb)) chatDb.reaction = false;
                if (!('nsfw' in chatDb)) chatDb.nsfw = false;
                if (!('antifake' in chatDb)) chatDb.antifake = false;
                if (!('delete' in chatDb)) chatDb.delete = false;
                if (!isNumber(chatDb.expired)) chatDb.expired = 0;
            } else {
                global.db.data.chats[chat] = {
                    isBanned: false, sAutoresponder: '', welcome: true, autolevelup: false,
                    autoresponder: false, delete: false, autoAceptar: false, autoRechazar: false,
                    detect: true, antiBot: false, antiBot2: false, modoadmin: false,
                    antiLink: true, antifake: false, reaction: false, nsfw: false, expired: 0,
                    antiLag: false, per: [],
                };
            }


            settings = global.db.data.settings[selfJid];
            if (!settings || typeof settings !== 'object') {
                global.db.data.settings[selfJid] = {
                    self: false, restrict: true, jadibotmd: true, antiPrivate: false,
                    autoread: false, status: 0
                };
                settings = global.db.data.settings[selfJid];
            } else {
                 const defaultSettings = { self: false, restrict: true, jadibotmd: true, antiPrivate: false, autoread: false, status: 0 };
                 for (const key in defaultSettings) {
                      if (!(key in settings)) {
                           settings[key] = defaultSettings[key];
                      }
                 }
            }

        } catch (e) {
            console.error(e);
        }


        const userDb = global.db.data.users[sender] || {};
        const ownerJids = global.owner.map(([number]) => numberToJid(number));
        const modJids = global.mods.map(number => numberToJid(number));
        const premJids = global.prems.map(number => numberToJid(number));

        const isOwner = m.fromMe || ownerJids.some(owner => sameUser(owner, sender));
        const isROwner = isOwner;
        const isMods = isOwner || modJids.some(mod => sameUser(mod, sender));
        const isPrems = isOwner || premJids.some(prem => sameUser(prem, sender)) || userDb.premium === true;

        if (m.isBaileys) return;
        if (opts['nyimak']) return;
        if (settings.self && !isOwner) return;
        if (opts['swonly'] && m.chat !== 'status@broadcast') return;
        if (typeof m.text !== 'string') m.text = '';


        if (m.isGroup) {
            let chatDb = global.db.data.chats[chat];
            if (chatDb?.primaryBot) {
                 if (!looksPhoneJid(chatDb.primaryBot)) {
                    chatDb.primaryBot = normalizeJid(chatDb.primaryBot);
                 }
                 if (!sameUser(chatDb.primaryBot, selfJid)) {
                     return;
                 }
            }
        }

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5;
            const previousID = queque[queque.length - 1];
            queque.push(m.id || m.key.id);
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this);
                await delay(time);
            }, time);
        }

        m.exp += Math.ceil(Math.random() * 10);


        let participants = [];
        let user = {};
        let bot = {};
        let isRAdmin = false;
        let isAdmin = false;
        let isBotAdmin = false;
        let groupMetadata = {};

        if (m.isGroup) {
            groupMetadata = ((this.chats[chat] || {}).metadata || await this.groupMetadata(chat).catch(_ => null)) || {};
            const rawParticipants = groupMetadata.participants || [];
            participants = rawParticipants.map(p => ({
                jid: normalizeJid(p.id),
                admin: p.admin
            }));

            user = participants.find(p => sameUser(p.jid, sender)) || {};
            bot = participants.find(p => sameUser(p.jid, selfJid)) || {};

            isRAdmin = user?.admin === "superadmin";
            isAdmin = isRAdmin || user?.admin === "admin";
            isBotAdmin = !!bot?.admin;
        }

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins');
        let usedPrefix = '';

        for (let name in global.plugins) {
            let plugin = global.plugins[name];
            if (!plugin) continue;
            if (plugin.disabled) continue;
            const __filename = join(___dirname, name);
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    });
                } catch (e) {
                    console.error(e);
                }
            }
            if (!opts['restrict']) {
                if (plugin.tags && plugin.tags.includes('admin')) {
                    continue;
                }
            }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
            let _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : global.prefix;
            let match = (_prefix instanceof RegExp ?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ?
                _prefix.map(p => {
                    let re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
                    return [re.exec(m.text), re];
                }) :
                typeof _prefix === 'string' ?
                [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                [[[], new RegExp]]
            ).find(p => p[1]);

            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match, conn: this, participants, groupMetadata, user, bot,
                    isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems,
                    chatUpdate, __dirname: ___dirname, __filename
                }))
                continue;
            }
            if (typeof plugin !== 'function') continue;

            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '');
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v);
                args = args || [];
                let _args = noPrefix.trim().split` `.slice(1);
                let text = _args.join` `;
                command = (command || '').toLowerCase();
                let fail = plugin.fail || global.dfail;
                let isAccept = plugin.command instanceof RegExp ?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ?
                    cmd.test(command) :
                    cmd === command) :
                    typeof plugin.command === 'string' ?
                    plugin.command === command :
                    false;

                global.comando = command;

                if ((m.id.startsWith('NJX-') || (m.id.startsWith('BAE5') && m.id.length === 16) || (m.id.startsWith('B24E') && m.id.length === 20))) return;

                if (!isAccept) {
                    continue;
                }

                m.plugin = name;

                if (chat in global.db.data.chats || sender in global.db.data.users) {
                    let chatDb = global.db.data.chats[chat];
                    let userDb = global.db.data.users[sender];
                    if (!['grupo-unbanchat.js'].includes(name) && chatDb && chatDb.isBanned && !isROwner) return;
                    if (name != 'grupo-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'grupo-delete.js' && chatDb?.isBanned && !isROwner) return;
                    if (m.text && userDb.banned && !isROwner) {
                        m.reply(`《✦》Estas baneado/a, no puedes usar comandos en este bot!\n\n${userDb.bannedReason ? `✰ *Motivo:* ${userDb.bannedReason}` : '✰ *Motivo:* Sin Especificar'}\n\n> ✧ Si este Bot es cuenta oficial y tiene evidencia que respalde que este mensaje es un error, puedes exponer tu caso con un moderador.`);
                        return;
                    }

                    if (name != 'grupo-unbanchat.js' && chatDb?.isBanned) return;
                    if (name != 'owner-unbanuser.js' && userDb?.banned) return;
                }

                let hl = _prefix;
                let adminMode = global.db.data.chats[chat].modoadmin;
                let mini = `${plugins.botAdmin || plugins.admin || plugins.group || plugins || noPrefix || hl || m.text.slice(0, 1) == hl || plugins.command}`;
                if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && mini) return;
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
                    fail('owner', m, this, usedPrefix, command);
                    continue;
                }
                if (plugin.rowner && !isROwner) {
                    fail('rowner', m, this, usedPrefix, command);
                    continue;
                }
                if (plugin.owner && !isOwner) {
                    fail('owner', m, this, usedPrefix, command);
                    continue;
                }
                if (plugin.mods && !isMods) {
                    fail('mods', m, this, usedPrefix, command);
                    continue;
                }
                if (plugin.premium && !isPrems) {
                    fail('premium', m, this, usedPrefix, command);
                    continue;
                }
                if (plugin.group && !m.isGroup) {
                    fail('group', m, this, usedPrefix, command);
                    continue;
                } else if (plugin.botAdmin && !isBotAdmin) {
                    fail('botAdmin', m, this, usedPrefix, command);
                    continue;
                } else if (plugin.admin && !isAdmin) {
                    fail('admin', m, this, usedPrefix, command);
                    continue;
                }
                if (plugin.private && m.isGroup) {
                    fail('private', m, this, usedPrefix, command);
                    continue;
                }
                if (plugin.register == true && userDb.registered == false) {
                    fail('unreg', m, this, usedPrefix, command);
                    continue;
                }

                m.isCommand = true;
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 10;
                m.exp += xp;

                if (!isPrems && plugin.coin && global.db.data.users[sender].coin < plugin.coin * 1) {
                    this.reply(chat, `❮✦❯ Se agotaron tus ${moneda}`, m);
                    continue;
                }
                if (plugin.level > userDb.level) {
                    this.reply(chat, `❮✦❯ Se requiere el nivel: *${plugin.level}*\n\n• Tu nivel actual es: *${userDb.level}*\n\n• Usa este comando para subir de nivel:\n*${usedPrefix}levelup*`, m);
                    continue;
                }

                let extra = {
                    match, usedPrefix, noPrefix, _args, args, command, text,
                    conn: this, participants, groupMetadata, user, bot,
                    isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems,
                    chatUpdate, __dirname: ___dirname, __filename
                };

                try {
                    await plugin.call(this, m, extra);
                    if (!isPrems) m.coin = m.coin || plugin.coin || false;
                } catch (e) {
                    m.error = e;
                    console.error(e);
                    if (e) {
                        let text = format(e);
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), 'Administrador');
                        m.reply(text);
                    }
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    if (m.coin)
                        this.reply(chat, `❮✦❯ Utilizaste ${+m.coin} ${moneda}`, m);
                }
                break;
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id);
            if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1);
        }

        if (m) {
            const sender = normalizeJid(m.sender); 
            let utente = global.db.data.users[sender];
            if (utente && utente.muto == true) {
                let bang = m.key.id;
                let cancellazzione = m.key.participant;
                await this.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: cancellazzione } });
            }
            if (sender && utente) {
                utente.exp += m.exp;
                utente.coin -= m.coin * 1;
            }

            let stats = global.db.data.stats;
            if (m.plugin) {
                let now = +new Date;
                let stat = stats[m.plugin] || (stats[m.plugin] = {
                    total: 0,
                    success: 0,
                    last: 0,
                    lastSuccess: 0
                });
                if (!isNumber(stat.total)) stat.total = 0;
                if (!isNumber(stat.success)) stat.success = 0;

                stat.total += 1;
                stat.last = now;
                if (m.error == null) {
                    stat.success += 1;
                    stat.lastSuccess = now;
                }
            }
        }

        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this);
        } catch (e) {
            console.log(m, m.quoted, e);
        }

        // La lógica de lectura ahora está al principio para mayor velocidad.
        // No es necesario tenerla aquí.

        if (db.data.chats[m.chat] && db.data.chats[m.chat].reaction && m.text.match(/(ción|dad|aje|oso|izar|mente|pero|tion|age|ous|ate|and|but|ify|ai|yuki|a|s)/gi)) {
            let emot = pickRandom(["🍟", "😃", "😄", "😁", "😆", "🍓", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "🌺", "🌸", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🌟", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "💫", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🤖", "🍭", "🤫", "🫠", "🤥", "😶", "📇", "😐", "💧", "😑", "🫨", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😮‍💨", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👺", "🧿", "🌩", "👻", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🫶", "👍", "✌️", "🙏", "🫵", "🤏", "🤌", "☝️", "🖕", "🙏", "🫵", "🫂", "🐱", "🤹‍♀️", "🤹‍♂️", "🗿", "✨", "⚡", "🔥", "🌈", "🩷", "❤️", "🧡", "💛", "💚", "🩵", "💙", "💜", "🖤", "🩶", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🚩", "👊", "⚡️", "💋", "🫰", "💅", "👑", "🐣", "🐤", "🐈"]);
            if (!m.fromMe) return this.sendMessage(m.chat, { react: { text: emot, key: m.key } });
        }
        function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]; }
    }
}

global.dfail = (type, m, conn, usedPrefix, command) => {
    let edadaleatoria = ['10', '28', '20', '40', '18', '21', '15', '11', '9', '17', '25'].getRandom();
    let user2 = m.pushName || 'Anónimo';
    let verifyaleatorio = ['registrar', 'reg', 'verificar', 'verify', 'register'].getRandom();

    const msg = {
        rowner: '🔐 Solo el Creador del Bot puede usar este comando.',
        owner: '👑 Solo el creador puede usar este comando.',
        mods: '🛡️ Solo los Moderadores pueden usar este comando.',
        premium: '💎 Solo usuarios Premium pueden usar este comando.',
        group: '「✧」 Este comando es sólo para grupos.',
        private: '🔒 Solo en Chat Privado puedes usar este comando.',
        admin: '🌤️ Solo los admins del grupo pueden usar este comando.',
        botAdmin: 'El bot debe ser Admin para ejecutar esto.',
        unreg: '> 🔰 Debes estar Registrado para usar este comando.\n\n Ejemplo : #reg Ado.55',
        restrict: '⛔ Esta función está deshabilitada.'
    }[type];

    if (msg)
        return conn.reply(m.chat, msg, m, { contextInfo: rcanal }).then(() => conn.sendMessage(m.chat, { react: { text: '✖️', key: m.key } }));

    let file = global.__filename(import.meta.url, true);
    watchFile(file, async () => {
        unwatchFile(file);
        console.log(chalk.magenta("Se actualizo 'handler.js'"));

        if (global.conns && global.conns.length > 0) {
            const users = [...new Set([...global.conns
                .filter(conn => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED)
                .map(conn => conn)])];
            for (const userr of users) {
                userr.subreloadHandler(false);
            }
        }
    });
};