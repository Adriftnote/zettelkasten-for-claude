---
title: DDL (Data Definition Language)
type: concept
permalink: knowledge/concepts/ddl
tags:
- sql
- database
category: 데이터베이스
difficulty: 초급
---

# DDL (Data Definition Language)

데이터의 구조(그릇)를 정의하는 SQL 문법 분류

## 📖 개요

DDL은 SQL 3대 분류 중 하나로, 테이블·인덱스 등 데이터베이스 객체의 구조를 생성·변경·삭제하는 명령어 집합입니다. 데이터 자체가 아닌 데이터가 담길 틀을 다룹니다.

## 🎭 비유

그릇을 만드는 것과 같습니다. DDL이 접시와 그릇을 만들고, DML이 그 안에 음식을 담는 것입니다.

## ✨ 특징

- **CREATE**: 새 구조 생성 (`CREATE TABLE users (id INT, name TEXT)`)
- **ALTER**: 기존 구조 변경 (`ALTER TABLE users ADD COLUMN email TEXT`)
- **DROP**: 구조 삭제 (`DROP TABLE users`)
- **TRUNCATE**: 데이터 전체 삭제, 구조는 유지 (`TRUNCATE TABLE users`)
- ORM 사용 시 클래스 정의가 DDL을 대신함

## 💡 예시

```python
# ORM(SQLAlchemy)에서 DDL 자동 생성
class User(Base):
    id = Column(Integer)     # → CREATE TABLE 자동 생성
    name = Column(String)
```

## Relations

- part_of [[SQL (Structured Query Language)]] (3대 분류 중 하나)
- similar_to [[DML (Data Manipulation Language)]] (SQL 문법 분류)
- similar_to [[DCL (Data Control Language)]] (SQL 문법 분류)
- used_by [[ORM (Object-Relational Mapping)]] (클래스 정의로 DDL 대체)