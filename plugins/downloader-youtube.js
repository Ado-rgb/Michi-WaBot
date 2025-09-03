import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, args, command }) => {
    if (!args[0]) return m.reply('✐ Escribe el nombre de la canción o el enlace de YouTube.')

    let query = args.join(' ')
    let url, video

    if (query.startsWith('http')) {
        url = query
        let videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop()
        let info = await yts({ videoId })
        video = info.videos && info.videos.length ? info.videos[0] : null
        if (!video) return m.reply('✐ No se pudo obtener info del video.')
    } else {
        let search = await yts(query)
        if (!search || !search.videos || !search.videos.length) return m.reply('✐ No encontré la canción.')
        video = search.videos[0]
        url = video.url
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } })

        let format = (command === 'play2') ? 'video' : 'audio'
        let apiUrl = `https://myapiadonix.vercel.app/download/yt?url=${encodeURIComponent(url)}&format=${format}`
        let res = await fetch(apiUrl)
        let json = await res.json()
        if (!json.status || !json.data) return m.reply('✐ No se pudo descargar el recurso.')

        let download = json.data.url  

        let details = 
`*»* ${video.title || 'Sin título'}
› *Autor:* ${video.author.name || 'Desconocido'}
› *Duración:* ${video.timestamp || 'Desconocido'}
› *Vistas:* ${video.views || 'Desconocido'}
› *Publicado:* ${video.ago || 'Desconocido'}`

        await conn.sendMessage(m.chat, {
            image: { url: video.thumbnail || '' },
            caption: details,
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        let fkontak = {
            key: { fromMe: false, participant: "0@s.whatsapp.net" },
            message: {
                contactMessage: { displayName: (format === 'audio' ? "𖤹 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗔𝗨𝗗𝗜𝗢" : "𖠢 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗩𝗜𝗗𝗘𝗢") }
            }
        }

        if (format === 'audio') {
            await conn.sendMessage(m.chat, {
                audio: { url: download },
                mimetype: 'audio/mpeg',
                fileName: `${video.title}.mp3`
            }, { quoted: fkontak })
        } else {
            await conn.sendMessage(m.chat, {
                video: { url: download },
                mimetype: 'video/mp4',
                fileName: `${video.title}.mp4`,
                caption: '⟩ Descarga completa, aquí tienes tu video'
            }, { quoted: fkontak })
        }

    } catch (e) {
        console.error(e)
        m.reply('✐ Ocurrió un error, intenta otra vez.')
    }
}

handler.command = ['play', 'ytmp3', 'play2', 'ytmp4']
handler.help = ['play', 'ytmp3', 'play2', 'ytmp4']
handler.tags = ['downloader']
export default handler
