---
title: SpreadsheetLLM Structural Anchors 행 누락 — 머지드 셀 영역 데이터 손실
type: note
permalink: 03.-sources/workcases/spreadsheet-llm-structural-anchors-haeng-nurag-meojideu-sel-yeongyeog-deiteo-sonsil
tags:
- spreadsheet-llm
- compression
- data-loss
- structural-anchors
- KPI
- troubleshooting
---

# SpreadsheetLLM Structural Anchors 행 누락 — 머지드 셀 영역 데이터 손실

## 상황 (Situation)

전사 KPI 대시보드 프로토타입 작업 중, 원본 Excel(`전사_본부_팀_KPI_매핑_v2.xlsx`)을 SpreadsheetLLM으로 압축한 JSON(`kpi_compressed.json`)을 사용하여 KPI 계층 매핑(전사→본부→팀)을 구축했다. 이후 매핑 누락이 다수 발견되어 원본 대조 과정에서 압축 데이터 자체의 행 누락을 확인.

- 작업: task-20260213-003 (전사 KPI 대시보드)
- DB: `C:\claude-workspace\working\kpi_dashboard.db`
- 압축 JSON: `C:\claude-workspace\working\worker-data\kpi_compressed.json`
- 원본 평문: `C:\claude-workspace\working\worker-data\inputs\전사KPI_vanilla.txt`

## 문제 (Problem)

SpreadsheetLLM 인코더의 **Structural Anchors (Module 1)** 단계에서 원본 80행 중 **22행이 누락**됨.

### 누락된 행

| 행 범위      | 내용                              | 영향                       |
| --------- | ------------------------------- | ------------------------ |
| Row 5-9   | 경영기획팀: 직원수→평가시스템/보상시스템/eNPS     | eNPS가 전사KPI `직원수`에 연결 불가 |
| Row 10-12 | 경영기획팀: 플로우 업무표준화율→매뉴얼/템플릿/분기완료율 | 플로우 전사KPI 3개에 본부 연결 없음   |
| Row 13-15 | 경영기획팀: 상품지식평가→학습시스템/지식평가/개인별점수  | 상품지식 전사→본부 일부 누락         |
| Row 16-22 | 재무팀 KPI 전체 (7개 팀KPI + 3개 본부KPI) | 재무팀이 DB에 아예 없음           |
| Row 34-36 | 콘텐츠디자인/영상제작팀→총유입호               | 본부KPI `총 유입호` 하위 연결 누락   |
| Row 37-38 | 퍼포먼스마케팅: 유료광고 콜당광고비/유입호         | 퍼포먼스마케팅 팀KPI 2개 누락       |

### 누락 패턴

누락된 행들의 공통점: **A열(실/본부)이 병합(merge)된 영역의 중간 행**

```
원본 Excel:
  A2:A4   "경영지원실"  (merged)  ← Row 2-4 포함됨
  A5:A21  "경영지원실"  (merged)  ← Row 5-21 전부 누락!
  A22     "경영지원실"  (single)  ← Row 22 포함됨
  A23:A33 "마케팅본부"  (merged)  ← Row 23-33 포함됨
  ↑ 단, Row 34-38은 A열에서 별도 범위
```

Structural Anchors 알고리즘이 행을 선택할 때, 병합 셀의 **첫 행과 마지막 행만 앵커로 선택**하고 중간 행을 버리는 것으로 추정. 또는 A열 기준 "경계 변화"가 없는 연속 행을 동질 영역으로 판단하여 샘플링한 것.

## 원인 분석 (Root Cause)

SpreadsheetLLM Module 1 (Structural Anchors)의 작동 원리:

1. **Boundary candidate 탐지**: 인접 행/열 간 유사도를 비교하여 테이블 경계를 찾음
2. **IoU + NMS**: 후보 경계들을 필터링
3. **앵커 행/열 선택**: 경계로 인식된 행/열만 보존, 나머지 제거

이 과정에서 **A열이 병합된 큰 영역**(예: A2:A21 전체가 "경영지원실")의 경우:
- 행 간 A열 값이 동일 → 경계로 인식 안 됨
- B열(팀)이 바뀌는 지점도 충분한 경계 신호가 안 됨
- 결과적으로 중간 행들이 "반복 데이터"로 판단되어 제거됨

**핵심**: SpreadsheetLLM은 "테이블 구조 파악"에 최적화되어 있지, "행 단위 데이터 완전성 보존"을 보장하지 않음. 압축률을 높이기 위해 유사한 행을 적극적으로 제거하는 것이 설계 의도.

## 해결 (Solution)

### 즉시 조치
`전사KPI_vanilla.txt` (압축 없이 행 단위 평문 추출)를 기준으로 매핑 재구축.

### 근본 대책: 용도별 인코딩 전략 분리

| 용도 | 인코딩 | 이유 |
|------|--------|------|
| **구조 파악** (테이블 범위, 열 의미) | SpreadsheetLLM 압축 | 토큰 절약, 구조 이해에 충분 |
| **데이터 추출** (행 단위 값 보존 필수) | Vanilla 인코딩 또는 직접 파싱 | 압축 시 행 누락 위험 |
| **관계 추출** (셀 간 참조, H/I열 영향) | Vanilla + 별도 파싱 | 셀 단위 정확성 필요 |

### CLI 사용법
```bash
# 압축 (구조 파악용)
python Spreadsheet_LLM_Encoder.py input.xlsx -o compressed.json

# 평문 (데이터 추출용) — 행 누락 없음
python Spreadsheet_LLM_Encoder.py input.xlsx --vanilla -o vanilla.txt
```

## 교훈 (Lessons Learned)
### 용도별 인코딩 선택 기준

| 용도 | 인코딩 | 이유 |
|------|--------|------|
| 구조 파악 (열 이름, 테이블 레이아웃, 시트 구성) | **압축** | 토큰 절약, 전체 윤곽 파악에 충분 |
| 데이터 추출 (행 단위 값, 매핑, 관계) | **vanilla** | 압축 시 행 누락 → 매핑 깨짐 |
| LLM에 엑셀 분석 요청 | **압축** | 컨텍스트 효율적 활용 |
| 셀 간 참조/영향 관계 추출 | **vanilla** | 셀 단위 정확성 필수 |

**한 줄 요약: 구조 파악 = 압축, 데이터 추출 = vanilla**

### 실무 체크리스트

1. SpreadsheetLLM 압축은 **손실 압축** — 병합 셀이 많은 시트에서 중간 행이 제거됨
2. 압축 후 `structural_anchors.rows` 배열 길이와 원본 행 수를 비교하여 누락 감지
3. 관계 추출, 매핑 구축 등 정확도가 중요한 작업에는 반드시 vanilla 사용
4. 두 버전(압축/vanilla)을 비교하면 누락 즉시 발견 가능
## Relations

- relates_to [[Spreadsheet_LLM_Encoder - SpreadsheetLLM 실전 인코더]] (누락을 발생시킨 인코더)
- relates_to [[SpreadsheetLLM 구현 로직]] (Structural Anchors 알고리즘 설명)
- relates_to [[스프레드시트 AI 처리 전략 (Spreadsheet AI Processing Strategy)]] (용도별 인코딩 전략)
- relates_to [[SpreadsheetLLM-compression - SheetCompressor 학습용 데모]] (Module 1 데모 코드)
