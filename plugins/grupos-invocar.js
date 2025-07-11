const cleanId = (id = '') => id.replace(/\D/g, '');

const handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!m.isGroup) return m.reply('🔒 Este comando solo se usa en grupos.');

  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants || [];
  const ownerNumber = cleanId(groupMetadata.owner || '');

  const senderNumber = cleanId(m.sender);

  // Obtener admins reales con la función de Baileys
  const admins = await conn.groupAdmins(m.chat); // Array de JIDs admin

  // Validar si el que mandó el comando está en admins
  const isUserAdmin = admins.some(adminJid => cleanId(adminJid) === senderNumber) || senderNumber === ownerNumber;

  console.log(`Tu número: ${senderNumber}`);
  console.log('Admins del grupo:', admins);
  console.log(`¿Sos admin?: ${isUserAdmin}`);

  if (!isUserAdmin) return m.reply('❌ Solo los administradores pueden usar este comando.');

  // Continuamos si es admin
  const mainEmoji = global.db.data.chats[m.chat]?.customEmoji || '☕';
  const decoEmoji1 = '✨';
  const decoEmoji2 = '📢';

  m.react(mainEmoji);

  const mensaje = args.join(' ') || '¡Atención a todos!';
  const total = participants.length;

  const encabezado = 
`${decoEmoji2} *Mención general activada* ${decoEmoji2}

> 💬 Mensaje: *${mensaje}*
> 👥 Total de miembros: *${total}*
`;

  const cuerpo = participants.map(p => `> ${mainEmoji} @${cleanId(p.id)}`).join('\n');
  const pie = `\n${decoEmoji1} Comando ejecutado: *${usedPrefix + command}*`;

  const textoFinal = `${encabezado}\n${cuerpo}\n${pie}`;

  await conn.sendMessage(m.chat, {
    text: textoFinal.trim(),
    mentions: participants.map(p => p.id)
  });
};

handler.help = ['invocar *<mensaje opcional>*'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall'];
handler.group = true;
handler.register = true;

export default handler;