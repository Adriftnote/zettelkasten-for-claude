---
title: Shannon - AI 자율형 펜테스팅 도구
type: note
permalink: 03.-sources/reference/shannon-ai-jayulhyeong-penteseuting-dogu
tags:
- ai
- security
- pentesting
- claude-code
- automation
---

# Shannon - AI 자율형 펜테스팅 도구

## 기본 정보
- **레포**: https://github.com/KeygraphHQ/shannon
- **Stars**: 13.4k | **License**: AGPL-3.0
- **용도**: 웹 앱 취약점 자동 탐지 + 실제 exploit 실행 + 보고서 생성
- **성능**: XBOW 벤치마크 96.15% 성공률 (힌트 없이)

## 핵심 특징
- Claude Code 기반 런타임 (Anthropic API 키 사용)
- 4단계: 정찰 → 취약점 분석 → 익스플로잇 → 보고서
- SQL Injection, XSS, SSRF, 인증/인가 취약점 탐지
- White-box 테스트 (소스코드 접근 필요)
- Docker로 실행
- `.claude/commands/`, `prompts/`, `mcp-server/` 구조

## 참고 포인트
- Claude Code를 보안 도구 런타임으로 활용한 사례
- Command → Agent → Skills 패턴을 보안 워크플로우에 적용
- Shannon Lite (오픈소스) / Shannon Pro (상용) 이중 라이선스

## 관련
- [relates_to] Claude Code Best Practice
- [useful_for] 보안 테스트 자동화
