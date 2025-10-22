import { $, $$ } from "./dom.js";

//Clase principal del traductor donde se manejan todas las funcionalidades
class GoogleTranslator {
  static FULL_LANGUAGE_CODES = {
    auto: "auto",
    af: "af",
    sq: "sq",
    am: "am",
    ar: "ar",
    hy: "hy",
    az: "az",
    eu: "eu",
    be: "be",
    bn: "bn",
    bs: "bs",
    bg: "bg",
    ca: "ca",
    ceb: "ceb",
    zh: "zh",
    "zh-CN": "zh-CN",
    "zh-TW": "zh-TW",
    hr: "hr",
    cs: "cs",
    da: "da",
    nl: "nl",
    en: "en",
    eo: "eo",
    et: "et",
    fi: "fi",
    fr: "fr",
    gl: "gl",
    ka: "ka",
    de: "de",
    el: "el",
    gu: "gu",
    ht: "ht",
    ha: "ha",
    haw: "haw",
    he: "he",
    hi: "hi",
    hmn: "hmn",
    hu: "hu",
    is: "is",
    ig: "ig",
    id: "id",
    ga: "ga",
    it: "it",
    ja: "ja",
    jw: "jw",
    kn: "kn",
    kk: "kk",
    km: "km",
    ko: "ko",
    ku: "ku",
    ky: "ky",
    lo: "lo",
    la: "la",
    lv: "lv",
    lt: "lt",
    lb: "lb",
    mk: "mk",
    mg: "mg",
    ms: "ms",
    ml: "ml",
    mt: "mt",
    mi: "mi",
    mr: "mr",
    mn: "mn",
    my: "my",
    ne: "ne",
    no: "no",
    ny: "ny",
    ps: "ps",
    fa: "fa",
    pl: "pl",
    pt: "pt",
    pa: "pa",
    ro: "ro",
    ru: "ru",
    sm: "sm",
    gd: "gd",
    sr: "sr",
    st: "st",
    sn: "sn",
    sd: "sd",
    si: "si",
    sk: "sk",
    sl: "sl",
    so: "so",
    es: "es",
    su: "su",
    sw: "sw",
    sv: "sv",
    tl: "tl",
    tg: "tg",
    ta: "ta",
    te: "te",
    th: "th",
    tr: "tr",
    uk: "uk",
    ur: "ur",
    uz: "uz",
    vi: "vi",
    cy: "cy",
    xh: "xh",
    yi: "yi",
    yo: "yo",
    zu: "zu",
  };

  //Metodo constructor para las funcionalidades del traductor
  constructor() {
    this.inputText = $("#inputText");
    this.outputText = $("#outputText");
    this.sourceLanguage = $("#sourceLanguage");
    this.targetLanguage = $("#targetLanguage");
    this.swapLanguages = $("#swapLanguages");
    this.copyButton = $("#copyButton");
    this.speakerButton = $("#speakerButton");
    this.micButton = $("#micButton");

    this.recognition = null;
    this.isRecognizing = false;

    this.setupEventListeners();
  }

  //Configuración de los eventos para los elementos del DOM
  setupEventListeners() {
    let typingTimer;
    this.inputText.addEventListener("input", () => {
      clearTimeout(typingTimer);
      this.showTranslating();
      typingTimer = setTimeout(() => this.translate(), 600);
    });

    this.sourceLanguage.addEventListener("change", () =>
      this.handleLangChange()
    );
    this.targetLanguage.addEventListener("change", () =>
      this.handleLangChange()
    );

    this.swapLanguages.addEventListener("click", () => this.swapLangs());
    this.copyButton.addEventListener("click", () => this.copyOutput());
    this.speakerButton.addEventListener("click", () => this.speakText());
    this.micButton.addEventListener("click", () => this.toggleMic());
  }
  handleLangChange() {
    if (this.inputText.value.trim()) {
      this.showTranslating();
      this.translate();
    }
  }

  showTranslating() {
    this.outputText.innerHTML = `<span class="loading">Traduciendo<span class="dots">...</span></span>`;
  }

  async translate() {
    const text = this.inputText.value.trim();
    if (!text) {
      this.outputText.textContent = "";
      return;
    }

    const from = this.sourceLanguage.value;
    const to = this.targetLanguage.value;

    try {
      //Endpoint Api de Google Translate
      const response = await fetch("http://localhost:5000/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          sourceLanguage: from,
          targetLanguage: to,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al conectar con el servidor");
      }

      const data = await response.json();
      this.outputText.textContent = data.translatedText || "Error al traducir";
    } catch (error) {
      console.error("Error en la traducción:", error);
      this.outputText.innerHTML = `<span class="error"> No se pudo traducir. Intenta nuevamente.</span>`;
    }
  }

  swapLangs() {
    let from = this.sourceLanguage.value;
    let to = this.targetLanguage.value;

    let newFrom = to;

    let newTo = from === "auto" ? (to === "es" ? "en" : "es") : from;

    this.sourceLanguage.value = newFrom;
    this.targetLanguage.value = newTo;

    const translatedText = this.outputText.textContent.trim();
    if (translatedText) {
      this.inputText.value = translatedText;
      this.showTranslating();
      this.translate();
    }
  }

  copyOutput() {
    const text = this.outputText.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copyButton.classList.add("copied");
      this.copyButton.title = "Copiado ✅";
      setTimeout(() => {
        this.copyButton.classList.remove("copied");
        this.copyButton.title = "Copiar texto";
      }, 1500);
    });
  }

  //Funcion para reproducir el texto a audio
  speakText() {
    const text = this.outputText.textContent;
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.targetLanguage.value || "en";
    speechSynthesis.speak(utterance);
  }

  toggleMic() {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    if (!this.recognition) {
      const Recognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new Recognition();
      this.recognition.lang = this.sourceLanguage.value || "es";
      this.recognition.interimResults = false;

      this.recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        this.inputText.value = text;
        this.showTranslating();
        this.translate();
      };

      this.recognition.onend = () => {
        this.isRecognizing = false;
        this.micButton.classList.remove("listening");
      };
    }

    if (this.isRecognizing) {
      this.recognition.stop();
      this.isRecognizing = false;
      this.micButton.classList.remove("listening");
    } else {
      this.recognition.lang = this.sourceLanguage.value || "es";
      this.recognition.start();
      this.isRecognizing = true;
      this.micButton.classList.add("listening");
    }
  }
}

new GoogleTranslator();
