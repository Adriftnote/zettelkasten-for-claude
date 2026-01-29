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

- [insight] 메모리는 속도 vs 용량의 트레이드오프 - 빠를수록 비싸고 작다 #hardware #memory
- [insight] 메모리 계층구조: CPU 캐시(극고속) → RAM(고속) → SSD(저속) → HDD(극저속) #cache #storage
- [insight] 속도 vs 비용 vs 용량의 삼각관계 - 한 가지만 택할 수 있음 #tradeoff
- [tip] LLM 성능은 VRAM 크기에 직결 (모델 로드, KV 캐시, 배치 크기 결정) #llm #gpu
- [path] 기초 계층 (L1/L2 캐시) → RAM → VRAM → 메모리 계층 구조 → LLM 최적화 #learning

## Relations

- organizes [[Cache]] (1. CPU 캐시 메모리, 극고속)
  - part_of [[L1-cache]] (1a. L1 캐시 (32KB, ~1ns))
  - part_of [[L2-cache]] (1b. L2 캐시 (256KB, ~4ns))
  - part_of [[L3-cache]] (1c. L3 캐시 (8MB, ~10ns))
- organizes [[RAM]] (2. 주 메모리, 중간 속도 (16-64GB))
  - extends [[RAM-access-patterns]] (2a. RAM 접근 패턴 최적화)
- organizes [[VRAM]] (3. GPU 전용 메모리, 병렬 처리 최적화 (8-24GB))
  - extends [[gpu-compute]] (3a. GPU 연산 특성)
  - extends [[kv-cache-vram]] (3b. VRAM의 KV 캐시 저장)
- organizes [[memory-hierarchy]] (4. 전체 메모리 계층 구조)
- connects_to [[encoding-systems]] (메모리에 데이터 저장 방식)
- connects_to [[optimization-patterns]] (KV 캐시 최적화 전략)
- connects_to [[programming-basics]] (프로그램 메모리 관리)