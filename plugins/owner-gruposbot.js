const handler = async (m, { conn }) => {
  try {
    const groups = Object.entries(conn.chats).filter(
      ([jid, chat]) => jid.endsWith('@g.us') && chat.isChats
    );
    const totalGroups = groups.length;

    // Obtener info de todos los grupos en paralelo
    const groupInfoList = await Promise.all(
      groups.map(async ([jid], index) => {
        let participants = [];
        try {
          const metadata = await conn.groupMetadata(jid);
          participants = metadata.participants || [];
        } catch {
          participants = [];
        }

        const isParticipant = participants.some(
          (u) => conn.decodeJid(u.id) === conn.user.jid
        );

        const bot = participants.find(
          (u) => conn.decodeJid(u.id) === conn.user.jid
        );
        const isBotAdmin = !!(bot?.admin);

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

        return `*◉ Grupo ${index + 1}*
*➤ Nombre:* ${await conn.getName(jid)}
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