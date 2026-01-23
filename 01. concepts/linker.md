---
title: 링커 (Linker)
type: concept
tags:
- programming-basics
- concepts
- execution-tools
permalink: knowledge/concepts/linker
category: 실행 도구
difficulty: 고급
---

# 링커 (Linker)

여러 개의 컴파일된 파일들을 하나의 실행 파일로 연결하는 프로그램입니다.

## 📖 개요

대규모 프로젝트는 여러 개의 소스 파일로 나뉩니다. 각 파일을 따로 컴파일하면 여러 개의 오브젝트 파일(.o 또는 .obj)이 생성됩니다. 링커는 이 파일들을 연결하고 외부 라이브러리를 추가하여 최종 실행 파일을 만듭니다.

## 🎭 비유

여러 장의 퍼즐 조각을 맞춰서 완성된 그림을 만드는 것과 같습니다.

## ✨ 특징

- **다중 파일 병합**: 여러 오브젝트 파일 연결
- **라이브러리 추가**: 외부 라이브러리 통합
- **심볼 해석**: 함수/변수 참조 해결
- **최적화**: 최종 파일 크기 최소화

## 💡 예시

```
main.o + utils.o + graphics.o
        ↓
      [링커]
        ↓
    program.exe
```

## Relations

- follows [[compiler]]
- consumes [[library]]
- produces [[program]]

---

**난이도**: 고급
**카테고리**: 실행 도구
**마지막 업데이트**: 2026년 1월