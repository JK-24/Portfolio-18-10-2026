import { profile, ui } from '../contents.js';
import { regions } from '../graph/regions/index.js';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function detailBase(region, title, body) {
  const dialog = document.querySelector('#detail');
  document.querySelector('#detail-kind').textContent = region.label;
  document.querySelector('#detail-title').textContent = title;
  document.querySelector('#detail-body').textContent = body;
  const media = document.querySelector('#detail-media');
  media.replaceChildren();
  return { dialog, media };
}
function showDialog(dialog) { if (!dialog.open) dialog.showModal(); }

export function mountStory() {
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet';
  sheet.href = new URL('./content.css', import.meta.url).href;
  document.head.append(sheet);
  document.title = profile.pageTitle;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = profile.introduction;
  document.querySelector('.brand').textContent = ui.brand;
  document.querySelector('nav a[href="#projects"]').textContent = ui.navigation.projects;
  document.querySelector('nav a[href="#contact"]').textContent = ui.navigation.contact;
  const main = document.querySelector('#story');
  main.replaceChildren();
  const intro = element('section', 'intro'); intro.id = 'intro';
  intro.append(element('p', 'eyebrow', ui.introEyebrow));
  const heading = element('h1');
  profile.headline.forEach((line, i) => {
    if (i) heading.append(document.createElement('br'));
    heading.append(document.createTextNode(line));
  });
  const bottom = element('div', 'intro-bottom');
  const identity = element('div');
  identity.append(element('p', 'name', profile.name), element('p', 'intro-copy', profile.introduction));
  const prompt = element('a', '', ui.scrollPrompt); prompt.href = '#education';
  bottom.append(identity, prompt); intro.append(heading, bottom); main.append(intro);

  for (const region of regions) {
    const section = element('section', 'chapter'); section.id = region.id;
    const panel = element('article', 'chapter-copy');
    panel.append(element('p', 'eyebrow', region.kicker), element('h2', '', region.title), element('p', '', region.description));
    for (const item of region.items.slice(0, ui.visibleItems)) {
      const button = element('button', 'item', item.title + ' ↗');
      button.type = 'button'; button.onclick = () => openDetail(region, item);
      if (item.image) {
        button.classList.add('item-with-image');
        const thumbnail = document.createElement('img');
        thumbnail.className = 'item-thumb'; thumbnail.src = item.image;
        thumbnail.alt = ''; thumbnail.loading = 'lazy';
        thumbnail.onerror = () => { thumbnail.hidden = true; };
        button.prepend(thumbnail);
      }
      panel.append(button);
    }
    if (region.items.length > ui.visibleItems) {
      const all = element('button', 'item view-all', `${ui.viewAll} ${region.label} (${region.items.length}) ↗`);
      all.type = 'button'; all.onclick = () => openCollection(region); panel.append(all);
    }
    if (!region.items.length) panel.append(element('p', 'empty-content', region.emptyMessage || ui.emptyMessage));
    section.append(panel); main.append(section);
  }

  const contact = element('section', 'contact'); contact.id = 'contact';
  const article = element('article');
  article.append(element('p', 'eyebrow', ui.contactEyebrow), element('h2', '', ui.contactHeading),
    element('p', 'availability', profile.availability), element('p', 'role', profile.role));
  const links = element('div', 'contact-links');
  const destinations = [
    [ui.contactLabels.email, profile.email ? 'mailto:' + profile.email : ''],
    [ui.contactLabels.resume, profile.resume],
    [ui.contactLabels.linkedin, profile.linkedin],
    [ui.contactLabels.phone, profile.phone ? 'tel:' + profile.phone : '']
  ];
  for (const [label, url] of destinations) {
    if (!url) continue;
    const link = element('a', '', label + ' ↗'); link.href = url;
    if (/^https?:/.test(url)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    if (url === profile.resume) link.download = '';
    links.append(link);
  }
  article.append(links, element('small', '', profile.portraitLabel));
  contact.append(article); main.append(contact);
  document.querySelector('#detail-title').tabIndex = -1;
  const close = document.querySelector('#close');
  close.textContent = ui.close; close.setAttribute('aria-label', ui.closeAriaLabel);
  close.onclick = () => document.querySelector('#detail').close();
}

export function openCollection(region) {
  const { dialog, media } = detailBase(region, region.label, region.description);
  for (const item of region.items) {
    const button = element('button', 'item', item.title + ' ↗');
    button.type = 'button'; button.onclick = () => {
      openDetail(region, item); document.querySelector('#detail-title').focus();
    };
    media.append(button);
  }
  showDialog(dialog);
}

export function openDetail(region, item) {
  const { dialog, media } = detailBase(region, item.title, item.body);
  if (item.image) {
    const image = document.createElement('img');
    image.alt = item.title; image.decoding = 'async'; image.src = item.image;
    image.onerror = () => image.replaceWith(element('p', 'empty-content', ui.imageUnavailable));
    media.append(image);
  }
  if (item.url && /^(https?:|mailto:)/.test(item.url)) {
    const link = element('a', 'detail-link', ui.itemLink);
    link.href = item.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; media.append(link);
  }
  document.querySelector('#detail-title').tabIndex = -1;
  showDialog(dialog);
}
