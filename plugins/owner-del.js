//[##]Creado por GianPoolS - github.com/GianPoolS
//[##]No quites los créditos

let handler = async (m, { conn }) => {
    try {
        if (!m.quoted || !m.quoted.key) {
            return m.reply('❌ Debes responder a un mensaje válido con .del');
        }

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
handler.rowner = false;
handler.owner = true;
export default handler;