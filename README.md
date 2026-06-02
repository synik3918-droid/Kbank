# K-Bank FAQ Accordion · GNB 펼침 모션 스펙

K-Bank 고객센터 「자주 묻는 질문」 페이지를 부드러운 아코디언 모션으로 구현한 프로토타입.
각 아코디언 항목 본문에는 **GNB 메가메뉴 펼침 모션 스펙 + 개발 전달 내용**이 정리되어 있습니다.

## 미리보기 (GitHub Pages)

저장소 `Settings → Pages → Branch: main / root` 설정 후:

```
https://<username>.github.io/<repo>/
```

빌드 과정 없이 `index.html`이 그대로 렌더링됩니다 (React 18 + Babel CDN).

## 파일

| 파일 | 설명 |
|------|------|
| `index.html` | 빌드 없이 바로 열리는 standalone 데모 (공유·미리보기용) |
| `CustomerCenterFAQ.jsx` | 원본 React 컴포넌트 소스 (프로젝트 이식용) |
| `.nojekyll` | GitHub Pages에서 Jekyll 처리 비활성화 |

## 아코디언 모션

| 항목 | 값 |
|------|-----|
| 높이 기법 | `grid-template-rows: 0fr → 1fr` (max-height 미사용) |
| 펼침/닫힘 | `300ms` · `cubic-bezier(0.4, 0, 0.2, 1)` |
| 셰브론 | `rotate(180deg)` · 높이와 동일 duration·easing |
| 콘텐츠 등장 | opacity 0→1 · `200ms` · delay `80ms` |
| 콘텐츠 사라짐 | opacity 1→0 · `120ms` |

## 본문 = GNB 메가메뉴 펼침 스펙

상단 GNB가 스펙의 대상 컴포넌트. 6개 항목 구성:

1. **모션값** — 열림/닫힘/메뉴전환 모션 토큰
2. **펼침** — 마우스 진입 시 열기 시퀀스 타임라인
3. **닫힘** — 150ms 지연 닫힘 + 재진입 취소
4. **개발** — DOM 구조·상태 관리 / GNB는 height가 아닌 `transform + opacity` 처리 (아코디언과 구분점)
5. **인터랙션** — hover / click / 스크롤 / 모바일 폴백
6. **접근성·QA** — aria · 키보드 · reduced-motion · 체크리스트

> GNB 모션 수치(250ms/150ms 등)는 Figma 프로토타입 추출값이 아닌 표준 메가메뉴 패턴 기준 **권장 스펙**입니다. 디자인 검수에서 확정 필요.

## 토큰

컬러·폰트·라운드는 KDS / Figma 변수에서 추출. 컴포넌트 상단 `T`, `MOTION` 객체에서 일괄 교체 가능.
