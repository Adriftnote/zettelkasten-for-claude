---
title: Paramiko - Python SSH 라이브러리
type: doc-summary
permalink: sources/reference/paramiko-python-ssh
tags:
- python
- ssh
- sftp
- remote
- automation
date: 2026-02-09
---

# Paramiko - Python SSH 라이브러리

Python에서 SSH 프로토콜을 구현한 라이브러리. 원격 서버 접속, 명령 실행, SFTP 파일 전송을 코드로 제어.

## 📖 핵심 아이디어

SSH 클라이언트/서버를 순수 Python으로 구현. 외부 SSH 바이너리(openssh) 없이도 Python 코드 안에서 원격 서버 접속, 명령 실행, 파일 전송이 가능. 자동화 스크립트나 n8n 같은 워크플로우에서 SSH 작업을 프로그래밍적으로 제어할 때 사용.

## 🛠️ 구성 요소

| 항목 | 설명 |
|------|------|
| **패키지** | `pip install paramiko` |
| **레포** | https://github.com/paramiko/paramiko |
| **License** | LGPL |
| **주요 기능** | SSH 접속, 명령 실행, SFTP, 키 인증 |

### 주요 클래스
| 클래스 | 용도 |
|--------|------|
| `SSHClient` | SSH 접속 + 명령 실행 |
| `SFTPClient` | 파일 업로드/다운로드 |
| `Transport` | 저수준 SSH 연결 관리 |
| `RSAKey` / `Ed25519Key` | SSH 키 인증 |

## 🔧 작동 방식

```python
import paramiko

# SSH 접속
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('192.168.0.9', username='admin123', password='비밀번호')

# 원격 명령 실행
stdin, stdout, stderr = client.exec_command('ls /volume1/docker/')
print(stdout.read().decode())

# SFTP 파일 전송
sftp = client.open_sftp()
sftp.get('/remote/file.db', 'C:/local/file.db')  # 다운로드
sftp.put('C:/local/file.db', '/remote/file.db')  # 업로드

client.close()
```

### Bash SSH vs Paramiko

```
Bash:     ssh admin123@192.168.0.9 "sqlite3 /path/db.db 'SELECT ...'"
Paramiko: client.exec_command("sqlite3 /path/db.db 'SELECT ...'")
```

Bash는 매번 새 SSH 세션, Paramiko는 하나의 연결에서 여러 명령 실행 가능.

## 💡 실용적 평가

**활용 시나리오:**
- NAS DB 자동 조회/수정 스크립트
- n8n Code 노드에서 SSH 작업
- 원격 파일 백업/동기화 자동화
- 배포 스크립트

**현재 우리 환경:**
- NAS 접속 시 `ssh admin123@192.168.0.9` Bash 명령 사용 중
- 비밀번호 매번 수동 입력 필요
- Paramiko + 키 인증 설정하면 자동화 가능

## 🔗 관련 개념

- [[Fabric]] - Paramiko 기반 고수준 SSH 자동화 라이브러리
- [[n8n]] - 워크플로우 자동화에서 SSH 작업 활용

---

**작성일**: 2026-02-09
**분류**: Python 라이브러리