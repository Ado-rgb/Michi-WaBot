// --[#] Creado por Ado < github.com/Ado-rgb >
import axios from "axios";
import cheerio from "cheerio";
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default;

const base = "https://www.pinterest.com";
const search = "/resource/BaseSearchResource/get/";

const headers = {
  'accept': 'application/json, text/javascript, /, q=0.01',
  'referer': 'https://www.pinterest.com/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  'x-app-version': 'a9522f',
  'x-pinterest-appstate': 'active',
  'x-requested-with': 'XMLHttpRequest'
};

async function obtenerCookies() {
  try {
    const respuesta = await axios.get(base);
    const setHeaders = respuesta.headers['set-cookie'];
    if (setHeaders) return setHeaders.map(c => c.split(';')[0].trim()).join('; ');
    return null;
  } catch {
    return null;
  }
}

async function buscarPinterest(query) {
  if (!query) return { status: false, message: "⚠️ Ingresa un término de búsqueda válido" };
  try {
    const cookies = await obtenerCookies();
    if (!cookies) return { status: false, message: "❌ No se pudieron obtener las cookies" };

    const params = {  
      source_url: `/search/pins/?q=${query}`,  
      data: JSON.stringify({  
        options: { isPrefetch: false, query, scope: "pins", bookmarks: [""], page_size: 10 },  
        context: {}  
      }),  
      _: Date.now()  
    };  

    const { data } = await axios.get(`${base}${search}`, { headers: { ...headers, 'cookie': cookies }, params });  
    const resultados = data.resource_response.data.results.filter(v => v.images?.orig);  
    if (resultados.length === 0) return { status: false, message: `⚠️ No se encontraron resultados para: ${query}` };  

    return {  
      status: true,  
      pins: resultados.map(pin => ({  
        id: pin.id,  
        title: pin.title || "Sin título",  
        description: pin.description || "Sin descripción",  
        pin_url: `https://pinterest.com/pin/${pin.id}`,  
        image: pin.images.orig.url,  
        uploader: {  
          username: pin.pinner.username,  
          full_name: pin.pinner.full_name,  
          profile_url: `https://pinterest.com/${pin.pinner.username}`  
        }  
      }))  
    };

  } catch {
    return { status: false, message: "❌ Ocurrió un error al buscar" };
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🌾 \`Ejemplo:\` ${usedPrefix + command} gatito`);

  await conn.sendMessage(m.chat, { react: { text: '🦀', key: m.key } });

  async function crearImagen(url) {
    const { imageMessage } = await generateWAMessageContent({ image: { url } }, { upload: conn.waUploadToServer });
    return imageMessage;
  }

  function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  let resultado = await buscarPinterest(text);
  if (!resultado.status) return m.reply(`⚠️ ${resultado.message}`);

  let pins = resultado.pins.slice(0, 10);
  mezclarArray(pins);

  let cards = [];
  let i = 1;
  for (let pin of pins) {
    let imageUrl = pin.image;
    cards.push({
      header: { type: 4, imageMessage: await crearImagen(imageUrl) }, // type 4 = image
      title: `💚 Imagen ${i++}`,
      description: `✧ *Título:* ${pin.title}\n » *Descripción:* ${pin.description}\n› *Autor:* ${pin.uploader.full_name} (@${pin.uploader.username})`,
      rowId: `url_${pin.id}`, 
      buttonText: "🦖 Ver en Pinterest",
      url: pin.pin_url 
    });
  }

  const message = generateWAMessageFromContent(m.chat, {
    templateMessage: {
      hydratedTemplate: {
        hydratedContentText: "🥞 Búsqueda completada",
        locationMessage: { jpegThumbnail: Buffer.alloc(0) },
        hydratedButtons: [],
        hydratedTemplateId: "",
        contextInfo: { mentionedJid: [] },
        listMessage: { title: "Pinterest", description: "Resultados", buttonText: "Selecciona una imagen", sections: [{ title: "Resultados", rows: cards }] }
      }
    }
  }, {});

  await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
};

handler.help = ['pinterest'];
handler.tags = ['search'];
handler.command = /^(pinterest)$/i;

export default handler;
