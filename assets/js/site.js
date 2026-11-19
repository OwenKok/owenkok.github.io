
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const siteRoot = new URL('../../', document.currentScript.src);
if (/^https?:$/.test(location.protocol) && location.pathname.endsWith('/index.html')) {
  location.replace('./' + location.search + location.hash);
}
function projectLink(p) {
  return new URL(`works/${encodeURIComponent(p.slug)}/`, siteRoot).href;
}
function card(p){return `<a class="work-card reveal" href="${projectLink(p)}"><div class="image-frame"><img src="${new URL(p.cover, siteRoot).href}" alt="${p.title} by Owen Kok" loading="lazy" decoding="async"></div><div class="card-meta"><span>${p.title}</span><span class="year">${p.year}</span></div></a>`}
function setupNav(){
 const btn=$('.mobile-menu'),nav=$('.nav');if(!btn||!nav)return;
 function close(){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.textContent='☰';btn.setAttribute('aria-label','Open navigation')}
 btn.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open));btn.textContent=open?'×':'☰';btn.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
}
function reveal(){if(!('IntersectionObserver' in window)){ $$('.reveal').forEach(e=>e.classList.add('in'));return;}const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(e=>obs.observe(e));}
function renderSelected(){const el=$('#selectedWorks'); if(!el)return; const ids=['grawliz','sweet-tooth-collection','blossom-table','torii-stool','hammer','elastico']; el.innerHTML=ids.map(id=>window.PROJECTS.find(p=>p.slug===id)).filter(Boolean).map(card).join('');}
function renderWorks(){const root=$('#worksRoot'); if(!root)return; const groups={}; window.PROJECTS.forEach(p=>{const key=p.year>=2012?String(p.year):'Earlier';(groups[key]??=[]).push(p)}); const years=Object.keys(groups).filter(k=>k!=='Earlier').sort((a,b)=>b-a); if(groups.Earlier)years.push('Earlier'); const nav=$('#yearLinks'); if(nav) nav.innerHTML=years.map(y=>`<a href="#y-${y.toLowerCase()}">${y==='Earlier'?'Earlier Works':y}</a>`).join(''); root.innerHTML=years.map(y=>`<section class="year-section" id="y-${y.toLowerCase()}"><div class="year-heading">${y==='Earlier'?'Earlier Works · 2005–2009':y}</div><div class="works-grid">${groups[y].map(card).join('')}</div></section>`).join('');}
function renderProject() {
  if (!$('#projectRoot')) return;
  const id = new URLSearchParams(location.search).get('id');
  const project = window.PROJECTS.find(entry => entry.slug === id) || window.PROJECTS[0];
  location.replace(projectLink(project) + location.hash);
}
// Discourage casual copying of portfolio photos. This cannot prevent screenshots or browser retrieval.
function discourageImageSaving(){
 const photos='.hero-visual img, .image-frame img, .project-main img, .gallery-item img, .about-visual img';
 document.addEventListener('contextmenu', e=>{
   if(e.target instanceof Element && e.target.closest(photos)) e.preventDefault();
 });
 document.addEventListener('dragstart', e=>{
   if(e.target instanceof Element && e.target.closest(photos)) e.preventDefault();
 });
}

// A quiet, random featured work chosen on page load (not an animated slideshow).
// Keeps a meaningful image and link even if JavaScript is unavailable.
function renderRandomHero(){
 const host=document.getElementById('rotating-featured-work');
 if(!host||!window.PROJECTS)return;
 const items=[
  {slug:'sweet-tooth-collection',src:'assets/img/brand/hero-sweet-tooth.webp'},
  {slug:'grawliz',src:'assets/img/projects/grawliz/01.jpg'},
  {slug:'blossom-table',src:'assets/img/projects/blossom-table/01.jpg'},
  {slug:'hammer',src:'assets/img/projects/hammer/01.jpg'},
  {slug:'tribal-chair',src:'assets/img/projects/tribal-chair/12.jpg'}
 ];
 const item=items[Math.floor(Math.random()*items.length)];
 const p=window.PROJECTS.find(p=>p.slug===item.slug);
 if(!p)return;
 const img=host.querySelector('img'),caption=host.querySelector('.hero-caption');
 if(!img||!caption)return;
 img.src=item.src;
 img.alt=p.title+' — furniture design by Owen Kok';
 host.href=projectLink(p);
 host.setAttribute('aria-label','Discover '+p.title+', '+p.year);
 caption.textContent=p.title.toUpperCase()+' — '+p.year+'   ↗';
}

document.addEventListener('DOMContentLoaded',()=>{
  setupNav();renderRandomHero();renderSelected();renderWorks();renderProject();discourageImageSaving();
  // Keep small interactions optional rather than hiding content on slow devices.
  document.documentElement.classList.add('js-motion');requestAnimationFrame(reveal);
});
