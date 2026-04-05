---
title: REF-116 Unsloth Studio — 로컬 노코드 모델 파인튜닝 및 추론 플랫폼
type: note
permalink: zettelkasten/03.-sources/reference/ref-116-unsloth-studio-rokeol-nokodeu-model-paintyuning-mic-curon-peulraespom
tags:
- unsloth
- fine-tuning
- local-llm
- no-code
- gguf
- lora
---

# Unsloth Studio — 로컬 노코드 모델 파인튜닝 및 추론 플랫폼

오픈소스 노코드 웹 UI로, 로컬 환경에서 모델 학습·추론·내보내기를 통합 제공하는 플랫폼.

- source: https://unsloth.ai/docs/new/studio
- type: tool-guide
- date: 2026-03-19
- permalink: sources/reference/unsloth-studio-local-nocode-finetuning

## 📖 핵심 아이디어

Unsloth Studio는 "학습 2배 빠르게, VRAM 70% 절약"을 표방하는 로컬 파인튜닝 도구. 코드 없이 문서(PDF, CSV, JSON, DOCX, TXT)만 업로드하면 자동으로 데이터셋을 생성하고 LoRA/FP8/FFT 학습을 실행할 수 있다. 500+ 모델 아키텍처 지원, GGUF/safetensor 모델 로컬 실행, 100% 오프라인 동작.

## 🛠️ 주요 기능

### 학습 (Training)
- **노코드 파인튜닝**: 문서 업로드 → 자동 데이터셋 생성 → 학습
- **Data Recipes**: 그래프 노드 워크플로우로 비정형 문서를 학습 데이터로 변환 (NVIDIA Nemo Data Designer 통합)
- **최적화 커널**: LoRA, FP8, FFT, PT — 2x 속도, 70% VRAM 절감
- **Observability**: 학습 loss, gradient norm, GPU 사용률 실시간 추적 + 원격 모니터링
- **Custom YAML config** 임포트 지원

### 추론 (Inference)
- GGUF + safetensor 모델 로컬 실행 (Mac/Windows/Linux)
- Self-healing tool calling, 웹 검색
- 코드 실행 (Bash, Python), 이미지/문서/오디오 업로드
- **Model Arena**: 모델 side-by-side 비교
- Multi-GPU 추론 지원

### 내보내기 (Export)
- safetensors, GGUF 포맷
- llama.cpp, vLLM, Ollama, LM Studio 호환

## 💻 지원 환경

| 환경 | 학습 | 추론 |
|------|------|------|
| NVIDIA GPU (RTX 30/40/50/Blackwell) | ✅ | ✅ |
| CPU only | ❌ | ✅ (채팅만) |
| Mac (Apple Silicon) | ❌ (MLX 예정) | ✅ (채팅만) |
| AMD / Intel | ❌ (예정) | ❌ (예정) |

## 🔧 설치

```bash
# MacOS/Linux/WSL
pip install uv  # Python 3.13 필요
unsloth studio setup
unsloth studio -H 0.0.0.0 -p 8888

# Docker
docker pull unsloth/unsloth
```

Google Colab 노트북도 제공 (T4 이상, 첫 설치 시 llama.cpp 컴파일 30분+).

## 📋 모델 지원

- Text LLM: Qwen3.5, NVIDIA Nemotron 3 등 500+ 아키텍처
- Vision, TTS(Text-to-Speech), Audio, Embedding 모델
- BERT 계열, Hugging Face transformers 호환 모델

## 🔒 보안/프라이버시

- 100% 오프라인 동작, 텔레메트리 수집 없음
- 토큰 기반 인증, 비밀번호 보호, JWT 접근

## 📄 라이선스

- 코어 패키지: Apache 2.0
- UI 컴포넌트: AGPL-3.0 (듀얼 라이선스)

## 🗺️ 로드맵

- 사전 컴파일된 llama.cpp 바이너리 (설치 시간 단축)
- Multi-GPU 공식 지원 확대
- Apple MLX 학습 통합
- AMD/Intel 지원
- OpenAI 호환 API 엔드포인트

## Relations

- [[REF-102 클라우드 GPU AI-ML 개발 플랫폼 비교 가이드 (2026)]] - (클라우드 vs 로컬 학습 환경 대비 — Unsloth는 로컬 대안)
