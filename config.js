import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['50493732693', 'Ado', true],
  ['51956931649'],
  ['156981591593126'],
  ['595972314588'],
]

global.mods = []
global.prems = []

global.namebot = '🪲 𝖬𝗂𝖼𝗁𝗂 - BOT'
global.packname = '🐥 𝖬𝗂𝖼𝗁𝗂𝖬𝖣'
global.author = '𝖡𝗎𝗂𝗅𝗍 𝖡𝖸 𝖠𝖽𝗈 | © 2025'
global.moneda = '𝖬𝖺𝗇𝗓𝖺𝗇𝖺𝗌 🍎'
global.api = { 
url: 'https://myapiadonix.casacam.net',
key: 'Adofreekey'
}


global.libreria = 'Baileys'
global.baileys = 'Personalizada'
global.vs = '2.2.0'
global.sessions = 'Sessions'
global.jadi = 'JadiBots'
global.yukiJadibts = true

global.namecanal = '❇️'
global.idcanal = '120363403739366547@newsletter'
global.idcanal2 = '120363403739366547@newsletter'
global.canal = 'https://whatsapp.com/channel/0029Vb5pM031CYoMvQi2I02D'
global.canalreg = '120363402895449162@newsletter'

global.ch = {
  ch1: '120363420941524030@newsletter'
}

global.multiplier = 69
global.maxwarn = 2

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("🔄 Se actualizó 'config.js'"))
  import(`file://${file}?update=${Date.now()}`)
})
