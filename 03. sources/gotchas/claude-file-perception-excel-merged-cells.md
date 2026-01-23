---
title: Claude 파일 인식 방식 - Excel 병합 셀 해결책
type: note
permalink: knowledge/claude-pail-insig-bangsig-excel-byeonghab-sel-haegyeolcaeg
tags:
- excel
- file-perception
- merged-cells
- markitdown
- vision
- knowledge
extraction_status: pending
---

# Claude 파일 인식 방식

## 핵심 인사이트

- [Claude](CLAUDE.md) [perceives](relationship) [files through conversion](concept)
- [Excel files](file-type) [converted via](process) [markitdown to markdown](tool)
- [Screenshots](file-type) [analyzed via](process) [vision capability](feature)
- [Merged cells](problem) [appear as](symptom) [NaN values](data-issue)

## 파일 형식별 인식

| 형식 | 방식 | 한계 |
|------|------|------|
| CSV/JSON/MD | 직접 읽기 | 없음 |
| Excel | markitdown → MD | 병합 셀 = NaN |
| 스크린샷 | vision 분석 | 데이터 추출 불가 |

## 해결책

- [preprocess_excel.py](script.md) [handles](solves) [merged cell NaN problem](problem)
- [Forward fill](technique) [restores](action) [hierarchical structure](data-structure)
- [Screenshot + Script](workflow) [provides](delivers) [complete understanding](result)

## Windows Excel Screenshot MCP

- [negokaz/excel-mcp-server](mcp-server) [uses](technique) [Windows COM automation](technology)
- [CopyPicture API](api.md) [captures](action) [Excel range to clipboard](mechanism)
- [Linux alternative](gap) [not yet implemented](status) - 사용자 스크린샷이 현실적

## 관련 자료

- 스킬: `~/claude-env/_common-skills/excel-merged-cells/`
- 지식: `~/claude-env/knowledge-base/knowledge/claude-file-perception.md`

## Observations

- [fact] Claude는 Excel 파일을 markitdown으로 마크다운 변환 후 인식 #excel #file-perception #markitdown
- [warning] Excel 병합 셀은 markitdown 변환 시 NaN으로 표시되어 계층 구조 손실 #merged-cells #data-issue
- [solution] preprocess_excel.py 스크립트로 forward fill 처리하여 계층 구조 복원 #preprocessing #fix
- [tech] negokaz/excel-mcp-server는 Windows COM + CopyPicture API로 Excel 범위 스크린샷 캡처 #mcp-server #windows
- [pattern] 스크린샷 + 전처리 스크립트 조합으로 Claude의 완전한 Excel 이해 가능 #workflow #best-practice
