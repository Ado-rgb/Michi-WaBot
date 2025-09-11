//--> Hecho por GianPoolS (github.com/GianPoolS)

let handler = async (m, { conn }) => {
  // Preguntas tipo encuesta
  let encuestas = [
    {
      name: "📘 ¿Quién es el creador de Doraemon?",
      options: ["A) Fujiko F. Fujio", "B) Akira Toriyama", "C) Osamu Tezuka"]
    },
    {
      name: "📘 ¿Qué color era originalmente Doraemon?",
      options: ["A) Rojo", "B) Amarillo", "C) Verde"]
    },
    {
      name: "📘 ¿Cuál es la comida favorita de Doraemon?",
      options: ["A) Dorayaki", "B) Sushi", "C) Ramen"]
    },
    {
      name: "📘 ¿Cómo se llama el mejor amigo de Doraemon?",
      options: ["A) Nobita", "B) Suneo", "C) Shizuka"]
    },
    {
      name: "📘 ¿De dónde viene Doraemon?",
      options: ["A) Del futuro", "B) De otro planeta", "C) De un laboratorio"]
    }
  ]

  // Enviar las 5 encuestas una por una
  for (let e of encuestas) {
    await conn.sendMessage(m.chat, {
      poll: {
        name: e.name,
        options: e.options,
        selectableOptionsCount: 1 // Solo una opción por persona
      }
    })
  }
}

handler.command = /^dora$/i
export default handler