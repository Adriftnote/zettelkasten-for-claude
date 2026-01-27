# Claude Code Task 시스템 조사

## 조사 일시
2026-01-27

## 개요
Claude Code 내장 Task 시스템의 지원 필드 및 동작 방식 조사

---

## 저장 위치

```
~/.claude/tasks/{TASK_LIST_ID}/
├── 1.json
├── 2.json
└── task-20260127-005.json  (커스텀 ID 가능)
```

- `CLAUDE_CODE_TASK_LIST_ID` 환경변수로 폴더명 지정
- 현재 설정: `orchestrator-main`

---

## 지원 필드 (테스트 완료)

| 필드            | 타입       | 용도         | 테스트 결과                                |
| ------------- | -------- | ---------- | ------------------------------------- |
| `id`          | string   | 고유 식별자     | 변경 가능, TaskList에서 `#id`로 표시           |
| `subject`     | string   | 작업 제목 (필수) | 정상 작동                                 |
| `description` | string   | 상세 설명      | 정상 작동                                 |
| `status`      | string   | 상태         | `pending`, `in_progress`, `completed` |
| `activeForm`  | string   | 진행중 표시 문구  | 정상 작동                                 |
| `blockedBy`   | string[] | 선행 작업 ID   | `[blocked by #1]`로 표시                 |
| `blocks`      | string[] | 후속 작업 ID   | blockedBy 설정 시 자동 연결                  |
| `metadata`    | object   | 커스텀 데이터    | 저장됨, TaskList에 표시 안 됨                 |

---

## 지원 안 되는 필드 (테스트 완료)

| 필드 | 테스트 결과 |
|------|------------|
| `subtasks` | JSON에 추가해도 무시됨 |
| `priority` | 미지원 |
| `tags` | 미지원 |
| `due_date` | 미지원 |

---

## 웹 조사로 확인된 필드 (미테스트)

| 필드          | 출처          |
| ----------- | ----------- |
| `owner`     | 담당 에이전트 지정  |
| `createdAt` | 생성 시간 (밀리초) |
| `updatedAt` | 수정 시간 (밀리초) |

---

## 파일명/ID 규칙 테스트

### 기본 동작
- TaskCreate 호출 시 순번 자동 증가: `1.json`, `2.json`, ...
- JSON 내부 `"id"` 값 기준으로 TaskList 표시

### 커스텀 ID 사용
1. 파일명 변경: `3.json` → `task-20260127-005.json`
2. JSON 내부 id 변경: `"id": "3"` → `"id": "task-20260127-005"`
3. 결과: TaskList에서 `#task-20260127-005`로 표시

---

## 폴더 구조 테스트

| 구조 | 인식 여부 |
|------|----------|
| 루트의 .json 파일 | ✅ 인식 |
| 하위 폴더의 .json | ❌ 인식 안 됨 |

```
orchestrator-main/
├── 1.json                    ✅
├── task-20260127-005.json    ✅
└── flow-project/
    └── task-001.json         ❌
```

---

## 의존성 (blockedBy/blocks)

### 설정 방법
```
TaskUpdate:
  taskId: "4"
  addBlockedBy: ["1"]
```

### 결과
```
#1 [pending] 메인 작업
#4 [pending] 하위 작업 [blocked by #1]
```

- Task #1 완료 시 Task #4의 blocked 상태 자동 해제
- subtask 개념 없음, 선후 관계만 표현 가능

---

## orchestration.db와 연계

### 현재 구조
- `orchestration.db`: 영구 기록 (task-YYYYMMDD-NNN)
- `Claude Code Task`: 세션 내 실시간 조율 (#1, #2, ...)

### 연계 방법 (권장)
1. orchestration.db에 INSERT (task-20260127-006)
2. TaskCreate 실행
3. **description 첫 줄에 `[task_id]` 포함** (metadata보다 가시성 좋음)

---

## description 형식 (테스트 완료)

CLAUDE.md에 규칙 정의 후 새 세션에서 테스트한 결과, 규칙대로 적용됨.

### 권장 형식
```markdown
[task-YYYYMMDD-NNN]
- 파생: task-YYYYMMDD-NNN (원본 작업명)
- 선행: task-YYYYMMDD-NNN (선행 작업명)
- 연관: task-YYYYMMDD-NNN (관련 작업명)

## 목표
{작업 목표}

## 산출물
{예상 산출물}

## 담당
{worker-xxx}
```

### 관계 유형
| 관계 | 의미 |
|------|------|
| 파생 | 이 작업이 어디서 나왔는지 (부모) |
| 선행 | 이 작업 전에 완료되어야 하는 것 |
| 연관 | 관련 있는 다른 작업 |
| 후속 | 이 작업 후에 진행될 것 |

### 테스트 결과
```
#1 Output 관리 자동화 구현 [blocked by #2]
   [task-20260127-007]
   - 파생: task-20260127-006 (Output Worker 역할 정의)
   - 연관: task-20260126-003 (SNS Flow 등록)

#2 Output Worker 역할 정의
   [task-20260127-006]

#3 SNS 기초 데이터 수집 자동화 - Flow 등록
   [task-20260126-003]
   - 파생: task-20260123-001 (Flow 프로젝트 폴더 생성)
```

---

## 멀티 세션 테스트

### 동작 방식
- Task 파일은 같은 폴더(`orchestrator-main/`)에 저장됨
- **자동 동기화 아님** - TaskList 호출 시 파일시스템에서 읽어옴
- 새 세션에서 만든 Task는 다른 세션에서 TaskList 호출해야 보임

### 테스트 결과
```
세션 A: TaskCreate → 1.json 생성
         ↓
세션 B: TaskList 호출 → 1.json 읽음 → #1 표시
```

---

## 결론

- **단순한 구조**: 의존성 관리 특화
- **고급 기능 없음**: 우선순위, 태그, 기한, 서브태스크 미지원
- **확장은 metadata로**: 커스텀 필드는 metadata에 저장
- **폴더 구분 불가**: 프로젝트별 분리는 파일명 prefix로 대체
