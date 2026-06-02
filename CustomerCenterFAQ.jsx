import { useState, useId, useCallback } from "react";

/* ════════════════════════════════════════════════════════════════
   KDS 토큰 (Figma 변수에서 추출)
   ──────────────────────────────────────────────────────────────── */
const T = {
  brandNavy: "#17008c",
  navySelected: "#0114a7",
  primary: "#4262ff",
  fgBase: "#17191e",
  fgSecondary: "#2a2e36",
  fgTertiary: "#545b69",
  placeholder: "#828ca2",
  fieldBorder: "#e4e8f0",
  borderQuinary: "#e4e8f0",
  borderQuatenary: "#ced4e2",
  bgBase: "#ffffff",
  bgSecondary: "#f7f8fb",
  tableHeader: "#eff2f7",
  tableBorder: "#828ca2",
  radiusSm: 8,
  radiusMd: 10,
};

/* ── 아코디언 자체 모션 토큰 (이 페이지의 펼침/닫힘) ── */
const MOTION = {
  duration: 300,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  fadeIn: 200,
  fadeInDelay: 80,
  fadeOut: 120,
};

const FONT =
  "'Pretendard Variable', Pretendard, 'Pretendard K Edition', -apple-system, sans-serif";
const MONO = "'JetBrains Mono', 'SF Mono', ui-monospace, monospace";

/* ════════════════════════════════════════════════════════════════
   스펙 본문 헬퍼
   ──────────────────────────────────────────────────────────────── */
const P = ({ children, top = 0 }) => (
  <p style={{ margin: 0, marginTop: top, fontSize: 15, lineHeight: 1.7, letterSpacing: "-0.3px", color: T.fgSecondary }}>
    {children}
  </p>
);
const HL = ({ children }) => <span style={{ color: T.primary, fontWeight: 700 }}>{children}</span>;

/* 모션 값 테이블 (key → value) */
function SpecTable({ rows }) {
  return (
    <div style={{ margin: "12px 0 0", border: `1px solid ${T.borderQuatenary}`, borderRadius: T.radiusSm, overflow: "hidden", background: T.bgBase }}>
      {rows.map(([k, v], i) => (
        <div key={k} style={{ display: "flex", gap: 12, padding: "11px 14px", borderBottom: i < rows.length - 1 ? `1px solid ${T.borderQuinary}` : "none", alignItems: "baseline" }}>
          <span style={{ flex: "none", width: 132, fontSize: 13, fontWeight: 600, color: T.fgTertiary }}>{k}</span>
          <span style={{ flex: 1, fontFamily: MONO, fontSize: 13, color: T.fgBase, lineHeight: 1.5 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

/* 코드 블록 */
const Code = ({ children }) => (
  <pre style={{ margin: "12px 0 0", padding: "16px 18px", background: "#1a1c1f", borderRadius: T.radiusSm, overflowX: "auto", fontFamily: MONO, fontSize: 12.5, lineHeight: 1.7, color: "#d6d9de" }}>
    {children}
  </pre>
);

/* 타임라인 시퀀스 */
function Timeline({ steps }) {
  return (
    <ol style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
      {steps.map((s, i) => (
        <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ flex: "none", fontFamily: MONO, fontSize: 12, fontWeight: 700, color: T.primary, background: "#eef1ff", padding: "3px 8px", borderRadius: 6, minWidth: 64, textAlign: "center" }}>{s.t}</span>
          <span style={{ fontSize: 14.5, color: T.fgSecondary, lineHeight: 1.6 }}>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}

const Bullets = ({ items }) => (
  <ul style={{ margin: "12px 0 0", paddingLeft: 18, display: "grid", gap: 6, fontSize: 15, color: T.fgSecondary, lineHeight: 1.6 }}>
    {items.map((t, i) => <li key={i}>{t}</li>)}
  </ul>
);

const Check = ({ items }) => (
  <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 8, fontSize: 14.5, color: T.fgSecondary, lineHeight: 1.55 }}>
    {items.map((t, i) => (
      <li key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
        <span style={{ flex: "none", color: T.primary, fontWeight: 700 }}>✓</span><span>{t}</span>
      </li>
    ))}
  </ul>
);

const Note = ({ children }) => (
  <div style={{ margin: "14px 0 0", padding: "12px 14px", background: "#eef1ff", borderRadius: T.radiusSm, fontSize: 13.5, color: T.fgTertiary, lineHeight: 1.6 }}>
    {children}
  </div>
);

const SubHead = ({ children, top = 18 }) => (
  <div style={{ marginTop: top, marginBottom: 2, fontSize: 14, fontWeight: 700, color: T.fgBase }}>{children}</div>
);

/* ════════════════════════════════════════════════════════════════
   GNB 메가메뉴 펼침 모션 스펙 — 아코디언 본문
   ※ 모션값은 Figma 프로토타입 추출이 아닌, 표준 메가메뉴 패턴 기준 권장 스펙
   ──────────────────────────────────────────────────────────────── */
const SPEC = [
  {
    id: "tokens",
    tag: "모션값",
    question: "GNB 메가메뉴 펼침 — 모션 토큰 정보값",
    answer: (
      <>
        <P>상단 GNB 메뉴에 마우스를 올리면 하위 메가메뉴 패널이 GNB 아래로 펼쳐집니다. 펼침/닫힘에 적용할 권장 모션값입니다.</P>

        <SubHead top={16}>열림 (Open)</SubHead>
        <SpecTable rows={[
          ["transform", "translateY(-8px → 0)"],
          ["opacity", "0 → 1"],
          ["duration", "250ms"],
          ["easing", "cubic-bezier(0.16, 1, 0.3, 1)  /* 감속 */"],
          ["딤 오버레이", "opacity 0 → 0.4 · 200ms ease"],
          ["active 표시", "color/underline · 140ms ease"],
        ]} />

        <SubHead>닫힘 (Close)</SubHead>
        <SpecTable rows={[
          ["transform", "translateY(0 → -8px)"],
          ["opacity", "1 → 0"],
          ["duration", "150ms  /* 열림보다 빠르게 */"],
          ["easing", "cubic-bezier(0.4, 0, 1, 1)  /* 가속 */"],
          ["hover-out 지연", "150ms  /* 의도치 않은 닫힘 방지 */"],
        ]} />

        <SubHead>메뉴 전환 (열린 채 다른 메뉴로)</SubHead>
        <SpecTable rows={[
          ["패널 높이 morph", "200ms · cubic-bezier(0.4, 0, 0.2, 1)"],
          ["콘텐츠 crossfade", "out 80ms / in 120ms"],
        ]} />

        <Note>위 값은 Figma 프로토타입에서 추출한 값이 아니라 표준 메가메뉴 패턴 기준 <HL>권장 스펙</HL>입니다. 확정 전 디자인 검수에서 duration·easing을 합의해 주세요.</Note>
      </>
    ),
  },
  {
    id: "open",
    tag: "펼침",
    question: "메뉴에 마우스를 올리면 어떻게 펼쳐지나요? (열기 시퀀스)",
    answer: (
      <>
        <P>진입 즉시(지연 0ms) 펼침을 시작합니다. 딤 → 패널 슬라이드/페이드 순으로 거의 동시에 진행됩니다.</P>
        <Timeline steps={[
          { t: "0ms", label: "마우스 진입 감지 → 해당 메뉴 active 표시(색/언더라인) 140ms" },
          { t: "0ms", label: "배경 딤 오버레이 opacity 0 → 0.4 (200ms)" },
          { t: "0ms", label: "메가메뉴 패널 translateY(-8px→0) + opacity 0→1 (250ms, 감속)" },
          { t: "250ms", label: "펼침 완료 — 패널 내부 포커스 진입 가능" },
        ]} />
        <Note>패널 콘텐츠는 별도 stagger 없이 패널과 함께 한 번에 나타납니다. 항목별 순차 등장은 과한 모션이라 GNB에선 지양합니다.</Note>
      </>
    ),
  },
  {
    id: "close",
    tag: "닫힘",
    question: "메뉴에서 벗어나면 어떻게 닫히나요? (닫기 시퀀스)",
    answer: (
      <>
        <P>트리거나 패널에서 마우스가 벗어나면 <HL>150ms 지연 후</HL> 닫힙니다. 이 지연이 트리거 → 패널로 커서를 옮기는 사이 패널이 사라지는 현상을 막습니다.</P>
        <Timeline steps={[
          { t: "leave", label: "GNB 영역(트리거+패널) 벗어남 감지 → 150ms 타이머 시작" },
          { t: "+150ms", label: "그 사이 재진입하면 타이머 취소 (닫지 않음)" },
          { t: "close", label: "패널 translateY(0→-8px) + opacity 1→0 (150ms, 가속)" },
          { t: "close", label: "딤 오버레이 opacity → 0 (150ms), active 표시 해제" },
        ]} />
        <P top={14}>열린 상태에서 다른 메뉴로 이동하면 닫지 않고 패널 높이를 morph(200ms)하며 콘텐츠만 crossfade로 교체합니다.</P>
      </>
    ),
  },
  {
    id: "impl",
    tag: "개발",
    question: "개발 구현 방식 — DOM 구조와 상태 관리",
    answer: (
      <>
        <SubHead top={0}>DOM 구조</SubHead>
        <Code>{`<header class="gnb">
  <nav>
    <button
      aria-expanded={open === id}
      aria-controls={\`panel-\${id}\`}
      onMouseEnter={() => openMenu(id)}
      onFocus={() => openMenu(id)}
      onClick={() => toggleMenu(id)}>
      메뉴명
    </button>
  </nav>
  <div id={\`panel-\${id}\`} role="region"
       data-open={open === id}
       onMouseLeave={scheduleClose}>
    {/* 메가메뉴 콘텐츠 */}
  </div>
  <div class="gnb-dim" data-open={open !== null} />
</header>`}</Code>

        <SubHead>상태 / JS 책임</SubHead>
        <Bullets items={[
          <><code style={{ fontFamily: MONO }}>open</code> 상태 하나로 관리 (활성 메뉴 id 또는 null)</>,
          <>진입 시 <code style={{ fontFamily: MONO }}>openMenu(id)</code>, 벗어날 때 <code style={{ fontFamily: MONO }}>scheduleClose()</code> = 150ms <code style={{ fontFamily: MONO }}>setTimeout</code>, 재진입 시 clear,</>,
          "JS는 open 상태·data-open 속성 토글만 담당. 애니메이션은 전부 CSS transition.",
        ]} />

        <SubHead>높이 처리 — 아코디언과 다른 점 (★)</SubHead>
        <P>FAQ 아코디언은 인라인 리스트라 <code style={{ fontFamily: MONO }}>grid-template-rows: 0fr→1fr</code>로 높이를 애니메이션합니다. 반면 GNB 메가메뉴는 <HL>본문 위에 떠 있는 오버레이</HL>라 본문 레이아웃을 밀면 안 됩니다.</P>
        <P top={10}>따라서 GNB는 height가 아니라 <HL>transform + opacity</HL>로 처리합니다. 컴포지터에서 처리돼 reflow 없이 60fps가 유지됩니다. 패널 높이는 콘텐츠에 따라 자연 높이로 두세요.</P>
      </>
    ),
  },
  {
    id: "rules",
    tag: "인터랙션",
    question: "트리거 규칙 — hover / click / 스크롤 / 모바일",
    answer: (
      <>
        <Bullets items={[
          <><b>데스크톱 hover</b> — 진입 즉시 열림, 벗어나면 150ms 후 닫힘. leave 감지는 트리거가 아닌 <b>header 전체</b>(트리거+패널) 기준,</>,
          <><b>클릭/키보드</b> — hover와 별개로 클릭·Enter로 고정 토글 지원 (hover-only는 접근성 위반),</>,
          <><b>스크롤</b> — 열린 상태에서 스크롤 시작 시 닫음 (정책 확정 필요: 닫기 vs 유지),</>,
          <><b>동시 열림 금지</b> — 항상 한 메뉴만 열림. 다른 메뉴 진입 시 전환(닫지 않고 morph),</>,
          <><b>모바일(hover 없음)</b> — GNB는 햄버거/풀스크린 메뉴로 대체, 메가메뉴는 아코디언으로 폴백,</>,
        ]} />
      </>
    ),
  },
  {
    id: "a11y",
    tag: "접근성",
    question: "접근성 & QA 체크리스트",
    answer: (
      <>
        <SubHead top={0}>접근성</SubHead>
        <Bullets items={[
          <>트리거 <code style={{ fontFamily: MONO }}>button</code> + <code style={{ fontFamily: MONO }}>aria-expanded</code> / <code style={{ fontFamily: MONO }}>aria-controls</code>, 패널 <code style={{ fontFamily: MONO }}>role="region"</code> + <code style={{ fontFamily: MONO }}>aria-label</code>,</>,
          "키보드: Tab 진입 · Enter/Space 토글 · Esc 닫고 트리거로 포커스 복귀,",
          <><code style={{ fontFamily: MONO }}>prefers-reduced-motion</code>: transform 제거, opacity만 또는 즉시 표시,</>,
          "focus-visible 아웃라인 필수,",
        ]} />
        <SubHead>QA 체크리스트</SubHead>
        <Check items={[
          "빠른 hover 이동 시 패널 깜빡임 없음 (close 지연 동작)",
          "메뉴 연속 전환 시 높이 morph·crossfade 부드러움",
          "스크롤 중 열림 상태 처리 정책대로 동작",
          "트리거 ↔ 패널 커서 이동 중 닫히지 않음",
          "모바일 폴백(아코디언) 정상 동작",
          "스크린리더로 열림/닫힘 상태 안내됨",
        ]} />
      </>
    ),
  },
];

const CATEGORIES_1 = ["요즘 많이하는 문의", "전체", "민생회복소비쿠폰", "예금·적금", "대출", "카드", "청소년 서비스", "해외", "보험", "케이뱅크 페이"];
const CATEGORIES_2 = ["앱서비스", "인증·OTP", "이체", "ATM·CD", "공과금", "사고신고", "기타"];
const NAV = ["은행소개", "예적금", "대출", "카드", "사장님", "서비스", "투자", "새소식&블로그", "고객센터", "인재영입", "기업뱅킹"];

/* ════════════════════════════════════════════════════════════════
   AccordionItem
   ──────────────────────────────────────────────────────────────── */
function AccordionItem({ item, isOpen, onToggle, isLast }) {
  const panelId = useId();
  const btnId = useId();
  return (
    <div style={{ borderBottom: isLast ? "none" : `1px solid ${T.borderQuinary}` }}>
      <button id={btnId} aria-expanded={isOpen} aria-controls={panelId} onClick={onToggle}
        style={{ width: "100%", appearance: "none", border: "none", background: "transparent", font: "inherit", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, padding: "24px 4px" }}>
        <span style={{ color: T.primary, fontWeight: 700, fontSize: 16, flex: "none", width: 18 }}>Q</span>
        <span style={{ flex: 1, fontSize: 16, fontWeight: 500, color: T.fgBase, letterSpacing: "-0.3px" }}>
          <span style={{ color: T.navySelected, fontWeight: 600 }}>[{item.tag}]</span> {item.question}
        </span>
        <svg viewBox="0 0 24 24" fill="none" style={{ flex: "none", width: 22, height: 22, color: T.fgTertiary, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: `transform ${MOTION.duration}ms ${MOTION.easing}` }}>
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id={panelId} role="region" aria-labelledby={btnId} style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: `grid-template-rows ${MOTION.duration}ms ${MOTION.easing}` }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ margin: "0 0 20px", padding: "24px 28px", background: T.bgSecondary, borderRadius: T.radiusMd, opacity: isOpen ? 1 : 0, transition: isOpen ? `opacity ${MOTION.fadeIn}ms ease ${MOTION.fadeInDelay}ms` : `opacity ${MOTION.fadeOut}ms ease` }}>
            {item.answer}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   페이지
   ──────────────────────────────────────────────────────────────── */
export default function App() {
  const [openId, setOpenId] = useState("tokens");
  const [activeCat, setActiveCat] = useState("민생회복소비쿠폰");
  const toggle = useCallback((id) => setOpenId((cur) => (cur === id ? null : id)), []);

  const chip = (label) => {
    const active = activeCat === label;
    return (
      <button key={label} onClick={() => setActiveCat(label)} style={{ appearance: "none", font: "inherit", fontSize: 14, fontWeight: active ? 600 : 400, padding: "8px 16px", borderRadius: 1000, cursor: "pointer", background: T.bgBase, border: `1px solid ${active ? T.navySelected : T.borderQuinary}`, color: active ? T.navySelected : T.fgTertiary, transition: "border-color 140ms ease, color 140ms ease", whiteSpace: "nowrap" }}>{label}</button>
    );
  };

  return (
    <div style={{ fontFamily: FONT, background: T.bgBase, minHeight: "100vh", color: T.fgBase, WebkitFontSmoothing: "antialiased" }}>
      {/* GNB — 이 스펙의 대상 컴포넌트 */}
      <header style={{ borderBottom: `1px solid ${T.borderQuinary}`, background: T.bgBase, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", height: 64, display: "flex", alignItems: "center", gap: 32, padding: "0 24px" }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: T.brandNavy, letterSpacing: "-0.5px", flex: "none" }}>Kbank</span>
          <nav style={{ flex: 1, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {NAV.map((n) => (<span key={n} style={{ fontSize: 15, fontWeight: 500, color: n === "고객센터" ? T.primary : T.fgSecondary, cursor: "pointer", whiteSpace: "nowrap" }}>{n}</span>))}
          </nav>
          <button style={{ flex: "none", appearance: "none", border: "none", background: T.primary, color: "#fff", font: "inherit", fontSize: 14, fontWeight: 600, padding: "9px 16px", borderRadius: T.radiusSm, cursor: "pointer" }}>앱 다운로드</button>
        </div>
      </header>

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "56px 24px 80px" }}>
        <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.5px", color: T.fgBase, margin: "0 0 12px" }}>자주 묻는 질문</h1>
        <p style={{ margin: "0 0 24px", fontSize: 15, color: T.fgTertiary, lineHeight: 1.6 }}>
          각 항목을 펼치면 <b style={{ color: T.fgSecondary }}>상단 GNB 메가메뉴 펼침 모션 스펙</b>과 개발 전달 내용이 정리되어 있습니다.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${T.fieldBorder}`, borderRadius: T.radiusMd, padding: "14px 18px", marginBottom: 20 }}>
          <input placeholder="예 : 신분증 촬영" style={{ flex: 1, border: "none", outline: "none", font: "inherit", fontSize: 16, color: T.fgBase, background: "transparent" }} />
          <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22, color: T.placeholder }}>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" /><path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>{CATEGORIES_1.map(chip)}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>{CATEGORIES_2.map(chip)}</div>

        <div style={{ fontSize: 18, fontWeight: 700, color: T.fgBase, marginBottom: 8, borderBottom: `2px solid ${T.fgSecondary}`, paddingBottom: 16 }}>
          GNB 펼침 모션 스펙 <span style={{ color: T.primary }}>총 {SPEC.length}건</span>
        </div>

        <div>
          {SPEC.map((item, i) => (
            <AccordionItem key={item.id} item={item} isOpen={openId === item.id} onToggle={() => toggle(item.id)} isLast={i === SPEC.length - 1} />
          ))}
        </div>
      </main>

      <footer style={{ background: T.bgSecondary, borderTop: `1px solid ${T.borderQuinary}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 24px 56px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.fgBase, marginBottom: 10 }}>고객센터</div>
          <div style={{ fontSize: 14, color: T.fgTertiary, marginBottom: 32, display: "flex", gap: 20, flexWrap: "wrap" }}>
            <span>은행 1522-1000</span><span>카드 1522-1155</span><span>해외 82-2-3778-9111</span>
          </div>
          <div style={{ fontSize: 12, color: T.placeholder, lineHeight: 1.7 }}>
            (주)케이뱅크 &nbsp; 대표이사 최우형 &nbsp; 사업자 등록번호 826-81-00172 &nbsp; 서울특별시 중구 (을지로4가, 을지트윈타워) 동관 6층<br />
            Copyright Kbank. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
