---
title: session-stop hook vecsearch sync orphan 프로세스 — hook 제거로 해결
type: note
permalink: zettelkasten/03.-sources/workcases/session-stop-hook-vecsearch-sync-orphan-peuroseseu-hook-jegeoro-haegyeol
tags:
- hook
- orphan-process
- vecsearch
- qmd
- troubleshooting
---

# session-stop hook vecsearch sync orphan 프로세스 — hook 제거로 해결

## 문제 상황

작업관리자에서 Bun 프로세스 4개가 CPU 24%씩 (합산 100%), 메모리 600~750MB씩 (합산 ~2.6GB) 점유.
주말 내내 돌아간 orphan 프로세스로, 시스템이 극도로 느려짐.

## 시도했지만 안 된 방법

### 1차: bun 프로세스만 kill
`taskkill /PID <bun_pid> /F`로 bun 4개 종료 → 즉시 재발.
원인: 부모인 `vecsearch sync` (python)가 자식 종료 감지 후 `qmd embed`를 다시 스폰.

### 2차: 전체 프로세스 트리 kill
`taskkill /PID <python_pid> /T /F`로 python + cmd + bun 트리 전체 종료 → 또 재발.
원인: 여러 세션의 session-stop hook이 각각 독립적으로 `vecsearch sync`를 스폰하여 다른 트리가 존재.

## 근본 원인

```
Claude Code 세션 종료
  └→ session-stop.sh (async: true)
       └→ bash: vecsearch sync
            └→ python: vecsearch.py sync
                 └→ cmd: qmd embed
                      └→ bun: qmd.ts embed (CPU-only, 장시간)
```

- `settings.json`의 Stop hook이 `async: true`로 설정 → 세션 종료 후에도 백그라운드 실행
- `vecsearch sync`가 내부적으로 `qmd embed` 호출 (subprocess)
- `qmd embed`는 `gpu: false` 설정(AMD Vulkan 크래시 방지)으로 CPU-only → 600초 timeout으로 오래 걸림
- 세션이 먼저 종료되어 부모 프로세스 죽고, 자식들이 orphan으로 생존
- 여러 세션이 종료될 때마다 새 orphan 트리 생성 → 누적

## 해결책

`_system/hooks/session-stop.sh`에서 `vecsearch sync` 호출 제거.

변경 전:
```bash
if command -v vecsearch &>/dev/null; then
  vecsearch sync >> "$LOG" 2>&1
fi
```

변경 후: 해당 블록 삭제. 필요 시 수동 실행.

## 적용

- 파일: `C:\claude-workspace\_system\hooks\session-stop.sh`
- 총 15개 orphan 프로세스 정리 (PowerShell `Get-CimInstance Win32_Process`로 트리 추적)

## 관련 Task
- task-20260316-002: qmd embed orphan 프로세스 원인 추적 및 해결

## Relations
- uses [[vecsearch]] (orphan 원인이 된 도구)
- learned_from [[qmd embed AMD Vulkan GPU 크래시 — CPU 폴백으로 해결]] (동일 qmd embed CPU-only 맥락)
- applied_in [[벡터 시맨틱 검색]] (vecsearch 프로젝트 운영 개선)

## Observations
- [fact] async hook에서 장시간 subprocess를 호출하면 orphan 프로세스가 생긴다 #hook #process
- [fact] Windows에서 부모 프로세스가 죽어도 자식은 자동 종료되지 않는다 (Unix와 다름) #windows #process
- [solution] bun만 kill하면 부모(python)가 재스폰하므로 반드시 프로세스 트리 전체를 추적해서 root부터 죽여야 한다 #troubleshooting
- [solution] 근본 해결은 hook에서 장시간 작업 호출 자체를 제거하는 것 #hook
- [method] PowerShell Get-CimInstance Win32_Process + ParentProcessId로 프로세스 트리 역추적 #windows #debugging
- [warning] taskkill /T /F 해도 다른 독립 트리가 있으면 재발한다 — 이미지명 기반 전수 조사 필요 #troubleshooting