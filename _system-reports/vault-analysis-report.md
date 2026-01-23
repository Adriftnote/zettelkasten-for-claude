---
title: Obsidian Vault 정량적 분석 리포트
created: 2026-01-22
type: analysis
tags:
- vault-analysis
- folder-structure
- knowledge-organization
- atomic-notes
permalink: vault-analysis-report-1
---

# Obsidian Vault 정량적 분석 리포트

**분석 일자**: 2026-01-22
**목적**: 폴더 구조 개선 및 원자적 노트/허브 노트 체계 정리

---

## 📊 전체 통계

### 기본 지표
- **총 노트 수**: 229개
- **폴더 수**: 18개 (`.obsidian`, `.claude` 제외)
- **Frontmatter 사용률**: 92.2% (212/230 파일)
- **총 Wikilink 수**: 1,013개
- **평균 링크 수**: 4.4개/파일
- **고아 노트**: 100개 (43.5%)

### 링크 밀도 분포
| 링크 개수 | 파일 수 | 비율 |
|-----------|---------|------|
| 0개 | 100 | 43.5% |
| 1-5개 | 85 | 37.0% |
| 6-10개 | 22 | 9.6% |
| 11-20개 | 14 | 6.1% |
| 21-50개 | 6 | 2.6% |
| 50개 이상 | 3 | 1.3% |

### 태그 사용 현황
- **총 태그 수**: 644개
- **고유 태그 수**: 360개
- **평균 태그 수**: 2.8개/파일

**Top 5 태그**:
1. `#metabase` (27회)
2. `#best-practice` (18회)
3. `#mcp` (15회)
4. `#workflow` (15회)
5. `#workaround` (13회)

---

## 🗂️ 폴더 구조 분석

### 현재 폴더별 파일 수

```
📁 Root Level (1개)
  └─ README.md

📁 01. concepts (88개) ⚠️ 과밀
  └─ 00.index.md (허브 노트, 66 links)

📁 02. knowledge (3개)
  ├─ architectures (18개)
  │   └─ 00.index.md
  ├─ automation-and-workflow (1개)
  ├─ gotchas (46개) ⚠️ 과밀
  │   └─ 00.index.md (허브 노트, 60 links)
  ├─ guides (2개)
  ├─ patterns (22개)
  │   └─ 00.index.md
  ├─ programming-basics (6개)
  └─ setup-and-guides (9개)

📁 knowledge-base (29개)
  ├─ diagrams (0개)
  ├─ inbox (1개)
  ├─ notes (6개)
  ├─ reports (6개)
  ├─ reviews (8개)
  ├─ templates (1개)
  ├─ tests (0개)
  └─ work-cases (5개)
```

### 폴더 크기 문제점

| 폴더 | 파일 수 | 상태 | 권장 크기 |
|------|---------|------|----------|
| `01. concepts` | 88 | ⚠️ **과밀** | 30-50개 |
| `02. knowledge/gotchas` | 46 | ⚠️ **과밀** | 30-40개 |
| `02. knowledge/patterns` | 22 | ✅ 적정 | 20-30개 |
| `02. knowledge/architectures` | 18 | ✅ 적정 | 15-25개 |

---

## 🔗 링크 구조 분석

### Top 10 허브 노트 (Incoming Links)
가장 많이 참조되는 노트들:

| 순위 | 노트 | 백링크 수 | 위치 |
|------|------|-----------|------|
| 1 | UTF-8 | 27 | 01. concepts |
| 2 | token-optimization-strategy | 20 | 01. concepts |
| 3 | 2026-01-22 (Daily Note) | 16 | - |
| 4 | Byte | 16 | 01. concepts |
| 5 | UTF-16 | 16 | 01. concepts |
| 6 | Unicode | 15 | 01. concepts |
| 7 | Character Encoding | 14 | 01. concepts |
| 8 | ASCII | 13 | 01. concepts |
| 9 | progressive-disclosure | 12 | 01. concepts |
| 10 | context-poisoning | 11 | 01. concepts |

### Top 10 연결 노트 (Outgoing Links)
가장 많은 링크를 포함하는 노트들:

| 순위 | 노트 | 링크 수 | 역할 |
|------|------|---------|------|
| 1 | `01. concepts/00.index.md` | 66 | 🌟 **메인 허브** |
| 2 | `02. knowledge/gotchas/00.index.md` | 60 | 🌟 **메인 허브** |
| 3 | `knowledge-base/reviews/basic-memory-comprehensive-guide.md` | 57 | 가이드 |
| 4 | `02. knowledge/patterns/00.index.md` | 22 | 🌟 **허브** |
| 5 | `02. knowledge/architectures/00.index.md` | 18 | 🌟 **허브** |

**관찰**: `00.index.md` 파일들이 명확하게 허브 역할을 수행하고 있음

---

## 🎯 원자적 노트 & 허브 노트 분석

### 현재 구조
```
원자적 노트 (Atomic Notes)
  └─ 01. concepts/ (88개)
      ├─ UTF-8.md
      ├─ token-optimization-strategy.md
      ├─ progressive-disclosure.md
      └─ ... (85개 더)

허브 노트 (Hub Notes)
  └─ 02. knowledge/ (7개 하위 폴더)
      ├─ architectures/00.index.md (18 links)
      ├─ gotchas/00.index.md (60 links)
      ├─ patterns/00.index.md (22 links)
      └─ ... (기타 허브들)
```

### 허브 노트의 링크 구조
- `01. concepts/00.index.md`: 66개 원자적 개념을 조직화
- `02. knowledge/gotchas/00.index.md`: 46개 문제 해결 노트를 조직화
- `02. knowledge/patterns/00.index.md`: 22개 패턴 노트를 조직화

**강점**: 허브-원자 구조가 명확히 구분됨
**약점**: 원자적 노트가 단일 폴더에 과도하게 집중 (88개)

---

## ⚠️ 주요 문제점

### 1. 고아 노트 과다 (43.5%)
- **100개 노트**가 다른 노트와 연결 없음
- 지식 그래프에서 고립됨
- 검색으로만 찾을 수 있음

### 2. 낮은 링크 밀도
- 평균 4.4개/파일 (권장: 5-10개)
- 양방향 링크 부족
- 지식 간 연결성 낮음

### 3. 폴더 과밀
- `01. concepts` (88개): 너무 많은 파일
- `02. knowledge/gotchas` (46개): 서브카테고리 필요
- 카테고리 세분화 부족

### 4. 불일치하는 태그 사용
- 360개의 고유 태그 (과도함)
- 유사 태그 중복 가능성 (#mcp, #MCP, #metabase, #Metabase 등)
- 태그 정리 필요

### 5. 폴더 구조 이원화
- `01. concepts` + `02. knowledge` 구조
- `knowledge-base` 별도 구조
- 통합 필요성 검토 필요

---

## 💡 폴더 구조 개선 제안

### 제안 1: concepts 폴더 세분화 ⭐ **추천**

```
01. concepts/ (88개 → 카테고리별 분산)
  ├─ 00.index.md (메인 허브)
  ├─ web-fundamentals/ (10개)
  │   ├─ 00.index.md
  │   ├─ HTML.md
  │   ├─ CSS.md
  │   └─ JavaScript.md
  ├─ programming-basics/ (18개)
  │   ├─ 00.index.md
  │   ├─ source-code.md
  │   └─ compiler.md
  ├─ design-patterns/ (23개)
  │   ├─ 00.index.md
  │   ├─ context-engineering/ (9개)
  │   ├─ mcp-patterns/ (5개)
  │   └─ optimization/ (3개)
  ├─ architectures/ (9개)
  │   └─ 00.index.md
  ├─ encoding/ (8개) ← UTF-8, UTF-16, Unicode 등
  │   └─ 00.index.md
  └─ tools-and-platforms/ (20개)
      └─ 00.index.md
```

**장점**:
- 각 폴더 10-25개로 적정 크기
- 개념별 명확한 구분
- 허브 노트 다층 구조 (root → category → concept)

**단점**:
- 기존 링크 대량 수정 필요 (파일 이동)
- 초기 작업량 많음

---

### 제안 2: knowledge 폴더 세분화

```
02. knowledge/
  ├─ gotchas/ (46개 → 카테고리별 분산)
  │   ├─ 00.index.md
  │   ├─ claude-code/ (13개)
  │   ├─ mcp/ (6개)
  │   ├─ metabase/ (5개)
  │   ├─ javascript/ (4개)
  │   ├─ network/ (2개)
  │   └─ misc/ (7개)
  ├─ patterns/ (22개) ✅ 유지
  ├─ architectures/ (18개) ✅ 유지
  └─ ... (기타)
```

---

### 제안 3: knowledge-base 통합 검토

**현재 상황**:
- `01. concepts` + `02. knowledge`: 원자-허브 체계
- `knowledge-base/`: 별도 조직 체계 (reviews, reports, notes 등)

**옵션 A - 분리 유지**:
```
01. concepts/         ← 원자적 개념 (변경 적음)
02. knowledge/        ← 허브 노트 (참조용)
03. work-artifacts/   ← knowledge-base를 리네임
  ├─ reviews/
  ├─ reports/
  └─ notes/
```

**옵션 B - 통합**:
```
knowledge/
  ├─ concepts/        ← 원자적 개념
  ├─ guides/          ← 허브 노트
  └─ artifacts/       ← 작업 산출물
```

**권장**: **옵션 A (분리 유지)** - 현재 구조가 명확히 구분되어 있음

---

### 제안 4: 폴더명 개선

현재 폴더명의 번호 접두사는 정렬용이지만 가독성이 낮음:

| 현재 | 제안 | 이유 |
|------|------|------|
| `01. concepts` | `concepts` | 번호 제거, 심플하게 |
| `02. knowledge` | `guides` | 역할 명확화 (허브 노트 = 가이드) |
| `knowledge-base` | `artifacts` | 명확한 역할 구분 |

**최종 구조**:
```
concepts/              ← 원자적 개념 (88개 → 서브카테고리화)
  ├─ web-fundamentals/
  ├─ programming-basics/
  ├─ design-patterns/
  └─ ...

guides/                ← 허브 노트 (knowledge → guides)
  ├─ architectures/
  ├─ gotchas/
  ├─ patterns/
  └─ ...

artifacts/             ← 작업 산출물 (knowledge-base → artifacts)
  ├─ reviews/
  ├─ reports/
  └─ notes/
```

---

## 🔧 실행 계획

### Phase 1: 준비 및 분석 (1-2시간)
- [x] Vault 전체 링크 구조 분석
- [x] 고아 노트 목록 확인
- [ ] 태그 중복 확인 및 정리 계획
- [ ] 파일 이동 계획 수립

### Phase 2: concepts 폴더 세분화 (3-4시간)
- [ ] 서브카테고리 폴더 생성
- [ ] 파일 이동 (Obsidian의 파일 이동 기능 사용 - 자동 링크 업데이트)
- [ ] 각 서브카테고리에 00.index.md 생성
- [ ] 메인 00.index.md 업데이트

### Phase 3: gotchas 폴더 세분화 (2-3시간)
- [ ] 카테고리별 서브폴더 생성
- [ ] 파일 이동
- [ ] 00.index.md 업데이트

### Phase 4: 고아 노트 연결 (2-3시간)
- [ ] 100개 고아 노트 중 우선순위 선정
- [ ] 관련 노트와 링크 연결
- [ ] 허브 노트에 등록

### Phase 5: 폴더명 변경 (선택적, 1시간)
- [ ] 폴더명 변경 (01. concepts → concepts)
- [ ] 링크 확인 및 수정

---

## 📈 개선 기대 효과

### 정량적 목표
| 지표 | 현재 | 목표 | 개선 |
|------|------|------|------|
| 평균 링크 밀도 | 4.4개 | 6-8개 | +36-82% |
| 고아 노트 비율 | 43.5% | <20% | -54% |
| 폴더당 평균 파일 수 | 12.7개 | 15-25개 | 균등화 |
| 최대 폴더 크기 | 88개 | <30개 | -66% |

### 정성적 효과
1. **탐색성 향상**: 서브카테고리로 개념 찾기 쉬워짐
2. **연결성 증가**: 고아 노트 감소 → 지식 그래프 활성화
3. **유지보수성**: 폴더당 파일 수 적정 → 관리 용이
4. **확장성**: 새 개념 추가 시 적절한 위치 명확

---

## 🎬 즉시 실행 가능한 Quick Wins

1. **고아 노트 Top 10 연결** (30분)
   - 주요 개념 노트 중 링크 없는 것들 먼저 연결

2. **00.index.md 보강** (1시간)
   - 기존 허브 노트에 누락된 파일 추가

3. **태그 정리** (1시간)
   - 중복 태그 통합 (#mcp vs #MCP)
   - 사용 빈도 낮은 태그 삭제

4. **Frontmatter 추가** (30분)
   - 18개 파일에 frontmatter 추가

---

## 📎 참고 자료

### 분석에 사용된 주요 파일
- [[01. concepts/00.index.md]] - 60개 원자적 개념 허브
- [[03. sources/gotchas/00.index]] - 45개 문제 해결 허브
- [[03. sources/patterns/00.index]] - 패턴 허브

### Zettelkasten 원칙
- 원자적 노트: 하나의 개념 = 하나의 파일
- 허브 노트: 관련 원자적 노트를 조직화
- 링크 우선: 폴더보다 링크로 연결

### 권장 읽기
- "How to Take Smart Notes" by Sönke Ahrens
- Obsidian 공식 문서: Graph View 활용

---

**다음 단계**: 위 실행 계획 중 어느 Phase부터 시작할지 결정 필요