---
title: LikeC4 - 코드 기반 아키텍처 다이어그램 도구
type: doc-summary
permalink: sources/reference/likec4-architecture-diagram
tags:
- architecture
- diagram
- c4-model
- dsl
- documentation
- visualization
date: 2026-02-09
---

# LikeC4 - 코드 기반 아키텍처 다이어그램 도구

코드(DSL)로 소프트웨어 아키텍처를 정의하면 인터랙티브 다이어그램을 자동 생성하는 도구. C4 Model 기반.

## 📖 핵심 아이디어

C4 Model(System Context → Container → Component → Code 4단계 줌)을 DSL로 작성하면 실시간으로 다이어그램이 생성됨. 코드=문서이므로 Git 버전관리 가능하고, 아키텍처 변경 시 다이어그램이 자동 동기화. Structurizr DSL에서 영감을 받았지만 커스텀 노테이션과 요소 타입을 자유롭게 정의할 수 있음.

## 🛠️ 구성 요소

| 항목 | 설명 |
|------|------|
| **레포** | https://github.com/likec4/likec4 |
| **Stars** | 2.4k |
| **License** | MIT |
| **Language** | TypeScript (98%) |
| **버전** | v1.48.0 (2026-01) |
| **파서** | Langium (DSL 파서/생성기) |

### 제공 형태
| 형태 | 용도 |
|------|------|
| CLI | `npx likec4 start` |
| VSCode 확장 | 에디터에서 실시간 미리보기 |
| 웹 플레이그라운드 | playground.likec4.dev |
| npm 패키지 | 프로젝트 통합 |

## 🔧 작동 방식

```
LikeC4 DSL 코드 작성
  ↓
Langium 파서가 파싱
  ↓
인터랙티브 다이어그램 생성 (줌/클릭 탐색)
  ↓
정적 사이트/이미지 내보내기 가능
```

### 기존 도구와 비교
| | LikeC4 | Mermaid | draw.io |
|--|--|--|--|
| 방식 | 코드 (DSL) | 코드 (마크다운) | GUI |
| 커스텀 | 자유 | 제한적 | 자유 |
| 버전관리 | Git 가능 | Git 가능 | 어려움 |
| 인터랙티브 | 줌/클릭 탐색 | 정적 | 정적 |

## 💡 실용적 평가

**활용 가능:**
- 워크스페이스 아키텍처(Orchestrator → Worker → Subagent) 시각화
- n8n 워크플로우 구조 문서화
- 시스템 복잡도 증가 시 아키텍처 문서 유지

**시기:**
- 지금 당장 필요하진 않음
- 시스템이 더 복잡해지면 도입 고려

## 🔗 관련 개념

- [[C4 Model]] - 소프트웨어 아키텍처 시각화 방법론
- [[Mermaid]] - 마크다운 기반 다이어그램 도구
- [[Structurizr]] - C4 Model 원조 도구

---

**작성일**: 2026-02-09
**분류**: 아키텍처 문서화