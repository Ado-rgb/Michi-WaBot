//[##]Creado por GianPoolS - github.com/GianPoolS
//[##]No quites los créditos

// Guardamos progreso por cada chat/grupo
let progreso = {}

let handler = async (m, { conn, usedPrefix, command }) => {
  let id = m.chat

  // 20 preguntas tipo encuesta
  let encuestas = [
    { pregunta: "📘 ¿Quién es el creador de Doraemon?", opciones: ["Fujiko F. Fujio", "Akira Toriyama", "Osamu Tezuka"] },
    { pregunta: "📘 ¿Qué color era originalmente Doraemon?", opciones: ["Rojo", "Amarillo", "Verde"] },
    { pregunta: "📘 ¿Cuál es la comida favorita de Doraemon?", opciones: ["Dorayaki", "Sushi", "Ramen"] },
    { pregunta: "📘 ¿Cómo se llama el mejor amigo de Doraemon?", opciones: ["Nobita", "Suneo", "Shizuka"] },
    { pregunta: "📘 ¿De dónde viene Doraemon?", opciones: ["Del futuro", "De otro planeta", "De un laboratorio"] },
    { pregunta: "📘 ¿Quién es la hermana pequeña de Nobita?", opciones: ["Shizuka", "Dorami", "Takeshi"] },
    { pregunta: "📘 ¿Qué relación tiene Dorami con Doraemon?", opciones: ["Hermana", "Prima", "Amiga"] },
    { pregunta: "📘 ¿Cuál es el nombre completo de Nobita?", opciones: ["Nobita Nobi", "Nobita Tanaka", "Nobita Yamamoto"] },
    { pregunta: "📘 ¿Qué invento usa Doraemon para volar?", opciones: ["Bambuleo", "Helicóptero de bolsillo", "Ala mágica"] },
    { pregunta: "📘 ¿Quién es el bravucón del grupo?", opciones: ["Gian", "Suneo", "Dekisugi"] },
    { pregunta: "📘 ¿Cómo se llama la máquina del tiempo de Doraemon?", opciones: ["El cajón del escritorio", "La puerta mágica", "El televisor del tiempo"] },
    { pregunta: "📘 ¿Cuál es la mayor debilidad de Doraemon?", opciones: ["Los ratones", "El agua", "El fuego"] },
    { pregunta: "📘 ¿Quién suele ayudar a Nobita con las tareas?", opciones: ["Shizuka", "Dekisugi", "Gian"] },
    { pregunta: "📘 ¿Qué usa Doraemon para abrir cualquier lugar?", opciones: ["Llave mágica", "Puerta mágica", "Ventana secreta"] },
    { pregunta: "📘 ¿En qué país se originó Doraemon?", opciones: ["Japón", "China", "Corea"] },
    { pregunta: "📘 ¿Qué forma tiene el bolsillo de Doraemon?", opciones: ["Circular", "Cuadrado", "Triangular"] },
    { pregunta: "📘 ¿Cuál es el sueño de Nobita?", opciones: ["Casarse con Shizuka", "Ser inventor", "Viajar al espacio"] },
    { pregunta: "📘 ¿Qué animal odia Doraemon?", opciones: ["Ratones", "Gatos", "Perros"] },
    { pregunta: "📘 ¿Cuál es el nombre real de Shizuka?", opciones: ["Shizuka Minamoto", "Shizuka Tanaka", "Shizuka Suzuki"] },
    { pregunta: "📘 ¿Qué usa Doraemon para viajar en el tiempo?", opciones: ["El cajón del escritorio", "La máquina de bolsillo", "El reloj del tiempo"] }
  ]

  // Inicializamos progreso si no existe
  if (!progreso[id]) progreso[id] = { index: 0 }

  let index = progreso[id].index

  // Si ya se mandaron todas las preguntas -> reinicia en silencio
  if (index >= encuestas.length) {
    progreso[id].index = 0 // 🔄 reinicia automáticamente sin mensaje
    index = 0
  }

  // Mandar la encuesta actual
  let e = encuestas[index]
  await conn.sendMessage(m.chat, {
    poll: {
      name: e.pregunta,
      values: e.opciones,
      selectableCount: 1
    }
  })

  // Mandar botones para continuar
  await conn.sendMessage(m.chat, {
    text: "", //👉 Pulsa el botón para la siguiente pregunta
    footer: "", //Doraemon Quiz
    buttons: [
      { buttonId: `${usedPrefix + command}`, buttonText: { displayText: "📩 Siguiente" }, type: 1 }
    ],
    headerType: 1
  })

  // Pasar a la siguiente para el próximo .dora
  progreso[id].index++
}

handler.command = /^dora$/i
export default handler