import fetch from 'node-fetch'
import fs from 'fs'
import { proto, generateWAMessageContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, command }) => {
  try {
    // Obtenemos imágenes aleatorias de BlackPink
    const res = await fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/blackpink.txt')
    const body = await res.text()
    const randomkpop = body.split('\n').filter(v => v && v.startsWith('http'))
    const randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]

    // Frase aleatoria
    const frases = [
      "✨ Disfruta de BlackPink en acción 💖",
      "🌸 Una imagen más de BlackPink 💟",
      "🔥 BlackPink nunca decepciona 🤩",
      "💌 BlackPink siempre brilla 🌟",
      "🎶 BlackPink en tu área 💎",
      "💞 Un regalo visual de BlackPink 🌷"
    ]
    const frase = frases[Math.floor(Math.random() * frases.length)]

    // Botón aleatorio
    const estilos = [
      "💕 SIGUIENTE 💕","💞 SIGUIENTE 💞","🩷 SIGUIENTE 🩷","💌 SIGUIENTE 💌",
      "🧡 SIGUIENTE 🧡","❤️ SIGUIENTE ❤️","💛 SIGUIENTE 💛","💚 SIGUIENTE 💚",
      "🩵 SIGUIENTE 🩵","💙 SIGUIENTE 💙","💜 SIGUIENTE 💜","🤍 SIGUIENTE 🤍",
      "❤️‍🔥 SIGUIENTE ❤️‍🔥","❣️ SIGUIENTE ❣️","💓 SIGUIENTE 💓",
      "💗 SIGUIENTE 💗","💝 SIGUIENTE 💝","💖 SIGUIENTE 💖"
    ]
    const estilo = estilos[Math.floor(Math.random() * estilos.length)]

    // Fake product como quoted
    const gp = proto.Message.fromObject({
      key: { fromMe: false, participant: '0@s.whatsapp.net' },
      message: {
        productMessage: {
          product: {
            productImage: {
              mimetype: 'image/jpeg',
              jpegThumbnail: fs.readFileSync('./storage/img/menu2.jpg')
            },
            title: 'BlackPink',
            description: 'by GP',
            currencyCode: 'USD',
            priceAmount1000: '1000000000',
            retailerId: 'Ghost',
            productImageCount: 1
          },
          businessOwnerJid: '0@s.whatsapp.net'
        }
      }
    })

    // ✅ generar imageMessage válido
    const mediaMsg = await generateWAMessageContent(
      { image: { url: randomkpopx } },
      { upload: conn.waUploadToServer }
    )

    // Enviar mensaje interactivo con botón
    await conn.sendMessage(
      m.chat,
      {
        interactiveMessage: {
          body: { text: frase },
          footer: { text: namebot },
          header: { hasMediaAttachment: true, imageMessage: mediaMsg.imageMessage },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                  display_text: estilo,
                  id: `/${command}`
                })
              }
            ]
          }
        }
      },
      { quoted: gp }
    )
  } catch (e) {
    m.reply('❌ Hubo un error al cargar la imagen.')
    console.error(e)
  }
}

handler.help = ['blackpink']
handler.tags = ['kpop']
handler.command = ['blackpink','t3']

export default handler