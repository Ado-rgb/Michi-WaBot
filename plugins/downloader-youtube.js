import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim()) {
      return conn.sendMessage(m.chat, {
        text: `֯　ׅ🍃ֶ֟፝֯ㅤ *Uso correcto:*\n> _${usedPrefix + command} <link o nombre del video>_`,
        ...global.rcanal
      }, { quoted: m })
    }

    let videoIdToFind = text.match(youtubeRegexID) || null
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

    if (videoIdToFind) {
      const videoId = videoIdToFind[1]
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId)
    }

    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2

    if (!ytplay2 || ytplay2.length === 0) {
      return conn.sendMessage(m.chat, {
        text: '🍂 No se encontraron resultados.',
        ...global.rcanal
      }, { quoted: m })
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2
    title = title || 'No encontrado'
    thumbnail = thumbnail || ''
    timestamp = timestamp || 'No disponible'
    views = views || 'No disponible'
    ago = ago || 'No disponible'
    url = url || ''
    author = author || { name: 'Desconocido' }

    const vistas = formatViews(views)
    const canal = author.name || 'Desconocido'

    const infoMessage = `
> ❐ *_YouTube - Play_* 

✩ *Título*: ${title}
✩ *Canal*: ${canal}
✩ *Vistas*: ${vistas}
✩ *Duración*: ${timestamp}
✩ *Subido*: ${ago}
✩ *Enlace*: ${url}
    `.trim()

    const thumb = (await conn.getFile(thumbnail))?.data
    await conn.sendMessage(m.chat, { image: thumb, caption: infoMessage, ...global.rcanal }, { quoted: m })

    const isAudio = ['play', 'yta', 'ytmp3', 'playaudio'].includes(command)
    const isVideo = ['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)

    if (!isAudio && !isVideo) {
      return conn.sendMessage(m.chat, {
        text: '🌾 Comando no reconocido.',
        ...global.rcanal
      }, { quoted: m })
    }

    const format = isAudio ? 'audio' : 'video'
    const apiUrl = `${api.url}/download/yt?apikey=${api.key}&url=${encodeURIComponent(url)}&format=${format}`
    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status || !json.data?.url) {
      throw new Error(json.message || 'No se pudo obtener el enlace de descarga.')
    }

    const downloadUrl = json.data.url

    if (isAudio) {
      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        ptt: true,
        ...global.rcanal
      }, { quoted: m })
    } else if (isVideo) {
      await conn.sendMessage(m.chat, {
        video: { url: downloadUrl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        caption: '🐸 *Descarga completada.*\n> *Aquí tienes tu video.*',
        ...global.rcanal
      }, { quoted: m })
    }

  } catch (error) {
    console.error('[ERROR YOUTUBE]', error)
    return conn.sendMessage(m.chat, {
      text: `❌ Ocurrió un error: ${error.message || error}`,
      ...global.rcanal
    }, { quoted: m })
  }
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'play2', 'ytv', 'ytmp4', 'playaudio', 'mp4']
handler.tags = ['descargas']

export default handler

function formatViews(views) {
  if (views === undefined) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K (${views.toLocaleString()})`
  return views.toString()
}