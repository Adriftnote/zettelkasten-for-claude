# 링크 추가 우선순위 파일 목록

## 1순위: 크기 큰 파일 + 링크 없음 (10개)

### 02. knowledge/architectures (3개)
- Tool-Hub & Tool-Chainer Architecture Analysis.md (11.0 KB, 0 링크)
- knowledge-agent-architecture-guide.md (7.6 KB, 0 링크)
- agent-architecture-guide.md (5.2 KB, 0 링크)

### knowledge-base/reviews (2개)
- 012-platform-data-extraction-comparison.md (11.3 KB, 0 링크)
- Tool-Hub MCP Server 코드 리뷰.md (8.2 KB, 0 링크)

### knowledge-base/reports (2개)
- Jarvis Conversational Knowledge Graph Construction Plan.md (10.5 KB, 0 링크)
- jarvis-graph-plan-simple.md (10.2 KB, 0 링크)

### 루트 (2개)
- concepts-categorization.md (7.3 KB, 0 링크)
- gotchas-categorization.md (6.9 KB, 0 링크)

### 02. knowledge (1개)
- Warp Terminal for Windows 사용자 가이드.md (8.2 KB, 0 링크)

**예상 효과**: 10개 파일에 각 5개 링크 = 50개 링크 추가

---

## 2순위: gotchas 폴더 - 상위 10개 파일 (링크 없음)

1. Claude Agent SDK- File Unexpectedly Modified Error - Windows Timestamp Bug.md (4.1 KB)
2. Claude Code Windows Timestamp Bug and Patch Method.md (3.7 KB)
3. Safe Syntax Conversion When Patching CLI.js.md (3.7 KB)
4. Axios Timeout Exceeding 5000ms - Network Latency Caution.md (3.3 KB)
5. Knowledge Base File Edit Failure and Background Process.md (3.2 KB)
6. shell-korean-special-character-path-handling.md (3.1 KB)
7. MCP Server Stderr- Distinguishing Actual Errors from Informational Messages.md (3.0 KB)
8. Metabase MCP Dashboard Tools - Update-Delete Bug.md (2.8 KB)
9. Claude Agent SDK- 1P Event Export Failure - Ignorable Telemetry Error.md (2.8 KB)
10. Knowledge File Incorrect Path Storage - Anti-Pattern and Prevention.md (2.8 KB)

**권장 링크** (각 파일당 5개):
- 관련 개념 2개 (예: `[[MCP]]`, `[[Windows]]`)
- 관련 패턴 1개 (예: `[[Known Edit Bug Response Pattern]]`)
- 유사 gotchas 1개
- 인덱스 1개 (`[[02. knowledge/gotchas/00.index]]`)

**예상 효과**: 10개 파일 × 5개 = 50개 링크 추가

---

## 3순위: patterns 폴더 - 상위 10개 파일 (링크 없음)

1. context-engineering-guide.md (4.5 KB)
2. Streaming Timeout Fallback - Graceful Degradation Pattern.md (4.2 KB)
3. Decision-to-Dataset Pipeline for D2D Recording.md (4.0 KB)
4. Metabase Dashboard Dropdown Filter Pattern - Model Solution.md (3.1 KB)
5. Request Aborted - User Intentional Abort Pattern.md (3.0 KB)
6. nodejs-cross-platform-development.md (2.9 KB)
7. context-engineering-core-guide.md (2.8 KB)
8. Metabase Model for Dropdown Filter Implementation.md (2.7 KB)
9. Memory-Based Error Pattern Collection.md (2.3 KB)
10. MCP CLI LazyToolLoader Pattern.md (1.9 KB)

**권장 링크** (각 파일당 6개):
- 관련 패턴 2개 (유사/보완)
- 관련 개념 2개
- 실제 사례(gotchas) 1개
- 인덱스 1개 (`[[02. knowledge/patterns/00.index]]`)

**예상 효과**: 10개 파일 × 6개 = 60개 링크 추가

---

## 총 예상 효과

- **1순위 10개**: 50개 링크 추가
- **2순위 10개**: 50개 링크 추가
- **3순위 10개**: 60개 링크 추가

**합계**: 30개 파일에 160개 링크 추가
**현재 전체 링크 수**: 989개
**개선 후**: 1,149개 (16% 증가)

---

## 실행 가이드

### 각 파일에 추가할 섹션

```markdown
## 관련 개념
- [[개념1]] - 간단한 설명
- [[개념2]] - 간단한 설명

## 관련 자료
- [[패턴/아키텍처]] - 연결 이유
- [[유사 문서]] - 연결 이유

## 참고
- [[인덱스 파일]]
```

### 예시: gotchas 파일

```markdown
## 관련 개념
- [[MCP]] - MCP 서버 기본 개념
- [[Windows]] - Windows 특화 문제

## 해결 패턴
- [[Known Edit Bug Response Pattern]] - 이 문제의 대응 패턴

## 유사 문제
- [[다른 Windows 관련 gotchas]]

## 더 보기
- [[02. knowledge/gotchas/00.index|모든 Gotchas 보기]]
```

### 예시: patterns 파일

```markdown
## 관련 패턴
- [[Progressive Disclosure]] - 점진적 정보 노출
- [[Context Poisoning]] - 반대 개념

## 관련 개념
- [[Token Optimization Strategy]]
- [[MCP]]

## 실제 사례
- [[gotchas/실제로 이 패턴을 사용한 문제 해결]]

## 더 보기
- [[02. knowledge/patterns/00.index|모든 패턴 보기]]
```
