---
title: Flow 업무처리 자동화
type: project
level: high
category: "automation/workflow/task-management"
permalink: projects/flow-eobmuceori-jadonghwa
path: "outputs/26.1Q/[전략기획팀] Flow 업무처리 자동화/"
tags:
- chrome-extension
- powershell
- automation
- flow-team
---

# Flow 업무처리 자동화

Flow.team에 Task/Subtask를 자동으로 생성하는 도구 개발 프로젝트

## 📖 개요

Flow.team 협업 도구에 업무(Task)를 수동 등록하는 번거로움을 해결. 폴더 구조 기반으로 프로젝트/그룹/Task를 자동 생성하는 Chrome Extension과 PowerShell GUI 도구 개발.

## 개발 히스토리

```
0. 주제선정 현상파악
1. Open API 방식        ← 실패 (API 미제공)
2. DOM 크롬 익스텐션    ← 실패 (불안정)
3. API 크롬 익스텐션    ← 채택 (내부 API 활용)
4. 폴더구조 생성 스크립트 표준화
5. 문서화
```

## 코드 구성

**모듈**
- flow-task-creator-extension: Chrome Extension (Flow.team Task 생성)
- flow-generator-gui: PowerShell GUI (폴더구조 → JSON 변환)
- build-exe: 빌드 도구 (PS1 → EXE 컴파일)
- create-hint-files: 힌트 파일 생성 스크립트
- flow-generator-cli: CLI 기반 폴더 구조 생성 도구
- flow-background-service: Side Panel 제어 Service Worker
- create-marketing-project: 마케팅 프로젝트 템플릿 생성

**주요 기능**
- 폴더 구조를 project.json으로 변환
- project.json을 Flow.team에 일괄 등록
- Side Panel UI로 진행상황 확인

## 데이터 흐름

```
[폴더 구조]                    [Flow.team]
    │                              ▲
    ▼ FlowGeneratorGUI             │ Chrome Extension
[project.json] ──────────────────→ │
```

## Relations

- contains [[flow-task-creator-extension]] (Chrome Extension 모듈)
- contains [[flow-generator-gui]] (PowerShell GUI 모듈)
- contains [[build-exe]] (빌드 도구)
- contains [[create-hint-files]] (힌트 파일 생성)
- contains [[flow-generator-cli]] (CLI 도구)
- contains [[flow-background-service]] (Service Worker)
- contains [[create-marketing-project]] (마케팅 템플릿)
- based_on [[웹 기초 (Web Fundamentals)]] (Chrome Extension, DOM 조작)
