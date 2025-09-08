import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args }) => {
  try {
    const chatId = m.chat

    if (!chatId.endsWith('@g.us')) {
      await conn.sendMessage(chatId, { text: '✩ Este comando solo se puede usar en grupos.' }, { quoted: m })
      return
    }

    const metadata = await conn.groupMetadata(chatId)
    const allMentions = metadata.participants.map(p => p.id)
    let messageToForward = null
    let hasMedia = false

    if (m.quoted?.message) {
      const quoted = m.quoted.message

      if (quoted.conversation) {
        messageToForward = { text: quoted.conversation }
      } else if (quoted.extendedTextMessage?.text) {
        messageToForward = { text: quoted.extendedTextMessage.text }
      } else if (quoted.imageMessage) {
        const stream = await downloadContentFromMessage(quoted.imageMessage, 'image')
        let buffer = Buffer.alloc(0)
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        const mimetype = quoted.imageMessage.mimetype || 'image/jpeg'
        const caption = quoted.imageMessage.caption || ''
        messageToForward = { image: buffer, mimetype, caption }
        hasMedia = true
      } else if (quoted.videoMessage) {
        const stream = await downloadContentFromMessage(quoted.videoMessage, 'video')
        let buffer = Buffer.alloc(0)
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        const mimetype = quoted.videoMessage.mimetype || 'video/mp4'
        const caption = quoted.videoMessage.caption || ''
        messageToForward = { video: buffer, mimetype, caption }
        hasMedia = true
      } else if (quoted.audioMessage) {
        const stream = await downloadContentFromMessage(quoted.audioMessage, 'audio')
        let buffer = Buffer.alloc(0)
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        const mimetype = quoted.audioMessage.mimetype || 'audio/mp3'
        messageToForward = { audio: buffer, mimetype }
        hasMedia = true
      } else if (quoted.stickerMessage) {
        const stream = await downloadContentFromMessage(quoted.stickerMessage, 'sticker')
        let buffer = Buffer.alloc(0)
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        messageToForward = { sticker: buffer }
        hasMedia = true
      } else if (quoted.documentMessage) {
        const stream = await downloadContentFromMessage(quoted.documentMessage, 'document')
        let buffer = Buffer.alloc(0)
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        const mimetype = quoted.documentMessage.mimetype || 'application/pdf'
        const caption = quoted.documentMessage.caption || ''
        messageToForward = { document: buffer, mimetype, caption }
        hasMedia = true
      }
    }

    if (!hasMedia && args.join(' ').trim().length > 0) {
      messageToForward = { text: args.join(' ') }
    }

    if (!messageToForward) {
      await conn.sendMessage(chatId, {
        text: '✧ Debes responder a un mensaje o escribir algo para etiquetar al grupo.'
      }, { quoted: m })
      return
    }

    await conn.sendMessage(chatId, {
      ...messageToForward,
      mentions: allMentions
    }, { quoted: m })

  } catch (error) {
    console.error('❌ Error en el comando tag:', error)
    await conn.sendMessage(m.chat, {
      text: '✩ Ocurrió un error al ejecutar el comando tag.'
    }, { quoted: m })
  }
}

handler.command = ['tag']
handler.help = ['tag']
handler.tags = ['group']
handler.group = true
handler.admin = true
handler.botAdmin = false
export default handler
