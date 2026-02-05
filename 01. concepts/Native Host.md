---
title: Native Host
type: concept
permalink: knowledge/concepts/native-host
tags:
- browser
- chrome-extension
- communication
- concepts
category: 브라우저 통신
difficulty: 중급
---

# Native Host

Chrome 확장이 로컬 시스템과 통신하는 **물리적 연결 통로**입니다.

## 📖 개요

Native Host는 Chrome Native Messaging API를 통해 브라우저 확장이 **로컬 컴퓨터의 프로그램과 직접 통신**하는 방식입니다. stdin/stdout으로 메시지를 교환하며, 브라우저 샌드박스를 벗어나 파일 시스템 접근이나 시스템 명령 실행을 가능하게 합니다.

## 🎭 비유

**전화선**과 같습니다. 통화 내용(프로토콜)과 별개로, 두 지점을 물리적으로 연결하는 회선 역할을 합니다.

## ✨ 특징

- **물리적 통신 채널**: 브라우저와 로컬 프로그램 간 다리 역할
- **stdin/stdout 기반**: 표준 입출력으로 메시지 교환
- **샌드박스 우회**: 브라우저 보안 경계를 벗어나 시스템 접근 가능
- **로컬 실행 파일 필요**: 별도의 Native Host 프로그램 설치 필요

## 💡 예시

**Claude Code에서의 구성**:
```
Claude in Chrome (Beta)
Status: Enabled
Extension: Installed
```
→ Chrome 확장과 물리적으로 통신 가능하게 연결

**통신 흐름**:
```
Chrome 확장 (브라우저 내부)
    ↓ Native Messaging (stdin/stdout)
Native Host (로컬 실행 파일)
    ↓
파일 시스템 / 시스템 명령
```

## Relations

- different_from [[MCP (Model Context Protocol)]] (통신 채널 vs 프로토콜)
- used_by [[Chrome Extension]] (확장이 Native Host 사용)
- enables [[Claude Code]] (로컬 시스템 접근 가능하게 함)

---

**난이도**: 중급
**카테고리**: 브라우저 통신
**마지막 업데이트**: 2026년 2월