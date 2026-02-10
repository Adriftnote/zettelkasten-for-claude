---
title: ORM (Object-Relational Mapping)
type: concept
permalink: knowledge/concepts/orm
tags:
- database
- python
- abstraction
category: 소프트웨어 패턴
difficulty: 중급
---

# ORM (Object-Relational Mapping)

SQL을 직접 쓰지 않고, 프로그래밍 언어의 객체(클래스)로 DB를 다루는 패턴

## 📖 개요

ORM은 데이터베이스 테이블을 클래스로, 행(row)을 객체 인스턴스로, 컬럼을 클래스 속성으로 매핑하는 패턴입니다. DDL과 DML 모두 처리할 수 있어 SQL을 직접 작성하지 않고도 데이터베이스를 조작할 수 있습니다.

## 🎭 비유

통역사와 같습니다. 개발자는 모국어(Python, Java)로 말하고, ORM이 이를 DB가 알아듣는 SQL로 통역해 줍니다.

## ✨ 특징

- 테이블 ↔ 클래스, 행 ↔ 객체, 컬럼 ↔ 속성 매핑
- DDL 처리: 클래스 정의 → CREATE TABLE 자동 생성
- DML 처리: 객체 조작 → SELECT/INSERT/UPDATE/DELETE 변환
- SQL이라는 복잡한 언어를 프로그래밍 객체로 추상화
- 대표 라이브러리: SQLAlchemy, Django ORM (Python) / Hibernate (Java) / Prisma (JS)

## 💡 예시

```python
# 클래스 정의 = DDL (테이블 구조 정의)
class Entity(Base):
    __tablename__ = 'entities'
    id = Column(Integer, primary_key=True)
    title = Column(String)

# 객체 조작 = DML (데이터 조작)
entity = Entity(title="노트1")     # INSERT
session.add(entity)
session.query(Entity).all()        # SELECT
entity.title = "수정됨"             # UPDATE
session.delete(entity)              # DELETE
```

## Relations

- enables [[DDL (Data Definition Language)]] (클래스로 DDL 대체)
- enables [[DML (Data Manipulation Language)]] (객체 조작으로 DML 대체)
- part_of [[추상화 패턴 (Abstraction Pattern)]] (DB 영역 추상화)
- relates_to [[SQLAlchemy]] (Python 대표 ORM)