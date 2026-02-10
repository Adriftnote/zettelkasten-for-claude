---
title: sync-feedback-gui
type: module
level: low
category: "dashboard/feedback/sync"
semantic: "sync excel to nas db with gui"
permalink: modules/sync-feedback-gui
path: "working/worker-data/scripts/sync_feedback_gui.py"
tags:
- python
- paramiko
- tkinter
- sqlite
- gui
---

# sync-feedback-gui

Excel 피드백 리스트를 NAS feedback.db에 증분 동기화하는 GUI 도구 (230줄)

## Observations

- [impl] paramiko SSH로 NAS 직접 접속 (비밀번호 내장, 외부 설정 불필요) #pattern
- [impl] tkinter GUI + threading으로 UI 블로킹 방지 #pattern
- [impl] 중복 판별 키: (수집일, 채널, 고객명, 내용) 4개 조합 #algo
- [impl] 검증 비교: category/keywords/response_status/department/action_status/note 6개 필드 #algo
- [impl] sync_log 테이블에 매 실행 이력 저장 (불일치 상세 JSON 포함) #pattern
- [impl] sys.argv[1]로 드래그앤드롭 지원, filedialog로 파일 선택 지원 #context
- [impl] PyInstaller --onefile --windowed로 단일 EXE 빌드 (38MB) #context
- [deps] paramiko, openpyxl, tkinter #import
- [note] Excel 구조 고정: 4행 헤더, 5행 데이터 시작, B~K열 10컬럼 #caveat
- [note] 파일명/시트명 무관, 첫 번째 시트만 읽음 #caveat

## 동작 흐름

```
1. Excel 읽기 (openpyxl)
2. NAS SSH 연결 (paramiko)
3. DB 기존 데이터 전체 조회
4. 기존 데이터 검증 (6개 필드 비교 → 불일치 표시)
5. 증분 INSERT (신규만)
6. sync_log 이력 저장
7. 결과 요약 표시
```

## DB 테이블

### feedback_raw
```sql
CREATE TABLE feedback_raw (
    id INTEGER PRIMARY KEY,
    collected_date DATE, channel TEXT, customer_name TEXT,
    content TEXT, category TEXT, keywords TEXT,
    response_status TEXT, department TEXT,
    action_status TEXT, note TEXT
);
```

### sync_log
```sql
CREATE TABLE sync_log (
    id INTEGER PRIMARY KEY,
    sync_date TEXT NOT NULL, excel_filename TEXT,
    excel_total INTEGER, db_before INTEGER,
    new_inserted INTEGER, verified_count INTEGER,
    mismatch_count INTEGER, mismatch_detail TEXT,
    db_after INTEGER
);
```

## NAS 접속 정보

- Host: 192.168.0.9
- User: admin123
- DB: /volume1/docker/n8n/databases/feedback.db

## EXE 빌드

```bash
cd working/worker-data/scripts
pyinstaller --onefile --windowed --name "피드백_동기화" sync_feedback_gui.py
```

## Relations

- part_of [[댓글 피드백 대시보드]] (소속 프로젝트)
- contains [[read-feedback-excel]] (Excel 파싱)
- contains [[get-existing-records]] (DB 조회)
- contains [[verify-existing]] (정합성 검증)
- contains [[insert-feedback-records]] (증분 INSERT)
- contains [[nas-ssh-connect]] (SSH 연결)
- contains [[save-sync-log]] (이력 저장)
