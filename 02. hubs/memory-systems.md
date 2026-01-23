---
title: 메모리 시스템
type: hub
tags:
- hub
- memory
- hardware
- ram
- cache
permalink: hubs/memory-systems-1
---

# 메모리 시스템 (Memory Systems)

컴퓨터가 데이터를 **저장하고 접근**하는 방식. RAM, VRAM, Cache의 역할과 차이.

---

## Observations

### 핵심 인사이트

> "메모리는 **속도 vs 용량**의 트레이드오프. 빠를수록 비싸고 작다."

- [insight] 메모리 계층구조: CPU 캐시(극고속) → RAM(고속) → SSD(저속) → HDD(극저속)
- [insight] **속도 vs 비용 vs 용량**의 삼각관계: 한 가지만 택할 수 있음
- [tip] LLM 성능은 VRAM 크기에 직결 (모델 로드, KV 캐시, 배치 크기 결정)

### 학습 경로

[path] 기초 계층 (L1/L2 캐시) → RAM → VRAM → 메모리 계층 구조 → LLM 최적화

### 인덱싱 (루만식)

- [index:1] [[Cache]] - CPU 캐시 메모리, 극고속 (시작점)
- [index:1a] [[L1-cache]] - L1 캐시 (32KB, ~1ns)
- [index:1b] [[L2-cache]] - L2 캐시 (256KB, ~4ns)
- [index:1c] [[L3-cache]] - L3 캐시 (8MB, ~10ns)
- [index:2] [[RAM]] - 주 메모리, 중간 속도 (16-64GB)
- [index:2a] [[RAM-access-patterns]] - RAM 접근 패턴 최적화
- [index:3] [[VRAM]] - GPU 전용 메모리, 병렬 처리 최적화 (8-24GB)
- [index:3a] [[gpu-compute]] - GPU 연산 특성
- [index:3b] [[kv-cache-vram]] - VRAM의 KV 캐시 저장
- [index:4] [[memory-hierarchy]] - 전체 메모리 계층 구조

---

## Relations

### 관리하는 노트들

- organizes [[Cache]]
- organizes [[RAM]]
- organizes [[VRAM]]
- organizes [[L1-cache]]
- organizes [[L2-cache]]
- organizes [[L3-cache]]
- organizes [[RAM-access-patterns]]
- organizes [[gpu-compute]]
- organizes [[kv-cache-vram]]
- organizes [[memory-hierarchy]]

### 다른 허브와의 연결

- connects_to [[encoding-systems]] (메모리에 데이터 저장 방식)
- connects_to [[optimization-patterns]] (KV 캐시 최적화 전략)
- connects_to [[programming-basics]] (프로그램 메모리 관리)