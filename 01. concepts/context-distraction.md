---
title: Context Distraction
type: pattern
tags:
  - context-engineering
  - attention
  - pattern
  - filtering
permalink: knowledge/concepts/context-distraction
category: Context Engineering
difficulty: 중급
---

# Context Distraction

관련 없는 정보가 주의력을 분산시켜 성능을 저하시키는 현상입니다.

## 📖 개요

모델의 주의는 제한된 자원입니다. 관련 없는 정보가 많을수록 관련 정보에 주의를 기울이기 어려워집니다. 이를 **Context Distraction**이라 합니다.

## 🎭 비유

시끄러운 카페에서 한 사람의 목소리를 집중해서 듣기 어려운 것처럼, 무관한 정보가 신호를 방해합니다.

## ✨ 특징

- **주의 경쟁**: 무관한 정보가 관련 정보와 경쟁
- **신호-잡음 비율**: 낮을수록 성능 저하
- **누적 효과**: 무관한 정보가 많을수록 문제 심화
- **해결 가능**: 필터링으로 개선

## 💡 예시

**분산된 컨텍스트**:
```
사용자 요청: "TypeScript 타입 정의 작성"

무관한 정보들:
- 지난주 회의 내용
- 다른 프로젝트의 폴더 구조
- 시스템 설정 정보
- ...

관련 정보 (주의 분산됨):
- TypeScript 타입 문법
- 프로젝트 구조
```

## 🛠️ 해결 방법

1. **사전 필터링**: 컨텍스트 추가 전에 관련성 검사
2. **검색 정제**: 과도한 검색 결과 필터링
3. **문서 요약**: 길고 무관한 부분 제거
4. **토큰 최적화**: 토큰 한계 내에 관련 정보만 로드

## Relations

- mitigates_by [[progressive-disclosure|Progressive Disclosure]] - solves through selective information loading
- mitigates_by [[four-bucket-optimization|Four-Bucket Optimization]] - solves through Select/Compress strategies
- relates_to [[lost-in-middle|Lost-in-Middle]] - related attention management issue
- relates_to [[context-confusion|Context Confusion]] - both degrade context quality
- used_by [[token-optimization-strategy|Token Optimization Strategy]] - component of context filtering

---

**난이도**: 중급
**카테고리**: Context Engineering
**마지막 업데이트**: 2026년 1월
**출처**: context-engineering-guide.md
