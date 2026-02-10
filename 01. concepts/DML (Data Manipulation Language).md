---
title: DML (Data Manipulation Language)
type: concept
permalink: knowledge/concepts/dml
tags:
- sql
- database
- crud
category: 데이터베이스
difficulty: 초급
---

# DML (Data Manipulation Language)

데이터를 조작(넣고, 읽고, 수정하고, 삭제)하는 SQL 문법 분류

## 📖 개요

DML은 SQL 3대 분류 중 하나로, 테이블 안의 데이터를 CRUD(생성·조회·수정·삭제)하는 명령어 집합입니다. 실무에서 가장 자주 쓰는 SQL 분류이며, 대부분의 쿼리가 DML에 해당합니다.

## 🎭 비유

DDL이 그릇을 만드는 것이라면, DML은 그릇 안의 음식을 다루는 것입니다. 음식을 넣고(INSERT), 확인하고(SELECT), 교체하고(UPDATE), 치우는(DELETE) 모든 행위가 DML입니다.

## ✨ 특징

- **INSERT** (Create): 데이터 추가
- **SELECT** (Read): 데이터 조회
- **UPDATE** (Update): 데이터 수정
- **DELETE** (Delete): 데이터 삭제
- CRUD와 1:1 대응하여 직관적
- 실무에서 가장 높은 사용 빈도

## 💡 예시

```python
# ORM(SQLAlchemy)에서 DML 대응
session.add(user)                          # INSERT
session.query(User).filter_by(id=1).all()  # SELECT
user.name = "수정"                          # UPDATE
session.delete(user)                        # DELETE
```

## Relations

- part_of [[SQL (Structured Query Language)]] (3대 분류 중 하나)
- similar_to [[DDL (Data Definition Language)]] (SQL 문법 분류)
- similar_to [[DCL (Data Control Language)]] (SQL 문법 분류)
- relates_to [[CRUD]] (DML 명령어와 1:1 대응)
- used_by [[ORM (Object-Relational Mapping)]] (객체 조작으로 DML 대체)