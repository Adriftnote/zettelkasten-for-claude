---
title: Claude Code - Anthropic 공식 CLI 에이전트
type: reference
permalink: 03.-sources/reference/claude-code-anthropic-gongsig-cli-eijeonteu
tags:
- claude-code
- cli
- anthropic
- agent
---

# Claude Code - Anthropic 공식 CLI 에이전트

## 개요

**Claude Code**는 Anthropic에서 만든 터미널 기반의 에이전트 코딩 도구입니다. 자연어 명령을 통해 코드베이스를 이해하고 더 빠른 개발을 가능하게 합니다.

- **형태**: 터미널에 설치되는 에이전트 기반 도구
- **인터페이스**: 자연어 명령 (conversational commands)
- **접근 범위**: 터미널, IDE, GitHub (@claude 태그)

---

## 주요 기능

### 1. 루틴 작업 자동화
- 공통 코딩 워크플로우를 자동으로 실행
- 수동 작업 최소화

### 2. 코드 설명
- 복잡한 코드를 자연어로 이해하기 쉽게 설명
- 코드베이스 문서화 지원

### 3. Git 워크플로우 관리
- 버전 관리 작업을 자연어로 명령
- 커밋, 브랜치 관리 등 자동화

### 4. 코드베이스 인식
- 프로젝트 구조 분석
- 특정 프로젝트 맥락 이해

---

## 주요 특징

### 에이전트 기반 접근
- 단순 제안이 아닌 자율적 작업 실행
- AI 에이전트가 작업을 스스로 처리

### 다중 플랫폼 지원
- **MacOS/Linux**: `curl -fsSL https://claude.ai/install.sh | bash`
- **Homebrew**: `brew install --cask claude-code`
- **Windows**: `irm https://claude.ai/install.ps1 | iex`
- **WinGet**: `winget install Anthropic.ClaudeCode`

### 확장 가능성
- 플러그인 시스템으로 커스텀 기능 추가 가능

### 커뮤니티 지표
- GitHub 66,000+ 스타
- 5,100+ 포크
- 483+ 커밋 (활발한 유지보수)

---

## 주요 차별점

1. **터미널-우선**: 개발 환경에서 직접 작동
2. **에이전트 자율성**: 사용자 명령을 자체적으로 분석·실행
3. **문맥 인식**: 특정 프로젝트 구조와 코드 맥락 이해
4. **멀티채널**: 터미널, IDE, GitHub 등 다양한 접근 채널

---

## 참고 자료

- 공식 문서: https://code.claude.com/docs/en/overview
- GitHub 저장소: https://github.com/anthropics/claude-code
- 설치 가이드: https://claude.ai/install

---

## 연결 노트
- [[Agent Teams]] - Anthropic Agent Teams와의 관계
- [[CLI 기반 개발]] - 터미널 기반 개발 도구의 특징
- [[자연어 인터페이스]] - 대화형 명령의 장점