import axios from 'axios'
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

let handler = async (m, { conn }) => {
  const proses = '😺 Obteniendo información de los creadores...'
  await conn.sendMessage(m.chat, { text: proses }, { quoted: m })

  async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent({ image: { url } }, {
      upload: conn.waUploadToServer
    })
    return imageMessage
  }

  const owners = [
    {
      name: 'Ado',
      desc: 'Creador Principal de 𝖠𝖨 | 𝖬𝗂𝖼𝗁𝗂 🧃',
      image: 'https://iili.io/F0FyRXR.jpg',
      buttons: [
        { name: '🌴 WhatsApp', url: 'https://wa.me/50493732693' },
        { name: '🥞 Canal OFC', url: 'https://whatsapp.com/channel/0029VbArz9fAO7RGy2915k3O' },
        { name: '🧃 Grupo', url: 'https://chat.whatsapp.com/HztBH5HP4kpBE86Nbuax4i?mode=ems_copy_c' },
        { name: '🍂 API', url: 'https://myapiadonix.vercel.app' }
      ]
    },
    {
      name: 'GianPoolS',
      desc: 'Colaborador de 𝖠𝖨 | 𝖬𝗂𝖼𝗁𝗂 🧃',
      image: 'https://iili.io/F0FyTmJ.jpg',
      buttons: [
        { name: '🦖 WhatsApp', url: 'https://wa.me/51956931649' },
        { name: '💎 Github', url: 'https://github.com/GianPoolS' }
      ]
    }
  ]

  let cards = []

  for (let owner of owners) {
    const imageMsg = await createImage(owner.image)

    let formattedButtons = owner.buttons.map(btn => ({
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({
        display_text: btn.name,
        url: btn.url
      })
    }))

    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `🪴 *${owner.name}*\n${owner.desc}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: '> Conoce más sobre nuestros creadores siguiendo sus redes sociales. Haz clic en cualquier botón para acceder a sus perfiles y descubrir su trabajo. Si te gustaría apoyarlos, también puedes realizar una donación a través de nuestro PayPal.'
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        hasMediaAttachment: true,
        imageMessage: imageMsg
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: formattedButtons
      })
    })
  }

  const slideMessage = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: '🙀 Creadores de 𝖠𝖨 | 𝖬𝗂𝖼𝗁𝗂 🧃 ⚘️'
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: 'Conoce a los desarrolladores del bot'
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards
          })
        })
      }
    }
  }, {})

  await conn.relayMessage(m.chat, slideMessage.message, { messageId: slideMessage.key.id })
}

//handler.help = ['owner']
//handler.tags = ['info']
handler.command = /^(tes3)$/i

export default handler
