# 태그 중복 분석 보고서

## 통계 요약

- **총 태그 출현**: 670회
- **고유 태그**: 375개
- **1회만 사용**: 278개 (74.1% - 삭제 후보)
- **1-2회 사용**: 328개 (87.5%)
- **3회 이상**: 47개 (12.5% - 유지 권장)

## 1. 대소문자 중복

| 현재 태그들 | 통합 제안 | 빈도 합계 | 설명 |
|------------|----------|----------|------|
| `#mcp` (18), `#MCP` (2) | `#mcp` | 20회 | 소문자로 통일 |
| `#metabase` (29), `#Metabase` (1) | `#metabase` | 30회 | 소문자로 통일 |
| `#Heading` (5), `#heading` (1) | `#heading` | 6회 | 소문자로 통일 |
| `#Search` (1), `#search` (1) | `#search` | 2회 | 소문자로 통일 |
| `#Implementation` (1), `#implementation` (1) | `#implementation` | 2회 | 소문자로 통일 |

**권장 조치**: 모든 태그를 소문자로 통일

## 2. 단수/복수 중복

| 현재 태그들 | 통합 제안 | 빈도 합계 | 설명 |
|------------|----------|----------|------|
| `#best-practice` (19), `#best-practices` (1) | `#best-practice` | 20회 | 단수형으로 통일 |
| `#limitation` (10), `#limitations` (1) | `#limitation` | 11회 | 단수형으로 통일 |
| `#tag` (3), `#tags` (2) | `#tag` | 5회 | 단수형으로 통일 |
| `#hook` (1), `#hooks` (1) | `#hook` | 2회 | 단수형으로 통일 |
| `#template-tag` (1), `#template-tags` (1) | `#template-tag` | 2회 | 단수형으로 통일 |

**권장 조치**: 단수형으로 통일 (일관성)

## 3. 하이픈/언더스코어 중복

| 현재 태그들 | 통합 제안 | 빈도 합계 | 설명 |
|------------|----------|----------|------|
| `#bugfix` (1), `#bug-fix` (1) | `#bug-fix` | 2회 | 하이픈 사용 통일 |
| `#tag_with_underscores` (1), `#tag-with-dashes` (1) | `#tag-with-dashes` | 2회 | 하이픈 사용 통일 |

**권장 조치**: 하이픈(`-`) 사용으로 통일

## 4. 의미적 중복 (Semantic Duplicates)

### 4.1 Configuration 관련
| 태그 | 빈도 | 통합 제안 |
|------|------|----------|
| `#config` | 6회 | **유지** |
| `#configuration` | 4회 | → `#config` |
| `#config-pattern` | 1회 | → `#config` + `#pattern` |
| `#config-format` | 1회 | → `#config` |

**통합 후**: `#config` (12회)

### 4.2 Bug 관련
| 태그 | 빈도 | 통합 제안 |
|------|------|----------|
| `#bug` | 3회 | **유지** |
| `#bugfix` / `#bug-fix` | 1회 각 | → `#bug-fix` (2회) |
| `#bug-tracking` | 1회 | → `#bug` |
| `#bug-prevention` | 1회 | → `#prevention` |

**통합 후**: `#bug` (3회), `#bug-fix` (2회)

### 4.3 Error 관련
| 태그 | 빈도 | 통합 제안 |
|------|------|----------|
| `#error-handling` | 5회 | **유지** |
| `#api-error` | 1회 | → `#error-handling` + `#api` |
| `#network-error` | 1회 | → `#error-handling` + `#network` |
| `#syntax-error` | 1회 | → `#error-handling` |
| `#type-error` | 1회 | → `#error-handling` |
| `#reference-error` | 1회 | → `#error-handling` |
| `#undefined-error` | 1회 | → `#error-handling` |
| `#initialization-error` | 1회 | → `#error-handling` |
| `#internal-error` | 1회 | → `#error-handling` |
| `#400-error` | 1회 | → `#error-handling` |
| `#error-classification` | 1회 | → `#error-handling` |

**통합 후**: `#error-handling` (16회)

### 4.4 Debugging 관련
| 태그 | 빈도 | 통합 제안 |
|------|------|----------|
| `#debugging` | 8회 | **유지** |
| `#troubleshooting` | 5회 | → `#debugging` |
| `#diagnosis` | 1회 | → `#debugging` |
| `#diagnostic` | 1회 | → `#debugging` |

**통합 후**: `#debugging` (15회)

### 4.5 Optimization 관련
| 태그 | 빈도 | 통합 제안 |
|------|------|----------|
| `#optimization` | 4회 | **유지** |
| `#token-optimization` | 6회 | **유지** (구체적) |
| `#performance` | 4회 | → `#optimization` |
| `#context-optimization` | 1회 | → `#optimization` |
| `#network-optimization` | 1회 | → `#optimization` |

**통합 후**: `#optimization` (10회), `#token-optimization` (6회 유지)

### 4.6 CLI 관련
| 태그 | 빈도 | 통합 제안 |
|------|------|----------|
| `#cli` | 2회 | **유지** |
| `#cli-patch` | 2회 | **유지** (구체적) |
| `#cli-commands` | 1회 | → `#cli` |
| `#mcp-cli` | 2회 | **유지** (구체적) |

**통합 후**: `#cli` (3회)

### 4.7 Data 관련
| 태그 | 빈도 | 통합 제안 |
|------|------|----------|
| `#data-quality` | 2회 | **유지** |
| `#data-loss` | 2회 | **유지** |
| `#data-transformation` | 1회 | → `#data-quality` |
| `#data-structure` | 1회 | → `#architecture` |
| `#data-issue` | 1회 | → `#data-quality` |
| `#data-volume` | 1회 | → `#data-quality` |

**통합 후**: `#data-quality` (5회), `#data-loss` (2회)

### 4.8 API 관련
| 태그 | 빈도 | 통합 제안 |
|------|------|----------|
| `#api` | 1회 | **유지** |
| `#api-error` | 1회 | → `#error-handling` |
| `#api-difference` | 1회 | → `#api` |
| `#api-contract` | 1회 | → `#api` |
| `#api-change` | 1회 | → `#api` |

**통합 후**: `#api` (5회)

### 4.9 File 관련
| 태그 | 빈도 | 통합 제안 |
|------|------|----------|
| `#file-handling` | 2회 | **유지** |
| `#file-watcher` | 2회 | **유지** |
| `#file-system` | 1회 | → `#file-handling` |
| `#file-perception` | 1회 | → `#file-handling` |
| `#file-paths` | 1회 | → `#path` |
| `#file-locking` | 1회 | → `#file-handling` |

**통합 후**: `#file-handling` (5회), `#file-watcher` (2회)

### 4.10 Version 관련
| 태그 | 빈도 | 통합 제안 |
|------|------|----------|
| `#version` | 1회 | **유지** |
| `#versioning` | 1회 | → `#version` |
| `#version-control` | 1회 | → `#version` |
| `#version-analysis` | 1회 | → `#version` |
| `#version-specific` | 1회 | → `#version` |

**통합 후**: `#version` (5회)

### 4.11 Memory 관련
| 태그 | 빈도 | 통합 제안 |
|------|------|----------|
| `#memory` | 4회 | **유지** |
| `#memory-leak` | 1회 | **유지** (구체적) |
| `#memory-url-format-memory` | 1회 | → `#memory` |

**통합 후**: `#memory` (5회)

### 4.12 Process 관련
| 태그 | 빈도 | 통합 제안 |
|------|------|----------|
| `#process-leak` | 1회 | → `#memory-leak` |
| `#process-conflict` | 1회 | → `#concurrency` |

### 4.13 Background 관련
| 태그 | 빈도 | 통합 제안 |
|------|------|----------|
| `#background` | 1회 | **유지** |
| `#background-process` | 1회 | → `#background` |

**통합 후**: `#background` (2회)

## 5. 숫자 태그 정리

### 5.1 Issue/PR 번호로 보이는 태그
| 태그 | 빈도 | 권장 조치 |
|------|------|----------|
| `#12836` | 4회 | 유지 (자주 참조) |
| `#7336` | 4회 | 유지 (자주 참조) |
| `#12805` | 3회 | 유지 |
| `#277` | 2회 | 유지 |
| 기타 1회 태그 | 30개 | **삭제 후보** |

### 5.2 단순 숫자 태그 (삭제 권장)
- `#1-`, `#2-`, `#3-`, `#4-`, `#5-`, `#6-`, `#7-`, `#8-` (섹션 번호로 추정)
- `#1`, `#2`, `#3`, `#10` (의미 불명)

**권장 조치**: 3회 이상 참조된 이슈 번호만 유지, 나머지 삭제

## 6. 삭제 후보 (1회만 사용된 태그)

### 6.1 너무 구체적인 태그 (상위 태그로 통합 가능)
- `#toolhub-execute` → `#tool-hub`
- `#tool-registration` → `#tool-hub`
- `#tool-design` → `#design`
- `#tool-chainer` → `#tool-hub`
- `#timeout-tuning` → `#timeout`
- `#merged-cells` → `#excel`
- `#minification` → `#optimization`
- `#section-6` → 삭제

### 6.2 중복 의미 태그
- `#fix-needed` → `#bug`
- `#root-cause` → `#debugging`
- `#reproduction` → `#debugging`
- `#normal-behavior` → 삭제
- `#observation` → 삭제

### 6.3 범용 태그 (정보가 없음)
- `#This`, `#Key`, `#View`, `#Decisions` → 삭제
- `#solution` → `#workaround` / `#fix`
- `#overview` → 삭제

### 6.4 색상 코드 (의미 불명)
- `#fff`, `#FF0000` → 삭제

## 7. 통합 효과 시뮬레이션

| 카테고리 | 통합 전 | 통합 후 | 감소율 |
|---------|---------|---------|--------|
| 고유 태그 수 | 375개 | 약 250개 | **33%** |
| 1회 사용 태그 | 278개 | 약 180개 | **35%** |
| 주요 태그 빈도 | - | - | - |
| - error-handling | 5회 | 16회 | +220% |
| - debugging | 8회 | 15회 | +88% |
| - optimization | 4회 | 10회 | +150% |
| - config | 6회 | 12회 | +100% |

## 8. 실행 계획

### Phase 1: 대소문자 통일 (빠른 승리)
```bash
# MCP → mcp (2회)
# Metabase → metabase (1회)
# Heading → heading (1회)
# Search → search (1회)
# Implementation → implementation (1회)
```

### Phase 2: 단수/복수 통일
```bash
# best-practices → best-practice (1회)
# limitations → limitation (1회)
# tags → tag (2회)
# hooks → hook (1회)
# template-tags → template-tag (1회)
```

### Phase 3: 의미적 통합 (고빈도 우선)
```bash
# error 관련 → error-handling (10개 태그 통합)
# debugging 관련 → debugging (3개 태그 통합)
# optimization 관련 → optimization (3개 태그 통합)
# config 관련 → config (3개 태그 통합)
```

### Phase 4: 저빈도 태그 삭제
```bash
# 1회 사용 + 의미 불명 태그 약 100개 삭제
# 숫자 태그 정리 (이슈 번호 아닌 것들)
```

## 9. 태그 네이밍 컨벤션 제안

### 규칙
1. **소문자만 사용** (예: `#mcp`, `#metabase`)
2. **단수형 우선** (예: `#limitation`, `#best-practice`)
3. **하이픈 구분** (예: `#best-practice`, `#error-handling`)
4. **구체성 레벨**:
   - 일반: `#error-handling`, `#optimization`
   - 구체적: `#token-optimization`, `#cli-patch` (필요시만)
5. **이슈 번호 태그**: 3회 이상 참조되는 경우만 유지

### 금지
- 대문자 시작 (X: `#Metabase`)
- 언더스코어 (X: `#tag_name`)
- 범용 단어 (X: `#This`, `#Key`)
- 색상 코드 (X: `#fff`, `#FF0000`)
- 섹션 번호 (X: `#1-`, `#section-6`)

## 10. 추천 태그 세트 (Top 50)

통합 후 유지할 핵심 태그:

### 시스템/도구 (10개)
- `#metabase`, `#mcp`, `#claude-code`, `#claude`, `#claude-sdk`
- `#excel`, `#chrome-extension`, `#windows`, `#powershell`, `#bash`

### 개발 패턴 (10개)
- `#architecture`, `#workflow`, `#best-practice`, `#anti-pattern`, `#design-pattern`
- `#clean-architecture`, `#pattern`, `#methodology`, `#naming-convention`, `#structure`

### 문제 해결 (10개)
- `#debugging`, `#troubleshooting`, `#error-handling`, `#bug`, `#workaround`
- `#gotcha`, `#limitation`, `#fix`, `#prevention`, `#resilience`

### 성능/최적화 (5개)
- `#optimization`, `#token-optimization`, `#performance`, `#memory`, `#network`

### 자동화/통합 (5개)
- `#automation`, `#integration`, `#workflow`, `#concurrency`, `#async`

### 설정/구성 (5개)
- `#config`, `#configuration`, `#setup`, `#installation`, `#environment`

### 데이터 (5개)
- `#data-quality`, `#data-loss`, `#sql`, `#database`, `#serialization`

## 11. 다음 단계

1. **Obsidian 플러그인 사용**: Tag Wrangler로 일괄 변경
2. **정규식 치환**:
   ```regex
   #MCP → #mcp
   #best-practices → #best-practice
   ```
3. **수동 검토**: 의미적 통합은 문맥 확인 후 진행
4. **컨벤션 문서화**: `reference/` 폴더에 태그 가이드 추가

---

**생성 일시**: 2026-01-22
**대상 경로**: `C:\claude-workspace\working\from-obsidian`
**분석 기준**: 670개 태그 출현, 375개 고유 태그
