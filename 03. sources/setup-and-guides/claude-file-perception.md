---
permalink: knowledge/setup-and-guides/claude-file-perception
extraction_status: pending
---

# Claude의 파일 인식 방식

## 핵심 개념

Claude는 파일을 **직접 읽지 못한다**. 항상 중간 변환 단계가 필요하다.

## 파일 형식별 인식 방식

| 파일 형식 | 인식 방식 | 도구 | 장점 | 한계 |
|----------|----------|------|------|------|
| **텍스트 (CSV, JSON, MD, TXT)** | 직접 읽기 | Read tool | 완벽한 데이터 접근 | - |
| **Excel (.xlsx)** | 마크다운 변환 | markitdown MCP | 데이터 추출 가능 | 병합 셀 → NaN, 서식 손실 |
| **이미지/스크린샷** | vision으로 시각 분석 | Read tool (이미지) | 레이아웃/서식 파악 | 데이터 추출 불가 |
| **PDF** | 마크다운 변환 | markitdown MCP | 텍스트 추출 | 복잡한 레이아웃 손실 |
| **바이너리** | 변환 필요 | 각종 MCP | - | 직접 읽기 불가 |

## 용어 정리

- **바이너리**: 사람이 직접 읽을 수 없는 파일 형식 (Excel, PDF, 이미지 등)
- **텍스트**: 사람이 읽을 수 있는 문자로 저장된 파일 (CSV, JSON, MD 등)
- **행렬 구조**: 데이터의 형태 (테이블) - 바이너리/텍스트와 무관

## Excel 병합 셀 문제

### 문제

```
원본 Excel (병합 셀):
┌─────────────┬─────────┐
│  경영지원실  │  직원수  │
│   (병합)    │  (병합)  │
│             │         │
└─────────────┴─────────┘

markitdown 출력:
| 경영지원실 | 직원수 | 세부1 |
| NaN       | NaN   | 세부2 |  ← 구조 손실!
| NaN       | NaN   | 세부3 |
```

### 해결책

1. **스크린샷**: 구조 파악용 (시각적 이해)
2. **preprocess_excel.py**: 데이터 추출용 (NaN → 값 채움)

```bash
python3 ~/claude-env/_common-skills/excel-merged-cells/scripts/preprocess_excel.py \
  "input.xlsx" --ffill-columns "0,1,2" --output "clean.csv"
```

## 권장 워크플로우

### Excel 분석 시

```
1. 사용자가 스크린샷 제공 → Claude가 구조 파악
2. preprocess 스크립트 실행 → 정제된 데이터 획득
3. 두 정보 조합 → 정확한 분석/작업
```

### 시각적 확인이 필요할 때

- 스크린샷 요청 (사용자가 캡처)
- base64 이미지로 전달받으면 vision으로 분석

## DO / DON'T

### DO

- Excel 작업 전 구조 파악을 위해 스크린샷 요청
- 병합 셀이 의심되면 preprocess 스크립트 사용
- 복잡한 Excel은 시각 + 데이터 두 가지로 접근

### DON'T

- markitdown 출력의 NaN을 무시하고 임의로 해석하지 말 것
- 병합 셀 구조를 추측하지 말 것
- 스크린샷만으로 데이터 추출 시도하지 말 것

---

## 참고: Windows Excel 스크린샷 MCP

### 프로젝트

- **이름**: negokaz/excel-mcp-server
- **URL**: https://github.com/negokaz/excel-mcp-server
- **환경**: Windows 전용 (COM 자동화)

### 핵심 로직

```go
// 1. Excel COM 객체로 실제 Excel 앱 실행
workbook, _ := excel.NewExcelOle()

// 2. Range.CopyPicture 호출 - 선택 영역을 클립보드에 비트맵으로 복사
// xlScreen = 1 (화면 모양 그대로)
// xlBitmap = 2 (비트맵 형식)
range.CopyPicture(xlScreen, xlBitmap)

// 3. 클립보드에서 이미지 읽기
clipboardReader, _ := clipboard.ReadFromClipboard()
io.Copy(bufWriter, clipboardReader)

// 4. base64로 인코딩하여 반환
return base64.StdEncoding.EncodeToString(buf.Bytes())
```

### 동작 원리

```
Excel COM 실행 → Range 선택 → CopyPicture(xlScreen, xlBitmap)
                                    ↓
                            Windows 클립보드
                                    ↓
                            clipboard 라이브러리로 읽기
                                    ↓
                            base64 인코딩 → Claude에 전달
```

### Linux 대안 (미구현)

| 방법 | 설명 |
|------|------|
| LibreOffice headless | `libreoffice --convert-to pdf` → `pdftoppm` |
| Xvfb + screenshot | 가상 디스플레이에서 LibreOffice 열고 캡처 |
| Python 렌더링 | openpyxl + PIL로 셀 직접 그리기 (복잡) |

현재는 사용자 스크린샷 + preprocess 스크립트 조합이 가장 실용적.

---

## 관련 스킬

- `excel-merged-cells`: 병합 셀 전처리 스킬
  - 경로: `~/claude-env/_common-skills/excel-merged-cells/`

## Observations

- [fact] Claude는 파일을 직접 읽지 못하며 항상 중간 변환 단계가 필요함 #claude #file-handling
- [warning] markitdown으로 Excel 변환 시 병합 셀이 NaN으로 변환되어 구조 손실 발생 #excel #data-loss
- [solution] Excel 병합 셀 문제는 스크린샷(구조 파악) + preprocess_excel.py(데이터 추출)로 해결 #excel #workflow
- [tech] Windows Excel 스크린샷은 COM 자동화의 Range.CopyPicture API로 구현 가능 #windows #excel #automation
- [pattern] 복잡한 Excel 분석 시 시각적 정보와 데이터 추출을 두 가지로 조합하는 것이 권장됨 #best-practice