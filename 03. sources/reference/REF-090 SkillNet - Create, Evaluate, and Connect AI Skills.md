---
title: REF-090 SkillNet - Create, Evaluate, and Connect AI Skills
type: paper-review
permalink: sources/reference/skillnet-create-evaluate-connect-ai-skills
tags:
- AI-agent
- skill-infrastructure
- knowledge-engineering
- skill-ontology
- agent-systems
date: 2026-03-09
---

# SkillNet: Create, Evaluate, and Connect AI Skills

AI 스킬을 대규모로 생성·평가·조직화하는 오픈 인프라. 통합 온톨로지, 5차원 평가(Safety/Completeness/Executability/Maintainability/Cost), 200K+ 스킬 저장소. 평균 보상 40% 향상, 실행 단계 30% 감소.

## 📖 핵심 아이디어

AI 에이전트는 매번 "바퀴를 재발명"한다 — 이전 전략을 축적·전이하는 체계가 없기 때문. SkillNet은 스킬을 **SKILL.md**(메타데이터 + 단계별 지침) 단위로 정의하고, 온톨로지(분류 + 관계 그래프 + 패키지 라이브러리)로 조직화하여 에이전트가 스킬을 검색·활성화·실행하는 전체 생애주기를 관리한다.

## 🛠️ 구성 요소

| 계층     | 이름                    | 설명                                                         |
| ------ | --------------------- | ---------------------------------------------------------- |
| Top    | Skill Taxonomy        | 10개 카테고리 (Development, AIGC, Research, Science 등) + 세밀한 태그 |
| Middle | Skill Relation Graph  | 4종 관계: similar_to, belong_to, compose_with, depend_on      |
| Bottom | Skill Package Library | 모듈형 태스크 번들로 물리적 조직                                         |

**스킬 구조**: `SKILL.md` (core) + scripts + templates + docs + resources

**운용 3단계**: Discovery(메타데이터로 식별) → Activation(SKILL.md 전문 로딩) → Execution(지침 실행)

## 🔧 스킬 생명주기

```
[생성 소스]                        [품질 관리]
 실행 궤적 ─┐                    ┌─ Deduplication (MD5+구조)
 GitHub ────┤                    ├─ Filtering (규칙+모델)
 문서 ──────┤→ 스킬 후보 ───────→├─ Categorization (10분류)
 프롬프트 ──┤                    ├─ 5D Evaluation
 웹 리소스 ─┘                    └─ Consolidation (관계 구축)
                                       ↓
                                  [스킬 저장소]
                                   200K+ 스킬
```

**5차원 평가**:
- **Safety**: 위험 작업, 프롬프트 인젝션 방어
- **Completeness**: 전제조건·의존성·제약 명시 여부
- **Executability**: 샌드박스에서 실제 실행 가능 여부
- **Maintainability**: 모듈성, 역방향 호환성
- **Cost-awareness**: 시간·연산·API 비용

검증: GPT-5o-mini 평가 vs PhD 3명 수동 평가 — MAE < 0.03, QWK = 1.000

## 📊 실험 결과

| 모델 | 방법 | ALFWorld (unseen) | WebShop | ScienceWorld (unseen) |
|------|------|-------------------|---------|----------------------|
| DeepSeek V3.2 | React | 45.52 | 28.67 | 51.67 |
| DeepSeek V3.2 | **SkillNet** | **83.57** | **46.18** | **81.31** |
| Gemini 2.5 Pro | React | 62.69 | 34.44 | 60.00 |
| Gemini 2.5 Pro | **SkillNet** | **91.04** | **53.02** | **86.26** |

**핵심**: seen/unseen 모두 일관된 개선 → 강한 일반화 능력

## 💡 실용적 평가

**강점**:
- SKILL.md 형식이 Claude Code의 스킬 시스템과 직접 대응 — 실무 적용 가능
- 4종 관계(similar/belong/compose/depend)가 스킬 간 탐색·조합을 체계화
- 궤적·코드·문서에서 자동 생성 → 기존 자산 재활용

**한계**:
- 자동 생성 스킬 품질 완전 보장 불가
- 악의적 "poisoned" 스킬 방어가 Safety 평가로 부분적만 커버
- 자연어 요구사항 → 완성된 에이전트까지의 end-to-end 파이프라인 미구축

**우리 시스템과의 관계**: 우리의 `.claude/skills/{name}/SKILL.md` 구조가 이 논문의 스킬 정의와 동일한 패턴. 차이점은 우리는 단일 오케스트레이터 기반이고 SkillNet은 대규모 공유 저장소 지향.

**[2026-03-09 적용 판단: 도입 불필요]**
- 아키텍처 검증으로서 가치 — Discovery→Activation→Execution 3단계가 우리 시스템(시스템 프롬프트→Skill tool→지침 실행)과 동일
- Taxonomy/관계 그래프: 29개 스킬에서 `using-superpowers` 자연어 우선순위가 충분. 50+에서 재검토
- 5D 평가: 내부 지침 스킬에 점수 체계는 과잉. `writing-skills`로 수동 점검 유지
- 자동 스킬 생성: 병목이 생성 속도가 아닌 "뭘 스킬로 만들지" 인간 판단이므로 ROI 낮음
- 재검토 트리거: 스킬 50+, 팀 공유, 세션 패턴 반복 3회+ 감지 시

## 🔗 관련 개념

- [[AI 에이전트 지식 전달 패턴]] - (SKILL.md Discovery→Activation→Execution이 지식 전달의 3단계 패턴과 대응)
- [[MemSkill - 자기진화 메모리 스킬]] - (MemSkill은 경험 기반 자기진화, SkillNet은 대규모 인프라 접근으로 상호 보완)
- [[Task 분해 (Task Decomposition)]] - (belong_to/compose_with 관계가 task decomposition의 스킬 수준 표현)
- [[context-engineering]] - (Discovery→Activation 2단계 로딩이 컨텍스트 효율화 전략)

---

**작성일**: 2026-03-09
**분류**: AI Agent Infrastructure / Knowledge Engineering
**원문**: arXiv 2603.04448v1
**코드**: https://github.com/zjunlp/SkillNet
**웹사이트**: http://skillnet.openkg.cn