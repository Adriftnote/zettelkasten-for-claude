---
title: Obsidian 볼트 위키링크 건강도 점검 및 자동 수정
type: workcase
permalink: sources/workcases/vault-wikilink-health-check-autofix
tags:
- obsidian
- vault-maintenance
- wikilink
- python-script
- naming-convention
---

# Obsidian 볼트 위키링크 건강도 점검 및 자동 수정

> 제텔카스텐 볼트(572개 노트, 2770개 위키링크)의 링크 건강도를 점검하고, 깨진 링크를 분류하여 자동 수정한 작업 기록.

## 1. 전체 흐름

```
볼트 스캔 (Python)
    │
    ▼
파일 인덱스 구축 ── basename, 경로, 비-md 파일
    │
    ▼
위키링크 추출 ── [[target|alias]], [[target#heading]], ![[embed]]
    │
    ▼
링크 해결 시도 ── Obsidian shortest-path 매칭 규칙 적용
    │
    ▼
깨진 링크 분류
    ├─ [A] 백슬래시 버그 (18) ── \| → | 자동 수정
    ├─ [B] 템플릿/예시 (65) ── 무시
    ├─ [C] 이름 불일치 (136) ── 고신뢰 매칭 자동 수정
    ├─ [D] Task 참조 (4) ── 무시
    └─ [E] 진짜 누락 (~480) ── 리포트로 남김
```

## 2. 핵심 발견

### 볼트 건강도 지표

| 지표 | 값 |
|------|-----|
| 총 노트 | 572개 |
| 총 위키링크 | 2,770개 |
| 깨진 링크 | 706개 (25.5%) |
| 수정 후 깨진 링크 | ~552개 (19.9%) → 건강도 74.5% → 80.1% |

### 깨진 링크의 주요 원인

**원인 1: 백슬래시 이스케이프 버그 (18개)**

Markdown 테이블 안에서 파이프(`|`)가 테이블 구분자로 해석되는 것을 피하려고 `\|`로 이스케이프한 것이 원인. Obsidian은 `[[target|alias]]`에서 `|`를 alias 구분자로 인식하는데, `\`가 끼면 전체가 깨짐.

```
❌ [[CORS (Cross-Origin Resource Sharing)|CORS]]
✅ [[CORS (Cross-Origin Resource Sharing)|CORS]]
```

**원인 2: 네이밍 컨벤션 불일치 (136개)**

볼트 컨벤션이 `한국어 (English)` 형식인데, Relations 섹션 등에서 영문 kebab-case나 약칭으로 링크를 건 경우.

| 링크에서 사용 | 실제 파일명 | 매칭 유형 |
|--------------|-----------|----------|
| `[[data-structure]]` | `데이터 구조 (Data Structure).md` | kebab → 한국어(English) |
| `[[abstraction]]` | `추상화 (Abstraction).md` | English 정확 매칭 |
| `[[AST]]` | `AST (Abstract Syntax Tree).md` | 약칭 → 풀네임 |
| `[[프로그래밍 패러다임]]` | `프로그래밍 패러다임 (Programming Paradigms).md` | 한국어만 → 한국어(English) |

**원인 3: 진짜 누락 노트 (~480개)**

`[[Docker]]`, `[[RAG]]`, `[[Obsidian]]` 등 참조했지만 아직 노트를 만들지 않은 것들. 점진적으로 생성하거나 판단 필요.

## 3. 자동 수정 방법

### 접근: AI 에이전트 vs Python 스크립트

| 방식 | 장점 | 단점 |
|------|------|------|
| 하이쿠 병렬 에이전트 | 유연한 판단 | 비용 높음, 느림, AI 해석 오류 가능 |
| **Python 스크립트** | 빠름, 정확, 재사용 가능 | 초기 작성 비용 |

**결론**: 위키링크 파싱과 파일 존재 확인은 결정론적(deterministic) 작업이므로 스크립트가 압도적으로 유리.

### 고신뢰 매칭 알고리즘

```python
# 파일 인덱스 3종 구축
basename_index   # {lowercase_basename: [paths]}
english_index    # {영문 부분: 원본 basename}  ← 괄호 안 추출
kebab_index      # {kebab-form: 원본 basename}  ← 영문을 kebab 변환
```

매칭 우선순위:
1. **english-exact**: 타겟이 괄호 안 영문과 정확히 일치
2. **kebab-to-english**: `data-structure` → `Data Structure` 변환 후 매칭
3. **prefix-with-parens**: `AST`가 `AST (Abstract Syntax Tree)`의 접두사
4. **main-part-exact**: 타겟의 주요 부분이 basename과 일치

**안전 장치**: 매칭이 2개 이상이면 ambiguous로 분류하여 건너뜀 → 오탐 0건 달성.

### 실행 결과

| 작업 | 수정 수 | 파일 수 |
|------|---------|---------|
| 백슬래시 버그 수정 | 18 | 7 |
| 이름 불일치 수정 | 136 | 81 |
| **합계** | **154** | **88** |

## 4. 산출물

- [[00. index/Broken Wikilink Report]] — 전체 깨진 링크 리포트 (체크리스트 형식)

## 관련 Task
- 2026-03-10 대화 세션: 볼트 위키링크 건강도 점검 요청

## Observations
- [fact] 572개 노트에서 2,770개 위키링크 중 706개(25.5%)가 깨져 있었음 #vault-health
- [fact] 깨진 링크의 최대 원인은 네이밍 컨벤션 불일치 (kebab-case vs 한국어(English) 형식) #naming-convention
- [pattern] 테이블 내 위키링크에서 `\|` 백슬래시 이스케이프가 반복적으로 발생 — 테이블 파이프와 alias 파이프 충돌 #obsidian
- [method] 파일명의 괄호 안 영문 부분을 추출하여 english_index, kebab_index를 구축하면 고신뢰 매칭 가능 #python-script
- [method] 매칭 후보가 2개 이상이면 ambiguous로 건너뛰는 안전장치로 오탐 0건 달성 #auto-fix
- [tech] 위키링크 파싱/파일 매칭 같은 결정론적 작업은 AI 에이전트가 아닌 스크립트가 압도적으로 효율적 #vault-maintenance
- [tech] Windows Python에서 한글 출력 시 `sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')` 필수 #windows
- [warning] Fuzzy 매칭은 오탐이 많음 — `[[Active Learning]]` → `[[Meta-Learning]]` 같이 다른 개념을 추천하는 경우 존재 #auto-fix