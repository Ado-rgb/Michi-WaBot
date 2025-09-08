const handler = async (m, { conn }) => {
  try {
    // Filtrar solo grupos
    const groups = Object.entries(conn.chats).filter(
      ([jid, chat]) => jid.endsWith('@g.us') && chat.isChats
    );

    const totalGroups = groups.length;

    // Obtener info de todos los grupos en paralelo
    const groupInfoList = await Promise.all(
      groups.map(async ([jid], index) => {
        // Intentar obtener metadata real del grupo
        let participants = [];
        try {
          const metadata = await conn.groupMetadata(jid);
          participants = metadata.participants || [];
        } catch {
          participants = [];
        }

        // Verificar si el bot está en el grupo
        const botJid = conn.user.jid;
        const isParticipant = participants.some(p => conn.decodeJid(p.id) === botJid);

        // Verificar si el bot es admin
        const bot = participants.find(p => conn.decodeJid(p.id) === botJid);
        const isBotAdmin = !!(bot?.admin);

        // Generar link solo si es admin
        let groupLink = '--- (No admin) ---';
        if (isBotAdmin) {
          try {
            groupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(jid) || '--- (Error) ---'}`;
          } catch {
            groupLink = '--- (Error) ---';
          }
        }

        const totalParticipants = participants.length;
        const participantStatus = isParticipant ? '👤 Participante' : '❌ Ex participante';
        const groupName = await conn.getName(jid);

        return `*◉ Grupo ${index + 1}*
*➤ Nombre:* ${groupName}
*➤ ID:* ${jid}
*➤ Admin:* ${isBotAdmin ? '✔ Sí' : '❌ No'}
*➤ Estado:* ${participantStatus}
*➤ Total de Participantes:* ${totalParticipants}
*➤ Link:* ${groupLink}\n\n`;
      })
    );

    m.reply(`*Lista de grupos del Bot* 🤖\n\n*—◉ Total de grupos:* ${totalGroups}\n\n${groupInfoList.join('')}`.trim());

  } catch (err) {
    console.error(err);
    m.reply('❌ Ocurrió un error al obtener la lista de grupos.');
  }
};

handler.help = ['grups'];
handler.tags = ['bot'];
handler.command = ['grups'];
handler.rowner = true;
handler.private = true;

export default handler;