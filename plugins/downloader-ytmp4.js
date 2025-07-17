import ytSearch from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply('📍 Escribe el nombre de un video o pega el link de YouTube')

  try {
    let url = text
    if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
      let search = await ytSearch(text)
      if (!search?.videos?.length) return m.reply('❌ No se encontraron resultados')
      url = search.videos[0].url
    }

    const apiUrl = `https://apiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}`
    console.log('🔗 URL usada para API:', apiUrl)

    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status || !json.result?.download) throw new Error('La API no devolvió un resultado válido')

    let { title, thumbnail, download } = json.result

    // Busca info con yt-search para más detalles
    let videoInfo = await ytSearch(url)
    let vid = videoInfo.videos.find(v => v.url === url) || videoInfo.videos[0]

    // Arma caption completo con detalles
    let caption = `🎬 *Título:* ${title}
⏱️ *Duración:* ${vid.timestamp || 'Desconocida'}
👤 *Canal:* ${vid.author?.name || 'Desconocido'}
👀 *Vistas:* ${vid.views?.toLocaleString() || 'N/A'}
📅 *Publicado:* ${vid.ago || 'N/A'}
🔗 *URL:* ${url}`

    // Manda miniatura + detalles
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: caption
    }, { quoted: m })

    // Manda video mp4
    await conn.sendMessage(m.chat, {
      video: { url: download },
      caption: `🎬 *${title}*`,
      mimetype: 'video/mp4'
    }, { quoted: m })

  } catch (e) {
    console.log('❌ Error al descargar el video:', e)
    m.reply('❌ Error al descargar el video')
  }
}

handler.help = ['ytmp4', 'play2', 'mp4'].map(v => v + ' <nombre o link>')
handler.tags = ['descargas']
handler.command = /^(ytmp4|play2|mp4)$/i

export default handler