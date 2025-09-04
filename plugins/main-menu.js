import fs from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'

const tags = {
  owner: '👑 ꨶ ㅤPropietario',
  serbot: '🫟 ㅤSubbots',
  eco: '💸 ㅤEconomía',
  downloader: '⬇️ ㅤDescargas',
  tools: '🛠️ ㅤHerramientas',
  efectos: '🍿 ㅤEfectos',
  info: 'ℹ️ ㅤInformación',
  game: '🎮 ㅤJuegos',
  gacha: '🎲 ㅤGacha Anime',
  reacciones: '💕 ㅤReacciones Anime',
  group: '👥 ㅤGrupos',
  search: '🔎 ㅤBuscadores',
  sticker: '📌 ㅤStickers',
  ia: '🤖 ㅤIA',
  channel: '📺 ㅤCanales',
  fun: '😂 ㅤDiversión',
}

const defaultMenu = {
  before: `
🧃 Hola soy %botname (%tipo)

🌳 ¿Cómo estas? %name

🥞 Fecha › %date
🥮 Hora › %hour
`,

  header: '> %category\n',
  body: '> 🥞 %cmd %islimit %isPremium',
  footer: '',
  after: '> 🐢 Creador › Ado'
}

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const { exp, limit, level } = global.db.data.users[m.sender]
    const { min, xp, max } = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)

    const d = new Date(Date.now() + 3600000)
    const date = d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })
    const hour = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: true })

    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        tags: Array.isArray(p.tags) ? p.tags : [p.tags],
        prefix: 'customPrefix' in p,
        limit: p.limit,
        premium: p.premium,
      }))

    const nombreBot = global.namebot || 'Bot'
    const tipo = conn.user?.jid === global.conn?.user?.jid ? 'Principal' : 'SubBot'
    const menuConfig = conn.menu || defaultMenu

    const _text = [
      menuConfig.before,
      ...Object.keys(tags).sort().map(tag => {
        const cmds = help
          .filter(menu => menu.tags?.includes(tag))
          .map(menu => menu.help.map(h =>
            menuConfig.body
              .replace(/%cmd/g, menu.prefix ? h : `${_p}${h}`)
              .replace(/%islimit/g, menu.limit ? '⭐' : '')
              .replace(/%isPremium/g, menu.premium ? '💎' : '')
          ).join('\n')).join('\n')
        return [menuConfig.header.replace(/%category/g, tags[tag]), cmds, menuConfig.footer].join('\n')
      }),
      menuConfig.after
    ].join('\n')

    const replace = {
      '%': '%',
      p: _p,
      botname: nombreBot,
      taguser: '@' + m.sender.split('@')[0],
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      level,
      limit,
      name,
      date,
      hour,
      uptime: clockString(process.uptime() * 1000),
      tipo,
      group: m.isGroup ? await conn.getName(m.chat) : 'Privado',
      readmore: readMore,
    }

    const text = _text.replace(
      new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'),
      (_, name) => String(replace[name])
    )

    await conn.sendMessage(m.chat, { react: { text: '🧃', key: m.key } })
    await conn.sendMessage(
      m.chat,
      {
        text: text.trim(),
        footer: 'Menú de comandos 📑',
        headerType: 4
      },
      { quoted: m }
    )

  } catch (e) {
    console.error('❌ Error en el menú:', e)
    conn.reply(m.chat, '❎ Ocurrió un error al mostrar el menú.', m)
  }
}

handler.command = ['m', 'menu', 'help', 'ayuda']
handler.register = false
export default handler

// Utilidades
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
