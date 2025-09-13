import { search, download } from 'aptoide-scraper'

var handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, `✩ Por favor, ingrese el nombre de la apk para descargarla.`, m)
    try {
        await m.react("🕓") 

        let searchA = await search(text)
        let data5 = await download(searchA[0].id)

        let txt = `> *_APT - DESCARGAS_*\n\n`
        txt += `✩ *Nombre*: ${data5.name}\n`
        txt += `✩ *Package*: ${data5.package}\n`
        txt += `✩ *Ultima Actualizacion*: ${data5.lastup}\n`
        txt += `✩ *Peso*: ${data5.size}`

        await conn.sendFile(m.chat, data5.icon, 'thumbnail.jpg', txt, m)

        if (data5.size.includes('GB') || parseFloat(data5.size.replace(' MB', '')) > 999) {
            await m.react(error) 
            return conn.reply(m.chat, `✩ El archivo es demasiado pesado, supera el límite permitido de descarga.`, m)
        }

        await conn.sendMessage(
            m.chat,
            {
                document: { url: data5.dllink },
                mimetype: 'application/vnd.android.package-archive',
                fileName: data5.name + '.apk',
                caption: `> ✩ Descarga completa.`
            },
            { quoted: fkontak }
        )

        await m.react(done) 
    } catch {
        await m.react(error)
        return conn.reply(m.chat, `✩ Ocurrió un fallo...`, m)
    }
}

handler.tags = ['descargas']
handler.help = ['apkmod']
handler.command = ['apk', 'modapk', 'aptoide']
handler.group = true

export default handler