import fetch from 'node-fetch'

let handler = async (m, { conn, command }) => {
  try {
    const res = await fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/blackpink.txt')
    const body = await res.text()
    const randomkpop = body.split('\n').filter(v => v && v.startsWith('http'))
    const randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]

    const gp = {key:{fromMe:false,participant:`0@s.whatsapp.net`},message:{productMessage:{product:{productImage:{mimetype:'image/jpeg',jpegThumbnail:require('fs').readFileSync('./storage/img/menu2.jpg')},title:`BlackPink`,description:'by GP',currencyCode:'USD',priceAmount1000:'1000000000',retailerId:'Ghost',productImageCount:1},businessOwnerJid:`0@s.whatsapp.net`}}};

    // Frases dinámicas
    const frases = [
      "✨ Disfruta de BlackPink en acción 💖",
      "🌸 Una imagen más de BlackPink 💟",
      "🔥 BlackPink nunca decepciona 🤩",
      "💌 BlackPink siempre brilla 🌟",
      "🎶 BlackPink en tu área 💎",
      "💞 Un regalo visual de BlackPink 🌷"
    ]
    const frase = frases[Math.floor(Math.random() * frases.length)]

    // Lista de estilos de botones
    const estilos = [
      "💕 SIGUIENTE 💕",
      "💞 SIGUIENTE 💞",
      "🩷 SIGUIENTE 🩷",
      "💌 SIGUIENTE 💌",
      "🧡 SIGUIENTE 🧡",
      "❤️ SIGUIENTE ❤️",
      "💛 SIGUIENTE 💛",
      "💚 SIGUIENTE 💚",
      "🩵 SIGUIENTE 🩵",
      "💙 SIGUIENTE 💙",
      "💜 SIGUIENTE 💜",
      "🤍 SIGUIENTE 🤍",
      "❤️‍🔥 SIGUIENTE ❤️‍🔥",
      "❣️ SIGUIENTE ❣️",
      "💓 SIGUIENTE 💓",
      "💗 SIGUIENTE 💗",
      "💝 SIGUIENTE 💝",
      "💖 SIGUIENTE 💖"
    ]
    const estilo = estilos[Math.floor(Math.random() * estilos.length)]

    conn.sendMessage(m.chat, { react: { text: '🤩', key: m.key } })
    await conn.sendButton(
      m.chat,
      frase,
      namebot, // tu watermark o nombre del bot
      randomkpopx,
      [[estilo, `/${command}`]], // Botón dinámico
      gp
    )
  } catch (e) {
    m.reply('❌ Hubo un error al cargar la imagen.')
    console.error(e)
  }
}

handler.help = ['blackpink']
handler.tags = ['kpop']
handler.command = ['blackpink','bp']

export default handler