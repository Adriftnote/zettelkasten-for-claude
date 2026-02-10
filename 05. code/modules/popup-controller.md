---
title: popup-controller
type: module
permalink: modules/popup-controller
level: low
category: automation/sns/ui
semantic: control popup extraction
path: working/projects/social-analytics-extractor/popup.js
tags:
- javascript
- popup
- ui-controller
---

# popup-controller

Social Analytics Extractor 팝업 UI 컨트롤러

## Observations

- [impl] 플랫폼 자동 감지 (Facebook/X/Naver) #algo
- [impl] 플랫폼별 설정 객체로 동적 UI 생성 #pattern
- [impl] 3개 플랫폼 모두 `getDailyInsights` 통일 액션 사용 #pattern
- [impl] Content Script와 메시지 통신으로 데이터 추출 제어 #pattern
- [impl] `displayResults()` 하나로 3개 플랫폼 공통 처리 (플랫폼별 분기 제거) #pattern
- [impl] chrome.storage.local로 추출 데이터 저장 (`dailyData` 통일) #pattern
- [impl] n8n webhook으로 데이터 자동 전송 (플랫폼별 필드 매핑 유지) #pattern
- [impl] popup 날짜 선택 없음 (hasDateRange: false), 페이지 UI 날짜만 따름 #pattern
- [deps] chrome.tabs, chrome.storage, chrome.runtime #import

## 함수 목록

### 플랫폼 감지
| 함수 | 역할 |
|------|------|
| `detectPlatform(url)` | URL로 플랫폼 감지 |

### UI 제어
| 함수 | 역할 |
|------|------|
| `setupUI()` | 플랫폼별 UI 동적 설정 |
| `showUnsupported()` | 미지원 페이지 표시 |
| `setStatus(type, text)` | 상태 표시 업데이트 |
| `showError(message)` | 에러 메시지 표시 |

### 데이터 추출
| 함수 | 역할 |
|------|------|
| `checkPage()` | 페이지 상태 확인 |
| `displayResults(response)` | 추출 결과 표시 (3개 플랫폼 공통) |

### 저장/내보내기
| 함수 | 역할 |
|------|------|
| `getStoredData()` | 저장된 데이터 조회 |
| `updateStoredCount()` | 저장 개수 업데이트 |
| `downloadFile(content, filename, type)` | 파일 다운로드 |

### Webhook 연동
| 함수 | 역할 |
|------|------|
| `sendToWebhook(data)` | n8n webhook 전송 |
| `saveWebhookUrl()` | webhook URL 저장 |
| `testWebhookConnection()` | webhook 연결 테스트 |
| `initWebhookSettings()` | webhook 설정 초기화 |

## 플랫폼 설정 구조

```javascript
PLATFORM_CONFIG = {
  facebook: { name, storageKey, metrics, tableHeaders, extractAction },
  x: { ... },
  naver: { ... }
}
```

## Relations

- part_of [[social-analytics-extractor]] (소속 프로젝트)
- depends_on [[facebook-extractor]] (Facebook 데이터 추출)
- depends_on [[x-extractor]] (X 데이터 추출)
- depends_on [[naver-extractor]] (Naver 데이터 추출)
- data_flows_to [[background-service-worker]] (webhook 전송 위임)


## Change Log

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-06 | path 수정: `worker/from-code/` → `projects/` |
| 2026-02-06 | 인터페이스 통일: displayNaverResults() 삭제, displayResults() 공통 처리 |
| 2026-02-06 | PLATFORM_CONFIG extractAction 모두 getDailyInsights로 통일 |
| 2026-02-06 | 저장 로직: naver 분기 제거, dailyData 통일 사용 |
| 2026-02-06 | 날짜 선택 제거: hasDateRange false (FB/X), 페이지 UI 날짜만 따르기 |