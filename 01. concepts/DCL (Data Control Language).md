---
title: DCL (Data Control Language)
type: concept
permalink: knowledge/concepts/dcl
tags:
- sql
- database
- security
category: 데이터베이스
difficulty: 초급
---

# DCL (Data Control Language)

데이터베이스의 접근 권한을 관리하는 SQL 문법 분류

## 📖 개요

DCL은 SQL 3대 분류(DDL, DML, DCL) 중 하나로, 데이터베이스 객체에 대한 사용자 권한을 부여하거나 회수하는 명령어 집합입니다. DDL이나 DML에 비해 사용 빈도는 낮지만, 보안 관점에서 매우 중요합니다.

## 🎭 비유

건물의 출입증 시스템과 같습니다. DDL이 건물을 짓고, DML이 건물 안에서 일하는 것이라면, DCL은 누구에게 출입증을 발급하고 회수할지 결정하는 것입니다.

## ✨ 특징

- **GRANT**: 특정 사용자에게 권한 부여 (`GRANT SELECT ON users TO analyst`)
- **REVOKE**: 부여한 권한 회수 (`REVOKE DELETE ON users FROM intern`)
- DDL/DML 대비 사용 빈도 낮지만 보안상 필수
- SQLite는 DCL 미지원 — 파일 단위 권한으로 대체

## 💡 예시

```sql
-- 분석팀에게 조회만 허용
GRANT SELECT ON daily_channel_summary TO analytics_team;

-- 인턴에게 삭제 권한 회수
REVOKE DELETE ON orchestration_log FROM intern_user;
```

## Relations

- part_of [[SQL (Structured Query Language)]] (3대 분류 중 하나)
- similar_to [[DDL (Data Definition Language)]] (SQL 문법 분류)
- similar_to [[DML (Data Manipulation Language)]] (SQL 문법 분류)
- relates_to [[데이터베이스 보안]] (권한 관리 수단)