var handler = async (m, { conn, args }) => {
    if (!m.isGroup) return m.reply('❐ ✩ Este comando solo funciona en grupos ❐');

    const groupMetadata = await conn.groupMetadata(m.chat);

    let user;
    if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0];
    } else if (m.quoted) {
        user = m.quoted.sender;
    } else if (args[0]) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) return m.reply('✩ Número inválido ❐');
        user = number + '@s.whatsapp.net';
    } else {
        return m.reply('✩ Menciona o responde a alguien para expulsar.');
    }

    const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

    if (user === conn.user.jid) return m.reply('❐ ✩ No puedo expulsarme a mí mismo ❐');
    if (user === ownerGroup) return m.reply('❐ ✩ No se puede expulsar al dueño del grupo ❐');
    if (user === ownerBot) return m.reply('❐ ✩ No se puede expulsar al dueño del bot ❐');

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
        
        await conn.sendMessage(m.chat, { react: { text: '👟', key: m.key } });
    } catch (e) {
        await conn.sendMessage(m.chat, { text: '❐ ✩ No se pudo expulsar al usuario ✧\n✐ Puede que no tenga permisos suficientes ❐' });
    }
};

handler.help = ['kick'];
handler.tags = ['group'];
handler.command = ['kick','echar','hechar','sacar','ban'];
handler.register = false;
handler.botAdmin = false;
handler.admin = true;

export default handler;
