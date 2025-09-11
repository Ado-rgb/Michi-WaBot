//[##]Creado por GianPoolS - github.com/GianPoolS
//[##]No quites los créditos

let handler = async (m, { conn }) => {
    try {
        const quoted = m.quoted;
        if (!quoted || !quoted.key) {
            return m.reply('❌ Debes responder a un mensaje válido con .del');
        }

        // Detecta correctamente el id y el chat
        const msgId = quoted.key.id || quoted.key.remoteJid;
        const chatId = m.chat || quoted.key.remoteJid;
        const fromMe = quoted.key.fromMe || false;

        await conn.sendMessage(chatId, {
            delete: { id: msgId, remoteJid: chatId, fromMe: fromMe }
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