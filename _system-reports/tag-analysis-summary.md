# 태그 중복 분석 요약

**분석 일시**: 2026-01-22
**대상 경로**: `C:\claude-workspace\working\from-obsidian`
**분석 대상**: 모든 `.md` 파일

---

## 핵심 통계

| 지표 | 값 | 비고 |
|------|-----|------|
| 총 태그 출현 | **670회** | grep으로 추출한 모든 태그 |
| 고유 태그 | **375개** | 중복 제거 후 |
| 1회만 사용 | **278개** (74.1%) | 삭제 후보 |
| 1-2회 사용 | **328개** (87.5%) | 저빈도 |
| 3회 이상 사용 | **47개** (12.5%) | 유지 권장 |

---

## Top 30 태그 (빈도순)

| 순위 | 태그 | 빈도 | 비고 |
|------|------|------|------|
| 1 | `#metabase` | 29회 | (+1 from #Metabase) |
| 2 | `#best-practice` | 19회 | (+1 from #best-practices) |
| 3 | `#mcp` | 18회 | (+2 from #MCP) |
| 4 | `#workflow` | 16회 | |
| 5 | `#workaround` | 14회 | |
| 6 | `#architecture` | 12회 | |
| 7 | `#limitation` | 10회 | (+1 from #limitations) |
| 8 | `#automation` | 9회 | |
| 9 | `#debugging` | 8회 | (통합 후 15회 가능) |
| 10 | `#windows` | 7회 | |
| 11 | `#token-optimization` | 6회 | |
| 12 | `#powershell` | 6회 | |
| 13 | `#excel` | 6회 | |
| 14 | `#encoding` | 6회 | |
| 15 | `#config` | 6회 | (통합 후 12회 가능) |
| 16 | `#claude-code` | 6회 | |
| 17 | `#troubleshooting` | 5회 | |
| 18 | `#Heading` | 5회 | → `#heading` |
| 19 | `#error-handling` | 5회 | (통합 후 16회 가능) |
| 20 | `#claude` | 5회 | |
| 21 | `#anti-pattern` | 5회 | |
| 22 | `#telemetry` | 4회 | |
| 23 | `#sql` | 4회 | |
| 24 | `#performance` | 4회 | |
| 25 | `#optimization` | 4회 | (통합 후 10회 가능) |
| 26 | `#network` | 4회 | |
| 27 | `#memory` | 4회 | |
| 28 | `#gotcha` | 4회 | |
| 29 | `#configuration` | 4회 | → `#config` |
| 30 | `#claude-sdk` | 4회 | |

---

## 중복 유형 분석

### 1. 대소문자 중복 (5건, 6회 중복)
- `#MCP` (2) → `#mcp` (18)
- `#Metabase` (1) → `#metabase` (29)
- `#Heading` (5) → `#heading` (1)
- `#Search` (1) → `#search` (1)
- `#Implementation` (1) → `#implementation` (1)

### 2. 단수/복수 중복 (5건, 6회 중복)
- `#best-practices` (1) → `#best-practice` (19)
- `#limitations` (1) → `#limitation` (10)
- `#tags` (2) → `#tag` (3)
- `#hooks` (1) → `#hook` (1)
- `#template-tags` (1) → `#template-tag` (1)

### 3. 하이픈/언더스코어 중복 (2건)
- `#bugfix` (1) → `#bug-fix` (1)
- `#tag_with_underscores` (1) → `#tag-with-dashes` (1)

### 4. 의미적 중복 (주요 카테고리)

| 카테고리 | 현재 태그 수 | 통합 후 | 통합 효과 |
|---------|------------|---------|----------|
| Error 관련 | 11개 태그 | 1개 | **error-handling: 5→16회** |
| Debugging | 4개 태그 | 1-2개 | **debugging: 8→15회** |
| Config | 4개 태그 | 1개 | **config: 6→12회** |
| Optimization | 5개 태그 | 2개 | **optimization: 4→10회** |
| Data | 6개 태그 | 2개 | **data-quality: 2→5회** |
| API | 5개 태그 | 1개 | **api: 1→5회** |
| File | 6개 태그 | 2개 | **file-handling: 2→5회** |
| Version | 5개 태그 | 1개 | **version: 1→5회** |

---

## 삭제 후보 (1회 사용 + 의미 불명)

### 카테고리별 삭제 후보

| 카테고리 | 개수 | 예시 |
|---------|------|------|
| 범용 단어 | 8개 | #This, #Key, #View, #solution |
| 색상 코드 | 2개 | #fff, #FF0000 |
| 섹션 번호 | 20개 | #1-, #2-, #section-6 |
| 너무 구체적 | 30개 | #toolhub-execute, #merged-cells |
| 중복 의미 | 40개 | #fix-needed, #root-cause |
| 이슈 번호 (1회) | 30개 | 3회 이상만 유지 |

**총 삭제 가능**: 약 130개 태그

---

## 통합 효과 예측

| 지표 | 현재 | 통합 후 | 개선 |
|------|------|---------|------|
| **고유 태그** | 375개 | ~250개 | **-33%** |
| **1회 사용 태그** | 278개 | ~180개 | **-35%** |
| **태그 커버리지** | - | - | - |
| Top 10 태그가 커버하는 비율 | 24.6% (165/670) | 약 35% | +42% |

### 주요 태그 빈도 증가 예상

| 태그 | 현재 | 통합 후 | 증가 |
|------|------|---------|------|
| `#error-handling` | 5회 | 16회 | **+220%** |
| `#debugging` | 8회 | 15회 | **+88%** |
| `#config` | 6회 | 12회 | **+100%** |
| `#optimization` | 4회 | 10회 | **+150%** |
| `#data-quality` | 2회 | 5회 | **+150%** |
| `#api` | 1회 | 5회 | **+400%** |

---

## 실행 우선순위

### 🔥 Phase 1: 즉시 실행 (11건, 자동화 가능)
- 대소문자 통일 (5건, 6회)
- 단수/복수 통일 (5건, 6회)
- 하이픈 통일 (1건, 1회)

**도구**: Obsidian Tag Wrangler 플러그인

### 🟡 Phase 2: 수동 검토 후 실행 (30건)
- Error 관련 통합 (10건, 11회 증가)
- Debugging 관련 통합 (3건, 7회 증가)
- Config 관련 통합 (3건, 6회 증가)
- 기타 의미적 통합 (14건)

**방법**: 문맥 확인 후 Tag Wrangler로 변경

### 🟢 Phase 3: 삭제 (130건)
- 범용/의미불명 태그 삭제 (8건)
- 섹션/숫자 태그 삭제 (20건)
- 1회 사용 + 너무 구체적 (100+건)

**방법**: Tag Wrangler에서 직접 삭제

---

## 태그 네이밍 컨벤션 (제안)

### ✅ DO
- 소문자 사용: `#mcp`, `#metabase`
- 단수형 우선: `#limitation`, `#best-practice`
- 하이픈 구분: `#error-handling`, `#best-practice`
- 구체성 레벨:
  - 일반: `#error-handling`, `#optimization`
  - 구체적: `#token-optimization` (필요시만)

### ❌ DON'T
- 대문자 시작: ~~`#Metabase`~~
- 언더스코어: ~~`#tag_name`~~
- 범용 단어: ~~`#This`~~, ~~`#Key`~~
- 색상 코드: ~~`#fff`~~
- 섹션 번호: ~~`#1-`~~, ~~`#section-6`~~

---

## 다음 단계

1. **Tag Wrangler 설치**
   - Settings → Community plugins → "Tag Wrangler" 검색

2. **Phase 1 실행** (자동화)
   - 대소문자, 단수/복수 통일
   - 소요 시간: 약 5분

3. **Phase 2 검토** (수동)
   - 의미적 통합 전 문맥 확인
   - 소요 시간: 약 30분

4. **Phase 3 정리** (삭제)
   - 저빈도 태그 삭제
   - 소요 시간: 약 15분

5. **컨벤션 문서화**
   - `reference/` 폴더에 태그 가이드 추가
   - 향후 일관성 유지

---

## 관련 문서

- 📊 **상세 분석**: `tag-duplicate-analysis.md`
- 📝 **실행 가이드**: `tag-consolidation-quick-guide.md`
- 📈 **원본 데이터**: `tag_analysis.txt`

---

**생성 도구**: Claude Code
**분석 방법**: `grep -roh '#[a-zA-Z0-9_-]\+' --include="*.md" . | sort | uniq -c | sort -rn`
