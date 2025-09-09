import { areJidsSameUser } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, participants, args, command }) => {

  const emoji = '🌲'
  const emoji2 = '🎍'
  const msm = '🌾 𝗔𝗏𝗂𝗌𝗈 ›'

  let member = participants.map(u => u.id)
  let sum = !text ? member.length : text
  let total = 0
  let sider = []

  for (let i = 0; i < sum; i++) {
    let users = m.isGroup ? participants.find(u => u.id == member[i]) : {}
    if ((typeof global.db.data.users[member[i]] == 'undefined' || global.db.data.users[member[i]].chat == 0) && !users.isAdmin && !users.isSuperAdmin) { 
      if (typeof global.db.data.users[member[i]] !== 'undefined'){
        if (global.db.data.users[member[i]].whitelist == false){
          total++
          sider.push(member[i])
        }
      } else {
        total++
        sider.push(member[i])
      }
    }
  }

  const delay = time => new Promise(res => setTimeout(res, time))

  switch (command) {

    case 'fantasmas': 
      if(total == 0) return conn.reply(m.chat, `${emoji} Este grupo está activo, no hay fantasmas`, m)
      m.reply(`${emoji} *Revisión de inactivos*\n\n${emoji2} *Lista de fantasmas*\n${sider.map(v => '@' + v.replace(/@.+/, '')).join('\n')}\n\n*📝 NOTA:*\nEsto no es 100% exacto, el bot inicia el conteo desde que se añade al grupo`, null, { mentions: sider })
      break

    case 'kickfantasmas':  
      if(total == 0) return conn.reply(m.chat, `${emoji} Este grupo está activo, no hay fantasmas`, m)
      await m.reply(`${emoji} *Eliminación de inactivos*\n\n${emoji2} *Lista de fantasmas*\n${sider.map(v => '@' + v.replace(/@.+/, '')).join('\n')}\n\n${msm} _El bot eliminará a los usuarios de la lista mencionada cada 10 segundos._`, null, { mentions: sider })
      await delay(10 * 1000)

      let chat = global.db.data.chats[m.chat]
      chat.welcome = false
      try {
        let users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
        let kickedGhost = sider.map(v => v.id).filter(v => v !== conn.user.jid)
        for (let user of users)
          if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => areJidsSameUser(v.id, user)) || { admin: true }).admin) {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
            kickedGhost.concat(user)
            await delay(10 * 1000)
          }
      } finally {
        chat.welcome = true
      }
      break            
  }
}

handler.tags = ['group']
handler.command = ['fantasmas', 'kickfantasmas']
handler.help = ['fantasmas', 'kickfantasmas']
handler.group = true
handler.admin = true


export default handler
