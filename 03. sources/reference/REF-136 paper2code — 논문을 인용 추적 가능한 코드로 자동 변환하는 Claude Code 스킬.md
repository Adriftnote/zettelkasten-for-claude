---
title: REF-136 paper2code — 논문을 인용 추적 가능한 코드로 자동 변환하는 Claude Code 스킬
type: doc_summary
permalink: zettelkasten/03.-sources/reference/ref-136-paper2code-nonmuneul-inyong-cujeog-ganeunghan-kodeuro-jadong-byeonhwanhaneun-claude-code-seukil
tags:
- claude-code
- skill
- paper-implementation
- reproducibility
- arxiv
---

# paper2code — 논문을 인용 추적 가능한 코드로 자동 변환하는 Claude Code 스킬

arXiv 논문 URL을 주면 모든 코드 라인에 논문 참조(§3.2, Eq. 4)가 붙은 구현을 자동 생성하는 에이전트 스킬.

## 📖 핵심 아이디어

일반적인 논문→코드 변환은 빈 부분을 조용히 메꾸지만, paper2code는 **모든 구현 결정의 출처를 명시**한다. 논문에 없는 부분은 `[UNSPECIFIED]`로 표시하고 대안을 나열하여, 사용자가 "어디까지가 논문이고 어디부터가 추측인지" 투명하게 볼 수 있다.

## 🛠️ 구성 요소 / 주요 내용

| 항목                  | 설명                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| Citation Anchoring  | 모든 코드 라인에 `# §3.2 — [설명]` 형태로 논문 출처 참조                                                          |
| Ambiguity Audit     | 코드 생성 전에 SPECIFIED / PARTIALLY_SPECIFIED / UNSPECIFIED 분류                                       |
| Classification Tags | `§X.Y` (논문 명시), `[UNSPECIFIED]` (시스템 판단), `[ASSUMPTION]` (추론), `[FROM_OFFICIAL_CODE]` (공식 구현)   |
| 산출물                 | `src/` + `REPRODUCTION_NOTES.md` (모호성 감사) + `configs/base.yaml` + `notebooks/walkthrough.ipynb` |

## 🔧 작동 방식 / 적용 방법

### 설치 및 사용

```bash
# 설치
npx skills add PrathamLearnsToCode/paper2code/skills/paper2code

# 기본 사용
/paper2code https://arxiv.org/abs/1706.03762

# 프레임워크 지정
/paper2code https://arxiv.org/abs/2006.11239 --framework jax

# 풀 모드 (학습 인프라 포함)
/paper2code 2106.09685 --mode full

# 교육 모드 (문서 강화)
/paper2code https://arxiv.org/abs/2010.11929 --mode educational
```

### 모드

| 모드 | 설명 |
|------|------|
| 기본 | 핵심 구현 코드 + 설정 + 노트북 |
| `--mode full` | 학습 인프라 포함 |
| `--mode educational` | 단계별 설명 강화 |

## 💡 실용적 평가 / 적용

**강점**
- 논문과 코드 사이의 **추적성(traceability)** — 어떤 결정이 논문 어디에서 나왔는지 바로 확인
- 모호성을 숨기지 않는 **투명성** — `[UNSPECIFIED]` 태그로 사용자 판단 영역 명시
- 부록, 각주, 캡션까지 동등 처리 — 본문만 보면 놓치는 디테일 커버

**한계 (프로젝트가 명시)**
- 정확성 보장 안 함 — 논문 설명대로 코드를 만든 것이지 실제 동작 보장 X
- 데이터셋 다운로드/전처리 안 함
- 베이스라인/표준 컴포넌트 재구현 안 함

**적용 시나리오**
- 논문 읽고 구현해보고 싶을 때 뼈대를 빠르게 잡는 용도
- REPRODUCTION_NOTES.md로 "이 논문에서 뭐가 명시되지 않았는지" 파악하는 용도로도 유용

## 🔗 관련 개념

- [[REF-090 SkillNet - Create, Evaluate, and Connect AI Skills]] - (스킬 기반 에이전트 확장 패턴)

---

**작성일**: 2026-04-09
**원문**: https://github.com/PrathamLearnsToCode/paper2code
**분류**: Claude Code 스킬 / 논문 구현 도구