let handler = async (m, { conn }) => {
  const messageText = `
> ❐ Ado
> ✩ Fundador de 𝖬𝗂𝖼𝗁𝗂 🧃
> 🌴 WhatsApp: +50493732693
`

  await conn.sendMessage(m.chat, { text: messageText }, { quoted: m })
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['creador', 'owner', 'creadores', 'owners']

export default handler