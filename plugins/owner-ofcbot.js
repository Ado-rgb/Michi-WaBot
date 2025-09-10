import fs from 'fs'

let handler = async (m, { conn }) => {
  try {
    // Asegúrate de que la ruta es la correcta
    const creds = JSON.parse(fs.readFileSync('./Sessions/creds.json'))

    // Buscar primero en id, luego en jid
    let botIdRaw = creds?.me?.id || creds?.me?.jid || ''
    let botNumber = String(botIdRaw).split(/[:@]/)[0] // solo número
    botNumber = botNumber.replace(/[^0-9]/g, '')

    if (!botNumber) {
      return m.reply('❌ No se pudo obtener el número del bot.')
    }

    await conn.sendMessage(m.chat, {
      text: `Hola, ${m.pushName} el Bot Ofc es:\n> wa.me/${botNumber}`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { text: '❌ Error al leer el número del bot.' }, { quoted: m })
  }
}

handler.help = ['ofcbot']
handler.tags = ['owner']
handler.command = ['ofcbot']
handler.rowner = true

export default handler