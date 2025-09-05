import fs from 'fs';

let handler = async (m, { conn }) => {
  try {
    const credsPath = './Sessions/creds.json';

    if (!fs.existsSync(credsPath)) {
      return m.reply('⚠️ No se encontró el archivo creds.json en ./Sessions/');
    }

    // Envía el archivo creds.json directamente
    await conn.sendMessage(
      m.chat,
      {
        document: { url: credsPath },
        mimetype: 'application/json',
        fileName: 'creds.json',
        caption: 'Aquí tienes el archivo creds.json 📂'
      },
      { quoted: m }
    );
  } catch (err) {
    console.error('ofcbot handler error:', err);
    m.reply('❌ Error al enviar el creds.json');
  }
};

handler.command = ['ofcbot'];
handler.customPrefix = /^\\.?ofcbot$/i;
handler.tags = ['general'];
handler.help = ['ofcbot'];

export default handler;