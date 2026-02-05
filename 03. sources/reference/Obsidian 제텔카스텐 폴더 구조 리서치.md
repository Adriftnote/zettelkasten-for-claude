---
title: Obsidian 제텔카스텐 폴더 구조 리서치
type: doc-summary
permalink: sources/reference/zettelkasten-folder-research
tags:
- obsidian
- zettelkasten
- knowledge-management
- folder-structure
date: 2026-01-01
---

# Obsidian 제텔카스텐 폴더 구조 리서치

Obsidian에서 제텔카스텐 방식 사용 시 폴더 구조 모범 사례와 inbox vs sources 역할 구분 분석

## 📖 핵심 아이디어

**제텔카스텐 폴더 구조는 두 진영이 존재한다:**
- **순수주의 (30%)**: 플랫 구조, 폴더 없이 링크만 사용
- **실용주의 (60%)**: 3-7개 최소 폴더로 워크플로우 단계 구분

핵심은 **폴더는 콘텐츠가 아닌 프로세스 관리용**이라는 점.

## 🛠️ 주요 내용

### inbox vs sources 역할

| 구분 | inbox | sources |
|------|-------|---------|
| 역할 | 임시 캡처 | 영구 보관 |
| 내용 | 내 생각 (Fleeting) | 타인의 아이디어 |
| 수명 | 1-2일 후 처리 | 계속 참조 |
| 비유 | 우편함 | 도서관 |

### 노트 3단계 구조

1. **Fleeting Notes** → inbox, 빠른 캡처, 삭제 가능
2. **Literature Notes** → sources, 외부 자료 요약, 영구 보관
3. **Permanent Notes** → notes, 내 언어로 재작성, 원자적

### 폴더 구조 패턴

| 패턴 | 구조 | 장단점 |
|------|------|--------|
| **3-Container** | inbox/literature/permanent | 단순, 업무분리 어려움 |
| **워크플로우 중심** | 6개 폴더 (단계별) | 명확, 복잡 |
| **PARA 하이브리드** | 8개 폴더 | 업무통합, 충돌 가능 |

## 🔧 전문가 조언

### DO ✅
- 3-4개 폴더로 시작
- 폴더보다 [[링크]]로 연결
- Structure Notes (인덱스 노트) 활용
- 매일 inbox 정리

### DON'T ❌
- 주제별 폴더 (/경제학, /심리학) 금지
- 과도한 YAML frontmatter 금지
- 초기 과잉 설계 금지 (100개 노트 전엔 모름)

## 💡 실용적 적용

### AI 자동화 가능 작업
- Inbox 자동 분류, Literature notes 자동 생성
- 중복 감지, 백링크 추가, MOC 자동 생성

### 현재 vault 개선안
```
00. inbox     → Fleeting (임시)
01. concepts  → Permanent의 기본 단위
02. hubs      → Structure notes / MOC
03. sources   → Literature (외부 자료)
04. notes     → Permanent (도출된 지식)
```

**inbox vs sources 명확화:**
- inbox: 내 생각 빠르게 캡처 → 처리 후 이동/삭제
- sources: 외부 자료 정리 → 영구 보관

## 🔗 관련 개념

- [[Basic Memory Hub]] - 현재 사용 중인 지식 관리 시스템
- [[context-engineering]] - 컨텍스트 최적화 관점

---

**작성일**: 2026-01-01
**출처**: Zettelkasten Forum, Obsidian Forum, 국내 커뮤니티 종합