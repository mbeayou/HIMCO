const root = document.documentElement;
const body = document.body;
const header = document.querySelector("[data-header]");
const languageSwitch = document.querySelector("[data-language-switch]");
const railPhoton = document.querySelector("[data-rail-photon]");
const heroImage = document.querySelector("[data-hero-image]");
const heroCopy = document.querySelector("[data-hero-copy]");
const proofImage = document.querySelector("[data-proof-image]");
const whatsappLinks = document.querySelectorAll(".whatsapp-link");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileViewport = window.matchMedia("(max-width: 760px)");

const translations = {
  ar: {
    lang: "ar",
    dir: "rtl",
    switchText: "EN",
    switchLabel: "Switch to English",
    whatsappMessage: "مرحباً شركة الحماية، أود الحصول على تقييم أولي لمنظومة طاقة شمسية.",
    whatsappLabel: "احصل على تقييم أولي عبر واتساب",
    title: "HIMCO | طاقة تتحرك معك",
    description: "HIMCO - تصميم وتوريد وتركيب منظومات الطاقة الشمسية في بنغازي، ليبيا.",
  },
  en: {
    lang: "en",
    dir: "ltr",
    switchText: "ع",
    switchLabel: "التبديل إلى العربية",
    whatsappMessage: "Hello HIMCO, I would like an initial assessment for a solar energy system.",
    whatsappLabel: "Get an initial assessment on WhatsApp",
    title: "HIMCO | Power in motion",
    description: "HIMCO designs, supplies and installs complete solar energy systems in Benghazi, Libya.",
  },
};

let currentLanguage = "ar";
let scrollTicking = false;
let counterStarted = false;

try {
  currentLanguage = localStorage.getItem("himco-language") === "en" ? "en" : "ar";
} catch {
  currentLanguage = "ar";
}

function updateWhatsAppLinks(language) {
  const message = encodeURIComponent(translations[language].whatsappMessage);
  const url = `https://wa.me/218926155231?text=${message}`;

  whatsappLinks.forEach((link) => {
    link.href = url;
    link.setAttribute("aria-label", translations[language].whatsappLabel);
  });
}

function splitText(element) {
  const text = element.dataset[currentLanguage] || element.textContent.trim();
  const words = text.split(/\s+/);
  element.replaceChildren();

  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "word";
    span.style.setProperty("--word-index", index);
    span.textContent = word;
    element.append(span);
    if (index < words.length - 1) element.append(document.createTextNode(" "));
  });
}

function setLanguage(language) {
  const config = translations[language];
  currentLanguage = language;
  root.lang = config.lang;
  root.dir = config.dir;
  document.title = config.title;
  document.querySelector('meta[name="description"]').content = config.description;

  document.querySelectorAll("[data-ar][data-en]:not([data-split-text])").forEach((element) => {
    element.textContent = element.dataset[language];
  });

  document.querySelectorAll("[data-split-text]").forEach(splitText);
  languageSwitch.querySelector("span").textContent = config.switchText;
  languageSwitch.setAttribute("aria-label", config.switchLabel);
  updateWhatsAppLinks(language);

  try {
    localStorage.setItem("himco-language", language);
  } catch {
    // File previews can block storage; the language still works for this session.
  }
}

function setFlowState(index) {
  const stage = document.querySelector("[data-flow-stage]");
  const steps = document.querySelectorAll("[data-flow-step]");
  const nodes = document.querySelectorAll("[data-node]");
  const count = document.querySelector("[data-flow-count]");
  const output = document.querySelector("[data-output-number]");
  const outputValues = ["08.4", "07.9", "06.8", "06.2"];

  stage.dataset.flowStage = index;
  stage.style.setProperty("--flow-progress", `${(index / 3) * 100}%`);
  count.textContent = `${String(index + 1).padStart(2, "0")} / 04`;
  output.textContent = outputValues[index];

  steps.forEach((step, stepIndex) => step.classList.toggle("active", stepIndex === index));
  nodes.forEach((node, nodeIndex) => node.classList.toggle("active", nodeIndex <= index));
}

function animateCounter(element) {
  if (counterStarted) return;
  counterStarted = true;
  const target = Number(element.dataset.count || 0);

  if (reduceMotion.matches) {
    element.textContent = target;
    return;
  }

  const duration = 1300;
  const start = performance.now();
  const tick = (time) => {
    const progress = Math.min(1, (time - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0;

  header.classList.toggle("is-scrolled", scrollTop > 30);
  railPhoton.style.top = `${progress * 100}%`;

  if (!reduceMotion.matches) {
    const heroProgress = Math.min(1, scrollTop / Math.max(1, window.innerHeight));
    const mobileMultiplier = mobileViewport.matches ? 0.42 : 1;
    heroImage.style.transform = `translate3d(0, ${heroProgress * 65 * mobileMultiplier}px, 0) scale(${1 + heroProgress * 0.06})`;
    heroCopy.style.transform = `translate3d(0, ${heroProgress * -48 * mobileMultiplier}px, 0)`;
    heroCopy.style.opacity = String(Math.max(0.22, 1 - heroProgress * 0.82));

    if (proofImage) {
      const rect = proofImage.parentElement.getBoundingClientRect();
      const proofProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const clamped = Math.min(1, Math.max(0, proofProgress));
      proofImage.style.transform = `translate3d(0, ${(clamped - 0.5) * 70 * mobileMultiplier}px, 0) scale(1.06)`;
    }
  }

  scrollTicking = false;
}

function requestScrollUpdate() {
  if (!scrollTicking) {
    requestAnimationFrame(updateScrollEffects);
    scrollTicking = true;
  }
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      if (entry.target.dataset.count) animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -7% 0px" },
);

const flowObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setFlowState(Number(visible.target.dataset.flowStep));
  },
  { threshold: [0.3, 0.55, 0.75], rootMargin: "-18% 0px -30% 0px" },
);

function setupMagneticButtons() {
  if (mobileViewport.matches || reduceMotion.matches) return;

  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.1;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
      button.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

setLanguage(currentLanguage);
document.querySelectorAll(".reveal, [data-split-text], [data-count]").forEach((element) => revealObserver.observe(element));
document.querySelectorAll("[data-flow-step]").forEach((step) => flowObserver.observe(step));
document.querySelector("[data-year]").textContent = new Date().getFullYear();
setFlowState(0);
setupMagneticButtons();

languageSwitch.addEventListener("click", () => setLanguage(currentLanguage === "ar" ? "en" : "ar"));
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate, { passive: true });
reduceMotion.addEventListener("change", requestScrollUpdate);

requestAnimationFrame(() => {
  requestAnimationFrame(() => body.classList.add("is-ready"));
});
updateScrollEffects();
