---
title: Jarvis Lite Architecture
type: architecture
permalink: knowledge/concepts/jarvis-lite-architecture
tags:
- lightweight
- knowledge-management
- orchestration
- minimal
- pragmatic
category: System Architecture
difficulty: 중급
---

# Jarvis Lite Architecture

경량 지식 관리와 도구 오케스트레이션을 위한 실용적 아키텍처 설계입니다.

## 📖 개요

Jarvis Lite Architecture는 **복잡한 Knowledge Agent의 기능을 실용적으로 단순화한 경량 설계**입니다. 지식 그래프의 고급 기능 대신 명확한 규칙과 명시적 매핑으로 80%의 기능을 20%의 복잡도로 구현합니다. 프로덕션 환경에서 빠르게 배포할 수 있습니다.

## 🎭 비유

멀티툴 같습니다. 스위스 칼처럼 모든 기능을 다 가지지는 않지만(Knowledge Agent), 실제 필요한 것들을 잘 갖추고 있어서 일상에서는 충분하고 휴대하기 편합니다.

## ✨ 특징

- **규칙 기반**: 지식 그래프 대신 명시적 규칙으로 추론
- **메타데이터 중심**: 개념 간 관계를 메타데이터로 관리
- **정규화된 인터페이스**: 모든 도구/지식이 동일한 구조
- **빠른 배포**: 최소 의존성, 단순 구조로 빠른 구현
- **확장 가능**: 필요시 Knowledge Agent로 업그레이드 경로 존재

## 💡 예시

**Jarvis Lite 구현 예시**:

```
[규칙 기반 매핑]

--- config.yaml ---
tool_categories:
  file_tools:
    - list, search, read, write
    priority: 1
  web_tools:
    - fetch, parse, scrape
    priority: 2
  memory_tools:
    - store, retrieve, search
    priority: 3

knowledge_rules:
  "file management" →
    tools: [file_tools],
    context: "user's local filesystem"
  
  "web automation" →
    tools: [web_tools],
    context: "internet resources"
  
  "information storage" →
    tools: [memory_tools],
    context: "persistent knowledge"

[사용자 요청] "로컬 파일들을 정리하고 요약해 저장해줄 수 있어?"
    ↓
[규칙 매칭]
요청 분류: "file management" + "information storage"
    ↓
[도구 선택]
1. file_tools (priority: 1) - list, read
2. memory_tools (priority: 3) - store
    ↓
[실행 계획]
Step 1: list (파일 목록 조회)
Step 2: read (각 파일 읽기)
Step 3: summarize (외부 AI)
Step 4: store (결과 저장)
    ↓
[결과] 완료
```

## 🛠️ 구현 방식

**1. 메타데이터 정의**
```yaml
tool:
  name: file_read
  category: file_tools
  input: {path: string}
  output: {content: string}
  tags: [file, read, io]
  cost: low
```

**2. 규칙 엔진**
```
if request_category in knowledge_rules:
  recommended_tools = knowledge_rules[category].tools
  execution_order = sort_by_priority(recommended_tools)
else:
  recommended_tools = search_by_tags(request_tokens)
```

**3. 오케스트레이션**
```
for tool in execution_order:
  result = execute(tool, previous_result)
  if error: try_alternative(tool)
  if success: continue
return final_result
```

## Relations

- implements [[knowledge-agent-architecture]]
- relates_to [[tool-hub-philosophy]]
- relates_to [[tool-hub-vs-tool-chainer]]
- relates_to [[progressive-loader]]
- relates_to [[knowledge-refinement-pipeline]]
- relates_to [[01. concepts/agent-architecture-guide]]

---

**난이도**: 중급
**카테고리**: System Architecture
**마지막 업데이트**: 2026년 1월
**출처**: Pragmatic Architecture Design