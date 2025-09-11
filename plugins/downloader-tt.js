import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.sendMessage(m.chat, {
      text: `֯　ׅ🍃ֶ֟፝֯ㅤ *Uso correcto:*\n> _${usedPrefix + command} <enlace válido de TikTok>_\n\n֯　ׅ🍃ֶ֟፝֯ㅤ *Ejemplo:*\n> _${usedPrefix + command} https://www.tiktok.com/@usuario/video/123456789_`,
      ...global.rcanal
    }, { quoted: m })
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

    const apiURL = `https://myapiadonix.casacam.net/download/tiktok?apikey=Adofreekey&url=${encodeURIComponent(args[0])}`
    const response = await fetch(apiURL)
    const data = await response.json()

    if (!data.status || !data.data?.video) {
      throw new Error('No se pudo obtener el video')
    }

    const info = data.data

    const caption = `
﹡ ﹟ 🌹 ׄ ⬭ TikTok Downloader

𓏸𓈒ㅤׄ *Título ›* ${info.title}
𓏸𓈒ㅤׄ *Autor ›* @${info.author?.username || 'Desconocido'}
𓏸𓈒ㅤׄ *Duración ›* ${info.duration || 'N/D'}s

🍂ᯭ⁾ ꤥㅤꤪꤨEstadísticasꤪꤨ
♥ *Likes:* ${info.likes?.toLocaleString() || 0}
💬 *Comentarios:* ${info.comments?.toLocaleString() || 0}
🔁 *Compartidos:* ${info.shares?.toLocaleString() || 0}
👁️ *Vistas:* ${info.views?.toLocaleString() || 0}
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
    await conn.sendMessage(m.chat, {
      text: `𓏸𓈒ㅤׄ *Error ›* No se pudo procesar el video. Intenta nuevamente más tarde.`,
      ...global.rcanal
    }, { quoted: m })
  }
}

handler.command = ['tiktok', 'tt']
handler.help = ['tiktok']
handler.tags = ['downloader']

export default handler