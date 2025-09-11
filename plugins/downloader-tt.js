import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply({
    text: `📥 Uso correcto:
${usedPrefix + command} <enlace válido de TikTok>

Ejemplo:
${usedPrefix + command} https://www.tiktok.com/@usuario/video/123456789`,
    ...global.rcanal
  })

  try {
    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

    let apiURL = `https://myapiadonix.casacam.net/download/tiktok?apikey=Adofreekey&url=${encodeURIComponent(args[0])}`
    let response = await fetch(apiURL)
    let data = await response.json()

    if (!data.success || !data.result?.video) 
      throw new Error('No se pudo obtener el video')

    let info = data.result

    let caption = `
📌 *${info.title}*
👤 Autor: *@${info.author?.username || 'Desconocido'}*
⏱️ Duración: *${info.duration || 'N/D'}s*

📊 Estadísticas:
♥ Likes: *${info.likes?.toLocaleString() || 0}*
💬 Comentarios: *${info.comments?.toLocaleString() || 0}*
🔁 Compartidos: *${info.shares?.toLocaleString() || 0}*
👁️ Vistas: *${info.views?.toLocaleString() || 0}*
    `.trim()

    await conn.sendMessage(m.chat, {
      video: { url: info.video },
      caption,
      fileName: `${info.title}.mp4`,
      mimetype: 'video/mp4',
      ...global.rcanal
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply({
      text: '❌ No se pudo procesar el video. Intenta nuevamente más tarde.',
      ...global.rcanal
    })
  }
}

handler.command = ['tiktok', 'tt']
handler.help = ['tiktok']
handler.tags = ['downloader']

export default handler