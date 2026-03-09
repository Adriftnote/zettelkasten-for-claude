---
title: REF-084 Marklas - Markdown와 Atlassian ADF 양방향 변환 라이브러리
type: doc-summary
permalink: sources/reference/marklas-markdown-adf-bidirectional-converter
tags:
- markdown
- atlassian
- confluence
- jira
- adf
- python
- ast
date: 2026-03-09
---

# Marklas - Markdown와 Atlassian ADF 양방향 변환 라이브러리

Markdown과 Atlassian Document Format(ADF) 간 양방향 무손실 변환 Python 라이브러리. Union AST를 중간 표현으로 사용하여 ADF 전용 기능도 보존한다.

## 📖 핵심 아이디어

Confluence/Jira가 사용하는 ADF(JSON 구조)와 Markdown 간 변환에서 **정보 손실 없는 라운드트립**이 핵심 목표다. ADF에만 있는 기능(패널, 멘션, 색상 텍스트, 레이아웃)을 Markdown의 HTML 주석 어노테이션으로 임베딩하여, 렌더링 시에는 보이지 않지만 역변환 시 완전히 복원된다.

토큰 효율성도 주요 이점: ADF JSON 대비 어노테이션 포함 시 3.2배, 순수 Markdown 시 5.8배 토큰 절감 — LLM 컨텍스트에서 Confluence 문서를 다룰 때 유리하다.

## 🛠️ 구성 요소 / 주요 내용

| 항목             | 설명                                                             |
| -------------- | -------------------------------------------------------------- |
| **Union AST**  | Markdown과 ADF의 공통 기능을 통합 표현하는 중간 추상 구문 트리                      |
| **어노테이션**      | ADF 전용 기능을 HTML 주석(`<!-- -->`)으로 Markdown에 임베딩. 렌더링 불가시, 파싱 가능 |
| **`to_adf()`** | Markdown → ADF 변환                                              |
| **`to_md()`**  | ADF → Markdown 변환. `annotate=True`(무손실) / `False`(깔끔) 선택       |
| **토큰 효율**      | ADF JSON 대비 3.2x(어노테이션) / 5.8x(순수 MD) 절감                       |
| **지원 요소**      | 문단, 제목, 리스트, 테이블, 볼드, 이탤릭, 코드 + 패널, 멘션, 색상, 레이아웃               |

## 🔧 작동 방식

```
[Markdown]  ──파싱──▶  [Union AST]  ──생성──▶  [ADF JSON]
                           │
    ADF 전용 기능은      ◀──────────────────▶
    HTML 주석으로 보존
```

```python
from marklas import to_adf, to_md

# Markdown → ADF
adf = to_adf(markdown_string)

# ADF → Markdown (무손실, 어노테이션 포함)
md = to_md(adf_dict, annotate=True)

# ADF → Markdown (깔끔, 어노테이션 없음)
clean_md = to_md(adf_dict, annotate=False)
```

**어노테이션 예시:**
```markdown
<!-- adf:panel type="info" -->
이 내용은 Confluence에서 Info 패널로 표시됩니다.
<!-- /adf:panel -->
```

**제한사항:**
- 테이블 셀에 비-문단 콘텐츠 → 인라인 HTML로 변환
- Markdown 전용 기능(raw HTML 블록) → ADF 변환 시 드롭

## 💡 실용적 평가

**장점:**
- 무손실 라운드트립 — Confluence 문서를 Markdown으로 작업 후 다시 업로드 가능
- LLM 컨텍스트에서 5.8x 토큰 절감 — Confluence 문서를 AI에 넘길 때 효율적
- 깔끔한 API (`to_adf`, `to_md` 두 함수)
- PyPI 배포 — `pip install marklas`

**활용 시나리오:**
- Confluence/Jira 콘텐츠를 LLM에 피딩할 때 토큰 절감
- Markdown 기반 워크플로우에서 Confluence 퍼블리싱 자동화
- Confluence → Obsidian/노트 앱 마이그레이션
- CI/CD에서 Markdown 문서를 Confluence에 자동 동기화

**한계:**
- ADF 스펙의 모든 엣지케이스 커버 여부 미확인
- Markdown 전용 기능(raw HTML) 손실 가능

## 🔗 관련 개념

- [[knowledge]] - (basic-memory도 Markdown 파싱 → 구조화된 표현(Entity/Relation)으로 변환하는 파이프라인 — Union AST 패턴과 구조적 유사성)

---

**작성일**: 2026-03-09
**분류**: Developer Tools / Document Format Conversion
**출처**: https://github.com/byExist/marklas