// Project names and completion years come from the supplied assets/Projects folders.
// Photo export timestamps are not completion dates. Unknown dates/locations stay null.
const himcoProjects = [
  {
    id: 'ghani', year: 2023, location: 'ghani',
    name: { ar: 'مطار حقل الغاني', en: 'Ghani Field Airport' },
    category: { ar: 'منظومة طاقة شمسية · مطار', en: 'Solar installation · Airport' },
    description: { ar: 'صور تنفيذ منظومة الألواح الشمسية والبطاريات ولوحة التوزيع في مطار حقل الغاني.', en: 'Installation photographs of the solar array, battery storage and distribution board at Ghani Field Airport.' },
    folder: 'مطار حقل الغاني سنة 2023',
    images: ['WhatsApp Image 2026-09-22 at 12.08.44 PM.jpeg', 'WhatsApp Image 2026-09-22 at 12.08.45 PM.jpeg', 'WhatsApp Image 2026-09-22 at 12.08.46 PM.jpeg'],
  },
  {
    id: 'martuba', year: 2023, location: 'martuba',
    name: { ar: 'مطار مرتوبة — درنة', en: 'Martuba Airport — Derna' },
    category: { ar: 'منظومة طاقة شمسية · مطار', en: 'Solar installation · Airport' },
    description: { ar: 'صور الألواح الشمسية في الموقع ومنظومة التخزين بمطار مرتوبة في منطقة درنة.', en: 'On-site solar arrays and battery storage at Martuba Airport in the Derna area.' },
    folder: 'مطار مرتوبة ( درنة ) 2023',
    images: ['WhatsApp Image 2026-09-22 at 12.10.18 PM.jpeg', 'WhatsApp Image 2026-09-22 at 12.10.19 PM.jpeg', 'WhatsApp Image 2026-09-22 at 12.1018 PM.jpeg'],
  },
  {
    id: 'rabiana-school', year: 2024, location: 'rabiana',
    name: { ar: 'مدرسة ربيانة', en: 'Rabiana School' },
    category: { ar: 'منظومة طاقة شمسية · تعليم', en: 'Solar installation · Education' },
    description: { ar: 'صور تركيب الألواح الشمسية ووحدات التحويل والتخزين في مدرسة ربيانة.', en: 'Solar panel installation, inverter and battery equipment at Rabiana School.' },
    folder: 'مدرسة ربيانة 2024',
    images: ['WhatsApp Image 2026-09-22 at 12.30.48 PM.jpeg', 'WhatsApp Image 2026-09-2212.30.48 PM.jpeg', 'WhatsApp Image 2026-09-22 at PM.jpeg'],
  },
  {
    id: 'rabiana-health', year: 2024, location: 'rabiana',
    name: { ar: 'المركز الصحي — ربيانة', en: 'Rabiana Health Center' },
    category: { ar: 'منظومة طاقة شمسية · صحة', en: 'Solar installation · Healthcare' },
    description: { ar: 'صور الأعمال الميدانية وتركيب الألواح والإنفرتر في المركز الصحي بربيانة.', en: 'Fieldwork, solar array and inverter installation at the health center in Rabiana.' },
    folder: 'المركز الصحي ربيانة 2024',
    images: ['WhatsApp Image 2026-09-22 at PM.jpeg', 'WhatsApp Image 2026-09-22 12.29.18 PM.jpeg', 'WhatsApp Image 2026-09-22 at 12.29.18 PM.jpeg', 'WhatsApp Image 2-22 at 12.29.19 PM.jpeg'],
  },
  {
    id: 'martuba-runway', year: null, location: 'martuba',
    name: { ar: 'تركيب وتشغيل مهبط مطار مرتوبة', en: 'Martuba Runway Installation & Commissioning' },
    category: { ar: 'إنارة المهبط · مطار', en: 'Runway lighting · Airport' },
    description: { ar: 'صور تركيب تجهيزات المهبط ووحدات الإنارة التي تعمل بالطاقة الشمسية واختبارها ليلاً.', en: 'Installation of runway equipment and solar-powered lighting, with nighttime operation photographs.' },
    folder: 'تركيب وتشغيل مهبط مطار مرتوبة',
    images: ['WhatsApp Image 2026-09-22 at 12.25.33 PM.jpeg', 'WhatsApp Image 2026-09-22  12.25.33 PM.jpeg', 'WhatsApp Image 2026-09-22 at 12.26.04 PM.jpeg'],
  },
  {
    id: 'solar-lighting', year: null, location: null,
    name: { ar: 'أعمدة الإنارة بالطاقة الشمسية', en: 'Solar Street Lighting' },
    category: { ar: 'إنارة شمسية · مساحات خارجية', en: 'Solar lighting · Outdoor spaces' },
    description: { ar: 'صور تجهيز وتركيب أعمدة الإنارة الشمسية وتشغيلها في المساحات الخارجية.', en: 'Assembly, installation and nighttime operation of outdoor solar lighting columns.' },
    folder: 'تركيبات اعمدة الانارة بالطاقة الشمسية',
    images: ['WhatsApp Image 2026--22 at 12.27.43 PM.jpeg', 'WhatsApp Image 2026-09-22 at PM.jpeg', 'WhatsApp Image 2026-09-22 aPM.jpeg', 'WhatsApp Image 2026-09-22 at 12.27.41 PM.jpeg', 'WhatsApp Image 2026-09-22 at 12.27.42 PM.jpeg', 'WhatsApp Image 2026-09-22 at 12.27.43 PM.jpeg'],
  },
];

// Regional reference coordinates, not a survey of the actual installed equipment.
// Airport references: https://ourairports.com/airports/LY-DNF/ and https://ourairports.com/airports/HL82/
// Rabiana: https://geographic.org/geographic_names/name.php?c=libya&fid=3763&uni=-4482730
const himcoLocations = {
  martuba: { ar: 'مرتوبة / درنة', en: 'Martuba / Derna', coordinates: [22.745001, 32.542] },
  ghani: { ar: 'حقل الغاني', en: 'Ghani Field', coordinates: [17.5881, 28.9619] },
  rabiana: { ar: 'ربيانة', en: 'Rabiana', coordinates: [21.983333, 24.233333] },
};

// Natural Earth 1:110m, public domain; geographic coordinates [longitude, latitude].
// https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson
const libyaBoundary = [[25,22],[25,20.00304],[23.85,20],[23.83766,19.58047],[19.84926,21.49509],[15.86085,23.40972],[14.8513,22.86295],[14.143871,22.491289],[13.581425,23.040506],[11.999506,23.471668],[11.560669,24.097909],[10.771364,24.562532],[10.303847,24.379313],[9.948261,24.936954],[9.910693,25.365455],[9.319411,26.094325],[9.716286,26.512206],[9.629056,27.140953],[9.756128,27.688259],[9.683885,28.144174],[9.859998,28.95999],[9.805634,29.424638],[9.48214,30.307556],[9.970017,30.539325],[10.056575,30.961831],[9.950225,31.37607],[10.636901,31.761421],[10.94479,32.081815],[11.432253,32.368903],[11.488787,33.136996],[12.66331,32.79278],[13.08326,32.87882],[13.91868,32.71196],[15.24563,32.26508],[15.71394,31.37626],[16.61162,31.18218],[18.02109,30.76357],[19.08641,30.26639],[19.57404,30.52582],[20.05335,30.98576],[19.82033,31.75179],[20.13397,32.2382],[20.85452,32.7068],[21.54298,32.8432],[22.89576,32.63858],[23.2368,32.19149],[23.60913,32.18726],[23.9275,32.01667],[24.92114,31.89936],[25.16482,31.56915],[24.80287,31.08929],[24.95762,30.6616],[24.70007,30.04419],[25,29.238655],[25,25.6825],[25,22]];
