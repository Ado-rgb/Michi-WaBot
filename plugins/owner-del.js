//[##]Creado por GianPoolS - github.com/GianPoolS
//[##]No quites los créditos

let handler = async (m, { conn }) => {
    try {
        if (!m.quoted) return m.reply('❌ Debes responder al mensaje que deseas eliminar con .del');

        const msgId = m.quoted.key.id;
        const chatId = m.chat;

        await conn.sendMessage(chatId, {
            delete: { id: msgId, remoteJid: chatId, fromMe: m.quoted.key.fromMe }
        });

    } catch (error) {
        console.log(error);
        m.reply('❌ Error al eliminar el mensaje:\n' + error.toString());
    }
};

handler.command = ['del'];
handler.rowner = true;
export default handler;