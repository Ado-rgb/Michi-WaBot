const handler = async (m, { conn }) => {
  try {
    let txt = '';
    const groups = Object.entries(conn.chats).filter(
      ([jid, chat]) => jid.endsWith('@g.us') && chat.isChats
    );
    const totalGroups = groups.length;

    for (let i = 0; i < groups.length; i++) {
      const [jid] = groups[i];

      // Obtener metadata del grupo forzando la carga
      let groupMetadata;
      try {
        groupMetadata = await conn.groupMetadata(jid);
      } catch {
        groupMetadata = { participants: [] };
      }

      const participants = groupMetadata.participants || [];

      // Verificar si el bot está en el grupo
      const isParticipant = participants.some(
        (u) => conn.decodeJid(u.id) === conn.user.jid
      );

      // Verificar si el bot es admin
      const bot = participants.find(
        (u) => conn.decodeJid(u.id) === conn.user.jid
      );
      const isBotAdmin = !!(bot?.admin);

      const participantStatus = isParticipant ? '👤 Participante' : '❌ Ex participante';
      const totalParticipants = participants.length;

      // Generar link solo si el bot es admin
      let groupLink = '--- (No admin) ---';
      if (isBotAdmin) {
        try {
          groupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(jid) || '--- (Error) ---'}`;
        } catch {
          groupLink = '--- (Error) ---';
        }
      }

      txt += `*◉ Grupo ${i + 1}*
*➤ Nombre:* ${await conn.getName(jid)}
*➤ ID:* ${jid}
*➤ Admin:* ${isBotAdmin ? '✔ Sí' : '❌ No'}
*➤ Estado:* ${participantStatus}
*➤ Total de Participantes:* ${totalParticipants}
*➤ Link:* ${groupLink}\n\n`;
    }

    m.reply(`*Lista de grupos del Bot* 🤖\n\n*—◉ Total de grupos:* ${totalGroups}\n\n${txt}`.trim());
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