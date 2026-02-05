---
title: Quarto 테스트 가이드
type: workcase
permalink: sources/workcases/quarto-test-guide
tags:
- quarto
- obsidian
- workcase
- setup
- tool
---

# Quarto 테스트 가이드

> Obsidian에서 실행 가능한 마크다운(.qmd) 환경 구축 과정

## 1. 전체 흐름

```
.qmd 파일 작성 → Quarto 렌더링 → 결과 포함된 .md 생성 → Obsidian에서 확인
```

## 2. 핵심 개념

### Quarto란?
코드와 실행 결과를 마크다운에 함께 담을 수 있는 도구. Jupyter Notebook의 마크다운 버전.

### 설치 순서
1. **Quarto CLI** - `choco install quarto` 또는 공식 사이트에서 다운로드
2. **Jupyter** - `pip install jupyter` (Python 실행용)
3. **Obsidian 플러그인** - "QMD as MD" (커뮤니티 플러그인)

## 3. 실제 적용

### 테스트 파일 (.qmd)
```markdown
---
title: "Quarto 테스트"
format: gfm
---

## 기본 테스트

```{python}
print("Hello from Quarto!")
1 + 1
```
```

### 렌더링 명령
```powershell
quarto render test.qmd
```

### 결과 (.md)
코드 + 실행 결과가 함께 포함된 마크다운 생성

## 트러블슈팅

| 문제 | 해결 |
|------|------|
| "quarto: command not found" | PATH에 추가 또는 재시작 |
| Python 코드 실행 안 됨 | `pip install jupyter` |
| 플러그인에서 Quarto 못 찾음 | 설정에서 경로 지정 |

## 비교: Execute Code vs Quarto

| | Execute Code (현재) | Quarto |
|---|:---:|:---:|
| 실시간 실행 | ✅ | ❌ (렌더링 필요) |
| 결과 저장 | ❌ | ✅ (.md에 삽입) |
| 로컬 DB 접근 | ✅ | ✅ |
| 설정 복잡도 | 낮음 | 중간 |

## Observations

- [fact] Quarto는 .qmd를 렌더링하여 코드+결과 포함된 .md 생성 #quarto
- [method] 설치 순서: Quarto CLI → Jupyter → Obsidian 플러그인 #setup
- [tech] format: gfm 설정하면 GitHub Flavored Markdown 출력 #quarto
- [pattern] 검증 결과를 문서에 영구 저장하려면 Quarto가 적합 #workflow

---

**작성일**: 2026-02-05
**프로젝트**: Obsidian 환경 구축