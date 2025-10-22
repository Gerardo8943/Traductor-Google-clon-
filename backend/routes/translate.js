import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let { text, sourceLanguage, targetLanguage } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    // Si no hay idioma origen, usar 'auto'
    const from = sourceLanguage || "auto";

    const to =
      targetLanguage === "auto"
        ? from === "es"
          ? "en"
          : "es"
        : targetLanguage;

    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const translatedText =
      data[0].map((item) => item[0]).join("") || "Traducción no disponible";
    res.json({ translatedText });
  } catch (error) {
    console.error("Error en la traducción:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

export default router;
