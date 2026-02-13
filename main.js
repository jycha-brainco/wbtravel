/* ============================================
   WELLBEING TRAVEL - Shared Logic
   Supabase API + Site Config + Navigation + Render
   ============================================ */

// ---- SUPABASE CONFIG ----
const SUPABASE_URL = 'https://gpcdyrftbpzuytmlgadu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwY2R5cmZ0YnB6dXl0bWxnYWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjI3NDUsImV4cCI6MjA4NjQ5ODc0NX0.w7syY9p531k8fMCvxleX4eM3ghzl_5MohNo-2Okdhv8';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwY2R5cmZ0YnB6dXl0bWxnYWR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkyMjc0NSwiZXhwIjoyMDg2NDk4NzQ1fQ.fyrKlNpctUp8q3AJ4Y3G092bOq-sZdcrt4nIA1PaG3k';
const STORAGE_URL = SUPABASE_URL + '/storage/v1/object/public';
const CONFIG_URL = STORAGE_URL + '/config/site-config.json';

// ---- SUPABASE REST HELPERS ----
async function sbFetch(table, query, key) {
  const apiKey = key || SUPABASE_ANON_KEY;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: { 'apikey': apiKey, 'Authorization': `Bearer ${apiKey}` }
  });
  return res.json();
}

async function sbMutate(method, table, body, query) {
  const q = query ? `?${query}` : '';
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${q}`, {
    method,
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}

async function sbUpload(bucket, path, file) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: file
  });
  if (res.ok) return `${STORAGE_URL}/${bucket}/${path}`;
  throw new Error('Upload failed');
}

// ---- SITE CONFIG (Supabase Storage) ----
let siteConfig = null;

async function loadSiteConfig() {
  try {
    const res = await fetch(CONFIG_URL + '?t=' + Date.now());
    if (res.ok) {
      siteConfig = await res.json();
      return siteConfig;
    }
  } catch (e) { console.error('Config load error:', e); }
  // Default config
  siteConfig = { hiddenClients: [], header: {}, footer: {} };
  return siteConfig;
}

async function saveSiteConfig(config) {
  siteConfig = config;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/config/site-config.json`, {
    method: 'PUT',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  });
  if (!res.ok) throw new Error('Config save failed');
  return true;
}

// ---- DATA STORE (Supabase) ----
const DataStore = {
  _cache: {},
  async getHistory() {
    if (this._cache.history) return this._cache.history;
    try {
      const data = await sbFetch('history', 'select=*&order=sort_order');
      if (Array.isArray(data)) { this._cache.history = data; return data; }
    } catch (e) { console.error('History fetch error:', e); }
    return [];
  },
  async getPortfolio() {
    if (this._cache.portfolio) return this._cache.portfolio;
    try {
      const data = await sbFetch('portfolio', 'select=*&order=sort_order');
      if (Array.isArray(data)) { this._cache.portfolio = data; return data; }
    } catch (e) { console.error('Portfolio fetch error:', e); }
    return [];
  },
  async getClients() {
    if (this._cache.clients) return this._cache.clients;
    try {
      const data = await sbFetch('clients', 'select=*&order=sort_order');
      if (Array.isArray(data)) { this._cache.clients = data; return data; }
    } catch (e) { console.error('Clients fetch error:', e); }
    return [];
  },
  async getVisibleClients() {
    const all = await this.getClients();
    const hidden = (siteConfig && siteConfig.hiddenClients) || [];
    return all.filter(c => !hidden.includes(c.id));
  },
  clearCache() { this._cache = {}; }
};

// ---- NAVIGATION ----
function getCurrentPage() {
  const path = window.location.pathname;
  if (path === '/' || path.endsWith('/') || path.endsWith('/index.html')) return 'index';
  const match = path.match(/(\w+)\.html$/);
  return match ? match[1] : 'index';
}

function insertNav() {
  const placeholder = document.getElementById('nav-placeholder');
  if (!placeholder) return;
  const currentPage = getCurrentPage();
  const navLinks = (siteConfig && siteConfig.header && siteConfig.header.navLinks) || [
    { label: '홈', href: './index.html' },
    { label: '회사개요', href: './about.html' },
    { label: '서비스', href: './services.html' },
    { label: '포트폴리오', href: './portfolio.html' },
    { label: '고객사', href: './clients.html' },
    { label: '문의', href: './contact.html' }
  ];
  const linksHtml = navLinks.map(link => {
    const page = (link.href.match(/(\w+)\.html/) || [])[1] || 'index';
    const activeClass = page === currentPage ? ' class="active"' : '';
    return `<li><a href="${link.href}"${activeClass}>${link.label}</a></li>`;
  }).join('');
  placeholder.outerHTML = `
  <nav class="nav" id="nav">
    <div class="nav-inner">
      <a href="./index.html" class="nav-logo"><img src="./assets/logo.png" alt="WB TRAVEL" class="nav-logo-img" /></a>
      <ul class="nav-links" id="navLinks">${linksHtml}</ul>
      <button class="nav-toggle" id="navToggle" aria-label="메뉴"><span></span><span></span><span></span></button>
    </div>
  </nav>`;
}

function insertFooter() {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;
  const f = (siteConfig && siteConfig.footer) || {};
  const companyName = f.companyName || '(주)웰빙트래블';
  const companyCeo = f.companyCeo || '대표 서상호';
  const companyLicense = f.companyLicense || '종합여행업 제 2018-000012호';
  const companyIata = f.companyIata || 'IATA: 17319223';
  const copyright = f.copyright || '&copy; 2003-2025 Wellbeing Travel Co., Ltd. All rights reserved.';
  const footerLinks = f.links || [
    { label: '회사개요', href: './about.html' },
    { label: '서비스', href: './services.html' },
    { label: '포트폴리오', href: './portfolio.html' },
    { label: '고객사', href: './clients.html' },
    { label: '문의', href: './contact.html' },
    { label: '관리자', href: './admin.html' }
  ];
  const linksHtml = footerLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('\n          ');
  placeholder.outerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="nav-logo"><img src="./assets/logo.png" alt="WB TRAVEL" class="footer-logo-img" /></span>
          <p>${companyName} | ${companyCeo}<br>${companyLicense} | ${companyIata}</p>
        </div>
        <div class="footer-links">
          ${linksHtml}
        </div>
      </div>
      <div class="footer-copy">${copyright}</div>
    </div>
  </footer>`;
}

// ---- CLIENT LOGO RENDERING ----
function logoCard(c, cssClass) {
  const cls = cssClass || 'cl-card';
  if (c.logo_url) {
    return `<div class="${cls} reveal"><img src="${c.logo_url}" alt="${c.name}" style="max-height:36px;max-width:120px;object-fit:contain;" /></div>`;
  }
  const b = c.brand_color ? { color: c.brand_color, text: c.brand_text, weight: c.brand_weight || 700, size: c.brand_size || 14 } : null;
  if (b) {
    const text = b.text || c.name;
    const size = b.size;
    return `<div class="${cls} reveal">
      <svg viewBox="0 0 ${Math.max(text.length * size * 0.65, 80)} 36" width="${Math.max(text.length * size * 0.65, 80)}" height="36">
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
          fill="${b.color}" font-family="'Inter','Noto Sans KR',sans-serif"
          font-size="${size}" font-weight="${b.weight}" letter-spacing="-0.02em">${text}</text>
      </svg>
    </div>`;
  }
  return `<div class="${cls} reveal"><span class="cl-text">${c.name}</span></div>`;
}

const CAT_MAP = {
  '금융': '금융 · 증권', '대기업': '기업', '기업': '기업',
  '공공기관': '공공기관 · 교육', '교육': '공공기관 · 교육',
  '미디어': '미디어', '여행': '여행 · 유통', '유통': '여행 · 유통', '협회': '여행 · 유통'
};
const CAT_ORDER = ['금융 · 증권', '공공기관 · 교육', '미디어', '기업', '여행 · 유통'];

// ---- RENDER FUNCTIONS ----
async function renderTimeline() {
  const el = document.getElementById('historyTimeline');
  if (!el) return;
  el.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>연혁을 불러오는 중...</p></div>';
  const data = await DataStore.getHistory();
  if (!data.length) {
    el.innerHTML = '<p class="empty-state">등록된 연혁이 없습니다.</p>';
    return;
  }
  el.innerHTML = data.map(h => `
    <div class="tl-item reveal">
      <div class="tl-year">${h.year}</div>
      <ul class="tl-list">${h.items.map(i => '<li>' + i + '</li>').join('')}</ul>
    </div>`).join('');
  initReveal();
}

async function renderPortfolio() {
  const el = document.getElementById('portfolioGrid');
  if (!el) return;
  el.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>포트폴리오를 불러오는 중...</p></div>';
  const icons = {
    workshop: '<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>',
    golf: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
    event: '<path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>'
  };
  const data = await DataStore.getPortfolio();
  if (!data.length) {
    el.innerHTML = '<p class="empty-state">등록된 포트폴리오가 없습니다.</p>';
    return;
  }
  el.innerHTML = data.map(p => {
    const thumbContent = p.image_url
      ? `<img src="${p.image_url}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;" />`
      : `<div class="pf-thumb-icon"><svg viewBox="0 0 24 24">${icons[p.category] || icons.workshop}</svg></div>`;
    return `
    <div class="pf-card reveal">
      <div class="pf-thumb ${p.image_url ? '' : p.category}">
        ${thumbContent}
        <span class="pf-loc">${p.location}</span>
      </div>
      <div class="pf-body">
        <h3>${p.title}</h3>
        <div class="pf-meta">
          <span><strong>장소</strong>${p.location}</span>
          <span><strong>인원</strong>${p.participants}</span>
          <span><strong>서비스</strong>${p.services}</span>
        </div>
      </div>
    </div>`;
  }).join('');
  initReveal();
}

async function renderClients(targetId, filterCategory) {
  const el = document.getElementById(targetId || 'clientsGrid');
  if (!el) return;
  if (!filterCategory) el.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>고객사를 불러오는 중...</p></div>';
  const clients = await DataStore.getVisibleClients();
  if (!clients.length) {
    el.innerHTML = '<p class="empty-state">등록된 고객사가 없습니다.</p>';
    return;
  }
  const groups = {};
  clients.forEach(c => {
    const cat = CAT_MAP[c.category] || '기타';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(c);
  });
  if (filterCategory && filterCategory !== '전체') {
    const filtered = groups[filterCategory] || [];
    el.innerHTML = filtered.length
      ? `<div class="cl-grid">${filtered.map(c => logoCard(c)).join('')}</div>`
      : '<p class="empty-state">해당 카테고리에 등록된 고객사가 없습니다.</p>';
  } else {
    el.innerHTML = CAT_ORDER
      .filter(cat => groups[cat] && groups[cat].length)
      .map(cat => `
        <div class="cl-category">
          <div class="cl-category-label">${cat}</div>
          <div class="cl-grid">${groups[cat].map(c => logoCard(c)).join('')}</div>
        </div>
      `).join('');
  }
  initReveal();
}

async function renderHomeClients() {
  const el = document.getElementById('homeClientsGrid');
  if (!el) return;
  const allClients = await DataStore.getVisibleClients();
  // Show first 15 visible clients on home page
  const clients = allClients.slice(0, 15);
  if (!clients.length) {
    el.innerHTML = '<p class="empty-state">등록된 고객사가 없습니다.</p>';
    return;
  }
  el.innerHTML = clients.map(c => logoCard(c, 'logo-wall-card')).join('');
  initReveal();
}

function initClientTabs() {
  const tabs = document.querySelectorAll('.client-tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderClients('clientsGrid', tab.getAttribute('data-category'));
    });
  });
}

// ---- SCROLL REVEAL ----
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
}

// ---- NAV LOGIC ----
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }
}

// ---- COUNTER ----
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.getAttribute('data-count'));
        animateCount(e.target, target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

function animateCount(el, target) {
  const dur = 1400, start = performance.now();
  (function update(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * ease);
    if (p < 1) requestAnimationFrame(update);
  })(start);
}

// ---- PAGE-SPECIFIC INITIALIZATION ----
async function initPage() {
  const page = getCurrentPage();
  try {
    switch (page) {
      case 'index':
        await renderHomeClients();
        break;
      case 'portfolio':
        await Promise.all([renderTimeline(), renderPortfolio()]);
        break;
      case 'clients':
        await renderClients('clientsGrid');
        initClientTabs();
        break;
    }
  } catch (e) {
    console.error('Page init error:', e);
  }
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadSiteConfig();
    insertNav();
    insertFooter();
    initNav();
    initReveal();
    initCounters();
    await initPage();
    initReveal();
  } catch (e) {
    console.error('Init error:', e);
  }
});
