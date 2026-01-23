# 02. knowledge/gotchas 폴더 분류 결과

## 전체 통계

| 항목 | 수량 |
|------|------|
| 전체 파일 수 | 47개 |
| 실제 문서 수 | 46개 (00.index.md 제외) |
| 인덱스 기록 수 | 45개 |
| 차이 | +1개 (인덱스 업데이트 필요) |

---

## 카테고리별 파일 개수

| 카테고리 | 파일 수 | 비율 |
|---------|---------|------|
| **Claude Code** | 13개 | 28.3% |
| **Metabase** | 8개 | 17.4% |
| **MCP** | 6개 | 13.0% |
| **JavaScript** | 4개 | 8.7% |
| **Claude Agent SDK** | 3개 | 6.5% |
| **Network** | 3개 | 6.5% |
| **Database** | 2개 | 4.3% |
| **Filesystem** | 2개 | 4.3% |
| **Process/Watcher** | 2개 | 4.3% |
| **Shell/System** | 1개 | 2.2% |
| **Bug Analysis** | 1개 | 2.2% |
| **기타/미분류** | 1개 | 2.2% |
| **인덱스** | 1개 | - |

**총계**: 46개 (인덱스 제외)

---

## 상세 분류

### 1️⃣ Claude Code (13개)

**파일 편집 이슈** (5개):
1. `Claude Code Edit Tool- File Watcher and Multi-Instance Collision.md`
2. `Claude Code File Watcher Blocks .claude- File Edit.md`
3. `Claude Code File Watcher Cache and Edit Tool Failure.md`
4. `Claude Code Windows Edit Bug - NTFS Timestamp Precision Problem.md`
5. `Claude Code Windows Timestamp Bug and Patch Method.md`

**CLI 및 설정 이슈** (5개):
6. `Claude Code CLI- CreateMessage Undefined Array Error.md`
7. `Claude Code MCP Configuration File Path.md`
8. `Claude Code MCP Disabling Limitations.md`
9. `Claude Code MCP Server Process Leak (Windows).md`
10. `Claude Code Streaming Request Timeout.md`

**규칙 및 기타** (3개):
11. `Claude CLAUDE.md Rules Auto-Trigger Limitations.md`
12. `Prevent Claude Code Plugin Crash on WSL.md`
13. `Windows Environment Claude Code Timestamp Bug.md`

---

### 2️⃣ Metabase (8개)

**쿼리 및 파라미터** (6개):
1. `Metabase Default Values Must Be Set in Both Template-Tags and Parameters.md`
2. `Metabase execute_card- Parameters Must Be Array.md`
3. `Metabase IN Clause Parameter Usage.md`
4. `Metabase Native Query Requires Template Tags.md`
5. `Metabase Optional Clause Syntax and Field Filter Cautions.md`
6. `Field Filter (Dimension Type) Returns Null When Writing Condition Directly.md`

**대시보드 API** (2개):
7. `Metabase MCP Dashboard Tools - Update-Delete Bug.md`
8. `Metabase update_dashboard Does Not Handle Dashcards.md`

**추가 발견**: `update_dashboard_card Call Deletes All Cards.md`도 Metabase로 분류 가능 (총 8개)

---

### 3️⃣ MCP (6개)

**설정 및 비활성화**:
1. `MCP disabledMcpServers Configuration Cannot Fully Disable Global MCP.md`
2. `Live Config File Modification Danger.md`

**파라미터 및 API**:
3. `MCP JSON Parameter Double Serialization Error (400).md`
4. `FastMCP Constructor API Breaking Change.md`

**Stderr 및 프로세스**:
5. `MCP Server Stderr- Distinguishing Actual Errors from Informational Messages.md`

**Knowledge Base**:
6. `Knowledge Base File Edit Failure and Background Process.md`

---

### 4️⃣ JavaScript (4개)

1. `JavaScript ReferenceError - Variable Use Before Declaration.md`
2. `JavaScript Variables Must Be Declared Before Use.md`
3. `JSON Parameter Type Error.md`
4. `TypeError- Cannot Read Properties of Undefined Error.md`

---

### 5️⃣ Claude Agent SDK (3개)

1. `Claude Agent SDK- 1P Event Export Failure - Ignorable Telemetry Error.md`
2. `Claude Agent SDK- File Unexpectedly Modified Error - Windows Timestamp Bug.md`
3. `SDK Telemetry Event Export Failure.md`

---

### 6️⃣ Network (3개)

1. `Axios Timeout Exceeding 5000ms - Network Latency Caution.md`
2. `n8n Always Check Empty Array After API Call.md`
3. `n8n Empty Array Response Returns Items Undefined Error.md`

---

### 7️⃣ Database (2개)

1. `claude-file-perception-excel-merged-cells.md` (Excel 데이터 처리)
2. `mcp-document-edit-excel-tool-usage-patterns.md` (Excel MCP 도구)

---

### 8️⃣ Filesystem (2개)

1. `Knowledge File Incorrect Path Storage - Anti-Pattern and Prevention.md`
2. `shell-korean-special-character-path-handling.md`

---

### 9️⃣ Process/Watcher (2개)

1. `Watcher and -save Command Process Collision.md`
2. `update_dashboard_card Call Deletes All Cards.md` (Metabase 중복 분류 가능)

---

### 🔟 Shell/System (1개)

1. `Safe Syntax Conversion When Patching CLI.js.md`

---

### 1️⃣1️⃣ Bug Analysis (1개)

1. `Bug Analysis- Distinguish Symptom Occurrence Version and Bug Introduction Version.md`

---

### 1️⃣2️⃣ 인덱스 (1개)

1. `00.index.md`

---

## 인덱스와 실제 파일 차이 분석

### 인덱스에 누락된 파일 후보

비교 결과, 다음 파일들이 인덱스에 명시적으로 나열되지 않았을 가능성:

1. `SDK Telemetry Event Export Failure.md` (Agent SDK 카테고리에 있으나 개수 불일치)
2. `Windows Environment Claude Code Timestamp Bug.md` (Claude Code 중복 가능성)
3. `update_dashboard_card Call Deletes All Cards.md` (Metabase 카테고리 누락)
4. `Prevent Claude Code Plugin Crash on WSL.md` (Claude Code 카테고리 누락)
5. `Watcher and -save Command Process Collision.md` (기타 카테고리 누락)

### 카테고리 개수 차이

| 카테고리 | 인덱스 기록 | 실제 파일 | 차이 |
|---------|-------------|-----------|------|
| Claude Code | 13개 | 13개 | ✅ 일치 |
| Metabase | ? | 8개 | ? |
| MCP | 6개 | 6개 | ✅ 일치 |
| JavaScript | 4개 | 4개 | ✅ 일치 |
| Agent SDK | ? | 3개 | ? |
| Network | 2개 | 3개 | ⚠️ +1 |
| Database | 3개 | 2개 | ⚠️ -1 |
| Filesystem | 2개 | 2개 | ✅ 일치 |

---

## 재분류 제안

### Metabase 카테고리 통합 (8개)

인덱스에서 Metabase는 5개로 기록되어 있으나, 실제 파일은 8개입니다.

**추가 파일**:
- `Metabase execute_card- Parameters Must Be Array.md`
- `Metabase IN Clause Parameter Usage.md`
- `update_dashboard_card Call Deletes All Cards.md`

### Database 카테고리 재검토

인덱스에서 Database는 3개로 기록되어 있으나, 실제 파일은 2개입니다.
- Excel 관련 파일들이 Database보다는 **Document/File Perception** 카테고리로 분류하는 것이 더 적절할 수 있음

### Network 카테고리 확장

n8n 관련 파일 2개를 Network에 추가하면 3개가 됩니다.

---

## 최종 권장 카테고리 구조

```
claude-code/          13개 (28.3%)
metabase/             8개  (17.4%)
mcp/                  6개  (13.0%)
javascript/           4개  (8.7%)
agent-sdk/            3개  (6.5%)
network/              3개  (6.5%)
document/             2개  (4.3%) ← Excel 파일 인식
filesystem/           2개  (4.3%)
process/              2개  (4.3%)
shell/                1개  (2.2%)
bug-analysis/         1개  (2.2%)
misc/                 1개  (2.2%)
```

---

## 다음 단계 제안

1. **인덱스 업데이트**: `00.index.md`에 누락된 파일 추가
2. **카테고리 재분류**: Database → Document로 Excel 파일 이동
3. **Metabase 카테고리 확장**: 5개 → 8개로 업데이트
4. **태그 통일**: 파일명과 태그 일관성 검토
