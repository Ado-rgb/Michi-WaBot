import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) return conn.reply(m.chat, `🦁 Responde a un archivo válido, ya sea imagen, video, etc..`, m);
  
  await m.react("🗂");
  
  try {
    let media = await q.download();
    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
    let link = await catbox(media);
    
    let txt `> *🐣 𝖲𝖴𝖡𝖨𝖣𝖠 𝖤𝖷𝖨𝖳𝖮𝖲𝖠*\n\n`;
    txt += `*🐛 Link* » ${link}\n`;
    txt += `*🎍 Tamaño total* » ${formatBytes(media.length)}\n`;
    txt += `*🐊 Expira en* »${isTele ? 'No expira' : 'Desconocido'}\n\n`;
    
    await conn.sendFile(m.chat, media, 'thumbnail.jpg', txt, m, rcanal);
    
    await m.react("✅");
  } catch {
    await m.react("✖️");
  }
};

handler.help = ['tourl'];
handler.tags = ['tools'];
handler.command = ['catbox', 'tourl'];
export default handler;

function formatBytes(bytes) {
  if (bytes === 0) {
    return '0 B';
  }
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function catbox(content) {
  const { ext, mime } = (await fileTypeFromBuffer(content)) || {};
  const blob = new Blob([content.toArrayBuffer()], { type: mime });
  const formData = new FormData();
  const randomBytes = crypto.randomBytes(5).toString("hex");
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomBytes + "." + ext);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    },
  });

  return await response.text();
}
