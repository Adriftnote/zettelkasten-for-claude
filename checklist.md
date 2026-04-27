---
title: checklist
type: note
permalink: zettelkasten/checklist
---

# 권한/인증/감사 체크리스트

## 목표

현재 프로젝트에서 아래를 동시에 만족시키는 구조로 보완합니다.

- 권한이 없는 사용자는 대시보드 섹션이 보이지 않음
- 권한이 없는 사용자는 주소를 직접 입력해도 페이지/API에 접근할 수 없음
- 대시보드 데이터는 조회 전용이며, 계정별 데이터 수정 권한은 없음
- 로그인 기능이 세션 보안, 권한 철회, 계정 잠금, 감사 로그 요구사항을 충족함
- 사용자 CRUD는 `SUPER_ADMIN`만 가능하고, 삭제는 소프트 삭제로 처리함
- `SUPER_ADMIN`이 계정을 생성하면 임시 비밀번호를 자동 생성하고, DB에는 해시만 저장함
- 임시 비밀번호로 로그인한 사용자는 최초 로그인 시 반드시 비밀번호를 변경해야 함
- 외부 업체를 포함한 비밀번호 초기화는 요청 -> 관리자 승인 -> 임시 비밀번호 재발급 -> 최초 로그인 후 변경 순서로 처리함
- 최근 로그인 시각과 메뉴 접근 이력을 감사용으로 조회할 수 있음

핵심 원칙은 아래와 같습니다.

1. 메뉴 노출 제어와 실제 접근 제어를 분리합니다.
2. 모든 진입 PHP 파일에서 서버 측 인증/권한 체크를 합니다.
3. 로그인 보안은 세션, 비밀번호, 잠금, 감사 로그까지 포함합니다.
4. 권한 변경은 즉시 반영되도록 세션 캐시 무효화 기준을 둡니다.
5. 사용자 삭제는 하드 삭제하지 않고 소프트 삭제합니다.
6. 운영 서버에는 불필요한 정적 시안/백업/문서 파일을 배포하지 않습니다.

---

## 1. 권장 파일 배치

### 1.1 로그인 페이지 위치

- `login.php`는 루트에 둡니다.
- 위치: `index.php`와 같은 레벨

이유:

- 현재 프로젝트는 프레임워크 없이 루트 PHP 파일을 직접 호출합니다.
- 팝업 URL도 모두 루트 기준으로 연결됩니다.
- 로그인 진입점도 같은 레벨이 가장 단순합니다.

### 1.2 권장 추가 파일 구조

```text
MOT/
├─ login.php
├─ logout.php
├─ changePassword.php
├─ passwordResetRequest.php
├─ 403.php
├─ 401.php
├─ index.php
├─ channelPerformanceStatus.php
├─ channelPerformanceStatusView.php
├─ contentPerformanceStatus.php
├─ contentPerformanceStatusView.php
├─ contentPerformanceStatusViewGeneral.php
├─ ajax_titles.php
├─ admin/
│  ├─ users.php
│  ├─ userForm.php
│  ├─ passwordResetRequests.php
│  ├─ userAuditLogin.php
│  └─ userAuditMenuAccess.php
└─ includes/
   ├─ auth.php
   ├─ acl.php
   ├─ audit.php
   ├─ csrf.php
   └─ ...
```

### 1.3 로그인 성공 후 이동

- 기본: `index.php`
- 또는 사용자에게 허용된 첫 번째 메뉴 URL

---

## 2. 현재 프로젝트에서 보호해야 하는 진입점

아래 파일은 모두 직접 URL 접근 차단 대상입니다.

| 파일                                        | 권한 코드 예시                           | 비고                                  |
| ----------------------------------------- | ---------------------------------- | ----------------------------------- |
| `index.php`                               | `PAGE_DASHBOARD`                   | 메인 대시보드                             |
| `channelPerformanceStatus.php`            | `PAGE_CHANNEL_STATUS_LIST`         | 채널 목록 팝업                            |
| `channelPerformanceStatusView.php`        | `PAGE_CHANNEL_STATUS_VIEW`         | 채널 상세 팝업                            |
| `contentPerformanceStatus.php`            | `PAGE_CONTENT_STATUS_LIST`         | 콘텐츠 목록 팝업                           |
| `contentPerformanceStatusView.php`        | `PAGE_CONTENT_STATUS_VIEW`         | 콘텐츠 상세 팝업                           |
| `contentPerformanceStatusViewGeneral.php` | `PAGE_CONTENT_STATUS_VIEW_GENERAL` | 유지 시 반드시 보호                         |
| `ajax_titles.php`                         | `API_AJAX_TITLES`                  | 자동완성 API                            |
| `changePassword.php`                      | 로그인 사용자                            | `must_change_password=1`이면 강제 진입    |
| `admin/users.php`                         | `PAGE_USER_MANAGEMENT`             | 사용자 관리, `SUPER_ADMIN` 전용            |
| `admin/userForm.php`                      | `PAGE_USER_MANAGEMENT`             | 사용자 등록/수정, `SUPER_ADMIN` 전용         |
| `admin/passwordResetRequests.php`         | `PAGE_USER_MANAGEMENT`             | 비밀번호 초기화 요청 승인/반려, `SUPER_ADMIN` 전용 |
| `admin/userAuditLogin.php`                | `PAGE_LOGIN_AUDIT`                 | 로그인 감사 조회                           |
| `admin/userAuditMenuAccess.php`           | `PAGE_MENU_ACCESS_AUDIT`           | 메뉴 접근 감사 조회                         |

별도 참고:

- `passwordResetRequest.php`는 비로그인 상태에서도 접근 가능한 공개 요청 페이지로 둘 수 있습니다.
- 이 경우 계정 존재 여부를 노출하지 않는 공통 응답, IP/계정 기준 요청 제한, 감사 로그 기록이 필요합니다.

운영 서버에서 웹 접근 자체를 막아야 하는 파일/디렉터리:

- `index.html`
- `channelPerformanceStatus.html`
- `channelPerformanceStatusView.html`
- `contentPerformanceStatus.html`
- `contentPerformanceStatusView.html`
- `channelPerformanceStatusView.php.bak`
- `contentPerformanceStatus.php.bak`
- `includes/queries/content.php.bak-20260416-watchtime`
- `mot.zip`
- `structure.md`
- `checklist.md`
- `/config/*`
- `/includes/*` 직접 호출

---

## 3. 권한 설계

### 3.1 권한 단위

페이지 권한:

- `PAGE_DASHBOARD`
- `PAGE_CHANNEL_STATUS_LIST`
- `PAGE_CHANNEL_STATUS_VIEW`
- `PAGE_CONTENT_STATUS_LIST`
- `PAGE_CONTENT_STATUS_VIEW`
- `PAGE_CONTENT_STATUS_VIEW_GENERAL`
- `PAGE_USER_MANAGEMENT`
- `PAGE_LOGIN_AUDIT`
- `PAGE_MENU_ACCESS_AUDIT`

섹션 권한:

- `SECTION_DASHBOARD_CHANNEL_TOP20`
- `SECTION_DASHBOARD_CONTENT_TOP20`

API 권한:

- `API_AJAX_TITLES`

액션 권한:

- `ACTION_USER_CREATE`
- `ACTION_USER_UPDATE`
- `ACTION_USER_SOFT_DELETE`
- `ACTION_USER_RESTORE`
- `ACTION_USER_ASSIGN_ROLE`
- `ACTION_USER_RESET_PASSWORD`
- `ACTION_USER_UNLOCK`

### 3.2 역할 예시

- `SUPER_ADMIN`
- `DASHBOARD_VIEWER`
- `CHANNEL_ANALYST`
- `CONTENT_ANALYST`
- `AUDITOR`

### 3.3 메뉴 예시

- 대시보드 -> `/index.php`
- 채널 성과 -> `/channelPerformanceStatus.php`
- 콘텐츠 성과 -> `/contentPerformanceStatus.php`
- 사용자 관리 -> `/admin/users.php`
- 로그인 감사 -> `/admin/userAuditLogin.php`
- 메뉴 접근 감사 -> `/admin/userAuditMenuAccess.php`

---

## 4. 보안 설계 필수 보완사항

### 4.1 DB 자격증명과 계정 보안

- [ ] `config/db.php`에 DB 비밀번호를 하드코딩하지 않기
- [ ] DB 접속 정보는 환경변수 또는 웹 루트 밖 서버 설정 파일에서 읽기
- [ ] 앱 전용 DB 계정 생성
- [ ] `root` 계정 사용 금지
- [ ] 앱 계정에는 필요한 권한만 부여
- [ ] `/config`, `/includes` 디렉터리 직접 웹 접근 차단

권장 DB 권한:

- `SELECT`
- `INSERT`
- `UPDATE`
- 필요 시 제한적 `DELETE`는 금지하고 소프트 삭제 사용
- `ALTER`, `DROP`, `CREATE USER`, `GRANT` 금지

### 4.2 세션 하드닝

- [ ] 로그인 직후 `session_regenerate_id(true)` 수행
- [ ] 권한 변경 직후에도 세션 재발급
- [ ] 로그아웃 시 세션 완전 파기
- [ ] `HttpOnly` 쿠키 적용
- [ ] HTTPS 환경에서는 `Secure` 쿠키 적용
- [ ] `SameSite=Lax` 또는 `Strict` 적용
- [ ] 유휴 만료 시간 설정
- [ ] 절대 만료 시간 설정
- [ ] 인증 페이지에 `Cache-Control: no-store` 적용
- [ ] 세션 만료 시 `401.php` 또는 `login.php`로 이동

권장 기준:

- 유휴 만료: 30분
- 절대 만료: 8시간

### 4.3 권한 철회 즉시 반영

세션에 권한 목록을 넣는 것만으로는 부족합니다.

- [ ] 사용자별 `acl_version` 저장
- [ ] 시스템 전체 `acl_global_version` 저장
- [ ] 로그인 시 세션에 두 값을 저장
- [ ] 매 요청마다 현재 DB 값과 세션 값을 비교
- [ ] 불일치 시 세션 무효화 후 재로그인 요구
- [ ] 계정 상태가 `LOCKED`, `DISABLED`, `DELETED`로 바뀌면 즉시 차단

### 4.4 무차별 대입/계정 잠금/로그인 감사

- [ ] 로그인 실패 횟수 저장
- [ ] 일정 횟수 이상 실패 시 잠금
- [ ] 잠금 해제 시간 저장
- [ ] 로그인 성공/실패/잠금/로그아웃 모두 감사 로그 저장
- [ ] 실패 메시지는 계정 존재 여부를 노출하지 않는 공통 문구 사용
- [ ] 가능하면 IP 기준 추가 제한 적용

권장 기준:

- 5회 실패 시 15분 잠금

### 4.5 CSRF와 상태 변경 요청 보호

- [ ] 로그인 POST에 CSRF 토큰 적용
- [ ] 사용자 등록/수정/삭제/복구/비밀번호 초기화 POST에 CSRF 토큰 적용
- [ ] 상태 변경은 GET 금지, POST 또는 POST+PRG 패턴 사용

### 4.6 임시 비밀번호 / 최초 로그인 비밀번호 변경 / 승인형 비밀번호 초기화

- [ ] `SUPER_ADMIN`이 사용자 생성 시 임시 비밀번호를 자동 생성
- [ ] DB에는 임시 비밀번호의 평문이 아니라 `password_hash()` 결과만 저장
- [ ] 사용자 생성 시 `must_change_password = 1`로 저장
- [ ] 임시 비밀번호 만료 시각 저장
- [ ] 임시 비밀번호는 화면에서 1회만 표시하고 별도 안전 채널로 전달
- [ ] 임시 비밀번호 로그인 성공 시 `changePassword.php`로 강제 이동
- [ ] `must_change_password = 1`이면 다른 메뉴 접근 차단
- [ ] 비밀번호 변경 완료 시 `must_change_password = 0`으로 해제
- [ ] 외부 업체 비밀번호 초기화는 `passwordResetRequest.php` 또는 관리자 대행 등록으로 요청 접수
- [ ] 요청 상태는 `REQUESTED -> APPROVED/REJECTED -> COMPLETED` 흐름으로 관리
- [ ] 승인 시 새 임시 비밀번호를 자동 생성하고 해시만 저장
- [ ] 승인/반려/완료 이력을 감사 로그로 남김

권장 기준:

- 임시 비밀번호 유효기간: 24시간
- 최초 로그인 후 비밀번호 변경 전에는 `changePassword.php`, `logout.php` 외 접근 금지

### 4.7 감사 로그

- [ ] 로그인 이력 테이블 별도 보관
- [ ] 메뉴/페이지 접근 로그 테이블 별도 보관
- [ ] 최근 로그인 시각 `last_login_at` 별도 유지
- [ ] 최근 메뉴 접근 시각 `last_menu_access_at` 별도 유지
- [ ] 관리자 감사 화면에서 최근 100건 이상 조회 가능하도록 인덱스 설계

---

## 5. MariaDB 추가 테이블

현재 요구사항 기준으로 아래 테이블을 권장합니다.

1. `auth_user`
2. `auth_role`
3. `auth_user_role`
4. `auth_permission`
5. `auth_role_permission`
6. `auth_menu`
7. `auth_menu_permission`
8. `auth_acl_state`
9. `auth_login_history`
10. `auth_menu_access_log`
11. `auth_password_reset_request`

### 5.1 DDL

```sql
CREATE TABLE auth_user (
    user_id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    login_id              VARCHAR(50) NOT NULL,
    password_hash         VARCHAR(255) NOT NULL,
    user_name             VARCHAR(100) NOT NULL,
    email                 VARCHAR(150) NULL,
    account_status        ENUM('ACTIVE', 'LOCKED', 'DISABLED', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
    failed_login_count    INT UNSIGNED NOT NULL DEFAULT 0,
    locked_until          DATETIME NULL,
    must_change_password  TINYINT(1) NOT NULL DEFAULT 1,
    temporary_password_issued_at DATETIME NULL,
    temporary_password_expires_at DATETIME NULL,
    password_changed_at   DATETIME NULL,
    last_login_at         DATETIME NULL,
    last_login_ip         VARCHAR(45) NULL,
    last_menu_access_at   DATETIME NULL,
    acl_version           BIGINT UNSIGNED NOT NULL DEFAULT 1,
    created_by            BIGINT UNSIGNED NULL,
    updated_by            BIGINT UNSIGNED NULL,
    deleted_by            BIGINT UNSIGNED NULL,
    deleted_at            DATETIME NULL,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY uq_auth_user_login_id (login_id),
    KEY ix_auth_user_status (account_status, deleted_at),
    KEY ix_auth_user_last_login (last_login_at),
    KEY ix_auth_user_last_menu_access (last_menu_access_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_role (
    role_id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    role_code             VARCHAR(50) NOT NULL,
    role_name             VARCHAR(100) NOT NULL,
    is_active             TINYINT(1) NOT NULL DEFAULT 1,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id),
    UNIQUE KEY uq_auth_role_code (role_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_user_role (
    user_role_id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id               BIGINT UNSIGNED NOT NULL,
    role_id               BIGINT UNSIGNED NOT NULL,
    is_active             TINYINT(1) NOT NULL DEFAULT 1,
    assigned_by           BIGINT UNSIGNED NULL,
    revoked_by            BIGINT UNSIGNED NULL,
    assigned_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at            DATETIME NULL,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_role_id),
    UNIQUE KEY uq_auth_user_role (user_id, role_id),
    KEY ix_auth_user_role_active (user_id, is_active),
    CONSTRAINT fk_auth_user_role_user FOREIGN KEY (user_id) REFERENCES auth_user (user_id),
    CONSTRAINT fk_auth_user_role_role FOREIGN KEY (role_id) REFERENCES auth_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_permission (
    permission_id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    permission_code       VARCHAR(100) NOT NULL,
    permission_name       VARCHAR(150) NOT NULL,
    permission_type       ENUM('PAGE', 'SECTION', 'API', 'ACTION') NOT NULL,
    is_active             TINYINT(1) NOT NULL DEFAULT 1,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (permission_id),
    UNIQUE KEY uq_auth_permission_code (permission_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_role_permission (
    role_permission_id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    role_id               BIGINT UNSIGNED NOT NULL,
    permission_id         BIGINT UNSIGNED NOT NULL,
    is_active             TINYINT(1) NOT NULL DEFAULT 1,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (role_permission_id),
    UNIQUE KEY uq_auth_role_permission (role_id, permission_id),
    KEY ix_auth_role_permission_active (role_id, is_active),
    CONSTRAINT fk_auth_role_permission_role FOREIGN KEY (role_id) REFERENCES auth_role (role_id),
    CONSTRAINT fk_auth_role_permission_permission FOREIGN KEY (permission_id) REFERENCES auth_permission (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_menu (
    menu_id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    menu_code             VARCHAR(50) NOT NULL,
    menu_name             VARCHAR(100) NOT NULL,
    menu_url              VARCHAR(255) NOT NULL,
    parent_menu_id        BIGINT UNSIGNED NULL,
    sort_order            INT NOT NULL DEFAULT 0,
    is_active             TINYINT(1) NOT NULL DEFAULT 1,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (menu_id),
    UNIQUE KEY uq_auth_menu_code (menu_code),
    CONSTRAINT fk_auth_menu_parent FOREIGN KEY (parent_menu_id) REFERENCES auth_menu (menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_menu_permission (
    menu_permission_id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    menu_id               BIGINT UNSIGNED NOT NULL,
    permission_id         BIGINT UNSIGNED NOT NULL,
    is_active             TINYINT(1) NOT NULL DEFAULT 1,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (menu_permission_id),
    UNIQUE KEY uq_auth_menu_permission (menu_id, permission_id),
    KEY ix_auth_menu_permission_active (menu_id, is_active),
    CONSTRAINT fk_auth_menu_permission_menu FOREIGN KEY (menu_id) REFERENCES auth_menu (menu_id),
    CONSTRAINT fk_auth_menu_permission_permission FOREIGN KEY (permission_id) REFERENCES auth_permission (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_acl_state (
    state_id              TINYINT UNSIGNED NOT NULL,
    acl_global_version    BIGINT UNSIGNED NOT NULL DEFAULT 1,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (state_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO auth_acl_state (state_id, acl_global_version)
VALUES (1, 1);

CREATE TABLE auth_login_history (
    login_history_id      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id               BIGINT UNSIGNED NULL,
    login_id_input        VARCHAR(50) NOT NULL,
    event_type            ENUM('LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT', 'SESSION_EXPIRED', 'ACCOUNT_LOCKED') NOT NULL,
    result_status         ENUM('SUCCESS', 'FAIL', 'BLOCKED') NOT NULL,
    reason_code           VARCHAR(50) NULL,
    client_ip             VARCHAR(45) NULL,
    user_agent            VARCHAR(255) NULL,
    attempted_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (login_history_id),
    KEY ix_auth_login_history_user_time (user_id, attempted_at),
    KEY ix_auth_login_history_login_id_time (login_id_input, attempted_at),
    CONSTRAINT fk_auth_login_history_user FOREIGN KEY (user_id) REFERENCES auth_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_menu_access_log (
    access_log_id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id               BIGINT UNSIGNED NOT NULL,
    menu_id               BIGINT UNSIGNED NULL,
    menu_code             VARCHAR(50) NULL,
    page_path             VARCHAR(255) NOT NULL,
    query_string          VARCHAR(1000) NULL,
    permission_code       VARCHAR(100) NULL,
    access_result         ENUM('ALLOWED', 'DENIED') NOT NULL,
    http_method           VARCHAR(10) NOT NULL DEFAULT 'GET',
    client_ip             VARCHAR(45) NULL,
    user_agent            VARCHAR(255) NULL,
    accessed_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (access_log_id),
    KEY ix_auth_menu_access_user_time (user_id, accessed_at),
    KEY ix_auth_menu_access_menu_time (menu_code, accessed_at),
    KEY ix_auth_menu_access_page_time (page_path, accessed_at),
    CONSTRAINT fk_auth_menu_access_user FOREIGN KEY (user_id) REFERENCES auth_user (user_id),
    CONSTRAINT fk_auth_menu_access_menu FOREIGN KEY (menu_id) REFERENCES auth_menu (menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_password_reset_request (
    password_reset_request_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id               BIGINT UNSIGNED NULL,
    login_id_input        VARCHAR(50) NOT NULL,
    requester_name        VARCHAR(100) NOT NULL,
    requester_company     VARCHAR(150) NULL,
    requester_email       VARCHAR(150) NULL,
    requester_phone       VARCHAR(30) NULL,
    request_channel       ENUM('PORTAL', 'EMAIL', 'PHONE', 'ADMIN_PROXY') NOT NULL DEFAULT 'PORTAL',
    request_reason        VARCHAR(255) NULL,
    request_status        ENUM('REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'REQUESTED',
    requested_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_by_user_id   BIGINT UNSIGNED NULL,
    approved_at           DATETIME NULL,
    rejected_by_user_id   BIGINT UNSIGNED NULL,
    rejected_at           DATETIME NULL,
    completed_by_user_id  BIGINT UNSIGNED NULL,
    completed_at          DATETIME NULL,
    temp_password_issued_at DATETIME NULL,
    temp_password_expires_at DATETIME NULL,
    client_ip             VARCHAR(45) NULL,
    note_admin            VARCHAR(500) NULL,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (password_reset_request_id),
    KEY ix_password_reset_request_user_time (user_id, requested_at),
    KEY ix_password_reset_request_status_time (request_status, requested_at),
    KEY ix_password_reset_request_login_id_time (login_id_input, requested_at),
    CONSTRAINT fk_password_reset_request_user FOREIGN KEY (user_id) REFERENCES auth_user (user_id),
    CONSTRAINT fk_password_reset_request_approved_by FOREIGN KEY (approved_by_user_id) REFERENCES auth_user (user_id),
    CONSTRAINT fk_password_reset_request_rejected_by FOREIGN KEY (rejected_by_user_id) REFERENCES auth_user (user_id),
    CONSTRAINT fk_password_reset_request_completed_by FOREIGN KEY (completed_by_user_id) REFERENCES auth_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 6. 초기 권한/메뉴/역할 데이터

### 6.1 권한 등록

```sql
INSERT INTO auth_permission (permission_code, permission_name, permission_type) VALUES
('PAGE_DASHBOARD', '메인 대시보드 접근', 'PAGE'),
('SECTION_DASHBOARD_CHANNEL_TOP20', '대시보드 - 채널 구독자 증가 TOP 20 섹션', 'SECTION'),
('SECTION_DASHBOARD_CONTENT_TOP20', '대시보드 - 콘텐츠 조회수 TOP 20 섹션', 'SECTION'),
('PAGE_CHANNEL_STATUS_LIST', '채널 성과 목록 접근', 'PAGE'),
('PAGE_CHANNEL_STATUS_VIEW', '채널 성과 상세 접근', 'PAGE'),
('PAGE_CONTENT_STATUS_LIST', '콘텐츠 성과 목록 접근', 'PAGE'),
('PAGE_CONTENT_STATUS_VIEW', '콘텐츠 성과 상세 접근', 'PAGE'),
('PAGE_CONTENT_STATUS_VIEW_GENERAL', '일반 콘텐츠 상세 접근', 'PAGE'),
('API_AJAX_TITLES', '콘텐츠 제목 자동완성 API 접근', 'API'),
('PAGE_USER_MANAGEMENT', '사용자 관리 페이지 접근', 'PAGE'),
('PAGE_LOGIN_AUDIT', '로그인 감사 페이지 접근', 'PAGE'),
('PAGE_MENU_ACCESS_AUDIT', '메뉴 접근 감사 페이지 접근', 'PAGE'),
('ACTION_USER_CREATE', '사용자 생성', 'ACTION'),
('ACTION_USER_UPDATE', '사용자 수정', 'ACTION'),
('ACTION_USER_SOFT_DELETE', '사용자 소프트 삭제', 'ACTION'),
('ACTION_USER_RESTORE', '사용자 복구', 'ACTION'),
('ACTION_USER_ASSIGN_ROLE', '사용자 역할 부여/회수', 'ACTION'),
('ACTION_USER_RESET_PASSWORD', '사용자 비밀번호 초기화', 'ACTION'),
('ACTION_USER_UNLOCK', '잠금 계정 해제', 'ACTION');
```

### 6.2 메뉴 등록

```sql
INSERT INTO auth_menu (menu_code, menu_name, menu_url, parent_menu_id, sort_order) VALUES
('MENU_DASHBOARD', '대시보드', '/index.php', NULL, 10),
('MENU_CHANNEL_STATUS', '채널 성과', '/channelPerformanceStatus.php', NULL, 20),
('MENU_CONTENT_STATUS', '콘텐츠 성과', '/contentPerformanceStatus.php', NULL, 30),
('MENU_USER_MANAGEMENT', '사용자 관리', '/admin/users.php', NULL, 80),
('MENU_LOGIN_AUDIT', '로그인 감사', '/admin/userAuditLogin.php', NULL, 90),
('MENU_MENU_ACCESS_AUDIT', '메뉴 접근 감사', '/admin/userAuditMenuAccess.php', NULL, 100);
```

### 6.3 메뉴-권한 연결

```sql
INSERT INTO auth_menu_permission (menu_id, permission_id)
SELECT m.menu_id, p.permission_id
FROM auth_menu m
JOIN auth_permission p ON
    (m.menu_code = 'MENU_DASHBOARD' AND p.permission_code = 'PAGE_DASHBOARD')
 OR (m.menu_code = 'MENU_CHANNEL_STATUS' AND p.permission_code = 'PAGE_CHANNEL_STATUS_LIST')
 OR (m.menu_code = 'MENU_CONTENT_STATUS' AND p.permission_code = 'PAGE_CONTENT_STATUS_LIST')
 OR (m.menu_code = 'MENU_USER_MANAGEMENT' AND p.permission_code = 'PAGE_USER_MANAGEMENT')
 OR (m.menu_code = 'MENU_LOGIN_AUDIT' AND p.permission_code = 'PAGE_LOGIN_AUDIT')
 OR (m.menu_code = 'MENU_MENU_ACCESS_AUDIT' AND p.permission_code = 'PAGE_MENU_ACCESS_AUDIT');
```

### 6.4 역할 등록

```sql
INSERT INTO auth_role (role_code, role_name) VALUES
('SUPER_ADMIN', '슈퍼 관리자'),
('CHANNEL_ANALYST', '채널 분석 담당'),
('CONTENT_ANALYST', '콘텐츠 분석 담당'),
('DASHBOARD_VIEWER', '기본 대시보드 조회자'),
('AUDITOR', '감사 조회자');
```

### 6.5 역할-권한 연결 예시

```sql
INSERT INTO auth_role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM auth_role r
JOIN auth_permission p
WHERE r.role_code = 'SUPER_ADMIN';
```

위 쿼리에는 사용자 관리 권한, 사용자 CRUD 액션 권한, 감사 조회 권한까지 포함됩니다.

```sql
INSERT INTO auth_role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM auth_role r
JOIN auth_permission p
WHERE r.role_code = 'CHANNEL_ANALYST'
  AND p.permission_code IN (
      'PAGE_DASHBOARD',
      'SECTION_DASHBOARD_CHANNEL_TOP20',
      'PAGE_CHANNEL_STATUS_LIST',
      'PAGE_CHANNEL_STATUS_VIEW'
  );
```

```sql
INSERT INTO auth_role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM auth_role r
JOIN auth_permission p
WHERE r.role_code = 'CONTENT_ANALYST'
  AND p.permission_code IN (
      'PAGE_DASHBOARD',
      'SECTION_DASHBOARD_CONTENT_TOP20',
      'PAGE_CONTENT_STATUS_LIST',
      'PAGE_CONTENT_STATUS_VIEW',
      'PAGE_CONTENT_STATUS_VIEW_GENERAL',
      'API_AJAX_TITLES'
  );
```

```sql
INSERT INTO auth_role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM auth_role r
JOIN auth_permission p
WHERE r.role_code = 'AUDITOR'
  AND p.permission_code IN (
      'PAGE_LOGIN_AUDIT',
      'PAGE_MENU_ACCESS_AUDIT'
  );
```

### 6.6 초기 `SUPER_ADMIN` 생성 방법

초기 슈퍼관리자도 일반 사용자 생성과 동일하게 "임시 비밀번호 생성 -> 해시 저장 -> 최초 로그인 시 비밀번호 변경" 흐름으로 두는 것이 안전합니다.

임시 비밀번호 생성 예시:

```php
<?php
$temporaryPassword = bin2hex(random_bytes(6)); // 예: 12자리
$passwordHash = password_hash($temporaryPassword, PASSWORD_DEFAULT);
```

초기 슈퍼관리자 계정 생성:

```sql
INSERT INTO auth_user (
    login_id,
    password_hash,
    user_name,
    email,
    account_status,
    must_change_password,
    temporary_password_issued_at,
    temporary_password_expires_at,
    created_at,
    updated_at
) VALUES (
    'superadmin',
    :password_hash,
    '슈퍼 관리자',
    'admin@example.com',
    'ACTIVE',
    1,
    NOW(),
    DATE_ADD(NOW(), INTERVAL 1 DAY),
    NOW(),
    NOW()
);
```

`SUPER_ADMIN` 역할 부여:

```sql
INSERT INTO auth_user_role (
    user_id, role_id, is_active, assigned_at
)
SELECT u.user_id, r.role_id, 1, NOW()
FROM auth_user u
JOIN auth_role r
WHERE u.login_id = 'superadmin'
  AND r.role_code = 'SUPER_ADMIN';
```

운영 원칙:

- 임시 비밀번호 평문은 DB에 저장하지 않습니다.
- 임시 비밀번호는 생성 직후 화면에 1회만 보여주고 안전한 채널로 전달합니다.
- 첫 로그인 후 `changePassword.php`로 강제 이동시켜 본인 비밀번호로 바꾸게 합니다.

---

## 7. 로그인/권한/감사 쿼리

### 7.1 로그인 시 사용자 조회

```sql
SELECT
    user_id,
    login_id,
    password_hash,
    user_name,
    account_status,
    failed_login_count,
    locked_until,
    must_change_password,
    temporary_password_expires_at,
    acl_version,
    deleted_at
FROM auth_user
WHERE login_id = :login_id
LIMIT 1;
```

로그인 처리 원칙:

- `deleted_at IS NULL`
- `account_status = 'ACTIVE'`
- `locked_until IS NULL OR locked_until < NOW()`
- `temporary_password_expires_at IS NULL OR temporary_password_expires_at >= NOW()`
- `password_verify()`로 검증

임시 비밀번호 사용자 로그인 후 처리:

- `must_change_password = 1`이면 세션에 `must_change_password` 플래그 저장
- 로그인 성공 직후 `changePassword.php`로 리다이렉트
- `changePassword.php`, `logout.php` 외 경로는 차단

### 7.2 로그인 성공 처리

```sql
UPDATE auth_user
SET failed_login_count = 0,
    locked_until = NULL,
    last_login_at = NOW(),
    last_login_ip = :client_ip,
    updated_at = NOW()
WHERE user_id = :user_id
  AND deleted_at IS NULL;
```

```sql
INSERT INTO auth_login_history (
    user_id, login_id_input, event_type, result_status, reason_code, client_ip, user_agent
) VALUES (
    :user_id, :login_id_input, 'LOGIN_SUCCESS', 'SUCCESS', NULL, :client_ip, :user_agent
);
```

### 7.3 로그인 실패 처리

```sql
UPDATE auth_user
SET failed_login_count = failed_login_count + 1,
    locked_until = CASE
        WHEN failed_login_count + 1 >= 5 THEN DATE_ADD(NOW(), INTERVAL 15 MINUTE)
        ELSE locked_until
    END,
    account_status = CASE
        WHEN failed_login_count + 1 >= 5 THEN 'LOCKED'
        ELSE account_status
    END,
    updated_at = NOW()
WHERE login_id = :login_id
  AND deleted_at IS NULL
  AND account_status <> 'DELETED';
```

```sql
INSERT INTO auth_login_history (
    user_id, login_id_input, event_type, result_status, reason_code, client_ip, user_agent
) VALUES (
    :user_id, :login_id_input, 'LOGIN_FAILURE', 'FAIL', :reason_code, :client_ip, :user_agent
);
```

공통 실패 메시지 예시:

- "로그인 정보가 올바르지 않거나 계정이 잠겨 있습니다."

### 7.3-1 공개 비밀번호 초기화 요청 생성

```sql
INSERT INTO auth_password_reset_request (
    user_id,
    login_id_input,
    requester_name,
    requester_company,
    requester_email,
    requester_phone,
    request_channel,
    request_reason,
    request_status,
    client_ip
) VALUES (
    :user_id,
    :login_id_input,
    :requester_name,
    :requester_company,
    :requester_email,
    :requester_phone,
    :request_channel,
    :request_reason,
    'REQUESTED',
    :client_ip
);
```

공개 요청 페이지 원칙:

- 응답은 항상 동일 문구로 반환
- 계정 존재 여부를 노출하지 않음
- `login_id_input`, `requester_email`, `client_ip` 기준 요청 빈도 제한
- 요청 생성 자체를 감사 로그에 남김

### 7.4 세션용 권한 로딩

```sql
SELECT DISTINCT
    p.permission_code
FROM auth_user u
JOIN auth_user_role ur
  ON ur.user_id = u.user_id
 AND ur.is_active = 1
JOIN auth_role r
  ON r.role_id = ur.role_id
 AND r.is_active = 1
JOIN auth_role_permission rp
  ON rp.role_id = r.role_id
 AND rp.is_active = 1
JOIN auth_permission p
  ON p.permission_id = rp.permission_id
 AND p.is_active = 1
WHERE u.user_id = :user_id
  AND u.account_status = 'ACTIVE'
  AND u.deleted_at IS NULL;
```

### 7.5 세션 무효화용 버전 조회

```sql
SELECT acl_version
FROM auth_user
WHERE user_id = :user_id
  AND deleted_at IS NULL
LIMIT 1;
```

```sql
SELECT acl_global_version
FROM auth_acl_state
WHERE state_id = 1;
```

세션 저장 권장값:

- `user_id`
- `login_id`
- `user_name`
- `permissions[]`
- `user_acl_version`
- `acl_global_version`
- `login_at`
- `last_activity_at`

### 7.6 사용자 메뉴 조회

```sql
SELECT DISTINCT
    m.menu_id,
    m.menu_code,
    m.menu_name,
    m.menu_url,
    m.parent_menu_id,
    m.sort_order
FROM auth_user_role ur
JOIN auth_role_permission rp
  ON rp.role_id = ur.role_id
 AND rp.is_active = 1
JOIN auth_menu_permission mp
  ON mp.permission_id = rp.permission_id
 AND mp.is_active = 1
JOIN auth_menu m
  ON m.menu_id = mp.menu_id
 AND m.is_active = 1
WHERE ur.user_id = :user_id
  AND ur.is_active = 1
ORDER BY m.sort_order ASC, m.menu_id ASC;
```

### 7.7 메뉴 접근 로그 기록

```sql
INSERT INTO auth_menu_access_log (
    user_id, menu_id, menu_code, page_path, query_string, permission_code,
    access_result, http_method, client_ip, user_agent
) VALUES (
    :user_id, :menu_id, :menu_code, :page_path, :query_string, :permission_code,
    :access_result, :http_method, :client_ip, :user_agent
);
```

```sql
UPDATE auth_user
SET last_menu_access_at = NOW(),
    updated_at = NOW()
WHERE user_id = :user_id
  AND deleted_at IS NULL;
```

기록 원칙:

- 허용된 메뉴 페이지 접근은 `ALLOWED`
- 거부된 직접 접근도 가능하면 `DENIED`로 기록
- CSS/JS/IMG 요청은 기록 대상에서 제외

---

## 8. 사용자 CRUD 쿼리

주의:

- 비밀번호는 PHP의 `password_hash()`로 생성합니다.
- 사용자 삭제는 하드 삭제하지 않고 소프트 삭제만 허용합니다.
- 소프트 삭제된 사용자는 기본 목록에서 제외합니다.
- 아래 사용자 CRUD는 모두 `SUPER_ADMIN` 전용입니다.
- 사용자 생성 시에는 임시 비밀번호를 자동 생성하고, DB에는 해시만 저장합니다.
- 생성된 사용자와 승인된 비밀번호 초기화 사용자는 최초 로그인 시 비밀번호를 반드시 변경해야 합니다.

### 8.1 사용자 생성

```sql
INSERT INTO auth_user (
    login_id,
    password_hash,
    user_name,
    email,
    account_status,
    must_change_password,
    temporary_password_issued_at,
    temporary_password_expires_at,
    password_changed_at,
    created_by,
    updated_by
) VALUES (
    :login_id,
    :password_hash,
    :user_name,
    :email,
    'ACTIVE',
    1,
    NOW(),
    DATE_ADD(NOW(), INTERVAL 1 DAY),
    NULL,
    :admin_user_id,
    :admin_user_id
);
```

생성 로직:

1. `SUPER_ADMIN`이 새 사용자 생성 요청
2. 시스템이 임시 비밀번호 평문 자동 생성
3. PHP `password_hash()`로 해시 생성
4. DB에는 해시만 저장
5. 평문 임시 비밀번호는 1회만 보여주고 안전 채널로 전달
6. 사용자 첫 로그인 시 `changePassword.php`로 강제 이동

### 8.2 사용자 역할 부여

```sql
INSERT INTO auth_user_role (
    user_id, role_id, is_active, assigned_by, assigned_at
) VALUES (
    :user_id, :role_id, 1, :admin_user_id, NOW()
)
ON DUPLICATE KEY UPDATE
    is_active = 1,
    revoked_at = NULL,
    revoked_by = NULL,
    assigned_by = VALUES(assigned_by),
    assigned_at = NOW(),
    updated_at = NOW();
```

권한 변경 후:

```sql
UPDATE auth_user
SET acl_version = acl_version + 1,
    updated_by = :admin_user_id,
    updated_at = NOW()
WHERE user_id = :user_id;
```

```sql
UPDATE auth_acl_state
SET acl_global_version = acl_global_version + 1,
    updated_at = NOW()
WHERE state_id = 1;
```

### 8.3 사용자 수정

```sql
UPDATE auth_user
SET user_name = :user_name,
    email = :email,
    account_status = :account_status,
    updated_by = :admin_user_id,
    updated_at = NOW()
WHERE user_id = :user_id
  AND deleted_at IS NULL;
```

### 8.4 본인 비밀번호 변경 완료

`must_change_password = 1` 상태의 사용자가 최초 로그인 후 자기 비밀번호를 변경할 때 사용합니다.

```sql
UPDATE auth_user
SET password_hash = :new_password_hash,
    password_changed_at = NOW(),
    must_change_password = 0,
    temporary_password_issued_at = NULL,
    temporary_password_expires_at = NULL,
    failed_login_count = 0,
    locked_until = NULL,
    acl_version = acl_version + 1,
    updated_by = :user_id,
    updated_at = NOW()
WHERE user_id = :user_id
  AND deleted_at IS NULL;
```

가능하면 같은 시점에 가장 최근 승인된 초기화 요청을 완료 처리합니다.

```sql
UPDATE auth_password_reset_request
SET request_status = 'COMPLETED',
    completed_by_user_id = :user_id,
    completed_at = NOW(),
    updated_at = NOW()
WHERE user_id = :user_id
  AND request_status = 'APPROVED'
ORDER BY password_reset_request_id DESC
LIMIT 1;
```

### 8.5 비밀번호 초기화 요청 승인 후 임시 비밀번호 재발급

```sql
UPDATE auth_user
SET password_hash = :new_password_hash,
    must_change_password = 1,
    temporary_password_issued_at = NOW(),
    temporary_password_expires_at = DATE_ADD(NOW(), INTERVAL 1 DAY),
    password_changed_at = NULL,
    failed_login_count = 0,
    locked_until = NULL,
    account_status = 'ACTIVE',
    acl_version = acl_version + 1,
    updated_by = :admin_user_id,
    updated_at = NOW()
WHERE user_id = :user_id
  AND deleted_at IS NULL;
```

```sql
UPDATE auth_password_reset_request
SET request_status = 'APPROVED',
    approved_by_user_id = :admin_user_id,
    approved_at = NOW(),
    temp_password_issued_at = NOW(),
    temp_password_expires_at = DATE_ADD(NOW(), INTERVAL 1 DAY),
    note_admin = :note_admin,
    updated_at = NOW()
WHERE password_reset_request_id = :password_reset_request_id
  AND request_status = 'REQUESTED';
```

승인 로직:

1. 외부 업체 또는 사용자 요청 접수
2. `SUPER_ADMIN`이 요청 검토
3. 승인 시 새 임시 비밀번호 평문 자동 생성
4. DB에는 해시만 저장
5. 사용자 계정은 `must_change_password = 1`
6. 임시 비밀번호는 1회만 표시 후 안전 채널 전달

### 8.6 비밀번호 초기화 요청 반려

```sql
UPDATE auth_password_reset_request
SET request_status = 'REJECTED',
    rejected_by_user_id = :admin_user_id,
    rejected_at = NOW(),
    note_admin = :note_admin,
    updated_at = NOW()
WHERE password_reset_request_id = :password_reset_request_id
  AND request_status = 'REQUESTED';
```

### 8.7 잠금 해제

```sql
UPDATE auth_user
SET failed_login_count = 0,
    locked_until = NULL,
    account_status = 'ACTIVE',
    acl_version = acl_version + 1,
    updated_by = :admin_user_id,
    updated_at = NOW()
WHERE user_id = :user_id
  AND deleted_at IS NULL;
```

### 8.8 사용자 소프트 삭제

```sql
UPDATE auth_user
SET account_status = 'DELETED',
    deleted_at = NOW(),
    deleted_by = :admin_user_id,
    acl_version = acl_version + 1,
    updated_by = :admin_user_id,
    updated_at = NOW()
WHERE user_id = :user_id
  AND deleted_at IS NULL;
```

```sql
UPDATE auth_user_role
SET is_active = 0,
    revoked_at = NOW(),
    revoked_by = :admin_user_id,
    updated_at = NOW()
WHERE user_id = :user_id
  AND is_active = 1;
```

### 8.9 사용자 복구

```sql
UPDATE auth_user
SET account_status = 'ACTIVE',
    deleted_at = NULL,
    deleted_by = NULL,
    acl_version = acl_version + 1,
    updated_by = :admin_user_id,
    updated_at = NOW()
WHERE user_id = :user_id
  AND deleted_at IS NOT NULL;
```

### 8.10 사용자 목록 조회

```sql
SELECT
    u.user_id,
    u.login_id,
    u.user_name,
    u.email,
    u.account_status,
    u.last_login_at,
    u.last_menu_access_at,
    GROUP_CONCAT(r.role_name ORDER BY r.role_name SEPARATOR ', ') AS role_names
FROM auth_user u
LEFT JOIN auth_user_role ur
  ON ur.user_id = u.user_id
 AND ur.is_active = 1
LEFT JOIN auth_role r
  ON r.role_id = ur.role_id
 AND r.is_active = 1
WHERE u.deleted_at IS NULL
GROUP BY
    u.user_id, u.login_id, u.user_name, u.email, u.account_status, u.last_login_at, u.last_menu_access_at
ORDER BY u.user_id DESC;
```

---

## 9. 감사 조회 쿼리

### 9.1 최근 로그인 이력

```sql
SELECT
    lh.attempted_at,
    lh.login_id_input,
    u.user_name,
    lh.event_type,
    lh.result_status,
    lh.reason_code,
    lh.client_ip,
    lh.user_agent
FROM auth_login_history lh
LEFT JOIN auth_user u
  ON u.user_id = lh.user_id
ORDER BY lh.attempted_at DESC
LIMIT 100;
```

### 9.2 최근 메뉴 접근 이력

```sql
SELECT
    al.accessed_at,
    u.login_id,
    u.user_name,
    al.menu_code,
    al.page_path,
    al.permission_code,
    al.access_result,
    al.client_ip
FROM auth_menu_access_log al
JOIN auth_user u
  ON u.user_id = al.user_id
ORDER BY al.accessed_at DESC
LIMIT 100;
```

### 9.3 비밀번호 초기화 요청 조회

```sql
SELECT
    pr.password_reset_request_id,
    pr.requested_at,
    pr.login_id_input,
    pr.requester_name,
    pr.requester_company,
    pr.requester_email,
    pr.request_status,
    pr.request_reason,
    pr.approved_at,
    approver.user_name AS approved_by_name,
    pr.rejected_at,
    rejector.user_name AS rejected_by_name,
    pr.temp_password_issued_at,
    pr.temp_password_expires_at
FROM auth_password_reset_request pr
LEFT JOIN auth_user approver
  ON approver.user_id = pr.approved_by_user_id
LEFT JOIN auth_user rejector
  ON rejector.user_id = pr.rejected_by_user_id
ORDER BY pr.requested_at DESC
LIMIT 100;
```

---

## 10. PHP 적용 체크리스트

### 10.1 공통 인증/권한 파일

- [ ] `includes/auth.php` 생성
- [ ] `includes/acl.php` 생성
- [ ] `includes/audit.php` 생성
- [ ] `includes/csrf.php` 생성
- [ ] `401.php`, `403.php`, `login.php`, `logout.php` 생성

`includes/auth.php` 책임:

- [ ] 보안 쿠키 옵션 설정 후 `session_start()`
- [ ] 로그인 여부 확인
- [ ] 유휴 만료/절대 만료 확인
- [ ] DB의 `account_status`, `deleted_at`, `acl_version`, `acl_global_version` 재검증
- [ ] 불일치 시 세션 파기 후 재로그인 요구
- [ ] 로그인 직후 `session_regenerate_id(true)` 수행
- [ ] `must_change_password = 1`이면 `changePassword.php`로 강제 이동
- [ ] `must_change_password = 1`이면 다른 메뉴 접근 차단
- [ ] 로그아웃 시 `session_destroy()`와 쿠키 삭제
- [ ] no-store 헤더 적용

`includes/acl.php` 책임:

- [ ] `load_user_permissions()`
- [ ] `load_user_menus()`
- [ ] `has_permission()`
- [ ] `require_permission()`
- [ ] HTML은 `403.php`, API는 JSON 403 처리

`includes/audit.php` 책임:

- [ ] 로그인 성공/실패/로그아웃 로그 기록
- [ ] 페이지/메뉴 접근 로그 기록
- [ ] 허용/거부 결과 기록
- [ ] 비밀번호 초기화 요청/승인/반려/완료 기록
- [ ] `last_login_at`, `last_menu_access_at` 갱신

`includes/csrf.php` 책임:

- [ ] 토큰 생성
- [ ] 토큰 검증
- [ ] 로그인/사용자 CRUD POST 요청에서 강제 사용

### 10.2 페이지별 적용

- [ ] `index.php` -> `PAGE_DASHBOARD`, 섹션 권한 없는 쿼리는 실행하지 않기
- [ ] `channelPerformanceStatus.php` -> `PAGE_CHANNEL_STATUS_LIST`
- [ ] `channelPerformanceStatusView.php` -> `PAGE_CHANNEL_STATUS_VIEW`
- [ ] `contentPerformanceStatus.php` -> `PAGE_CONTENT_STATUS_LIST`
- [ ] `contentPerformanceStatusView.php` -> `PAGE_CONTENT_STATUS_VIEW`
- [ ] `contentPerformanceStatusViewGeneral.php` -> 유지 시 `PAGE_CONTENT_STATUS_VIEW_GENERAL`
- [ ] `ajax_titles.php` -> `API_AJAX_TITLES`
- [ ] `changePassword.php` -> 로그인 사용자 전용, `must_change_password = 1` 처리
- [ ] `passwordResetRequest.php` -> 공개 페이지, 공통 응답 + IP/계정 기준 요청 제한 + 감사 로그
- [ ] `admin/users.php` -> `PAGE_USER_MANAGEMENT`, `SUPER_ADMIN` 전용
- [ ] `admin/userForm.php` -> `PAGE_USER_MANAGEMENT` + 액션 권한 + POST + CSRF, `SUPER_ADMIN` 전용
- [ ] `admin/passwordResetRequests.php` -> `PAGE_USER_MANAGEMENT`, `SUPER_ADMIN` 전용
- [ ] `admin/userAuditLogin.php` -> `PAGE_LOGIN_AUDIT`
- [ ] `admin/userAuditMenuAccess.php` -> `PAGE_MENU_ACCESS_AUDIT`

### 10.3 메뉴 출력

- [ ] 상단 메뉴를 하드코딩에서 DB 기반으로 전환
- [ ] 로그인 후 세션에 `allowed_menus` 저장
- [ ] `includes/head.php` 또는 별도 메뉴 렌더 파일에서 출력

중요:

- 메뉴를 숨기는 것은 UX
- PHP 파일 상단 권한 체크는 보안

둘 다 있어야 합니다.

---

## 11. 서버 차단 체크리스트

- [ ] `/config` 직접 웹 접근 차단
- [ ] `/includes` 직접 웹 접근 차단
- [ ] `*.bak`, `*.zip`, `*.md` 차단
- [ ] 운영에 필요 없는 정적 `*.html` 차단 또는 배포 제외
- [ ] 운영 배포 산출물에서 문서/백업/압축/시안 파일 제외

최소 권장:

- 운영 서버에는 `.php`, `css`, `js`, `img`, `fonts`만 배포

---

## 12. 구현 순서 체크리스트

- [ ] DB 비밀정보를 환경변수/서버 설정으로 이동
- [ ] 앱 전용 MariaDB 계정 생성
- [ ] `auth_*` 테이블 생성
- [ ] 권한/메뉴/역할 데이터 등록
- [ ] 초기 `SUPER_ADMIN` 계정 생성 및 역할 부여
- [ ] 임시 비밀번호 자동 생성기 구현
- [ ] 인증/권한/감사/CSRF 공통 모듈 생성
- [ ] 로그인 실패 잠금 처리 구현
- [ ] 세션 하드닝 구현
- [ ] ACL 버전 비교 구현
- [ ] 최초 로그인 비밀번호 변경 강제 로직 구현
- [ ] `changePassword.php` 구현
- [ ] `passwordResetRequest.php` 공개 요청 페이지 구현
- [ ] 비밀번호 초기화 요청 승인/반려 화면 구현
- [ ] 승인 시 임시 비밀번호 자동 재발급 로직 구현
- [ ] 각 PHP 진입 파일 상단 권한 체크 추가
- [ ] `index.php` 섹션별 쿼리 실행 분기 추가
- [ ] 사용자 CRUD 화면 구현
- [ ] 최근 로그인/최근 메뉴 접근 시각 표시 구현
- [ ] 로그인 감사/메뉴 접근 감사 화면 구현
- [ ] 상단 메뉴를 사용자 메뉴 기반으로 변경
- [ ] 운영 배포에서 `.html`, `.bak`, `.zip`, `.md` 제외
- [ ] 역할별 테스트 계정으로 시나리오 테스트

---

## 13. 테스트 시나리오

- [ ] `SUPER_ADMIN`은 모든 메뉴/페이지/CRUD/감사 화면 접근 가능
- [ ] `SUPER_ADMIN`이 사용자 생성 시 임시 비밀번호가 자동 생성되고 DB에는 해시만 저장됨
- [ ] 생성된 사용자는 첫 로그인 후 `changePassword.php`로 강제 이동됨
- [ ] `CHANNEL_ANALYST`는 채널 TOP20만 보고 콘텐츠 페이지는 403
- [ ] `CONTENT_ANALYST`는 콘텐츠 TOP20만 보고 채널 페이지는 403
- [ ] 사용자 CRUD는 `SUPER_ADMIN`만 가능
- [ ] `AUDITOR`는 감사 화면만 조회 가능하고 CRUD는 불가
- [ ] 미로그인 사용자는 모든 보호 페이지 접근 시 로그인으로 이동
- [ ] 권한 철회 후 다음 요청에서 즉시 세션 무효화 또는 재인증 요구
- [ ] 소프트 삭제된 사용자는 로그인 불가, 감사 로그는 유지
- [ ] 공개 비밀번호 초기화 요청은 항상 동일한 응답 문구를 반환함
- [ ] 비밀번호 초기화 요청 승인 시 새 임시 비밀번호가 자동 발급되고 `must_change_password = 1`이 됨
- [ ] 승인된 사용자도 첫 로그인 후 비밀번호 변경 전에는 다른 메뉴 접근이 차단됨

---

## 14. 현재 프로젝트 기준 최종 권장안

1. 로그인 페이지는 루트 `login.php`에 둡니다.
2. 사용자 관리/감사 화면은 `admin/` 하위로 분리합니다.
3. `includes/auth.php`, `includes/acl.php`, `includes/audit.php`, `includes/csrf.php`를 공통 모듈로 둡니다.
4. 모든 진입 PHP 파일 상단에서 로그인 + 페이지 권한을 먼저 체크합니다.
5. `index.php`는 섹션 권한이 없으면 해당 쿼리도 실행하지 않습니다.
6. 대시보드 관련 역할은 모두 조회 전용이며, 데이터 수정 권한은 두지 않습니다.
7. 사용자 CRUD는 `SUPER_ADMIN`만 수행하게 설계합니다.
8. `SUPER_ADMIN`이 계정을 만들면 시스템이 임시 비밀번호를 자동 생성하고 해시만 저장합니다.
9. 임시 비밀번호 사용자는 최초 로그인 시 `changePassword.php`에서 본인 비밀번호를 반드시 바꾸게 합니다.
10. 외부 업체 비밀번호 초기화는 요청 -> 관리자 승인 -> 임시 비밀번호 재발급 -> 최초 로그인 후 변경 순서로 처리합니다.
11. 사용자 삭제는 `auth_user.deleted_at` 기반 소프트 삭제로만 처리합니다.
12. 로그인 이력은 `auth_login_history`, 메뉴 접근 이력은 `auth_menu_access_log`에 남깁니다.
13. 최근 로그인/최근 메뉴 접근 시각은 `auth_user.last_login_at`, `auth_user.last_menu_access_at`로 별도 유지합니다.
14. 권한 캐시는 `acl_version`, `acl_global_version`으로 즉시 무효화 가능하게 설계합니다.
15. 운영 서버에는 문서/백업/정적 시안 파일을 배포하지 않습니다.
```

---

## 15. 전체 메뉴 이용 플로우

아래 플로우는 이 프로젝트를 실제 사용자가 이용하는 전체 흐름을 메뉴 기준으로 정리한 것입니다.

### A. 공통 진입 플로우

A > 사용자가 `login.php` 접속  
B > 아이디와 비밀번호 입력  
C > 시스템이 계정 상태, 잠금 상태, 비밀번호 해시, 권한 버전, 세션 상태를 검증  
D > 로그인 성공 시 사용자 권한과 메뉴 목록을 세션에 적재  
E > 임시 비밀번호 사용자이면 `changePassword.php`로 강제 이동  
F > 일반 사용자는 권한이 허용된 첫 메뉴 또는 `index.php`로 이동

### B. 최초 로그인 / 임시 비밀번호 플로우

A > `SUPER_ADMIN`이 사용자 계정을 생성  
B > 시스템이 임시 비밀번호를 자동 생성하고 해시만 DB에 저장  
C > 사용자는 전달받은 임시 비밀번호로 로그인  
D > 시스템이 `must_change_password = 1` 상태를 확인  
E > 사용자를 `changePassword.php`로 강제 이동  
F > 사용자가 새 비밀번호를 입력하고 변경 완료  
G > 시스템이 `must_change_password = 0`으로 변경하고 일반 메뉴 접근을 허용

### C. 일반 조회 사용자 플로우

A > 로그인 완료 후 메인 대시보드 진입  
B > 사용자는 본인 권한에 따라 보이는 메뉴만 확인  
C > 대시보드에서 권한이 있는 섹션만 조회  
D > 채널 성과 메뉴 접근 시 `channelPerformanceStatus.php`로 이동  
E > 채널 목록에서 상세 클릭 시 `channelPerformanceStatusView.php` 팝업 조회  
F > 콘텐츠 성과 메뉴 접근 시 `contentPerformanceStatus.php`로 이동  
G > 콘텐츠 목록에서 상세 클릭 시 `contentPerformanceStatusView.php` 팝업 조회  
H > 자동완성은 `ajax_titles.php` 권한이 있는 경우에만 동작  
I > 로그아웃 시 세션 종료

### D. 채널 분석 담당자 플로우

A > 로그인  
B > 대시보드 진입  
C > 채널 TOP20 섹션만 조회 가능  
D > 콘텐츠 TOP20 섹션은 숨김  
E > 채널 성과 목록/상세 메뉴만 접근 가능  
F > 콘텐츠 관련 메뉴 직접 접근 시 403 처리

### E. 콘텐츠 분석 담당자 플로우

A > 로그인  
B > 대시보드 진입  
C > 콘텐츠 TOP20 섹션만 조회 가능  
D > 채널 TOP20 섹션은 숨김  
E > 콘텐츠 성과 목록/상세 메뉴 접근 가능  
F > 필요 시 제목 자동완성 API 사용  
G > 채널 관련 메뉴 직접 접근 시 403 처리

### F. 감사 조회 사용자 플로우

A > 로그인  
B > 본인에게 허용된 감사 메뉴 확인  
C > 로그인 감사 메뉴에서 최근 로그인 성공/실패/잠금/로그아웃 이력 조회  
D > 메뉴 접근 감사 메뉴에서 최근 메뉴 접근/거부 이력 조회  
E > 사용자 CRUD 메뉴는 보이지 않으며 직접 접근 시 403 처리

### G. `SUPER_ADMIN` 사용자 관리 플로우

A > 로그인  
B > 사용자 관리 메뉴 진입  
C > 사용자 목록에서 계정 상태, 역할, 최근 로그인, 최근 메뉴 접근 시각 확인  
D > 신규 사용자 생성  
E > 시스템이 임시 비밀번호를 자동 생성하고 해시만 저장  
F > `SUPER_ADMIN`이 역할 부여  
G > 필요 시 사용자 수정, 잠금 해제, 비밀번호 초기화 승인, 소프트 삭제, 복구 수행  
H > 모든 변경 사항은 감사 로그와 권한 버전 갱신에 반영

### H. 외부 업체 비밀번호 초기화 요청 플로우

A > 외부 업체 사용자가 `passwordResetRequest.php`에서 초기화 요청  
B > 시스템은 계정 존재 여부를 노출하지 않는 동일 응답 반환  
C > 요청은 `REQUESTED` 상태로 저장되고 감사 대상이 됨  
D > `SUPER_ADMIN`이 비밀번호 초기화 요청 관리 화면 진입  
E > 요청 내용을 확인하고 승인 또는 반려  
F > 승인 시 시스템이 새 임시 비밀번호를 자동 생성하고 해시만 저장  
G > 요청 상태는 `APPROVED`로 바뀌고 임시 비밀번호 전달 이력이 남음  
H > 사용자는 새 임시 비밀번호로 로그인  
I > `changePassword.php`에서 본인 비밀번호 변경 후 `COMPLETED` 처리

### I. 권한 차단 / 예외 플로우

A > 사용자가 권한 없는 메뉴 URL 직접 입력  
B > 시스템이 로그인 여부와 권한을 먼저 검사  
C > 비로그인 상태이면 `login.php` 또는 `401.php`로 이동  
D > 로그인 상태지만 권한이 없으면 403 처리  
E > 이 접근 시도는 가능하면 감사 로그에 `DENIED`로 기록