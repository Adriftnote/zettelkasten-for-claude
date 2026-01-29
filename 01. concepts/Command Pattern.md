---
title: Command Pattern
type: concept
tags: [design-patterns, gof, behavioral-patterns, oop]
permalink: knowledge/concepts/command-pattern
category: 디자인 패턴
difficulty: 중급
created: 2026-01-22
---

# Command Pattern

**"요청을 객체로 캡슐화하여 요청의 발신자와 수신자를 분리한다"**

GoF 행동 패턴 중 하나. 실행할 작업을 객체로 만들어 매개변수화, 큐잉, 로깅, 실행취소(Undo)를 가능하게 합니다.

## 📖 개요

핵심 아이디어: **"행동 자체를 객체로 만든다"**

```
[일반 방식]
버튼 클릭 → 직접 document.save() 호출

[Command Pattern]
버튼 클릭 → SaveCommand 실행 → command.execute() → document.save()
```

중간에 Command 객체가 들어가면서:
- 실행 시점 조절 가능 (나중에 실행, 큐에 넣기)
- 실행 취소 가능 (undo)
- 실행 기록 가능 (로깅)

## 🎭 비유

### 레스토랑 주문 시스템

```
[직접 호출]
손님 ──→ 주방장: "파스타 주세요!"
→ 손님이 주방장을 직접 알아야 함

[Command Pattern]
손님 ──→ 주문서 ──→ 웨이터 ──→ 주방
→ 주문서(Command)가 요청을 캡슐화
→ 손님은 주방장을 몰라도 됨
→ 주문서를 나중에 처리하거나 취소 가능
```

## 💡 구조

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────→│  Command │←────│ Invoker  │
└──────────┘     │(interface)│     └──────────┘
                 └────┬─────┘
                      │
         ┌────────────┼────────────┐
         ↓            ↓            ↓
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │SaveCommand│ │CopyCommand│ │UndoCommand│
   └─────┬────┘ └─────┬────┘ └─────┬────┘
         │            │            │
         ↓            ↓            ↓
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ Document │ │ Clipboard│ │  History │
   │(Receiver)│ │(Receiver)│ │(Receiver)│
   └──────────┘ └──────────┘ └──────────┘
```

| 역할 | 설명 |
|------|------|
| **Command** | 실행 메서드를 정의하는 인터페이스 |
| **ConcreteCommand** | 구체적인 명령 구현 |
| **Invoker** | 명령을 실행하는 주체 (버튼, 메뉴 등) |
| **Receiver** | 실제 작업을 수행하는 객체 |
| **Client** | 명령 객체를 생성하고 설정 |

## 💻 예시

### 기본 구현

```python
from abc import ABC, abstractmethod

# Command 인터페이스
class Command(ABC):
    @abstractmethod
    def execute(self):
        pass

    @abstractmethod
    def undo(self):
        pass

# Receiver
class Document:
    def __init__(self):
        self.content = ""

    def write(self, text):
        self.content += text
        print(f"작성: {text}")

    def erase(self, length):
        erased = self.content[-length:]
        self.content = self.content[:-length]
        print(f"삭제: {erased}")
        return erased

# Concrete Commands
class WriteCommand(Command):
    def __init__(self, document, text):
        self.document = document
        self.text = text

    def execute(self):
        self.document.write(self.text)

    def undo(self):
        self.document.erase(len(self.text))

# Invoker
class TextEditor:
    def __init__(self):
        self.history = []

    def execute(self, command):
        command.execute()
        self.history.append(command)

    def undo(self):
        if self.history:
            command = self.history.pop()
            command.undo()

# 사용
doc = Document()
editor = TextEditor()

editor.execute(WriteCommand(doc, "Hello "))
editor.execute(WriteCommand(doc, "World!"))
print(f"내용: {doc.content}")  # Hello World!

editor.undo()
print(f"내용: {doc.content}")  # Hello
```

### MCP 도구에서의 활용

```javascript
// 각 MCP 도구 = Command 객체
class MCPToolCommand {
  constructor(client, toolName, args) {
    this.client = client;
    this.toolName = toolName;
    this.args = args;
  }

  async execute() {
    return await this.client.callTool(this.toolName, this.args);
  }
}

// 도구 목록에서 동적으로 Command 생성
tools.forEach(tool => {
  const command = new MCPToolCommand(client, tool.name, {});
  cli.registerCommand(tool.name, () => command.execute());
});
```

## ✨ 장점

| 장점 | 설명 |
|------|------|
| **분리** | 호출자와 실행자 분리 (느슨한 결합) |
| **Undo/Redo** | 명령 기록으로 실행취소 구현 |
| **큐잉** | 명령을 큐에 넣어 나중에 실행 |
| **로깅** | 모든 명령 기록 가능 |
| **매크로** | 여러 명령을 하나로 묶기 |
| **OCP 준수** | 새 명령 추가 시 기존 코드 수정 불필요 |

## 📊 적용 사례

| 사례 | 설명 |
|------|------|
| **GUI 버튼/메뉴** | 버튼 클릭 → Command 실행 |
| **트랜잭션** | DB 작업을 Command로 캡슐화 |
| **작업 큐** | 비동기 작업 스케줄링 |
| **매크로 기록** | 사용자 동작 녹화/재생 |
| **CLI 도구** | 각 서브커맨드 = Command |

## Relations

- achieves [[Open-Closed Principle (OCP)]] (새 커맨드 추가 시 기존 코드 수정 불필요)
- similar_to [[Strategy Pattern]] (둘 다 행동을 캡슐화하지만 목적이 다름)
- part_of [[GoF 디자인 패턴]] (행동 패턴 중 하나)
- used_with [[Memento Pattern]] (Undo 구현에 함께 사용)
- related_to [[Inversion of Control (제어의 역전)]] (실행 제어를 Invoker에 위임)
