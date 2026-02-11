/* ============================================
   WELLBEING TRAVEL - Shared Data + IR Logic
   ============================================ */

// ---- DEFAULT DATA ----
const DEFAULT_HISTORY = [
  { id:1, year:'2003', items:['(주)웰빙트래블 설립'] },
  { id:2, year:'2004-2006', items:['IATA 국제항공운송협회 가입','맘스투어 특허상표출원 (맘스투어, Momstour 상표등록)','상해 핸드폰 배낭여행 상품 출시'] },
  { id:3, year:'2007', items:['대한항공 수선화 멤버','대신정보통신 / VK 파트너십','아시아나항공 우수대리점','모두투어 항공콜센터 공동운영'] },
  { id:4, year:'2009-2015', items:['서울시 관광협회 최우수여행사 6년 연속 선정','CITI BANK 파트너십','동아일보 파트너십 - 전국 3위','골프전문 사이트 egolftour 오픈','동국제강그룹 / Korea Financial Group 파트너십','루트로닉 / 대진기계 / 유안타증권 파트너십'] },
  { id:5, year:'2016', items:['PIVOT group / 초록마을 파트너십','태웅로직스 / 인사혁신처 파트너십','프리미엄 국내여행 루하여행 공동상품 운영'] },
  { id:6, year:'2017', items:['브루나이 관광청 업무협약','맘스투어 브루나이투어 시작','로열브루나이항공 하드블럭 체결','KATA 한국여행업협회 가입'] },
  { id:7, year:'2018', items:['종합여행업 변경 등록','SM 면세점 밴더 등록','NH투자증권 / 한국투자증권 / IBK투자증권 파트너십','채널A / 대성엘텍 파트너십'] },
  { id:8, year:'2019', items:['한국무역보험공사 파트너십','모두투어 Incentive Trip 공동운영','Bah Makan 브루나이 미식축제 한국 공식지정여행사'] },
  { id:9, year:'2020-2021', items:['COVID-19 기간 기업서비스 지속 제공','BIT / 엘리케이파크 / EL WIDE / 피닉슨컨트롤즈 파트너십'] },
  { id:10, year:'2022-2023', items:['동아일보 터키지진 취재지원'] },
  { id:11, year:'2024', items:['국민대학교 파트너십','수원시청 오사카 방문행사','중부일보 스페인/프랑스/스위스 취재지원','서울국제관광전 브루나이 부스 운영'] },
  { id:12, year:'2025', items:['안양시청 ITS 두바이 총회 행사','한국IT비즈니스진흥협회 파트너십','momstour.com 채널 오픈','서울국제관광전 브루나이 부스 운영','MIRI 이스트우드밸리 주관판매사 선정','E채널 류학생어남선 브루나이편 코디네이팅'] }
];

const DEFAULT_PORTFOLIO = [
  { id:1, title:'P그룹 미국 시책 워크샵', location:'미국 서부 (LA, 샌프란시스코)', participants:'50명', services:'행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', category:'workshop' },
  { id:2, title:'W기업 중국 워크샵', location:'장가계, 중국', participants:'30명', services:'행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', category:'workshop' },
  { id:3, title:'D기업 우수고객사 초청 골프대회', location:'제주도, 대한민국', participants:'50명', services:'행사지 제안, 항공/숙박/골프장/차량/가이드 수배, 현지운영', category:'golf' },
  { id:4, title:'T사 치앙마이 우수사원 워크샵', location:'치앙마이, 태국', participants:'55명', services:'행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', category:'workshop' },
  { id:5, title:'R사 라스베가스 워크샵', location:'라스베가스, 미국', participants:'75명', services:'행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', category:'workshop' },
  { id:6, title:'H은행 우수조합원 대만 워크샵', location:'대만', participants:'20명', services:'행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', category:'workshop' },
  { id:7, title:'T사 다낭 우수사원 워크샵', location:'다낭, 베트남', participants:'20명', services:'행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', category:'workshop' },
  { id:8, title:'H사 문경 조합원 워크샵', location:'문경, 경상북도', participants:'20명', services:'행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', category:'workshop' },
  { id:9, title:'브루나이 인플루언서 초청 행사', location:'브루나이', participants:'5명', services:'항공/숙박/차량/가이드 수배, 현지운영', category:'event' },
  { id:10, title:'S사 고객사 초청 골프행사', location:'제주도, 대한민국', participants:'30명', services:'항공/숙박/골프장/차량/가이드 수배, 현지운영', category:'golf' },
  { id:11, title:'K대학교 대학원 해외 워크숍', location:'후쿠오카, 일본', participants:'50명', services:'항공/숙박/세미나/차량/가이드 수배, 현지운영', category:'workshop' }
];

const DEFAULT_CLIENTS = [
  { id:1, name:'동국제강그룹', category:'대기업' },
  { id:2, name:'Korea Financial Group', category:'금융' },
  { id:3, name:'NH투자증권', category:'금융' },
  { id:4, name:'한국투자증권', category:'금융' },
  { id:5, name:'IBK투자증권', category:'금융' },
  { id:6, name:'유안타증권', category:'금융' },
  { id:7, name:'CITI BANK', category:'금융' },
  { id:8, name:'한국무역보험공사', category:'공공기관' },
  { id:9, name:'인사혁신처', category:'공공기관' },
  { id:10, name:'국민대학교', category:'교육' },
  { id:11, name:'루트로닉', category:'기업' },
  { id:12, name:'대진기계', category:'기업' },
  { id:13, name:'대신정보통신', category:'기업' },
  { id:14, name:'PIVOT group', category:'기업' },
  { id:15, name:'태웅로직스', category:'기업' },
  { id:16, name:'대성엘텍', category:'기업' },
  { id:17, name:'동아일보', category:'미디어' },
  { id:18, name:'채널A', category:'미디어' },
  { id:19, name:'중부일보', category:'미디어' },
  { id:20, name:'E채널', category:'미디어' },
  { id:21, name:'수원시청', category:'공공기관' },
  { id:22, name:'안양시청', category:'공공기관' },
  { id:23, name:'초록마을', category:'기업' },
  { id:24, name:'모두투어', category:'여행' },
  { id:25, name:'하나투어', category:'여행' },
  { id:26, name:'SM면세점', category:'유통' },
  { id:27, name:'한국IT비즈니스진흥협회', category:'협회' },
  { id:28, name:'BIT', category:'기업' },
  { id:29, name:'엘리케이파크', category:'기업' },
  { id:30, name:'피닉슨컨트롤즈', category:'기업' }
];

// ---- DATA STORE (localStorage) ----
const DataStore = {
  _get(key, fallback) {
    try { const d = localStorage.getItem('wb_' + key); return d ? JSON.parse(d) : fallback; }
    catch { return fallback; }
  },
  _set(key, data) { localStorage.setItem('wb_' + key, JSON.stringify(data)); },
  getHistory()  { return this._get('history', DEFAULT_HISTORY); },
  getPortfolio(){ return this._get('portfolio', DEFAULT_PORTFOLIO); },
  getClients()  { return this._get('clients', DEFAULT_CLIENTS); },
  setHistory(d) { this._set('history', d); },
  setPortfolio(d){ this._set('portfolio', d); },
  setClients(d) { this._set('clients', d); }
};

// ---- RENDER FUNCTIONS (IR Site) ----
function renderTimeline() {
  const el = document.getElementById('historyTimeline');
  if (!el) return;
  el.innerHTML = DataStore.getHistory().map(h => `
    <div class="tl-item reveal">
      <div class="tl-year">${h.year}</div>
      <ul class="tl-list">${h.items.map(i => '<li>' + i + '</li>').join('')}</ul>
    </div>`).join('');
}

function renderPortfolio() {
  const el = document.getElementById('portfolioGrid');
  if (!el) return;
  const icons = {
    workshop: '<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>',
    golf: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
    event: '<path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>'
  };
  el.innerHTML = DataStore.getPortfolio().map(p => `
    <div class="pf-card reveal">
      <div class="pf-thumb ${p.category}">
        <div class="pf-thumb-icon"><svg viewBox="0 0 24 24">${icons[p.category] || icons.workshop}</svg></div>
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
    </div>`).join('');
}

function renderClients() {
  const el = document.getElementById('clientsGrid');
  if (!el) return;

  // Brand styles for SVG text logos
  const BRANDS = {
    'NH투자증권':       { color: '#00823F', weight: 800 },
    'CITI BANK':        { text: 'CITI', color: '#003DA5', weight: 800, size: 18 },
    '동아일보':         { color: '#C41230', weight: 800 },
    '하나투어':         { color: '#F37321', weight: 700 },
    '모두투어':         { color: '#0066B3', weight: 700 },
    '채널A':            { color: '#E31937', weight: 800 },
    '국민대학교':       { color: '#8B1A2B', weight: 700 },
    '동국제강그룹':     { text: '동국제강', color: '#003478', weight: 800 },
    '한국투자증권':     { color: '#F58220', weight: 700 },
    'IBK투자증권':      { text: 'IBK', color: '#0072BC', weight: 800, size: 18 },
    '유안타증권':       { color: '#ED1C24', weight: 700 },
    '한국무역보험공사': { text: 'K-SURE', color: '#003DA5', weight: 800, size: 16 },
    'E채널':            { color: '#E31937', weight: 800 },
    '중부일보':         { color: '#1B4F72', weight: 700 },
    'Korea Financial Group': { text: 'KFG', color: '#1A5276', weight: 800, size: 18 },
    'SM면세점':         { text: 'SM', color: '#C70039', weight: 800, size: 18 },
    'PIVOT group':      { text: 'PIVOT', color: '#2C3E50', weight: 800, size: 16 },
    '수원시청':         { color: '#1B6B1B', weight: 700 },
    '안양시청':         { color: '#2E86C1', weight: 700 },
    '인사혁신처':       { color: '#1A5276', weight: 700 },
  };

  // Category mapping and ordering
  const CAT_MAP = {
    '금융': '금융 · 증권',
    '대기업': '기업',
    '기업': '기업',
    '공공기관': '공공기관 · 교육',
    '교육': '공공기관 · 교육',
    '미디어': '미디어',
    '여행': '여행 · 유통',
    '유통': '여행 · 유통',
    '협회': '여행 · 유통'
  };
  const CAT_ORDER = ['금융 · 증권', '공공기관 · 교육', '미디어', '기업', '여행 · 유통'];

  // Group clients
  const groups = {};
  DataStore.getClients().forEach(c => {
    const cat = CAT_MAP[c.category] || '기타';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(c);
  });

  // Build logo card HTML
  function logoCard(c) {
    const b = BRANDS[c.name];
    if (b) {
      const text = b.text || c.name;
      const size = b.size || 14;
      return `<div class="cl-card reveal">
        <svg viewBox="0 0 ${Math.max(text.length * size * 0.65, 80)} 36" width="${Math.max(text.length * size * 0.65, 80)}" height="36">
          <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
            fill="${b.color}" font-family="'Inter','Noto Sans KR',sans-serif"
            font-size="${size}" font-weight="${b.weight}" letter-spacing="-0.02em">${text}</text>
        </svg>
      </div>`;
    }
    return `<div class="cl-card reveal"><span class="cl-text">${c.name}</span></div>`;
  }

  // Render grouped layout
  el.innerHTML = CAT_ORDER
    .filter(cat => groups[cat] && groups[cat].length)
    .map(cat => `
      <div class="cl-category">
        <div class="cl-category-label">${cat}</div>
        <div class="cl-grid">${groups[cat].map(logoCard).join('')}</div>
      </div>
    `).join('');
}

// ---- SCROLL REVEAL ----
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ---- NAV ----
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

// ---- SMOOTH SCROLL ----
function initSmooth() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderTimeline();
  renderPortfolio();
  renderClients();
  requestAnimationFrame(() => {
    initReveal();
    initNav();
    initCounters();
    initSmooth();
  });
});
