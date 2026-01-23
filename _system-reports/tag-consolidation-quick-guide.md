# 태그 통합 퀵 가이드

## 즉시 실행 가능한 변경 (Obsidian Tag Wrangler 사용)

### 1. 대소문자 통일 (5건, 6회)
```
#MCP → #mcp (2회)
#Metabase → #metabase (1회)
#Heading → #heading (1회)
#Search → #search (1회)
#Implementation → #implementation (1회)
```

### 2. 단수/복수 통일 (5건, 6회)
```
#best-practices → #best-practice (1회)
#limitations → #limitation (1회)
#tags → #tag (2회)
#hooks → #hook (1회)
#template-tags → #template-tag (1회)
```

### 3. 하이픈 통일 (1건, 1회)
```
#bugfix → #bug-fix (1회)
```

**위 3단계 완료 시**: 12회 중복 제거, 17개 태그 감소

---

## 의미적 통합 (수동 검토 필요)

### 우선순위 1: Error 관련 (10건 통합 → 11회 증가)
```
→ #error-handling (현재 5회)
  - #syntax-error (1회)
  - #type-error (1회)
  - #reference-error (1회)
  - #undefined-error (1회)
  - #initialization-error (1회)
  - #internal-error (1회)
  - #400-error (1회)
  - #error-classification (1회)
  - #network-error (1회)
  - #api-error (1회)
```

### 우선순위 2: Debugging 관련 (3건 통합 → 7회 증가)
```
→ #debugging (현재 8회)
  - #troubleshooting (5회) ⚠️ 많이 사용됨, 유지 고려
  - #diagnosis (1회)
  - #diagnostic (1회)
```

### 우선순위 3: Config 관련 (3건 통합 → 6회 증가)
```
→ #config (현재 6회)
  - #configuration (4회) ⚠️ 많이 사용됨, 유지 고려
  - #config-pattern (1회)
  - #config-format (1회)
```

### 우선순위 4: Optimization 관련 (3건 통합 → 6회 증가)
```
→ #optimization (현재 4회)
  - #performance (4회) ⚠️ 유지 고려
  - #context-optimization (1회)
  - #network-optimization (1회)

⚠️ #token-optimization (6회)는 구체적이므로 유지
```

### 우선순위 5: Data 관련 (4건 통합 → 4회 증가)
```
→ #data-quality (현재 2회)
  - #data-transformation (1회)
  - #data-issue (1회)
  - #data-volume (1회)
  - #data-structure (1회) → #architecture가 더 적합할 수도
```

---

## 삭제 권장 태그 (1회 사용 + 의미 불명)

### 카테고리 1: 범용 단어 (정보가 없음)
```
#This, #Key, #View, #Decisions, #solution, #overview, #observation, #normal-behavior
```

### 카테고리 2: 색상 코드
```
#fff, #FF0000
```

### 카테고리 3: 섹션 번호
```
#1-, #2-, #3-, #4-, #5-, #6-, #7-, #8-, #1, #2, #3, #10, #section-6
```

### 카테고리 4: 너무 구체적 (상위 태그 있음)
```
#toolhub-execute → #tool-hub로 충분
#tool-registration → #tool-hub로 충분
#tool-chainer → #tool-hub로 충분
#timeout-tuning → #timeout로 충분
#merged-cells → #excel로 충분
#fix-needed → #bug로 충분
```

---

## Obsidian Tag Wrangler 사용법

### 설치
1. Settings → Community plugins → Browse
2. "Tag Wrangler" 검색 → Install → Enable

### 태그 이름 변경
1. 좌측 사이드바에서 태그 뷰 열기
2. 변경할 태그 우클릭 → "Rename tag"
3. 새 이름 입력 → Enter
4. 모든 파일에 자동 반영됨

### 태그 삭제
1. 태그 우클릭 → "Delete tag"
2. 확인 → 모든 파일에서 제거됨

---

## 정규식으로 일괄 변경 (고급)

Obsidian에서 Ctrl+Shift+F (전체 검색) → 정규식 모드 활성화

### 예시: 대소문자 통일
```regex
찾기: #MCP\b
바꾸기: #mcp
```

### 예시: 복수형 → 단수형
```regex
찾기: #best-practices\b
바꾸기: #best-practice
```

### 예시: Error 관련 통합
```regex
찾기: #(syntax|type|reference|undefined|initialization|internal|network|api)-error\b
바꾸기: #error-handling
```

⚠️ **주의**: 정규식 치환 전 백업 필수!

---

## 실행 체크리스트

- [ ] **Phase 1**: 대소문자 통일 (5건)
- [ ] **Phase 2**: 단수/복수 통일 (5건)
- [ ] **Phase 3**: 하이픈 통일 (1건)
- [ ] **Phase 4**: Error 관련 통합 (10건)
- [ ] **Phase 5**: Debugging 관련 통합 (3건)
- [ ] **Phase 6**: Config 관련 통합 (3건)
- [ ] **Phase 7**: 범용 태그 삭제 (8건)
- [ ] **Phase 8**: 색상/번호 태그 삭제 (20건)
- [ ] **Phase 9**: 태그 네이밍 컨벤션 문서화

---

## 예상 효과

| 지표 | 현재 | 통합 후 | 개선율 |
|------|------|---------|--------|
| 고유 태그 수 | 375개 | ~250개 | -33% |
| 1회 사용 태그 | 278개 | ~180개 | -35% |
| 주요 태그 빈도 | - | - | - |
| - error-handling | 5회 | 16회 | +220% |
| - debugging | 8회 | 15회 | +88% |
| - config | 6회 | 12회 | +100% |

**태그 품질 개선**: 중복 제거 + 일관성 확보 + 검색 정확도 향상
