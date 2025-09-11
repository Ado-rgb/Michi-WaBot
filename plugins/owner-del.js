//[##] Creado por GianPoolS

let handler = async (m, { conn, text }) => {
    try {
        if (!m.quoted) {
            return m.reply('❌ Debes responder al mensaje que deseas eliminar con .del');
        }

        const msgId = m.quoted.key.id;
        const chatId = m.chat;

        await conn.sendMessage(chatId, { delete: { id: msgId, remoteJid: chatId, fromMe: true } });

    } catch (error) {
        console.log(error);
        m.reply('❌ No se pudo eliminar el mensaje.');
    }
};

handler.command = ['del'];
handler.rowner = false;
handler.owner = true;
export default handler;