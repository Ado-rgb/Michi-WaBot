import { promises as fs } from 'fs'
const acertijosPath = './database/acertijos.json'

let acertijoActual = null
const tiempoLimite = 60000

async function cargarAcertijos() {
  try {
    const data = await fs.readFile(acertijosPath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const acertijos = await cargarAcertijos()
  if (acertijos.length === 0) return conn.reply(m.chat, 'No hay acertijos disponibles 🤷‍♂️', m)

  if (!acertijoActual) {
    const idx = Math.floor(Math.random() * acertijos.length)
    acertijoActual = {
      ...acertijos[idx],
      inicio: Date.now(),
      jugador: m.sender,
      chat: m.chat
    }
    return conn.reply(m.chat, `
🎭 *¡ACERTIJO NUEVO PA' TI!* 🎭

${acertijoActual.pregunta}

*Responde rápido antes de que se acabe el tiempo* (60 segundos)

*Usa:* ${usedPrefix}${command} <tu respuesta>
    `.trim(), m)
  }

  if (m.sender !== acertijoActual.jugador) {
    return conn.reply(m.chat, `❗ Solo @${acertijoActual.jugador.split`@`[0]} puede responder este acertijo.`, m, { mentions: [acertijoActual.jugador] })
  }

  if (!text) return conn.reply(m.chat, `✎ Responde el acertijo con: *${usedPrefix}${command} <tu respuesta>*`, m)

  if (text.toLowerCase().trim() === acertijoActual.respuesta) {
    conn.reply(m.chat, `
🎉 ¡Bien hecho @${m.sender.split`@`[0]}! 🎉
Acertaste el acertijo:

${acertijoActual.pregunta}

Respuesta: *${acertijoActual.respuesta}*

👏 ¡Eres un duro!
    `.trim(), m, { mentions: [m.sender] })
    acertijoActual = null
  } else {
    conn.reply(m.chat, `❌ Incorrecto, inténtalo otra vez.\n\nPregunta: ${acertijoActual.pregunta}`, m)
  }
}

setInterval(() => {
  if (!acertijoActual) return
  if (Date.now() - acertijoActual.inicio > tiempoLimite) {
    global.conn?.sendMessage(
      acertijoActual.chat,
      {
        text: `⌛ Se acabó el tiempo para responder!\n\n${acertijoActual.pregunta}\n\nLa respuesta era: *${acertijoActual.respuesta}*`
      },
      { mentions: [acertijoActual.jugador] }
    )
    acertijoActual = null
  }
}, 15000)

handler.help = ['acertijo']
handler.tags = ['game']
handler.command = ['acertijo', 'adivinanza']
handler.register = true
handler.group = true

export default handler
