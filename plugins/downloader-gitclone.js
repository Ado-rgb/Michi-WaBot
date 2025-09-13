import fetch from 'node-fetch'

const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i

let handler = async (m, { args, conn }) => {
  const emoji = '⚡'
  const emoji2 = '❌'
  const rwait = '⏳'
  const done = '✅'
  const error = '❌'
  const wait = '⌛ Obteniendo información...'
  const dev = 'Ado'

  if (!args[0]) {
    return conn.reply(m.chat, `✦ Ingresa la URL de un *repositorio de GitHub* que quieras descargar.`, m)
  }

  if (!regex.test(args[0])) {
    await conn.reply(m.chat, `✦ Verifica que la *URL* sea válida de GitHub 🐙`, m)
    return m.react(error)
  }

  const [_, user, repo] = args[0].match(regex) || []
  const sanitizedRepo = repo.replace(/.git$/, '')

  const repoUrl = `https://api.github.com/repos/${user}/${sanitizedRepo}`
  const zipUrl = `https://api.github.com/repos/${user}/${sanitizedRepo}/zipball`

  await m.react(rwait)
  conn.reply(m.chat, wait, m)

  try {
    const [repoResponse, zipResponse] = await Promise.all([fetch(repoUrl), fetch(zipUrl)])
    const repoData = await repoResponse.json()
    const disposition = zipResponse.headers.get('content-disposition')
    const filenameMatch = disposition?.match(/attachment; filename=(.*)/)
    const filename = filenameMatch ? filenameMatch[1] : `${sanitizedRepo}.zip`
    const img = 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745610598914.jpeg'

    let txt = `> *_Repositorio de GitHub_* 
✩ *Nombre*: ${sanitizedRepo}
✩ *Repositorio*: ${user}/${sanitizedRepo}
✩ *Creador*: ${repoData.owner.login}
✩ *Descripción*: ${repoData.description || 'Sin descripción disponible'}
✩ *URL*: ${args[0]}`

    await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m)
    await conn.sendFile(m.chat, await zipResponse.buffer(), filename, null, m, rcanal)
    await m.react(done)

  } catch (err) {
    console.error(err)
    await m.react(error)
    conn.reply(m.chat, '❌ Ocurrió un error al intentar descargar el repositorio.', m)
  }
}

handler.help = ['gitclone']
handler.tags = ['downloader']
handler.command = ['gitclone']

export default handler