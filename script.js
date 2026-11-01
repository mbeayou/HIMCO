'use strict';

const root = document.documentElement;
const header = document.querySelector('[data-header]');
const languageSwitch = document.querySelector('[data-language-switch]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentLanguage = 'ar';
try { currentLanguage = localStorage.getItem('himco-language') === 'en' ? 'en' : 'ar'; } catch { /* Storage is optional. */ }

const ui = {
  ar: {
    title: 'HIMCO | الحماية للطاقة المتجددة', aboutTitle: 'عن HIMCO | الحماية للطاقة المتجددة',
    description: 'شركة الحماية للطاقة المتجددة - تصميم وتركيب وبيع منظومات الطاقة الشمسية في بنغازي، ليبيا.',
    aboutDescription: 'تعرف على تاريخ شركة الحماية منذ 2010 ورؤيتها وأهدافها وخدماتها في الأعمال الكهربائية والطاقة المتجددة في ليبيا.',
    quote: 'اطلب عرض سعر عبر واتساب', message: 'مرحباً شركة الحماية، أود طلب عرض سعر لمنظومة طاقة شمسية.',
    photos: 'شاهد صور المشروع', year: 'سنة الإنجاز', location: 'المنطقة',
    pause: 'إيقاف الحركة', play: 'تشغيل الحركة', reduced: 'الحركة المخففة مفعلة',
    galleryClose: 'إغلاق صور المشروع', photo: 'صورة', of: 'من',
    marker: 'استكشف مشاريع', related: 'مشاريع أخرى في المنطقة',
  },
  en: {
    title: 'HIMCO | Renewable Energy Solutions', aboutTitle: 'About HIMCO | Renewable Energy Solutions',
    description: 'HIMCO Renewable Energy - solar system design, supply and installation in Benghazi, Libya.',
    aboutDescription: 'Discover HIMCO’s history since 2010, vision, goals and electrical and renewable energy services in Libya.',
    quote: 'Request a quote on WhatsApp', message: 'Hello HIMCO, I would like to request a quote for a solar energy system.',
    photos: 'View project photographs', year: 'Completion year', location: 'Area',
    pause: 'Pause animation', play: 'Play animation', reduced: 'Reduced motion enabled',
    galleryClose: 'Close project gallery', photo: 'Photo', of: 'of',
    marker: 'Explore projects in', related: 'More projects in this area',
  },
};
const copy = () => ui[currentLanguage];
const localize = (value) => value[currentLanguage];
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const photoURL = (project, index = 0) => encodeURI(`assets/Projects/${project.folder}/${project.images[index]}`);
const projects = typeof himcoProjects === 'undefined' ? [] : himcoProjects;
let selectedProjectId = projects[0]?.id;

function setLanguage(language) {
  currentLanguage = language;
  root.lang = language;
  root.dir = language === 'ar' ? 'rtl' : 'ltr';
  const isAbout = document.body.dataset.page === 'about';
  document.title = isAbout ? copy().aboutTitle : copy().title;
  const description = isAbout ? copy().aboutDescription : copy().description;
  document.querySelector('meta[name="description"]').content = description;
  document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((meta) => { meta.content = document.title; });
  document.querySelectorAll('meta[property="og:description"], meta[name="twitter:description"]').forEach((meta) => { meta.content = description; });
  document.querySelector('meta[property="og:locale"]').content = language === 'ar' ? 'ar_LY' : 'en_GB';
  document.querySelectorAll('[data-ar][data-en]').forEach((element) => {
    element.textContent = element.dataset[language];
  });
  document.querySelectorAll('[data-alt-ar][data-alt-en]').forEach((element) => {
    element.setAttribute(element.tagName === 'IMG' ? 'alt' : 'aria-label', element.dataset[language === 'ar' ? 'altAr' : 'altEn']);
  });
  languageSwitch.querySelector('span').textContent = language === 'ar' ? 'EN' : 'ع';
  languageSwitch.setAttribute('aria-label', language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
  document.querySelectorAll('.whatsapp-link').forEach((link) => {
    link.href = `https://wa.me/218926155231?text=${encodeURIComponent(copy().message)}`;
    link.setAttribute('aria-label', copy().quote);
  });
  try { localStorage.setItem('himco-language', language); } catch { /* Keep the current session working. */ }
  if (projects.length) {
    renderMap();
    renderProjectOptions();
    renderProjectDetail();
    renderTimeline();
    if (gallery?.open) renderGallery();
  }
  renderFlowDescription();
  updateFlowMotion();
}

languageSwitch.addEventListener('click', () => setLanguage(currentLanguage === 'ar' ? 'en' : 'ar'));
document.querySelectorAll('[data-year]').forEach((element) => { element.textContent = new Date().getFullYear(); });
window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 24), { passive: true });
if (document.body.dataset.page === 'about') {
  document.querySelectorAll('a[href="about.html"]').forEach((link) => link.setAttribute('aria-current', 'page'));
}

const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); }
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(expanded));
  mobileNav.hidden = !expanded;
});
mobileNav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); }
});
document.addEventListener('click', (event) => {
  if (!mobileNav.hidden && !event.target.closest('.site-header, .mobile-nav')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });

// The diagram follows the requested sequence. No generation or load metrics are invented.
const flow = document.querySelector('[data-energy-flow]');
const flowToggle = document.querySelector('[data-flow-toggle]');
const flowStages = [...document.querySelectorAll('[data-flow-stage]')];
const flowDescriptions = {
  ar: [
    'تحول الألواح ضوء الشمس إلى كهرباء بتيار مستمر، لتبدأ رحلة الطاقة.',
    'يدير الإنفرتر الطاقة ويحول التيار المستمر إلى تيار متردد مناسب للأجهزة.',
    'تخزن البطاريات الطاقة لاستخدامها عند انخفاض إنتاج الشمس أو انقطاع الكهرباء.',
    'تصل الكهرباء إلى الإضاءة والأجهزة والأحمال التي صُممت المنظومة لتغذيتها.',
  ],
  en: [
    'Panels turn sunlight into direct-current electricity, starting the energy journey.',
    'The inverter manages energy and converts direct current into alternating current for appliances.',
    'Batteries store energy for use when solar production falls or grid power is unavailable.',
    'Electricity reaches the lights, appliances and loads the system is designed to supply.',
  ],
};
let flowStage = 0;
let flowPaused = false;
let flowVisible = false;
let flowTimer;
function renderFlowDescription() {
  if (!flow) return;
  flowStages.forEach((button, index) => {
    button.classList.toggle('is-active', index === flowStage);
    button.setAttribute('aria-pressed', String(index === flowStage));
  });
  document.querySelector('[data-flow-description]').textContent = flowDescriptions[currentLanguage][flowStage];
}
function updateFlowMotion() {
  if (!flow) return;
  clearInterval(flowTimer);
  const paused = flowPaused || reduceMotion.matches;
  flow.classList.toggle('is-paused', paused || !flowVisible || document.hidden);
  flow.classList.toggle('motion-reduced', reduceMotion.matches);
  flowToggle.disabled = reduceMotion.matches;
  flowToggle.setAttribute('aria-pressed', String(paused));
  flowToggle.querySelector('span').textContent = reduceMotion.matches ? copy().reduced : flowPaused ? copy().play : copy().pause;
  flowToggle.querySelector('span:last-child').textContent = paused ? '▷' : 'Ⅱ';
  if (!paused && flowVisible && !document.hidden) {
    flowTimer = window.setInterval(() => { flowStage = (flowStage + 1) % 4; renderFlowDescription(); }, 2000);
  }
}
if (flow) {
  flowToggle.addEventListener('click', () => { flowPaused = !flowPaused; updateFlowMotion(); });
  flowStages.forEach((button, index) => button.addEventListener('click', () => {
    flowStage = index; flowPaused = true; renderFlowDescription(); updateFlowMotion();
  }));
  new IntersectionObserver((entries) => {
    flowVisible = entries[0].isIntersecting;
    updateFlowMotion();
  }, { threshold: .15 }).observe(flow);
  reduceMotion.addEventListener('change', updateFlowMotion);
  document.addEventListener('visibilitychange', updateFlowMotion);
}

// A small, local SVG map: works without tiles, a map API key, or a network request.
function projectPoint([longitude, latitude]) { return [(longitude - 8) * 30 + 30, (34.8 - latitude) * 34 + 15]; }
function renderMap() {
  const markerContainer = document.querySelector('[data-map-markers]');
  if (!markerContainer) return;
  const path = libyaBoundary.map((coordinate, index) => `${index ? 'L' : 'M'}${projectPoint(coordinate).map((value) => value.toFixed(2)).join(',')}`).join(' ') + ' Z';
  document.querySelector('[data-libya-shape]').setAttribute('d', path);
  document.querySelector('[data-libya-pattern]').setAttribute('d', path);
  markerContainer.innerHTML = Object.entries(himcoLocations).map(([id, location]) => {
    const [x, y] = projectPoint(location.coordinates);
    return `<button type="button" class="map-pin" data-map-location="${id}" style="left:${x / 6}%;top:${y / 5.6}%" aria-pressed="false" aria-label="${escapeHTML(`${copy().marker} ${location[currentLanguage]}`)}"><span>${escapeHTML(location[currentLanguage])}</span></button>`;
  }).join('');
  markerContainer.querySelectorAll('[data-map-location]').forEach((button) => button.addEventListener('click', () => {
    selectProject(projects.find((project) => project.location === button.dataset.mapLocation).id);
  }));
}
function renderProjectOptions() {
  const select = document.querySelector('[data-project-select]');
  select.innerHTML = projects.map((project) => `<option value="${project.id}">${escapeHTML(localize(project.name))}${project.year ? ` · ${project.year}` : ''}</option>`).join('');
  select.value = selectedProjectId;
}
function selectProject(id) {
  if (!projects.some((project) => project.id === id)) return;
  selectedProjectId = id;
  document.querySelector('[data-project-select]').value = id;
  renderProjectDetail();
}
function renderProjectDetail() {
  const project = projects.find((item) => item.id === selectedProjectId);
  if (!project) return;
  document.querySelectorAll('[data-map-location]').forEach((button) => {
    const selected = button.dataset.mapLocation === project.location;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const facts = [];
  if (project.year) facts.push(`<div><dt>${copy().year}</dt><dd>${project.year}</dd></div>`);
  if (project.location) facts.push(`<div><dt>${copy().location}</dt><dd>${escapeHTML(himcoLocations[project.location][currentLanguage])}</dd></div>`);
  const related = project.location ? projects.filter((item) => item.location === project.location && item.id !== project.id) : [];
  document.querySelector('[data-project-detail]').innerHTML = `
    <button class="detail-photo" type="button" data-open-project="${project.id}" aria-label="${escapeHTML(`${copy().photos}: ${localize(project.name)}`)}"><img src="${photoURL(project)}" alt="${escapeHTML(localize(project.name))}" width="640" height="400" loading="lazy" /><span>${copy().photos} ↗</span></button>
    <div class="project-meta">${escapeHTML(localize(project.category))}</div>
    <h3>${escapeHTML(localize(project.name))}</h3>
    <p>${escapeHTML(localize(project.description))}</p>
    ${facts.length ? `<dl class="project-facts">${facts.join('')}</dl>` : ''}
    ${related.length ? `<div class="related-projects"><p>${copy().related}</p>${related.map((item) => `<button type="button" data-select-project="${item.id}">${escapeHTML(localize(item.name))} ↗</button>`).join('')}</div>` : ''}`;
  document.querySelectorAll('[data-select-project]').forEach((button) => button.addEventListener('click', () => {
    selectProject(button.dataset.selectProject);
    document.querySelector('[data-project-select]').focus();
  }));
}
function projectCard(project) {
  return `<article class="project-card"><button type="button" data-open-project="${project.id}" aria-label="${escapeHTML(`${copy().photos}: ${localize(project.name)}`)}"><img src="${photoURL(project)}" alt="${escapeHTML(localize(project.name))}" width="640" height="400" loading="lazy" /><div class="project-card-info"><span>${escapeHTML(localize(project.category))}</span><h4>${escapeHTML(localize(project.name))}</h4><p>${escapeHTML(localize(project.description))}</p><span class="card-link">${copy().photos} ↗</span></div></button></article>`;
}
function renderTimeline() {
  const timeline = document.querySelector('[data-project-timeline]');
  const years = [...new Set(projects.filter((project) => project.year).map((project) => project.year))].sort((a, b) => a - b);
  timeline.innerHTML = years.map((year) => `<div class="timeline-year"><h3>${year}</h3><div class="project-card-grid">${projects.filter((project) => project.year === year).map(projectCard).join('')}</div></div>`).join('');
  document.querySelector('[data-undated-projects]').innerHTML = projects.filter((project) => !project.year).map(projectCard).join('');
}
const projectSelect = document.querySelector('[data-project-select]');
projectSelect?.addEventListener('change', () => selectProject(projectSelect.value));

const gallery = document.querySelector('[data-project-dialog]');
let galleryProject;
let galleryIndex = 0;
let galleryTrigger;
function renderGallery() {
  if (!galleryProject) return;
  document.querySelector('[data-gallery-title]').textContent = localize(galleryProject.name);
  document.querySelector('[data-gallery-meta]').textContent = `${localize(galleryProject.category)}${galleryProject.year ? ` · ${galleryProject.year}` : ''}`;
  document.querySelector('[data-gallery-description]').textContent = localize(galleryProject.description);
  const image = document.querySelector('[data-gallery-image]');
  image.src = photoURL(galleryProject, galleryIndex);
  image.alt = `${localize(galleryProject.name)} — ${copy().photo} ${galleryIndex + 1}`;
  document.querySelector('[data-gallery-counter]').textContent = `${copy().photo} ${galleryIndex + 1} ${copy().of} ${galleryProject.images.length}`;
  document.querySelector('[data-gallery-close]').setAttribute('aria-label', copy().galleryClose);
  document.querySelector('[data-gallery-prev]').disabled = galleryIndex === 0;
  document.querySelector('[data-gallery-next]').disabled = galleryIndex === galleryProject.images.length - 1;
}
function changeGalleryImage(offset) {
  const next = galleryIndex + offset;
  if (next >= 0 && next < galleryProject.images.length) { galleryIndex = next; renderGallery(); }
}
if (gallery) {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-project]');
    if (!trigger) return;
    galleryProject = projects.find((project) => project.id === trigger.dataset.openProject);
    galleryTrigger = trigger;
    galleryIndex = 0;
    renderGallery();
    gallery.showModal();
    document.body.classList.add('dialog-open');
    document.querySelector('[data-gallery-close]').focus();
  });
  document.querySelector('[data-gallery-close]').addEventListener('click', () => gallery.close());
  document.querySelector('[data-gallery-prev]').addEventListener('click', () => changeGalleryImage(-1));
  document.querySelector('[data-gallery-next]').addEventListener('click', () => changeGalleryImage(1));
  gallery.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); changeGalleryImage(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); changeGalleryImage(-1); }
  });
  gallery.addEventListener('click', (event) => {
    if (event.target !== gallery) return;
    const rect = gallery.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) gallery.close();
  });
  gallery.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (galleryTrigger?.isConnected) galleryTrigger.focus();
  });
}
setLanguage(currentLanguage);
