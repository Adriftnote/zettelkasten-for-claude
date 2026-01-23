---
title: Progressive Disclosure
type: pattern
tags:
  - context-engineering
  - optimization
  - token-efficiency
  - pattern
permalink: knowledge/concepts/progressive-disclosure
category: Context Engineering
difficulty: 중급
---

# Progressive Disclosure

필요할 때만 정보를 단계적으로 로드하는 컨텍스트 최적화 패턴입니다.

## 📖 개요

Progressive Disclosure는 처음에는 최소한의 정보(이름, 설명)만 제공하고, 필요시 상세 정보를 로드하는 방식입니다. 파일 시스템의 폴더/파일 구조가 자연스럽게 이 패턴을 구현합니다.

## 🎭 비유

도서관의 카테고리 → 섹션 → 책 구조처럼, 먼저 목록만 보고 필요한 항목만 깊이 들어갑니다.

## ✨ 특징

- **초기 로드 최소화**: 스킬 이름/설명만 먼저 제공
- **JIT 로딩**: Just-in-Time으로 필요 정보만 로드
- **토큰 절약**: 불필요한 정보는 로드하지 않음
- **자연스러운 구조**: 파일/폴더 계층이 이를 지원

## 💡 예시

**도구 목록 단계**:
```
- WebFetch: "웹 콘텐츠 가져오기"
- Bash: "명령어 실행"
- Read: "파일 읽기"
```

**필요시 상세 정보 로드**:
```
WebFetch:
- 파라미터: url, prompt
- 반환: 마크다운 형식 콘텐츠
- 제약: HTML만 지원
```

## Relations

- extends [[lazy-tool-loader|LazyToolLoader Pattern]] - builds on deferred loading principles
- part_of [[four-bucket-optimization|Four-Bucket Optimization]] - component of Select strategy
- used_by [[token-optimization-strategy|Token Optimization Strategy]] - applies in token-reduction workflow
- mitigates [[lost-in-middle|Lost-in-Middle]] - reduces middle-context problems through selective loading
- similar_to [[observation-masking|Observation Masking]] - both employ selective information display

---

**난이도**: 중급
**카테고리**: Context Engineering
**마지막 업데이트**: 2026년 1월
**출처**: context-engineering-guide.md
