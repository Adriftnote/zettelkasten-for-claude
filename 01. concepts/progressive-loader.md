---
title: Progressive Loader
type: architecture
permalink: knowledge/concepts/progressive-loader
tags:
- mcp
- loader
- noise-reduction
- progressive-disclosure
- architecture
category: System Architecture
difficulty: 중급
---

# Progressive Loader

MCP 서버 기반의 점진적 도구/정보 로더로, 초기 노이즈를 제거하고 필요시 상세 정보를 로드합니다.

## 📖 개요

Progressive Loader는 **MCP 서버가 제공하는 도구나 정보를 계층적으로 로드**하는 아키텍처입니다. 초기 단계에서 핵심 정보만 제공하고, 사용자의 선택에 따라 상세 정보를 점진적으로 공개합니다.

## 🎭 비유

마트의 상품 진열대 같습니다. 처음에는 카테고리 표지판만 보고, 원하는 섹션을 선택하면 그제서야 상세 상품들이 보입니다. 모든 상품이 한눈에 들어와 선택 마비를 일으키지 않습니다.

## ✨ 특징

- **다층 구조**: 요약 → 상세 → 전체 정보로 단계적 진행
- **노이즈 제거**: 불필요한 정보는 초기 단계에서 제외
- **토큰 효율성**: 컨텍스트에 실제 필요한 정보만 로드
- **사용자 선택 기반**: 사용자의 선택에 따라 필요한 정보만 확장
- **MCP 서버 연계**: MCP 서버의 도구 메타데이터 활용

## 💡 예시

**MCP 서버의 도구 로딩**:

```
[초기 로드]
- 도구 이름, 기능 한줄 요약 (예: "파일 검색 도구")

[선택 후]
- 도구 설명, 파라미터 목록 (예: "파일명, 경로, 정규식")

[실제 사용]
- 전체 도구 정의, 예시, 에러 처리 가이드

[다중 도구 환경]
Tool-Hub: 도구 1, 도구 2, 도구 3 (총 15개 중 3개)
    ↓ [도구 1 선택]
    - 파라미터 A, B, C
    - 예시: ...
    - 에러 케이스: ...
```

## 🛠️ 구현 방식

**1단계: 메타데이터 로드**
```
도구 이름, 카테고리, 난이도, 사용 빈도
```

**2단계: 기능 상세**
```
목적, 사용 시나리오, 입력 형식
```

**3단계: 전체 정의**
```
파라미터 스펙, 에러 핸들링, 확장 옵션
```

## Relations

- relates_to [[progressive-disclosure]]
- relates_to [[tool-hub-philosophy]]
- relates_to [[lazy-tool-loader]]
- relates_to [[token-optimization-strategy]]
- relates_to [[tool-discovery-pattern]]

---

**난이도**: 중급
**카테고리**: System Architecture
**마지막 업데이트**: 2026년 1월
**출처**: MCP Architecture Guide