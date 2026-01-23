---
title: Boolean Algebra (불 대수)
type: concept
tags: [logic, mathematics, digital-circuits, george-boole]
permalink: knowledge/concepts/boolean-algebra
category: 수학/논리학
difficulty: 초급
created: 2026-01-22
---

# Boolean Algebra (불 대수)

**"참(True)과 거짓(False) 두 값만으로 논리를 수학적으로 다루는 체계"**

George Boole이 1854년 저서에서 정립. 100년 후 Claude Shannon이 전기 회로에 적용하여 디지털 컴퓨터의 기초가 됨.

## 📖 개요

핵심 아이디어: **"논리를 숫자처럼 계산할 수 있다"**

```
일상 언어         불 대수
───────────────────────────
"참"        →     1 (True)
"거짓"      →     0 (False)
"그리고"    →     AND (∧)
"또는"      →     OR (∨)
"아니다"    →     NOT (¬)
```

## 🎭 비유

### 전등 스위치

```
[AND = 직렬 연결]
스위치A ──○── 스위치B ──○── 💡
둘 다 켜야 불이 켜짐

[OR = 병렬 연결]
스위치A ──○──┐
            ├── 💡
스위치B ──○──┘
하나만 켜도 불이 켜짐

[NOT = 반전 스위치]
스위치 켜면 불 꺼짐, 끄면 불 켜짐
```

## 💡 기본 연산

### 진리표 (Truth Table)

```
[AND (논리곱)]        [OR (논리합)]         [NOT (부정)]
A  B  A∧B            A  B  A∨B             A  ¬A
0  0   0             0  0   0              0   1
0  1   0             0  1   1              1   0
1  0   0             1  0   1
1  1   1             1  1   1

"둘 다 참"            "하나라도 참"          "반대"
```

### 프로그래밍 표현

```javascript
// AND
true && true   // true
true && false  // false

// OR
true || false  // true
false || false // false

// NOT
!true          // false
!false         // true
```

## 📊 기본 법칙

| 법칙 | AND 형태 | OR 형태 |
|------|----------|---------|
| **항등** | A ∧ 1 = A | A ∨ 0 = A |
| **영** | A ∧ 0 = 0 | A ∨ 1 = 1 |
| **보수** | A ∧ ¬A = 0 | A ∨ ¬A = 1 |
| **멱등** | A ∧ A = A | A ∨ A = A |
| **교환** | A ∧ B = B ∧ A | A ∨ B = B ∨ A |
| **결합** | (A∧B)∧C = A∧(B∧C) | (A∨B)∨C = A∨(B∨C) |

### 드모르간 법칙 (De Morgan's Laws)

```
¬(A ∧ B) = ¬A ∨ ¬B
¬(A ∨ B) = ¬A ∧ ¬B

예시:
"비가 오고 춥다"의 부정
= "비가 안 오거나 안 춥다"
```

## 💻 디지털 회로 적용

### Claude Shannon의 혁신 (1937)

```
[Shannon의 발견]

전기 스위치 ON/OFF = 불 대수 1/0

→ 전기 회로로 논리 연산 가능!
→ 모든 계산은 AND, OR, NOT 조합

[논리 게이트]
     ┌───┐
A ───┤AND├─── A∧B
B ───┤   │
     └───┘

     ┌───┐
A ───┤OR ├─── A∨B
B ───┤   │
     └───┘

     ┌───┐
A ───┤NOT├─── ¬A
     └───┘
```

### NAND 게이트의 보편성

```
[NAND = NOT AND]
A NAND B = ¬(A ∧ B)

놀라운 사실:
NAND만으로 모든 논리 회로 구현 가능!

NOT A    = A NAND A
A AND B  = (A NAND B) NAND (A NAND B)
A OR B   = (A NAND A) NAND (B NAND B)

→ 실제 CPU는 NAND 게이트로 구성
```

## 🔧 실제 활용

### 조건문

```javascript
// 로그인 조건
if (username !== '' && password !== '' && isValidEmail) {
  login();
}

// 권한 체크
if (isAdmin || (isEditor && hasPermission)) {
  showEditButton();
}
```

### 비트 연산

```javascript
// 플래그 설정
const READ = 0b001;   // 1
const WRITE = 0b010;  // 2
const EXEC = 0b100;   // 4

let permission = READ | WRITE;  // 0b011 = 3
permission & READ;   // 0b001 (READ 권한 있음)
permission & EXEC;   // 0b000 (EXEC 권한 없음)
```

## ⚠️ 흔한 실수

| 실수 | 올바른 이해 |
|------|------------|
| `\|\|`와 `\|` 혼동 | `\|\|`는 논리, `\|`는 비트 연산 |
| 단락 평가 무시 | `A && B`에서 A가 false면 B 평가 안 함 |
| 드모르간 실수 | `!(A && B)` ≠ `!A && !B` |

## 💡 역사적 의의

```
[불 대수의 여정]

1854: George Boole, 논리의 수학화
         ↓ (80년 방치)
1937: Claude Shannon, 전기 회로 적용
         ↓
1945: 폰 노이만 구조 컴퓨터
         ↓
현재: 모든 디지털 장치의 기초
```

## Relations

- created_by George Boole (1854)
- applied_by Claude Shannon (1937)
- foundation_of [[Von Neumann Architecture (폰 노이만 구조)]] - 논리 회로의 기초
- foundation_of [[Turing Machine (튜링 머신)]] - 상태 전이의 논리적 기초
- related_to [[Bit]] - 0과 1의 의미
- hub [[computing-history]] - 컴퓨팅 역사 허브
