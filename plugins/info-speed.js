import { totalmem, freemem } from 'os'
import osu from 'node-os-utils'
import { sizeFormatter } from 'human-readable'
import { performance } from 'perf_hooks'

const cpu = osu.cpu
const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`
})

var handler = async (m, { conn }) => {
  // Latencia real con microsegundos
  let start = performance.now()
  if (conn.sendPresenceUpdate) await conn.sendPresenceUpdate('composing', m.chat)
  let latency = (performance.now() - start).toFixed(4) // Ej: 0.9999 ms

  // Uptime
  let totalMs = process.uptime() * 1000
  let muptime = clockString(totalMs)

  // Chats
  let chats = Object.values(conn.chats).filter(chat => chat.isChats)
  let groups = Object.entries(conn.chats)
    .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)
    .map(([jid]) => jid)

  // Uso de CPU
  let cpuUsage = await cpu.usage()  // porcentaje

  // Fecha y hora actual de Perú (sin mostrar la palabra Perú)
  const now = new Date()
  const opcionesHora = { hour12: true, hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' }
  const opcionesFecha = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Lima' }

  let fecha = now.toLocaleDateString('es-PE', opcionesFecha)
  let hora = now.toLocaleTimeString('es-PE', opcionesHora)

  let texto = `
⚡ *Estado del Bot*

📡 *Velocidad de Respuesta:*  
→ _${latency} ms_

⏱️ *Tiempo Activo:*  
→ _${muptime}_

💬 *Chats Activos:*  
→ 👤 _${chats.length}_ chats privados  
→ 👥 _${groups.length}_ grupos

🖥️ *Uso de RAM:*  
→ 💾 _${format(totalmem() - freemem())}_ / _${format(totalmem())}_

⚙️ *Uso de CPU:*  
→ _${cpuUsage.toFixed(2)} %_

📊 Fecha y Hora
→ ${fecha}
→ ${hora}
`.trim()

  if (m.react) m.react('✈️')
  conn.reply(m.chat, texto, m)
}

handler.help = ['speed']
handler.tags = ['info']
handler.command = ['speed','sped']

export default handler

function clockString(ms) {
  if (isNaN(ms)) return '--d --h --m --s'
  let d = Math.floor(ms / 86400000) // días
  let h = Math.floor((ms % 86400000) / 3600000) // horas
  let m = Math.floor((ms % 3600000) / 60000) // minutos
  let s = Math.floor((ms % 60000) / 1000) // segundos
  return `${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`
}



/*import { totalmem, freemem } from 'os'
import os from 'os'
import util from 'util'
import osu from 'node-os-utils'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'
import speed from 'performance-now'
import { spawn, exec, execSync } from 'child_process'

const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`
})

var handler = async (m, { conn }) => {
  let timestamp = speed()
  let latensi = speed() - timestamp

  let _muptime = process.uptime() * 1000
  let muptime = clockString(_muptime)

  let chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  let groups = Object.entries(conn.chats)
    .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce)
    .map(v => v[0])

  let texto = `
⚡ *Estado del Bot*

📡 *Velocidad de Respuesta:*  
→ _${latensi.toFixed(4)} ms_

⏱️ *Tiempo Activo:*  
→ _${muptime}_

💬 *Chats Activos:*  
→ 👤 _${chats.length}_ chats privados  
→ 👥 _${groups.length}_ grupos

🖥️ *Uso de RAM:*  
→ 💾 _${format(totalmem() - freemem())}_ / _${format(totalmem())}_
`.trim()

  m.react('✈️')
  conn.reply(m.chat, texto, m)
}

handler.help = ['speed']
handler.tags = ['info']
handler.command = ['speed','sped']
handler.register = false

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}*/
