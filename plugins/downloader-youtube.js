import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim()) {
      return conn.reply(m.chat, "> 》 🌲 Coloca el link o nombre del video a descargar.", m)
    }

    let videoIdToFind = text.match(youtubeRegexID) || null
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

    if (videoIdToFind) {
      const videoId = videoIdToFind[1]
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId)
    }

    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2

    if (!ytplay2 || ytplay2.length === 0) {
      return m.reply('🪴 Lo siento, no se encontraron resultados.')
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2
    title = title || 'no encontrado'
    thumbnail = thumbnail || ''
    timestamp = timestamp || 'no encontrado'
    views = views || 'no disponible'
    ago = ago || 'no disponible'
    url = url || ''
    author = author || { name: 'Desconocido' }

    const vistas = formatViews(views)
    const canal = author.name || 'Desconocido'

    const infoMessage = `🐢 🅨𝗈𝗎𝗍𝗎𝖻𝖾 𝗣𝗹𝗮𝘆\n\n*⏤͟͟͞͞ ${title}*\n\n🦎 \`Canal\` » *${canal}*\n🐣 \`Vistas\` » *${vistas}*\n🎍 \`Duración\` » *${timestamp}*\n🌾 \`Subido\` » *${ago}*\n🦆 \`Enlace\` » ${url}`
    const thumb = (await conn.getFile(thumbnail))?.data

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: '',
          body: title,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: null,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    }

    await conn.reply(m.chat, infoMessage, m, JT)

    const isAudio = ['play', 'yta', 'ytmp3', 'playaudio'].includes(command)
    const isVideo = ['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)

    if (!isAudio && !isVideo) {
      return conn.reply(m.chat, '🥮︎ Comando no reconocido.', m)
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
        ptt: true
      }, { quoted: m })
    } else if (isVideo) {
      await conn.sendMessage(m.chat, {
        video: { url: downloadUrl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        caption: '*🐢 SUCCESS*.\n> 🐸 Aquí tienes tu video.',
        ptv: true
      }, { quoted: m })
    }

  } catch (error) {
    console.error('[ERROR YOUTUBE]', error)
    return m.reply(`🌵︎ Algo sucedió mal: ${error.message || error}`)
  }
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'play2', 'ytv', 'ytmp4', 'playaudio', 'mp4']
handler.tags = ['descargas']
//handler.group = true

export default handler

function formatViews(views) {
  if (views === undefined) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}🅱 (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}🅼 (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}🅺 (${views.toLocaleString()})`
  return views.toString()
}
