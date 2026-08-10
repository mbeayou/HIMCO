const root = document.documentElement;
const body = document.body;
const header = document.querySelector("[data-header]");
const languageSwitch = document.querySelector("[data-language-switch]");
const progressBar = document.querySelector(".scroll-progress span");
const translatableElements = document.querySelectorAll("[data-ar][data-en]");
const whatsappLinks = document.querySelectorAll(".whatsapp-link");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileViewport = window.matchMedia("(max-width: 760px)");

const translations = {
  ar: {
    lang: "ar",
    dir: "rtl",
    switchText: "EN",
    switchLabel: "Switch to English",
    whatsappMessage: "مرحباً شركة الحماية، أود طلب عرض سعر لمنظومة طاقة شمسية.",
    whatsappLabel: "اطلب عرض سعر عبر واتساب",
    title: "HIMCO | الحماية للطاقة المتجددة",
    description: "شركة الحماية للطاقة المتجددة - تصميم وتركيب وبيع منظومات الطاقة الشمسية في بنغازي، ليبيا.",
  },
  en: {
    lang: "en",
    dir: "ltr",
    switchText: "ع",
    switchLabel: "التبديل إلى العربية",
    whatsappMessage: "Hello HIMCO, I would like to request a quote for a solar energy system.",
    whatsappLabel: "Request a quote on WhatsApp",
    title: "HIMCO | Renewable Energy Solutions",
    description: "HIMCO Renewable Energy - solar system design, supply and installation in Benghazi, Libya.",
  },
};

let currentLanguage = localStorage.getItem("himco-language") === "en" ? "en" : "ar";
let ticking = false;

function updateWhatsAppLinks(language) {
  const message = encodeURIComponent(translations[language].whatsappMessage);
  const url = `https://wa.me/218926155231?text=${message}`;

  whatsappLinks.forEach((link) => {
    link.href = url;
    link.setAttribute("aria-label", translations[language].whatsappLabel);
  });
}

function setLanguage(language, animate = true) {
  const config = translations[language];
  currentLanguage = language;

  if (animate) body.classList.add("language-changing");

  window.setTimeout(() => {
    root.lang = config.lang;
    root.dir = config.dir;
    document.title = config.title;
    document.querySelector('meta[name="description"]').content = config.description;

    translatableElements.forEach((element) => {
      element.textContent = element.dataset[language];
    });

    languageSwitch.querySelector("span").textContent = config.switchText;
    languageSwitch.setAttribute("aria-label", config.switchLabel);
    updateWhatsAppLinks(language);
    localStorage.setItem("himco-language", language);
    body.classList.remove("language-changing");
  }, animate ? 120 : 0);
}

function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? scrollTop / scrollable : 0;

  header.classList.toggle("is-scrolled", scrollTop > 24);
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;

  if (!reduceMotion.matches && !mobileViewport.matches) {
    document.querySelectorAll("[data-parallax]").forEach((element) => {
      const speed = Number(element.dataset.parallax || 0);
      const rect = element.getBoundingClientRect();
      const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
      const offset = Math.max(-55, Math.min(55, distanceFromCenter * speed));
      element.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  }

  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}

function resetParallax() {
  if (reduceMotion.matches || mobileViewport.matches) {
    document.querySelectorAll("[data-parallax]").forEach((element) => {
      element.style.transform = "";
    });
  }
  requestScrollUpdate();
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -6% 0px",
  },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

languageSwitch.addEventListener("click", () => {
  setLanguage(currentLanguage === "ar" ? "en" : "ar");
});

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate, { passive: true });
reduceMotion.addEventListener("change", resetParallax);
mobileViewport.addEventListener("change", resetParallax);

document.querySelector("[data-year]").textContent = new Date().getFullYear();
setLanguage(currentLanguage, false);
updateScrollEffects();
