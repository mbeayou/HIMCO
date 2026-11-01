import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const fail = (message) => failures.push(message);
const pages = ['index.html', 'about.html', '404.html'];
const documents = new Map(pages.map((page) => [page, fs.readFileSync(path.join(root, page), 'utf8')]));
const ids = new Map();
for (const [page, html] of documents) {
  const values = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  ids.set(page, new Set(values));
  if (values.length !== ids.get(page).size) fail(`${page}: duplicate element IDs`);
  if ([...html.matchAll(/<h1\b/g)].length !== 1) fail(`${page}: expected one h1`);
  if (!/<html lang="ar" dir="rtl">/.test(html)) fail(`${page}: missing Arabic document language`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${page}: missing title`);
  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(image[0])) fail(`${page}: image missing alt text`);
  }
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (/^(?:https?:|mailto:|tel:|data:)/.test(value)) continue;
    const [file, fragment] = value.split('#');
    const target = decodeURI(file || page).replace(/^\//, '');
    if (!fs.existsSync(path.join(root, target))) fail(`${page}: missing ${target}`);
    if (fragment && documents.has(target) && !ids.has(target)) continue; // Checked below after collecting all IDs.
  }
}
for (const [page, html] of documents) {
  for (const match of html.matchAll(/\bhref="([^"]*#[^"]+)"/g)) {
    const [file, fragment] = match[1].split('#');
    const target = (file || page).replace(/^\//, '');
    if (ids.has(target) && !ids.get(target).has(fragment)) fail(`${page}: missing anchor ${target}#${fragment}`);
  }
  if (page !== '404.html') {
    for (const name of ['description', 'twitter:title', 'twitter:description']) {
      if (!html.includes(`name="${name}"`)) fail(`${page}: missing ${name}`);
    }
    if (!html.includes('class="skip-link"')) fail(`${page}: missing skip link`);
    if (/placeholder|coming soon|to be added|will be added|قريباً|لاحقاً/i.test(html)) fail(`${page}: unfinished copy`);
  }
}
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'projects.js'), 'utf8'), context);
const data = vm.runInContext('({projects: himcoProjects, locations: himcoLocations, boundary: libyaBoundary})', context);
let photos = 0;
const projectIds = new Set();
for (const project of data.projects) {
  if (projectIds.has(project.id)) fail(`Duplicate project ID: ${project.id}`);
  projectIds.add(project.id);
  if (project.location && !data.locations[project.location]) fail(`Unknown project location: ${project.id}`);
  for (const field of ['name', 'description', 'category']) {
    if (!project[field]?.ar || !project[field]?.en) fail(`Missing translation: ${project.id}/${field}`);
  }
  if (!project.images.length) fail(`No images: ${project.id}`);
  for (const image of project.images) {
    if (!fs.existsSync(path.join(root, 'assets', 'Projects', project.folder, image))) fail(`Missing photo: ${project.id}/${image}`);
    photos++;
  }
}
for (const location of Object.keys(data.locations)) {
  if (!data.projects.some((project) => project.location === location)) fail(`Map marker has no project: ${location}`);
}
if (data.boundary.length < 3) fail('Missing Libya boundary');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${pages.length} pages, local links and anchors, bilingual metadata, ${data.projects.length} projects, ${photos} photo references, ${Object.keys(data.locations).length} map regions.`);
}
