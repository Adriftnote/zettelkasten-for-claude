---
title: 가상 머신 (Virtual Machine)
type: concept
tags:
- programming-basics
- concepts
- execution-tools
permalink: knowledge/concepts/virtual-machine
category: 실행 도구
difficulty: 중급
---

# 가상 머신 (Virtual Machine)

실제 컴퓨터처럼 작동하는 소프트웨어 환경입니다.

## 📖 개요

가상 머신은 소프트웨어로 만든 컴퓨터입니다. 물리적 컴퓨터의 하드웨어를 소프트웨어로 구현하여, 그 위에서 프로그램을 실행합니다. JVM(Java Virtual Machine)이 대표적이며, 한 번 작성한 코드를 모든 플랫폼에서 실행 가능합니다.

## 🎭 비유

컴퓨터 안에 또 다른 가상의 컴퓨터를 만드는 것과 같습니다.

## ✨ 특징

- **플랫폼 독립성**: Write Once, Run Anywhere
- **샌드박스**: 안전한 격리 환경 제공
- **성능 오버헤드**: 실제 머신보다 느림
- **유연성**: 서로 다른 OS에서 동일 실행

## 💡 예시

**Java 코드 실행**:
```
HelloWorld.java → [javac] → HelloWorld.class → [JVM] → 실행
```

**종류**:
- 시스템 VM: VMware, VirtualBox (전체 OS 가상화)
- 프로세스 VM: JVM, Python VM (특정 프로그램 실행)

## Relations

- similar_to [[interpreter]]
- implements [[runtime]]
- works_with [[compiler]]

---

**난이도**: 중급
**카테고리**: 실행 도구
**마지막 업데이트**: 2026년 1월