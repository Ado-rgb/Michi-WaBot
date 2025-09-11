import speed from "performance-now"
import { exec } from "child_process"
import pkg from "@whiskeysockets/baileys"
const { proto, generateWAMessageFromContent } = pkg

let handler = async (m, { conn, usedPrefix, command }) => {
  let timestamp = speed()

  exec(`neofetch --stdout`, (error, stdout, stderr) => {
    let latensi = speed() - timestamp
    let child = stdout.toString("utf-8")
    let ssd = child.replace(/Memory:/, "Ram:")

    const content = {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `${ssd}\n乂  *Speed* : ${latensi.toFixed(4)} _ms_`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: '📊 Información del sistema'
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: 'PING TEST',
              hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              */buttons: [
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: '⚡ Ver velocidad',
                    id: `${usedPrefix}speed`
                  })
                },
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: '🔄 Nuevo Speed',
                    id: `${usedPrefix + command}`
                  })
                }
              ]*/
            })
          })
        }
      }
    }

    // generar mensaje con quoted incrustado
    const msg = generateWAMessageFromContent(m.chat, content, { quoted: m })

    conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  })
}

handler.help = ["ping"]
handler.tags = ["info"]
handler.command = ["ping", "p"]

export default handler
