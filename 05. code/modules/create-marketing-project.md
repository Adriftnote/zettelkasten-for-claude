---
title: create-marketing-project
type: module
permalink: modules/create-marketing-project
level: low
category: automation/workflow/generator
semantic: create marketing folder structure
path: working/worker/from-code/flow-task-creator/create-marketing-project.ps1
tags:
- powershell
- template
- folder-generator
---

# create-marketing-project

마케팅 콘텐츠 제작 프로젝트 폴더 구조 일괄 생성 (84줄)

## Observations

- [impl] 4개 그룹 × 2개 Task × 6개 Subtask 구조 #algo
- [impl] 그룹: 브랜드/퍼포먼스 × 이미지/영상 조합 #pattern
- [impl] Subtask: 브리프→기획안→킥오프→시안→채널→성과 워크플로우 #pattern
- [impl] Task/Subtask마다 힌트 템플릿 자동 생성 #pattern
- [deps] System.IO.File, New-Item #import
- [note] 특정 프로젝트 템플릿용, 범용 아님 #caveat

## 생성 구조

```
[마케팅_콘텐츠마케팅] 브랜드_퍼포먼스 콘텐츠 제작(파일럿)/
├── 1. 브랜드 이미지 콘텐츠/
│   ├── 1. 콘텐츠명/
│   │   ├── 1. 브리프 아이템 선정/
│   │   ├── 2. 기획안 작성/
│   │   ├── 3. 킥오프 미팅 및 제작 착수/
│   │   ├── 4. 시안 공유 및 수정/
│   │   ├── 5. 채널 등록/
│   │   └── 6. 성과 측정 및 피드백/
│   └── 2. 콘텐츠명/
├── 2. 브랜드 영상 콘텐츠/
├── 3. 퍼포먼스 이미지 콘텐츠/
└── 4. 퍼포먼스 영상 콘텐츠/
```

## 힌트 템플릿

### Task용
```
## 방법
1.

## 산출물
-

## 첨부
-
```

### Subtask용
```
## 방법
1.

## 산출물
-
```

## Relations

- part_of [[Flow 업무처리 자동화]] (소속 프로젝트)
- uses [[flow-generator-cli]] (동일 패턴)