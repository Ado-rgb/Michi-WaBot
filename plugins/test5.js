//[##]Creado por GianPoolS - github.com/GianPoolS
//[##]No quites los créditos

let handler = async (m, { conn }) => {
  // Preguntas tipo encuesta
  let encuestas = [
    {
      pregunta: "📘 ¿Quién es el creador de Doraemon?",
      opciones: ["Fujiko F. Fujio", "Akira Toriyama", "Osamu Tezuka"]
    },
    {
      pregunta: "📘 ¿Qué color era originalmente Doraemon?",
      opciones: ["Rojo", "Amarillo", "Verde"]
    },
    {
      pregunta: "📘 ¿Cuál es la comida favorita de Doraemon?",
      opciones: ["Dorayaki", "Sushi", "Ramen"]
    },
    {
      pregunta: "📘 ¿Cómo se llama el mejor amigo de Doraemon?",
      opciones: ["Nobita", "Suneo", "Shizuka"]
    },
    {
      pregunta: "📘 ¿De dónde viene Doraemon?",
      opciones: ["Del futuro", "De otro planeta", "De un laboratorio"]
    }
  ]

  // Enviar las 5 encuestas
  for (let e of encuestas) {
    await conn.sendMessage(m.chat, {
      poll: {
        name: e.pregunta,       // Título de la encuesta
        values: e.opciones,     // Opciones (string[])
        selectableCount: 1      // Solo 1 voto por persona
      }
    })
  }
}

handler.command = /^dora$/i
export default handler