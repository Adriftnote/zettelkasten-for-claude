---
title: qmd embed AMD Vulkan GPU 크래시 — CPU 폴백으로 해결
type: note
permalink: 03.-sources/workcases/qmd-embed-amd-vulkan-gpu-keuraesi-cpu-polbaegeuro-haegyeol
tags:
- gpu
- amd
- vulkan
- node-llama-cpp
- windows
- cuda
- qmd
- troubleshooting
---

# qmd embed AMD Vulkan GPU 크래시 — CPU 폴백으로 해결

> qmd(로컬 마크다운 검색엔진)의 embed 기능이 AMD GPU Vulkan 드라이버에서 크래시. `gpu: false` 한 줄로 CPU 전환하여 해결. CUDA 독점의 실체를 체감한 사례.

## 환경

- Windows 11, AMD Ryzen 7 8700G (내장 GPU: Radeon 780M)
- Bun 1.3.9, node-llama-cpp (llama.cpp Node.js 바인딩)
- qmd: BM25 + 벡터 시맨틱 검색 도구 (bun 글로벌 설치)

## 문제 상황

### 증상 1: CLI 실행 안 됨
```
$ qmd --help
/bin/bash: C:\Users\RL\.bun\install\global\node_modules\qmd\qmd: No such file or directory
```
- 원인: Bun이 Windows에서 글로벌 설치 시 PE32+ exe 스텁 생성 → qmd의 bin 엔트리가 bash 스크립트 → 경로 전달 실패
- 해결: `~/.bashrc`에 alias 추가
```bash
alias qmd='bun "C:/Users/RL/.bun/install/global/node_modules/qmd/src/qmd.ts"'
```

### 증상 2: embed 크래시 (핵심 문제)
```
$ qmd embed
Chunking 446 documents...
Model: embeddinggemma
EXIT: 127  ← segfault
```

## 디버깅 과정

### 1단계: 크래시 지점 격리
```javascript
// 모듈 로드 → OK
// 모델 로드 → OK  
// 임베딩 컨텍스트 생성 → OK
// getEmbeddingFor("test") → 크래시 (exit 127)
```
모델 로딩까지는 성공, **실제 추론 연산에서 터짐**.

### 2단계: 디버그 로깅으로 원인 확인
```
ggml_vulkan: Found 1 Vulkan devices:
0 = AMD Radeon 780M Graphics (AMD proprietary driver)
load_backend: loaded Vulkan backend from ggml-vulkan.dll
load_tensors: offloaded 25/25 layers to GPU (Vulkan0)
...
output_reserve: reallocating output buffer from 1.00 MiB to 3.01 MiB
EXIT:127  ← 여기서 크래시
```

**핵심 발견**: node-llama-cpp가 AMD 780M을 Vulkan GPU로 자동 감지 → 모델 전체(25레이어)를 GPU에 오프로드 → Vulkan 컴퓨트 셰이더로 행렬 연산 시도 → AMD Vulkan 드라이버가 크래시.

### 3단계: CPU 강제 전환 테스트
```javascript
const llama = await getLlama({ gpu: false });
// → CPU (zen4 DLL) 사용
// → getEmbeddingFor("hello world test")
// → SUCCESS! Vector length: 768
```

## 근본 원인

```
node-llama-cpp 시작
├─ GPU 자동 탐지: "Vulkan 있네? AMD 780M 발견!"
├─ 모델 전체를 Vulkan GPU에 올림 (307MB)
├─ 추론 요청 (행렬곱 컴퓨트 셰이더)
└─ AMD Vulkan 드라이버가 해당 셰이더를 처리 못함 → segfault

llama.cpp 추론 백엔드 성숙도:
├─ CUDA (NVIDIA): 10년+ 개발, 안정적
├─ Vulkan (AMD 등): 최근 추가, 엣지 케이스 많음
└─ CPU: 항상 안정적 (느리지만 확실)
```

메모리 부족이 아님 (UMA라서 시스템 RAM 공유, 로드까지는 성공). 
드라이버 수준에서 특정 컴퓨트 셰이더 호환성 문제.

## 해결

**qmd 소스 1줄 수정** (`src/llm.ts` line 494):
```javascript
// Before:
this.llama = await getLlama({ logLevel: LlamaLogLevel.error });

// After:
this.llama = await getLlama({ gpu: false, logLevel: LlamaLogLevel.error });
```

결과:
- `qmd embed` (446파일, 911 chunks) → CPU에서 정상 동작
- `qmd search` (BM25) → 정상
- `qmd vsearch` (벡터 시맨틱) → 정상
- `qmd query` (LLM 리랭킹 + 쿼리 확장) → 정상

## Observations

- [fact] node-llama-cpp는 GPU 자동 감지 후 Vulkan 우선 사용 — AMD iGPU에서 크래시 유발 #auto-detection-pitfall
- [fact] AMD Radeon 780M Vulkan 드라이버는 llama.cpp 컴퓨트 셰이더와 비호환 #amd-vulkan-incompatible
- [fact] 모델 로딩 성공 ≠ 추론 가능 — 메모리 복사와 연산은 다른 코드 경로 #load-vs-compute
- [solution] `gpu: false` 한 줄로 Vulkan 비활성화, CPU 폴백 → 문제 해결 #cpu-fallback
- [pattern] CUDA 독점은 이론이 아니라 현실 — AMD GPU에서 로컬 LLM 추론이 실제로 안 됨 #cuda-moat-validated
- [pattern] AI 추론 생태계: NVIDIA CUDA만 안정적, Vulkan/ROCm은 후발주자로 엣지 케이스 다수 #gpu-inference-ecosystem
- [warning] bun 글로벌 설치 + bash 스크립트 bin 엔트리 = Windows에서 실행 안 됨 #bun-windows-gotcha
- [connects] [[AI 기계어 이해와 NVIDIA CUDA 독점 붕괴 가능성]] — 이론적 분석의 현실 증거. "에코시스템이 기술을 이긴다"는 경고가 정확히 맞음