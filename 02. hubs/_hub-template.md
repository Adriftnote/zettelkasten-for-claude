---
title: 허브 노트 템플릿
type: template
tags:
- template
- hub
- zettelkasten
- basic-memory
permalink: hubs/template-1
---

# 허브 노트 템플릿

이 문서는 **제텔카스텐 + Basic Memory** 방식의 허브 노트 작성 가이드입니다.

---

## 구조

```markdown
---
title: [허브 이름]
type: hub
tags: [hub, 주제태그들]
permalink: hubs/[허브-permalink]
---

# [허브 이름]

[1-2문장 설명: 이 허브가 다루는 주제]

## Observations

### 핵심 인사이트
- [insight] 핵심 통찰 1
- [insight] 핵심 통찰 2

### 학습 경로
- [path] 시작 → 중간 → 끝 (전체 흐름 요약)

### 인덱싱 (루만식)
- [index:1] [[노트A]] - 시작점 설명
- [index:1a] [[노트B]] - 1에서 파생된 개념
- [index:1b] [[노트C]] - 1에서 파생된 다른 개념
- [index:2] [[노트D]] - 두 번째 주요 분기
- [index:2a] [[노트E]] - 2에서 파생
- [index:2a1] [[노트F]] - 2a에서 더 파생

## Relations

### 관리하는 노트들
- organizes [[노트A]]
- organizes [[노트B]]
- organizes [[노트C]]

### 다른 허브와의 연결
- connects_to [[다른-허브]] (연결 이유)
```

---

## 인덱싱 규칙

### 번호 체계 (루만식)

```
1       ← 첫 번째 주요 개념 (시작점)
1a      ← 1에서 파생된 첫 번째
1a1     ← 1a에서 파생된 첫 번째
1a2     ← 1a에서 파생된 두 번째
1b      ← 1에서 파생된 두 번째
2       ← 두 번째 주요 개념
2a      ← 2에서 파생
```

### 파생의 의미

- **숫자 증가 (1→2→3)**: 새로운 주요 분기/주제
- **문자 추가 (1→1a→1b)**: 같은 부모에서 파생된 형제
- **숫자+문자 (1a→1a1)**: 더 깊은 파생/구체화

### 예시

```
1. Character Encoding     ← 시작점
   1a. Bit               ← 인코딩의 기초 단위
   1b. Byte              ← 인코딩의 데이터 단위
2. ASCII                  ← 첫 번째 표준
   2a. CP949             ← ASCII 확장
3. Unicode                ← 통합 표준
   3a. UTF-8             ← Unicode 구현체
      3a1. BOM           ← UTF-8의 부가 개념
   3b. UTF-16
   3c. UTF-32
```

---

## Observation 카테고리

| 카테고리 | 용도 | 예시 |
|---------|------|------|
| `[index:N]` | 루만식 인덱싱 | `[index:3a] [[UTF-8]] - 웹 표준` |
| `[path]` | 학습 경로 | `[path] 기초 → 역사 → 현대` |
| `[insight]` | 핵심 통찰 | `[insight] Unicode는 정의, UTF는 구현` |
| `[summary]` | 요약 | `[summary] 11개 개념을 다룸` |
| `[tip]` | 실용 팁 | `[tip] 웹에서는 항상 UTF-8 사용` |

---

## Relation 타입

| 타입 | 의미 | 용도 |
|------|------|------|
| `organizes` | 이 허브가 관리함 | 허브 → 영구노트 |
| `connects_to` | 다른 허브와 연결 | 허브 → 허브 |
| `derives_from` | 여기서 파생됨 | 개념 간 관계 |
| `contrasts_with` | 대비됨 | 비교 관계 |
| `implements` | 구현함 | 추상 → 구체 |

---

## AI 활용 가이드

AI가 이 허브를 읽을 때:

1. **`[path]`** → 전체 흐름 파악
2. **`[index:N]`** → 순서와 계층 파악
3. **`[insight]`** → 핵심 포인트 파악
4. **`organizes`** → 관련 노트 목록
5. **`connects_to`** → 확장 탐색 경로

**memory:// 사용:**
```
memory://hubs/encoding-systems
→ Observations와 Relations 로드
→ 맥락 즉시 파악
```

---

## 체크리스트

허브 노트 작성 시:

- [ ] `type: hub` frontmatter 설정
- [ ] 1-2문장 설명 작성
- [ ] `[path]` - 전체 학습 경로 정의
- [ ] `[index:N]` - 모든 노트에 인덱스 부여
- [ ] `[insight]` - 최소 1-2개 핵심 통찰
- [ ] `organizes` - 모든 관리 노트 나열
- [ ] `connects_to` - 관련 허브 연결

---

**생성일**: 2026-01-22
**버전**: 1.0