import axios from 'axios'
import crypto from 'crypto'

let handler = async (m, { conn, text }) => {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/(?:v|e(?:mbed)?)\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})|(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
  if (!text || !youtubeRegex.test(text)) {
    return conn.reply(m.chat, `🌱 Uso correcto: mp4 https://youtube.com/watch?v=DLh9mnfZvc0`, m)
  }

  try {
    await m.react('🕒')

    let vid = await yta(text)
    if (!vid.status) {
      vid = await ytv(text)
      if (!vid.status) {
        return conn.reply(m.chat, `❌ No pude obtener el video: ${vid.error}`, m)
      }
    }

    const cap = `🎬 *${vid.result.title}*
📁 Tipo: ${vid.result.format || 'mp4'}
🔗 Link directo`

    await conn.sendMessage(m.chat, {
      video: { url: vid.result.download },
      caption: cap,
      mimetype: 'video/mp4'
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, `❌ Error al enviar el video.\n\n${e.message}`, m)
  }
}

handler.command = ['mp4', 'ytmp4', 'ytv']

async function yta(link) {
  const apiBase = "https://media.savetube.me/api"
  const apiCDN = "/random-cdn"
  const apiInfo = "/v2/info"
  const apiDownload = "/download"

  const decryptData = (enc) => {
    try {
      const key = Buffer.from('C5D58EF67A7584E4A29F6C35BBC4EB12', 'hex')
      const data = Buffer.from(enc, 'base64')
      const iv = data.slice(0, 16)
      const content = data.slice(16)
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
      let decrypted = decipher.update(content)
      decrypted = Buffer.concat([decrypted, decipher.final()])
      return JSON.parse(decrypted.toString())
    } catch {
      return null
    }
  }

  const request = async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : apiBase}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          origin: 'https://yt.savetube.me',
          referer: 'https://yt.savetube.me/',
          'user-agent': 'Postify/1.0.0'
        }
      })
      return { status: true, data: response }
    } catch (error) {
      return { status: false, error: error.message }
    }
  }

  const youtubeID = link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/)
  if (!youtubeID) return { status: false, error: "No se pudo extraer el ID del video." }

  const qualityOptions = ['1080', '720', '480', '360', '240']

  const cdnRes = await request(apiCDN, {}, 'get')
  if (!cdnRes.status) return cdnRes
  const cdn = cdnRes.data.cdn

  const infoRes = await request(`https://${cdn}${apiInfo}`, { url: `https://www.youtube.com/watch?v=${youtubeID[1]}` })
  if (!infoRes.status) return infoRes

  const decrypted = decryptData(infoRes.data.data)
  if (!decrypted) return { status: false, error: "No se pudo desencriptar la info del video." }

  let downloadUrl = null
  for (const quality of qualityOptions) {
    const downloadRes = await request(`https://${cdn}${apiDownload}`, {
      id: youtubeID[1],
      downloadType: 'video',
      quality,
      key: decrypted.key
    })
    if (downloadRes.status && downloadRes.data.data.downloadUrl) {
      downloadUrl = downloadRes.data.data.downloadUrl
      break
    }
  }

  if (!downloadUrl) return { status: false, error: "No hay enlace de descarga disponible." }

  return {
    status: true,
    result: {
      title: decrypted.title || "Unknown",
      format: 'mp4',
      download: downloadUrl,
      type: 'video'
    }
  }
}

async function ytv(url) {
  const headers = {
    accept: '*/*',
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    referer: 'https://id.ytmp3.mobi/',
    'referrer-policy': 'strict-origin-when-cross-origin'
  }
  try {
    const initial = await axios.get(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers })
    const init = initial.data

    const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1]
    if (!id) return { status: false, error: "No se pudo extraer el ID del video." }

    const convertURL = `${init.convertURL}&v=${id}&f=mp4&_=${Math.random()}`
    const converts = await axios.get(convertURL, { headers })
    const convert = converts.data

    let info = {}
    for (let i = 0; i < 5; i++) {
      const progressResponse = await axios.get(convert.progressURL, { headers })
      info = progressResponse.data
      if (info.progress === 3) break
      await new Promise(r => setTimeout(r, 1500))
    }

    if (!convert.downloadURL) return { status: false, error: "No se encontró enlace de descarga." }

    return {
      status: true,
      result: {
        title: info.title || "Unknown",
        format: 'mp4',
        download: convert.downloadURL,
        type: 'video'
      }
    }
  } catch (error) {
    return { status: false, error: error.message }
  }
}

export default handler