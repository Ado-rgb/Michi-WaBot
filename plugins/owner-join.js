// Expresión regular para detectar enlaces de invitación a grupos de WhatsApp
const linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
let enviando;

const handler = async (m, {conn, text, isMods, isOwner, isPrems}) => {
  if (enviando) return; // Evita que se ejecute varias veces al mismo tiempo
  enviando = true 
  
  try {
    const link = text // Se toma el texto escrito como posible enlace
    if (!link || !link.match(linkRegex)) throw '⚠️ Debes proporcionar un enlace válido de grupo de WhatsApp.';

    const [_, code] = link.match(linkRegex) || [];
    
    // Si el usuario es Premium, Moderador, Dueño o el mismo bot, se une directo
    if (isPrems || isMods || isOwner || m.fromMe) {
      await conn.groupAcceptInvite(code);
      await conn.sendMessage(m.chat, {text: '✅ El bot se unió correctamente al grupo.'}, {quoted: m})
      enviando = false 
    } else {
      // Si no tiene permisos, avisa que no puede unirse y notifica al dueño
      await conn.sendMessage(m.chat, {text: '🚫 No tienes permisos para usar este comando. El dueño del bot revisará tu solicitud.'}, {quoted: m});
      const data = global.owner.filter(([id]) => id)[0];
      const dataArray = Array.isArray(data) ? data : [data];
      
      // Enviar mensaje al dueño con los detalles
      for (const entry of dataArray) {
        await conn.sendMessage(
          entry + '@s.whatsapp.net', 
          {
            text: `📩 El usuario @${m.sender.split('@')[0]} intentó invitar al bot a un grupo.\n\n*—◉ Link del grupo:* ${link}`, 
            mentions: [m.sender], 
            contextInfo: {
              forwardingScore: 9999999, 
              isForwarded: true, 
              mentionedJid: [m.sender], 
              externalAdReply: {
                showAdAttribution: true, 
                containsAutoReply: true, 
                renderLargerThumbnail: true, 
                title: global.author, 
                mediaType: 1, 
                thumbnail: './storage/img/menu2.jpg, 
                mediaUrl: `${link}`, 
                sourceUrl: `${link}`
              }
            }
          }, 
          {quoted: m}
        );
      }
      enviando = false 
    }
  } catch {
    enviando = false 
    throw '❌ Ocurrió un error al intentar procesar el enlace.';
  }
};

// Ayuda y configuración del comando
handler.help = ['unirme [enlace del grupo]'];
handler.tags = ['dueño'];
handler.command = /^join|nuevogrupo|unirme$/i;
handler.private = true;

export default handler;