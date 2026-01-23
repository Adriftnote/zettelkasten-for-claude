---
title: 어셈블러 (Assembler)
type: concept
tags:
- programming-basics
- concepts
- execution-tools
permalink: knowledge/concepts/assembler
category: 실행 도구
difficulty: 고급
---

# 어셈블러 (Assembler)

어셈블리어를 기계어로 번역하는 프로그램입니다.

## 📖 개요

어셈블러는 어셈블리어(사람이 읽을 수 있는 저수준 언어)를 CPU가 이해하는 기계어로 변환합니다. 컴파일러와 다르게, 어셈블리어의 각 명령어는 대부분 기계어의 한 명령어로 1:1 대응됩니다.

## 🎭 비유

약어와 기호로 된 메모를 정식 문서로 변환하는 것과 같습니다.

## ✨ 특징

- **저수준 번역**: CPU 아키텍처에 직접 대응
- **1:1 대응**: 어셈블리 명령어가 기계어로 직접 변환
- **플랫폼 종속성**: CPU 아키텍처별로 다름
- **레지스터 직접 제어**: 하드웨어 수준의 세밀한 제어

## 💡 예시

```assembly
MOV AX, 5       # AX 레지스터에 5 저장
ADD AX, 3       # AX에 3 더하기
→ 기계어로 변환됨
```

## Relations

- produces [[machine-language]]
- similar_to [[compiler]]
- precedes [[linker]]

---

**난이도**: 고급
**카테고리**: 실행 도구
**마지막 업데이트**: 2026년 1월