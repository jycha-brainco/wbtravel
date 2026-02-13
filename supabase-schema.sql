-- ============================================
-- WELLBEING TRAVEL - Database Schema
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. 연혁 (History)
CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  year TEXT NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 포트폴리오 (Portfolio)
CREATE TABLE IF NOT EXISTS portfolio (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  participants TEXT NOT NULL DEFAULT '',
  services TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'workshop',
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. 고객사 (Clients)
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  brand_color TEXT,
  brand_text TEXT,
  brand_weight INTEGER,
  brand_size INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_history_updated BEFORE UPDATE ON history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_portfolio_updated BEFORE UPDATE ON portfolio
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. RLS (Row Level Security)
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY history_public_read ON history FOR SELECT USING (true);
CREATE POLICY portfolio_public_read ON portfolio FOR SELECT USING (true);
CREATE POLICY clients_public_read ON clients FOR SELECT USING (true);

-- service_role 전체 권한 (관리자용)
CREATE POLICY history_service_all ON history FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY portfolio_service_all ON portfolio FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY clients_service_all ON clients FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- SEED DATA
-- ============================================

-- 연혁 데이터
INSERT INTO history (year, items, sort_order) VALUES
  ('2003', ARRAY['(주)웰빙트래블 설립'], 1),
  ('2004-2006', ARRAY['IATA 국제항공운송협회 가입','맘스투어 특허상표출원 (맘스투어, Momstour 상표등록)','상해 핸드폰 배낭여행 상품 출시'], 2),
  ('2007', ARRAY['대한항공 수선화 멤버','대신정보통신 / VK 파트너십','아시아나항공 우수대리점','모두투어 항공콜센터 공동운영'], 3),
  ('2009-2015', ARRAY['서울시 관광협회 최우수여행사 6년 연속 선정','CITI BANK 파트너십','동아일보 파트너십 - 전국 3위','골프전문 사이트 egolftour 오픈','동국제강그룹 / Korea Financial Group 파트너십','루트로닉 / 대진기계 / 유안타증권 파트너십'], 4),
  ('2016', ARRAY['PIVOT group / 초록마을 파트너십','태웅로직스 / 인사혁신처 파트너십','프리미엄 국내여행 루하여행 공동상품 운영'], 5),
  ('2017', ARRAY['브루나이 관광청 업무협약','맘스투어 브루나이투어 시작','로열브루나이항공 하드블럭 체결','KATA 한국여행업협회 가입'], 6),
  ('2018', ARRAY['종합여행업 변경 등록','SM 면세점 밴더 등록','NH투자증권 / 한국투자증권 / IBK투자증권 파트너십','채널A / 대성엘텍 파트너십'], 7),
  ('2019', ARRAY['한국무역보험공사 파트너십','모두투어 Incentive Trip 공동운영','Bah Makan 브루나이 미식축제 한국 공식지정여행사'], 8),
  ('2020-2021', ARRAY['COVID-19 기간 기업서비스 지속 제공','BIT / 엘리케이파크 / EL WIDE / 피닉슨컨트롤즈 파트너십'], 9),
  ('2022-2023', ARRAY['동아일보 터키지진 취재지원'], 10),
  ('2024', ARRAY['국민대학교 파트너십','수원시청 오사카 방문행사','중부일보 스페인/프랑스/스위스 취재지원','서울국제관광전 브루나이 부스 운영'], 11),
  ('2025', ARRAY['안양시청 ITS 두바이 총회 행사','한국IT비즈니스진흥협회 파트너십','momstour.com 채널 오픈','서울국제관광전 브루나이 부스 운영','MIRI 이스트우드밸리 주관판매사 선정','E채널 류학생어남선 브루나이편 코디네이팅'], 12);

-- 포트폴리오 데이터
INSERT INTO portfolio (title, location, participants, services, category, sort_order) VALUES
  ('P그룹 미국 시책 워크샵', '미국 서부 (LA, 샌프란시스코)', '50명', '행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', 'workshop', 1),
  ('W기업 중국 워크샵', '장가계, 중국', '30명', '행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', 'workshop', 2),
  ('D기업 우수고객사 초청 골프대회', '제주도, 대한민국', '50명', '행사지 제안, 항공/숙박/골프장/차량/가이드 수배, 현지운영', 'golf', 3),
  ('T사 치앙마이 우수사원 워크샵', '치앙마이, 태국', '55명', '행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', 'workshop', 4),
  ('R사 라스베가스 워크샵', '라스베가스, 미국', '75명', '행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', 'workshop', 5),
  ('H은행 우수조합원 대만 워크샵', '대만', '20명', '행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', 'workshop', 6),
  ('T사 다낭 우수사원 워크샵', '다낭, 베트남', '20명', '행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', 'workshop', 7),
  ('H사 문경 조합원 워크샵', '문경, 경상북도', '20명', '행사지 제안, 항공/숙박/차량/가이드 수배, 현지운영', 'workshop', 8),
  ('브루나이 인플루언서 초청 행사', '브루나이', '5명', '항공/숙박/차량/가이드 수배, 현지운영', 'event', 9),
  ('S사 고객사 초청 골프행사', '제주도, 대한민국', '30명', '항공/숙박/골프장/차량/가이드 수배, 현지운영', 'golf', 10),
  ('K대학교 대학원 해외 워크숍', '후쿠오카, 일본', '50명', '항공/숙박/세미나/차량/가이드 수배, 현지운영', 'workshop', 11);

-- 고객사 데이터
INSERT INTO clients (name, category, brand_color, brand_text, brand_weight, brand_size, sort_order) VALUES
  ('동국제강그룹', '대기업', '#003478', '동국제강', 800, NULL, 1),
  ('Korea Financial Group', '금융', '#1A5276', 'KFG', 800, 18, 2),
  ('NH투자증권', '금융', '#00823F', NULL, 800, NULL, 3),
  ('한국투자증권', '금융', '#F58220', NULL, 700, NULL, 4),
  ('IBK투자증권', '금융', '#0072BC', 'IBK', 800, 18, 5),
  ('유안타증권', '금융', '#ED1C24', NULL, 700, NULL, 6),
  ('CITI BANK', '금융', '#003DA5', 'CITI', 800, 18, 7),
  ('한국무역보험공사', '공공기관', '#003DA5', 'K-SURE', 800, 16, 8),
  ('인사혁신처', '공공기관', '#1A5276', NULL, 700, NULL, 9),
  ('국민대학교', '교육', '#8B1A2B', NULL, 700, NULL, 10),
  ('루트로닉', '기업', NULL, NULL, NULL, NULL, 11),
  ('대진기계', '기업', NULL, NULL, NULL, NULL, 12),
  ('대신정보통신', '기업', NULL, NULL, NULL, NULL, 13),
  ('PIVOT group', '기업', '#2C3E50', 'PIVOT', 800, 16, 14),
  ('태웅로직스', '기업', NULL, NULL, NULL, NULL, 15),
  ('대성엘텍', '기업', NULL, NULL, NULL, NULL, 16),
  ('동아일보', '미디어', '#C41230', NULL, 800, NULL, 17),
  ('채널A', '미디어', '#E31937', NULL, 800, NULL, 18),
  ('중부일보', '미디어', '#1B4F72', NULL, 700, NULL, 19),
  ('E채널', '미디어', '#E31937', NULL, 800, NULL, 20),
  ('수원시청', '공공기관', '#1B6B1B', NULL, 700, NULL, 21),
  ('안양시청', '공공기관', '#2E86C1', NULL, 700, NULL, 22),
  ('초록마을', '기업', NULL, NULL, NULL, NULL, 23),
  ('모두투어', '여행', '#0066B3', NULL, 700, NULL, 24),
  ('하나투어', '여행', '#F37321', NULL, 700, NULL, 25),
  ('SM면세점', '유통', '#C70039', 'SM', 800, 18, 26),
  ('한국IT비즈니스진흥협회', '협회', NULL, NULL, NULL, NULL, 27),
  ('BIT', '기업', NULL, NULL, NULL, NULL, 28),
  ('엘리케이파크', '기업', NULL, NULL, NULL, NULL, 29),
  ('피닉슨컨트롤즈', '기업', NULL, NULL, NULL, NULL, 30);
