---
title: PM Skills — 65개 PM 스킬과 36개 체인 워크플로우 Claude Code 플러그인
type: doc-summary
permalink: sources/reference/pm-skills-claude-code-plugin
tags:
- claude-code
- plugin
- product-management
- skill-system
- workflow-automation
date: 2026-03-11
---

# PM Skills — 65개 PM 스킬과 36개 체인 워크플로우 Claude Code 플러그인

검증된 PM 프레임워크(Teresa Torres, Marty Cagan, Alberto Savoia)를 AI 워크플로우로 코드화한 Claude Code/Cowork 플러그인 마켓플레이스.

## 📖 핵심 아이디어

PM의 구조화된 의사결정 프레임워크를 AI 스킬로 변환하여, 단순 문서 생성이 아닌 체계적 제품 사고를 지원한다. 8개 도메인에 65개 스킬, 36개 체인 워크플로우로 구성되며 MIT 라이선스 오픈소스.

## 🛠️ 구성 요소 / 주요 내용

| 도메인 | 스킬 수 | 커맨드 수 | 핵심 역할 |
|--------|---------|-----------|-----------|
| Product Discovery | 13 | 5 | 아이디어 도출, 실험 설계, 가정 검증 |
| Product Strategy | 12 | 5 | 비전, 비즈니스 모델, 가격 정책 |
| Execution | 15 | 10 | PRD, OKR, 로드맵, 스프린트 |
| Market Research | 7 | 3 | 페르소나, 시장 세분화, 고객 여정 |
| Data Analytics | 3 | 3 | SQL 생성, 코호트, A/B 테스트 |
| Go-to-Market | 6 | 3 | Beachhead, ICP, 성장 루프 |
| Marketing & Growth | 5 | 2 | 포지셔닝, North Star 메트릭 |
| Toolkit | 4 | 5 | 이력서 검토, 법률 문서, 교정 |

## 🔧 작동 방식 / 적용 방법

### 스킬 ↔ 커맨드 구조

```
커맨드 (체인 워크플로우)
  └── /discover
        ├── 스킬1: 아이디어 브레인스토밍
        ├── 스킬2: 가정 매핑
        ├── 스킬3: 우선순위 지정
        └── 스킬4: 실험 설계

스탠드얼론 스킬 (맥락 자동 로딩)
  └── prioritization-frameworks
  └── opportunity-solution-tree
```

- **스킬**: `skills/*/SKILL.md` 범용 포맷 — Claude Code 외 다른 AI 도구에서도 사용 가능
- **커맨드**: 슬래시 명령으로 여러 스킬을 체인 실행 (Claude 플러그인 전용)
- **자동 로딩**: 대화 맥락에서 관련 스킬 자동 활성화

### 설치

```bash
# Claude Code CLI
claude plugin marketplace add phuryn/pm-skills
claude plugin install pm-toolkit@pm-skills
# Claude Cowork: Customize → Browse plugins → phuryn/pm-skills
```

## 💡 실용적 평가 / 적용
**우리 시스템과의 비교**
- 우리는 이미 "스킬이 도구를 호출"하는 체인 패턴 사용 중 (`/source` → WebFetch → vecsearch → write_note → edit_note)
- PM Skills는 "스킬이 스킬을 호출"하는 체인 (`/discover` → 브레인스토밍 스킬 → 가정매핑 스킬 → 실험설계 스킬)
- 스킬 간 체인이 필요한 케이스는 현재 `/flow-sync` → `/weekly-report` 정도뿐

**현재 판단: 오버스펙**
- 도메인 미스매치 — PM(제품 기획) vs 우리(경영기획: KPI, SNS, 데이터 분석, 보고서)
- using-superpowers 경량화(1% → clearly relevant)한 직후에 65개 스킬 추가는 역행
- SkillNet(REF-090) "50+ 스킬 시 네트워크 관리 필요" 임계치 초과

**참고 가치 (추후 활용 가능)**
- 체인 워크플로우 패턴: 독립된 스킬 2개를 순서대로 묶는 SKILL.md 구조
- 도메인별 플러그인 분리: 스킬이 50개 넘을 때 그룹핑 전략
- 의사결정 구조화 / 데이터 기반 판단 프레임워크: 경영기획 업무에 맞게 커스텀 시 참고

**재검토 트리거**
- 스킬 50개 이상으로 증가 시 → 도메인별 분리 검토
- 경영기획 의사결정 스킬 필요 시 → PM Skills 프레임워크 참고하여 커스텀 개발
## 🔗 관련 개념

- [[REF-087 65 Lines of Markdown - A Claude Code Sensation]] - (Claude Code 스킬 시스템의 설계 철학과 실전 사례)
- [[REF-090 SkillNet - Create, Evaluate, and Connect AI Skills]] - (스킬 규모 확장 시 네트워크 관리 문제 — 65개 스킬이 임계치 초과)
- [[REF-095 LangChain Skills — Claude Code 통과율 25%에서 95%로 개선한 방법]] - (또 다른 대규모 스킬셋 사례 — 스킬 설계 패턴 비교)
- [[REF-096 Claude Code 플러그인 vs MCP — 시스템 프롬프트 주입과 확장 레벨 차이]] - (플러그인 아키텍처에서 스킬이 어떻게 시스템 프롬프트에 주입되는지)
- [[스킬 모드 분기 패턴 적용 설계]] - (체인 워크플로우 vs 모드 분기 패턴 비교)

---

**출처**: https://github.com/phuryn/pm-skills | https://news.hada.io/topic?id=27327
**작성일**: 2026-03-11
**분류**: AI 도구 / Product Management