---
title: Atomic File Modification
type: concept
tags: [file-system, concurrency, reliability, system-programming]
permalink: knowledge/concepts/atomic-file-modification
category: 시스템 프로그래밍
difficulty: 중급
created: 2026-01-22
---

# Atomic File Modification

**"파일 수정이 전부 성공하거나 전부 실패하는 것을 보장하는 기법"**

시스템 프로그래밍의 핵심 개념. 파일 수정 중 크래시가 발생해도 파일이 손상되지 않도록 보장합니다. 중간 상태(half-written)가 존재하지 않습니다.

## 📖 개요

핵심 아이디어: **"All or Nothing"**

```
[비원자적 수정]
파일 열기 → 쓰기 중... → 💥 크래시 → 파일 손상!

[원자적 수정]
임시파일에 쓰기 → 완료 → rename → 성공!
                  ↓
              💥 크래시 → 원본 파일 무사
```

## 🎭 비유

### 은행 계좌 이체

```
[비원자적]
A 계좌에서 출금 → 💥 시스템 다운 → B 계좌 입금 안 됨
→ 돈이 사라짐!

[원자적]
A에서 출금 + B에 입금을 "하나의 트랜잭션"으로
→ 둘 다 성공하거나 둘 다 실패
→ 돈이 사라지지 않음
```

## 💡 구현 방법

### 방법 1: Write-to-Temp + Rename (권장)

```bash
# 1. 임시 파일에 쓰기
echo "new content" > config.json.tmp

# 2. 원자적으로 교체 (rename/mv는 원자적)
mv config.json.tmp config.json
```

**왜 원자적인가?**
- `rename()`/`mv`는 파일시스템 레벨에서 원자적
- 메타데이터(inode 포인터)만 변경
- 중간 상태 없음

### 방법 2: Write + fsync + Rename

```python
import os

def atomic_write(filepath, content):
    tmp_path = filepath + '.tmp'

    # 1. 임시 파일에 쓰기
    with open(tmp_path, 'w') as f:
        f.write(content)
        f.flush()
        os.fsync(f.fileno())  # 디스크에 확실히 기록

    # 2. 원자적 교체
    os.rename(tmp_path, filepath)
```

### 방법 3: Bash heredoc (단순 케이스)

```bash
# 직접 덮어쓰기 (작은 파일용)
cat <<'EOF' > config.json
{
  "key": "value"
}
EOF
```

## 💻 실제 사례

### Claude Code Edit 도구 문제

```
[문제]
Edit 도구로 .claude.json 수정 시
→ File Watcher가 중간에 감지
→ "File has been unexpectedly modified" 에러

[원인]
Edit 도구의 Read → Modify → Write 과정이 원자적이지 않음

[해결]
Python script로 원자적 수정
또는 Bash로 직접 덮어쓰기
```

### 데이터베이스 저널링

```
[SQLite Write-Ahead Logging]
1. 변경사항을 WAL 파일에 먼저 기록
2. WAL이 완전히 기록되면 메인 DB에 적용
3. 크래시 시 WAL로 복구

→ 원자성 보장
```

## ⚠️ 비원자적 수정의 위험

### 파일 손상 시나리오

```python
# ❌ 비원자적 수정
with open('config.json', 'w') as f:
    f.write('{"key": ')   # 일부만 기록
    # 💥 여기서 크래시!
    f.write('"value"}')   # 실행 안 됨

# 결과: config.json = '{"key": '  (손상됨!)
```

### 동시 접근 문제

```
[프로세스 A]        [프로세스 B]
파일 읽기 ─────────→ 파일 읽기
    ↓                    ↓
수정 중... ──────→ 수정 중...
    ↓                    ↓
파일 쓰기 ←───────── 파일 쓰기
                        ↑
                   A의 변경 사라짐!
```

## 📊 방법 비교

| 방법 | 원자성 | 복잡도 | 사용 상황 |
|------|--------|--------|----------|
| **직접 쓰기** | ❌ | 낮음 | 비권장 |
| **Temp + Rename** | ✅ | 중간 | 일반적 |
| **Temp + fsync + Rename** | ✅✅ | 높음 | 중요 데이터 |
| **DB 트랜잭션** | ✅✅ | 높음 | 복잡한 데이터 |

## ✅ 체크리스트

| 체크 | 내용 |
|------|------|
| 1 | 임시 파일에 먼저 쓰기 |
| 2 | 쓰기 완료 후 `fsync()` (중요 데이터) |
| 3 | `rename()`으로 원자적 교체 |
| 4 | 임시 파일은 같은 파일시스템에 생성 |
| 5 | 에러 시 임시 파일 정리 |

## 🔧 언어별 구현

### Node.js

```javascript
const fs = require('fs');
const path = require('path');

function atomicWrite(filePath, content) {
  const tmpPath = filePath + '.tmp';

  fs.writeFileSync(tmpPath, content);
  fs.renameSync(tmpPath, filePath);
}
```

### Python

```python
import os
import tempfile

def atomic_write(filepath, content):
    dir_name = os.path.dirname(filepath)
    with tempfile.NamedTemporaryFile(
        mode='w', dir=dir_name, delete=False
    ) as tmp:
        tmp.write(content)
        tmp.flush()
        os.fsync(tmp.fileno())
        tmp_path = tmp.name

    os.rename(tmp_path, filepath)
```

## Relations

- prevents [[Race Condition]] (동시 접근 시 데이터 손상 방지)
- related_to [[Defensive Coding]] (안정적인 파일 처리)
- used_with [[트랜잭션]] (DB에서의 원자성 개념)
- related_to [[graceful-degradation]] (실패 시에도 안전한 상태 유지)
