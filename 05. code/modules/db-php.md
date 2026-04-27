---
title: db-php
type: note
permalink: zettelkasten/05.-code/modules/db-php
level: low
category: code/mot-dashboard/config
semantic: provide mariadb pdo connection
path: /volume1/web/mot/config/db.php
tags:
- module
- php
- config
- database
---


# db-php

MOT 대시보드 MariaDB 연결 설정. 싱글톤 PDO 인스턴스 제공.

## 개요

NAS localhost의 MariaDB 10.11(`mot_dashboard` DB)에 `utf8mb4` + `utf8mb4_unicode_ci`로 PDO 연결. `getDB()` 함수가 정적 변수로 싱글톤 보장. 페이지 PHP의 최상단에서 `require_once __DIR__ . '/config/db.php'` 후 `getDB()` 호출.

## Observations

- [impl] `static $pdo = null` — 함수 내부 정적 변수로 싱글톤 구현, 요청당 1회 연결 #pattern
- [impl] PDO 옵션: `ERRMODE_EXCEPTION`(오류 예외화), `FETCH_ASSOC`(기본 연관배열), `INIT_COMMAND="SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"` #pattern
- [impl] DSN: `mysql:host=localhost;port=3306;dbname=mot_dashboard;charset=utf8mb4` — NAS 내부라 TCP 3306 직접 사용 #pattern
- [deps] 없음 (PHP 내장 `PDO`) #import
- [usage] `require_once __DIR__ . '/config/db.php'; $pdo = getDB();` — 모든 페이지 공통 #cli
- [note] DB 비밀번호가 평문으로 하드코딩 (운영 NAS 내부라 격리되어 있지만 민감값 — feedback memory 참조) #caveat
- [note] Unix socket(`/run/mysqld/mysqld10.sock`) 대신 TCP 사용 — 수집기(Node.js)는 socket, 대시보드는 TCP로 다름 #caveat

## Relations

- part_of [[MOT 성과분석 대시보드 (PHP)]]
- uses [[pdo]] (PHP 내장)
