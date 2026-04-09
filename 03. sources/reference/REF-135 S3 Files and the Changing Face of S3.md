---
title: REF-135 S3 Files and the Changing Face of S3
type: doc_summary
permalink: zettelkasten/03.-sources/reference/ref-135-s3-files-and-the-changing-face-of-s3
tags:
- aws
- s3
- storage
- filesystem
- object-storage
- architecture
---

# S3 Files and the Changing Face of S3

Andy Warfield (AWS VP/Distinguished Engineer)가 S3의 진화를 설명하며, 파일시스템과 오브젝트 스토리지의 수렴 설계를 다룬 글.

## 📖 핵심 아이디어

데이터 접근 방식의 차이(파일 vs 오브젝트)는 "해결할 문제"가 아니라 "서비스할 현실"이다. S3 Files는 EFS를 S3에 통합하여 양쪽 시맨틱을 타협 없이 유지하면서, **stage-and-commit** 경계를 통해 연결한다. AI 시대에 코드는 빠르게 생멸하지만 데이터는 오래 남으므로, 데이터 접근 추상화가 점점 더 중요해진다.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| S3 Tables (2024) | Apache Iceberg 기반 관리형 구조화 데이터. 200만+ 테이블 운영 중 |
| S3 Vectors (2024) | 네이티브 벡터 인덱스. 인메모리/SSD 대신 스토리지 시맨틱(탄력적 스케일, 내구성) |
| S3 Files (2026) | EFS를 S3에 통합. 버킷을 NFS 마운트로 EC2/Lambda에서 접근 |
| Data Friction | 스토리지 간 호환 불가 API로 인한 데이터 복사/관리 오버헤드 |

## 🔧 작동 방식 / 적용 방법

### 파일 vs 오브젝트 근본 차이

| 측면 | Files | Objects |
|------|-------|---------|
| 변경 | in-place 부분 쓰기, mmap() | 불변, 원자적 PUT |
| 시맨틱 | POSIX, 동시 접근, rename | 버전 관리, 알림 |
| 접근 패턴 | 변경 중심, 빈번 | 알림 기반 워크플로우 |

### Stage-and-Commit 모델

```
[EFS 파일시스템] ──(~60초 주기 커밋)──▶ [S3 오브젝트]
       ▲                                      │
       └────(양방향 동기화)────────────────────┘
       
충돌 시: S3가 source-of-truth → 파일시스템 버전은 lost+found로
```

### 성능 최적화

- **Lazy Hydration**: <128KB는 첫 접근 시 전체 import, 그 이상은 메타데이터만 → 수백만 객체 버킷도 즉시 마운트
- **Read Bypass**: 순차 읽기는 NFS 우회하여 S3 병렬 GET 직행 → 클라이언트당 3GB/s
- **Storage Lifecycle**: 30일+ 비활성 파일은 파일시스템 뷰에서 퇴거, S3에는 유지

## 💡 실용적 평가 / 적용

**핵심 통찰 — "경계를 설계 자산으로"**
- 파일/오브젝트 완전 통합을 포기하고 경계 자체를 명시적 인터페이스로 만든 것이 핵심 설계 판단
- "대부분의 앱이 두 인터페이스를 동시에 쓰지 않는다" → 순차적 다단계 워크플로우에 최적화
- 기술적 돌파가 아니라 **"어디까지 합치고 어디서 멈출 것인가"에 대한 설계 선언**에 가까움. 합칠 수 없는 것을 억지로 합치지 않고, 동기화 규칙과 충돌 해소 원칙(S3가 source-of-truth)만 명확히 정의한 것이 핵심 가치

**한계**
- 디렉토리 rename: prefix 하위 전체 copy-and-delete (5000만+ 객체 시 경고)
- 60초 커밋 윈도우: 엄격한 일관성 필요 시 부적합
- POSIX 위반 오브젝트 키는 파일시스템 뷰에서 제외

**시사점**
- 코드/데이터 분리가 AI 시대에 더 중요해진다는 관점은 데이터 파이프라인 설계에 직결
- "filerectories"(파일+디렉토리) 같은 네이밍 과정에서 교훈 — 두 패러다임의 개념 혼합은 실패하기 쉬움

## 🔗 관련 개념

- [[추상화는 3단 구조로 반복된다]] - (S3의 진화가 primitive→managed→converged 3단계로 전개되는 패턴)

---

**작성일**: 2026-04-09
**원문**: https://www.allthingsdistributed.com/2026/04/s3-files-and-the-changing-face-of-s3.html
**저자**: Andy Warfield (AWS VP/Distinguished Engineer)
**분류**: 클라우드 스토리지 / 시스템 아키텍처