---
title: nas-ssh-connect
type: function
level: low
category: "infra/ssh/nas"
semantic: "connect nas via paramiko"
permalink: functions/nas-ssh-connect
path: "working/worker-data/scripts/sync_feedback_gui.py"
tags:
- python
- paramiko
- ssh
---

# nas-ssh-connect

paramiko로 NAS에 SSH 접속하는 클래스 (비밀번호 내장)

## 시그니처

```python
class NAS:
    def __init__(self)          # 연결
    def query(sql) -> str       # SELECT 결과 반환
    def query_sep(sql, sep) -> str  # separator 지정 조회
    def execute(sql) -> bool    # INSERT/UPDATE 실행
    def close()                 # 연결 종료
```

## Observations

- [impl] paramiko.SSHClient + AutoAddPolicy로 호스트키 자동 수락 #pattern
- [impl] 비밀번호를 스크립트에 내장하여 외부 설정 불필요 #context
- [impl] sqlite3 CLI를 SSH로 원격 실행하는 방식 #algo
- [deps] paramiko #import
- [note] Host: 192.168.0.9, User: admin123 #caveat

## Relations

- part_of [[sync-feedback-gui]] (소속 모듈)
- used_by [[get-existing-records]] (DB 조회)
- used_by [[insert-feedback-records]] (DB INSERT)
- used_by [[save-sync-log]] (이력 저장)
