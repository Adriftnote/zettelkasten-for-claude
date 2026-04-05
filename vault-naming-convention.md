# Vault Naming Convention

볼트 파일명 및 링크 작성 규칙. 2026-03-21 팀 합의.

---

## 카테고리별 파일명 규칙

| 카테고리 | 규칙 | 예시 |
|---------|------|------|
| `01. concepts/` | **kebab-case** (소문자, 하이픈) | `token-optimization-strategy.md` |
| `02. hubs/` | **kebab-case** | `agent-tools-hub.md` |
| `03. sources/REF` | **REF-NNN 제목** (현행 유지) | `REF-075 Think Deep Not Just Long.md` |
| `04. notes/` | 자유 (한글 허용) | `자가 생성 메모리의 파라미터.md` |
| `05. code/` | **kebab-case** | `flow-content-script.md` |

---

## 링크 작성 규칙

```markdown
# concepts 참조
[[token-optimization-strategy]]

# 표시 이름 다르게 할 때
[[token-optimization-strategy|토큰 최적화 전략]]

# sources 참조
[[REF-075 Think Deep Not Just Long]]

# REF alias (짧게)
[[REF-075]]
```

---

## 신규 메모 체크리스트

- [ ] concepts/hubs/code → kebab-case 사용 (대문자, 공백, 특수문자 X)
- [ ] 기존 유사 concept 먼저 확인 → 중복 생성 방지
- [ ] 링크는 파일명 그대로 (alias 표기는 `|` 뒤에)
- [ ] sources 추가 시 → 관련 concept에 백링크 달기

---

## 자주 실수하는 패턴 (BAD → GOOD)

| ❌ 잘못된 예 | ✅ 올바른 예 |
|------------|------------|
| `[[Token Optimization Strategy]]` | `[[token-optimization-strategy]]` |
| `[[Rust - Memory Management]]` | `[[rust-memory-management]]` |
| `[[RAG (Retrieval-Augmented Generation)]]` | `[[rag]]` 또는 `[[retrieval-augmented-generation]]` |
| `[[MCP CLI Polymorphism]]` | `[[mcp-cli-polymorphism]]` |

---

## 기존 파일 마이그레이션

- 기존 파일명 변경 금지 (broken link 재발 방지)
- **신규 생성부터** 위 규칙 적용
- broken link 복구는 `/vault-link-repair` 스킬 사용

---

_마지막 업데이트: 2026-03-21 | 관리: 세팅집착남_
