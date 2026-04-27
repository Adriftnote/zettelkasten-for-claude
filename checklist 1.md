---
title: checklist 1
type: note
permalink: zettelkasten/checklist-1
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
- `SUPER_ADMIN` 전용 설정 페이지에서 운영 보안 설정을 관리할 수 있음
- 설정 페이지는 별도 허용 IP 레인지 안에서만 접근 가능함
- 로그인 경고 팝업, 엑셀 다운로드 경고 팝업은 ON/OFF와 문구를 설정 페이지에서 변경할 수 있음
- 엑셀 다운로드 이력과 설정 변경 이력을 누적 저장하고 감사 화면에서 추적할 수 있음
- 설정 페이지에 로그인 차단 IP 목록 관리 영역을 두고, 자동 차단 기준 횟수 설정과 수동 차단/해제를 할 수 있음
- 감사 이력은 비로그인 직접 접근 시도까지 포함하고, 당시 행위자 스냅샷과 레드랙션된 요약값 기준으로 보관함
- 신규 로그인/관리/감사 페이지는 현재 구현되어 있는 페이지의 디자인 톤앤매너를 그대로 따라가며, 별도 디자인 체계를 새로 만들지 않음
- 엑셀 다운로드는 현재 화면의 내용을 클라이언트에서 저장하는 기능으로 두고, 감사는 반드시 적용하며 버튼 노출은 권한에 따라 제어함

핵심 원칙은 아래와 같습니다.

1. 메뉴 노출 제어와 실제 접근 제어를 분리합니다.
2. 모든 진입 PHP 파일에서 서버 측 인증/권한 체크를 합니다.
3. 로그인 보안은 세션, 비밀번호, 잠금, 감사 로그까지 포함합니다.
4. 권한 변경은 즉시 반영되도록 세션 캐시 무효화 기준을 둡니다.
5. 사용자 삭제는 하드 삭제하지 않고 소프트 삭제합니다.
6. 운영 서버에는 불필요한 정적 시안/백업/문서 파일을 배포하지 않습니다.

---

## 0. 호환성 100% / 이슈 0% 목표 적용 원칙

현재 구조에서 구현하기로 한 기능을 붙일 때는 "기존 조회 기능과 기존 데이터는 그대로 두고, 인증/권한/감사 기능만 옆에 추가한다"는 원칙을 강제합니다.

- 기존 성과 데이터 테이블/뷰(`v_channel_follower_summary`, `content_daily_cache`, `v_content_snapshots_raw`, `tt_item_metrics`, `yt_video_metrics`, `channel_daily`, `m_channels`)에는 신규 기능 때문에 `ALTER`, `UPDATE`, `DELETE`를 하지 않음
- 신규 쓰기 작업은 원칙적으로 `auth_*` 테이블에만 수행하고, 가능하면 기존 업무 DB와 분리된 스키마 또는 별도 DB를 사용함
- 기존 페이지 URL, 파일명, 쿼리 파라미터명, 팝업 호출 방식은 유지하고, 각 진입 파일 상단에 인증/권한 체크만 추가함
- 기존 화면의 DOM id/class, 기존 JS에서 참조하는 셀렉터, 기존 엑셀 다운로드 호출 파라미터는 변경하지 않음
- 기존 대시보드 조회 SQL 본문은 수정하지 않고, 권한이 없는 경우에만 서버에서 해당 쿼리 실행을 생략함
- 공통 인증/권한 처리는 `includes/auth.php`, `includes/acl.php`, `includes/audit.php`로 분리하고, 기존 비즈니스 쿼리 파일과 섞지 않음
- 로그인/비밀번호 변경/사용자 CRUD/설정 저장/비밀번호 초기화 승인 같은 보안 중요 기능은 감사 적재 또는 상태 저장 실패 시 `fail-closed`로 중단함
- 읽기 전용 대시보드, 일반 메뉴 조회, 감사 조회 화면은 감사 로그 적재 실패가 발생하더라도 서버 에러 로그를 남기고 화면 렌더링은 유지하는 `fail-open for audit write` 원칙을 적용함
- 배포는 `DB 객체 추가 -> 공통 include 추가 -> 신규 페이지 공개 -> 기존 페이지 보호 적용 -> 설정/감사 세부 기능 활성화` 순서의 단계적 적용을 기본으로 함
- 운영 전환 직후를 대비해 인증 강제 여부, 감사 적재 강제 여부를 설정 또는 서버 구성으로 임시 제어할 수 있게 설계함
- 기존 `comm.css` 기반 톤앤매너는 유지하고, 신규 인증/관리 페이지의 추가 스타일만 별도 CSS로 분리함
- 신규 페이지는 기존 페이지의 레이아웃 밀도, 타이틀 구조, 폼/버튼/테이블 스타일, 팝업 구조를 그대로 따르고, 새로운 색 체계나 과한 UI 효과를 도입하지 않음
- `auth-admin.css` 같은 보조 스타일 파일은 기존 `comm.css`로 표현이 어려운 최소 영역만 보완하고, 기존 클래스와 충돌하지 않게 네임스페이스를 분리함

현재 코드 구조 기준 추가 선행 원칙:

- 현재 루트 페이지와 `/admin` 페이지는 CSS/JS 경로 깊이가 다르므로, 공통 헤드/메뉴를 만들 때는 `asset_prefix`, `base_path`, `url()` 헬퍼 같은 경로 추상화를 먼저 둠
- `includes/head.php`는 지금처럼 루트 기준 자산 경로를 고정한 채 `/admin`에서 재사용하지 않고, `<head>` 자산 출력과 상단 헤더/메뉴 렌더를 분리 가능한 구조로 개편한 뒤 공통화함
- `index.php`, `channelPerformanceStatus.php`, `contentPerformanceStatus.php` 등 기존 페이지가 각자 헤더/메뉴를 다르게 출력하고 있으므로, DB 메뉴 출력 전 먼저 공통 partial 구조를 정리함
- `.btn_excel` 클릭 로직이 페이지마다 흩어져 있으므로, 엑셀 경고 팝업과 다운로드 감사 로그를 붙이기 전에 공통 JS 함수 + 공통 감사 API 호출 방식으로 중앙화함
- `ajax_titles.php`는 현재 성공 응답만 가정하는 자동완성 호출이 여러 화면에 퍼져 있으므로, 권한 체크 적용 전에 공통 실패 처리(`401/403` 시 빈 목록, 재로그인 유도 또는 조용한 종료)를 먼저 추가함
- PHP 보호 적용보다 먼저 `.html`, `.bak`, 시안/백업 파일이 운영에서 노출되지 않도록 배포 제외 또는 웹 차단을 선행함
- 읽기 전용 페이지에는 인증/감사 로직을 주입하되, 기존 GET 파라미터 계약과 팝업 호출 방식(`window.open`, `data-url`)은 그대로 유지하는 방향으로만 수정함

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
├─ ajax_export_download_audit.php
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
│  ├─ userAuditMenuAccess.php
│  ├─ userAuditExportDownload.php
│  ├─ userAuditSettingChange.php
│  └─ settings.php
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

| 파일 | 권한 코드 예시 | 비고 |
|---|---|---|
| `index.php` | `PAGE_DASHBOARD` | 메인 대시보드 |
| `channelPerformanceStatus.php` | `PAGE_CHANNEL_STATUS_LIST` | 채널 목록 팝업 |
| `channelPerformanceStatusView.php` | `PAGE_CHANNEL_STATUS_VIEW` | 채널 상세 팝업 |
| `contentPerformanceStatus.php` | `PAGE_CONTENT_STATUS_LIST` | 콘텐츠 목록 팝업 |
| `contentPerformanceStatusView.php` | `PAGE_CONTENT_STATUS_VIEW` | 콘텐츠 상세 팝업 |
| `contentPerformanceStatusViewGeneral.php` | `PAGE_CONTENT_STATUS_VIEW_GENERAL` | 유지 시 반드시 보호 |
| `ajax_titles.php` | `API_AJAX_TITLES` | 자동완성 API |
| `changePassword.php` | 로그인 사용자 | `must_change_password=1`이면 강제 진입 |
| `admin/users.php` | `PAGE_USER_MANAGEMENT` | 사용자 관리, `SUPER_ADMIN` 전용 |
| `admin/userForm.php` | `PAGE_USER_MANAGEMENT` | 사용자 등록/수정, `SUPER_ADMIN` 전용 |
| `admin/passwordResetRequests.php` | `PAGE_USER_MANAGEMENT` | 비밀번호 초기화 요청 승인/반려, `SUPER_ADMIN` 전용 |
| `admin/userAuditLogin.php` | `PAGE_LOGIN_AUDIT` | 로그인 감사 조회 |
| `admin/userAuditMenuAccess.php` | `PAGE_MENU_ACCESS_AUDIT` | 메뉴 접근 감사 조회 |
| `admin/userAuditExportDownload.php` | `PAGE_EXPORT_DOWNLOAD_AUDIT` | 엑셀 다운로드 감사 조회 |
| `admin/userAuditSettingChange.php` | `PAGE_SYSTEM_SETTING_AUDIT` | 설정 변경 감사 조회 |
| `admin/settings.php` | `PAGE_SYSTEM_SETTINGS` | 운영 설정 관리, `SUPER_ADMIN` 전용 + 허용 IP 레인지 제한 + 로그인 차단 IP 목록 관리 |
| `ajax_export_download_audit.php` | 현재 화면의 `PAGE_*` + `ACTION_EXPORT_*` 검사 후 감사 기록 | 엑셀 다운로드 감사 기록 API |

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
- `PAGE_EXPORT_DOWNLOAD_AUDIT`
- `PAGE_SYSTEM_SETTING_AUDIT`
- `PAGE_SYSTEM_SETTINGS`

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
- `ACTION_EXPORT_CHANNEL_EXCEL`
- `ACTION_EXPORT_CONTENT_EXCEL`
- `ACTION_IP_BLOCK_MANUAL`
- `ACTION_IP_BLOCK_RELEASE`
- `ACTION_SYSTEM_SETTINGS_UPDATE`

엑셀 다운로드 권한 원칙:

- 채널 화면 엑셀 버튼은 현재 화면의 `PAGE_CHANNEL_*` 권한과 `ACTION_EXPORT_CHANNEL_EXCEL`이 있을 때만 노출함
- 콘텐츠 화면 엑셀 버튼은 현재 화면의 `PAGE_CONTENT_*` 권한과 `ACTION_EXPORT_CONTENT_EXCEL`이 있을 때만 노출함
- 현재 구조에서 엑셀은 화면에 렌더된 테이블을 클라이언트에서 저장하는 편의 기능으로 보고, `ACTION_EXPORT_*`는 공식 UI 노출과 감사 흐름 제어 권한으로 사용함
- 따라서 `ACTION_EXPORT_*`는 버튼 노출, 경고 팝업, 감사 기록 기준이며 데이터를 본 사용자의 임의 복사/저장 자체를 완전히 차단하는 보안 경계로 보지는 않음
- 감사 로그에는 다운로드 당시의 페이지 권한 코드와 엑셀 다운로드 권한 코드를 함께 남김

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
- 엑셀 다운로드 감사 -> `/admin/userAuditExportDownload.php`
- 설정 변경 감사 -> `/admin/userAuditSettingChange.php`
- 설정 -> `/admin/settings.php`

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
- [ ] IP 기준 로그인 실패 횟수 집계
- [ ] 설정된 횟수 이상 로그인 실패 시 해당 IP 자동 차단
- [ ] 차단된 IP에서 로그인 시도 시 즉시 차단
- [ ] 로그인 성공/실패/잠금/로그아웃 모두 감사 로그 저장
- [ ] 실패 메시지는 계정 존재 여부를 노출하지 않는 공통 문구 사용
- [ ] 가능하면 IP 기준 추가 제한 적용

권장 기준:

- 5회 실패 시 15분 잠금
- IP 기준 3회 실패 시 차단 여부와 기준 횟수는 설정 페이지에서 변경 가능

### 4.5 CSRF와 상태 변경 요청 보호

- [ ] 로그인 POST에 CSRF 토큰 적용
- [ ] 사용자 등록/수정/삭제/복구/비밀번호 초기화 POST에 CSRF 토큰 적용
- [ ] `changePassword.php`, `admin/passwordResetRequests.php`, `admin/settings.php`, `admin/userForm.php`, `ajax_export_download_audit.php`의 상태 변경 POST/Ajax POST에 CSRF 토큰 적용
- [ ] Ajax POST는 CSRF 토큰 외에 `Origin` 또는 `Referer` 기반 same-origin 검증 추가
- [ ] 상태 변경은 GET 금지, POST 또는 POST+PRG 패턴 사용
- [ ] `SameSite=Lax` 또는 `Strict` 쿠키 정책과 상태 변경 GET 금지 원칙을 함께 유지

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
- [ ] 엑셀 다운로드 이력 테이블 별도 보관
- [ ] 설정 변경 이력 테이블 별도 보관
- [ ] IP 차단 현재 상태 테이블과 차단/해제 이력 테이블을 분리
- [ ] 감사 이벤트에 당시 `actor_login_id`, `actor_user_name` 스냅샷 저장
- [ ] 비로그인 401/403 탐지 요청도 감사 대상에 포함
- [ ] raw `query_string`, raw 필터 JSON, raw 설정 diff 전체 저장 금지
- [ ] 감사 payload는 allowlist 기반 요약값만 저장
- [ ] 민감 필드는 마스킹 또는 제외
- [ ] 요약 문자열 길이 제한 적용
- [ ] 최근 로그인 시각 `last_login_at` 별도 유지
- [ ] 최근 메뉴 접근 시각 `last_menu_access_at` 별도 유지
- [ ] 관리자 감사 화면에서 최근 100건 이상 조회 가능하도록 인덱스 설계

권장 원칙:

- `last_login_at`, `last_menu_access_at`는 최신 상태 요약값으로만 사용
- 실제 감사 추적은 append-only 성격의 history 테이블에서 수행
- 엑셀 다운로드는 사용자, 메뉴, 필터 조건, 건수, 파일명, 시각 기준으로 남김
- 설정 변경은 변경 키, 변경 전/후 값, 변경자, 변경 시각 기준으로 남김
- 현재 사용자 테이블과 조인한 값은 참고용으로만 사용하고, 감사 보고서는 스냅샷 컬럼을 우선 사용
- 익명 접근 시도는 `user_id = NULL` 허용 구조로 저장
- IP 차단 현재 상태는 한 IP/스코프당 1행만 유지하고, 차단/해제 이벤트는 별도 history에 누적

보안 사례:

- 동일 IP가 자동 차단과 수동 차단으로 중복 등록되면 한 건만 해제해도 계속 막히는 문제가 생길 수 있음
- 로그인하지 않은 사용자가 `/admin/settings.php`를 직접 반복 호출해도 현재 사용자 정보가 없다는 이유로 로그가 안 남으면 탐지가 어려움
- 사용자의 `login_id`, `user_name`이 나중에 바뀌면 과거 감사 보고서의 행위자 표시가 바뀌는 문제를 막아야 함
- 쿼리스트링에 토큰, 이메일, 내부 검색어가 섞여 들어오면 raw 저장 자체가 새로운 정보노출 지점이 될 수 있음

### 4.8 설정 페이지 / 운영 팝업 / IP 제한

- [ ] `admin/settings.php`는 `SUPER_ADMIN`만 접근 가능하게 설정
- [ ] `admin/settings.php`는 권한 체크 전에 허용 IP 레인지 검사 수행
- [ ] 설정 페이지 접근 허용 IP는 CIDR 또는 단일 IP 기준으로 저장
- [ ] 설정 페이지 허용 IP 레인지가 없으면 기본 거부로 처리
- [ ] 로그인 차단 기준 횟수 설정 저장
- [ ] 로그인 차단 판정 시간 구간 설정 저장
- [ ] 자동 차단된 IP와 수동 차단된 IP를 구분해서 관리
- [ ] `SUPER_ADMIN`이 특정 IP를 수동 차단할 수 있게 구현
- [ ] 차단 목록에서 IP 차단 해제 가능하게 구현
- [ ] 로그인 경고 팝업 ON/OFF 설정 저장
- [ ] 로그인 경고 팝업 문구 HTML 이스케이프 또는 허용 태그 제한
- [ ] 엑셀 다운로드 경고 팝업 ON/OFF 설정 저장
- [ ] 엑셀 다운로드 경고 팝업 문구 HTML 이스케이프 또는 허용 태그 제한
- [ ] 설정 변경 이력은 감사 로그에 남김

설정 페이지 포함 권장 항목:

- 설정 페이지 접근 허용 IP 레인지 목록
- 로그인 차단 기준 횟수
- 로그인 차단 판정 시간 구간(예: 최근 15분)
- 로그인 차단 IP 목록
- 로그인 경고 팝업 사용 여부
- 로그인 경고 팝업 문구
- 엑셀 다운로드 경고 팝업 사용 여부
- 엑셀 다운로드 경고 팝업 문구

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
12. `auth_system_setting`
13. `auth_ip_allowlist`
14. `auth_export_download_history`
15. `auth_system_setting_history`
16. `auth_ip_blocklist`
17. `auth_ip_block_history`

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
    actor_login_id        VARCHAR(50) NULL,
    actor_user_name       VARCHAR(100) NULL,
    event_type            ENUM('LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT', 'SESSION_EXPIRED', 'ACCOUNT_LOCKED', 'LOGIN_BLOCKED_BY_IP') NOT NULL,
    result_status         ENUM('SUCCESS', 'FAIL', 'BLOCKED') NOT NULL,
    reason_code           VARCHAR(50) NULL,
    client_ip             VARCHAR(45) NULL,
    user_agent            VARCHAR(255) NULL,
    attempted_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (login_history_id),
    KEY ix_auth_login_history_user_time (user_id, attempted_at),
    KEY ix_auth_login_history_login_id_time (login_id_input, attempted_at),
    KEY ix_auth_login_history_ip_time (client_ip, attempted_at),
    CONSTRAINT fk_auth_login_history_user FOREIGN KEY (user_id) REFERENCES auth_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_menu_access_log (
    access_log_id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id               BIGINT UNSIGNED NULL,
    actor_login_id        VARCHAR(50) NULL,
    actor_user_name       VARCHAR(100) NULL,
    menu_id               BIGINT UNSIGNED NULL,
    menu_code             VARCHAR(50) NULL,
    page_path             VARCHAR(255) NOT NULL,
    query_summary         VARCHAR(500) NULL,
    permission_code       VARCHAR(100) NULL,
    access_result         ENUM('ALLOWED', 'DENIED') NOT NULL,
    response_status_code  SMALLINT UNSIGNED NOT NULL DEFAULT 200,
    deny_reason_code      VARCHAR(50) NULL,
    redaction_applied     TINYINT(1) NOT NULL DEFAULT 1,
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

CREATE TABLE auth_system_setting (
    system_setting_id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    setting_key           VARCHAR(100) NOT NULL,
    setting_name          VARCHAR(150) NOT NULL,
    setting_type          ENUM('BOOLEAN', 'TEXT') NOT NULL DEFAULT 'TEXT',
    setting_value         TEXT NULL,
    description           VARCHAR(255) NULL,
    is_active             TINYINT(1) NOT NULL DEFAULT 1,
    updated_by            BIGINT UNSIGNED NULL,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (system_setting_id),
    UNIQUE KEY uq_auth_system_setting_key (setting_key),
    CONSTRAINT fk_auth_system_setting_updated_by FOREIGN KEY (updated_by) REFERENCES auth_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_ip_allowlist (
    ip_allowlist_id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    scope_code            VARCHAR(100) NOT NULL,
    scope_name            VARCHAR(150) NOT NULL,
    ip_version            ENUM('IPV4', 'IPV6') NOT NULL DEFAULT 'IPV4',
    cidr_notation         VARCHAR(100) NOT NULL,
    description           VARCHAR(255) NULL,
    is_active             TINYINT(1) NOT NULL DEFAULT 1,
    created_by            BIGINT UNSIGNED NULL,
    updated_by            BIGINT UNSIGNED NULL,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ip_allowlist_id),
    UNIQUE KEY uq_auth_ip_allowlist_scope_cidr (scope_code, cidr_notation),
    KEY ix_auth_ip_allowlist_scope_active (scope_code, is_active),
    CONSTRAINT fk_auth_ip_allowlist_created_by FOREIGN KEY (created_by) REFERENCES auth_user (user_id),
    CONSTRAINT fk_auth_ip_allowlist_updated_by FOREIGN KEY (updated_by) REFERENCES auth_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_ip_blocklist (
    ip_blocklist_id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    client_ip             VARCHAR(45) NOT NULL,
    ip_version            ENUM('IPV4', 'IPV6') NOT NULL DEFAULT 'IPV4',
    block_type            ENUM('AUTO', 'MANUAL') NOT NULL DEFAULT 'AUTO',
    block_scope           ENUM('LOGIN') NOT NULL DEFAULT 'LOGIN',
    block_reason          VARCHAR(255) NULL,
    threshold_count       INT UNSIGNED NULL,
    failure_count_at_block INT UNSIGNED NULL,
    is_active             TINYINT(1) NOT NULL DEFAULT 1,
    blocked_by_user_id    BIGINT UNSIGNED NULL,
    blocked_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unblocked_by_user_id  BIGINT UNSIGNED NULL,
    unblocked_at          DATETIME NULL,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ip_blocklist_id),
    UNIQUE KEY uq_auth_ip_blocklist_scope_ip (client_ip, block_scope),
    KEY ix_auth_ip_blocklist_ip_active (client_ip, is_active),
    KEY ix_auth_ip_blocklist_blocked_at (blocked_at),
    CONSTRAINT fk_auth_ip_blocklist_blocked_by FOREIGN KEY (blocked_by_user_id) REFERENCES auth_user (user_id),
    CONSTRAINT fk_auth_ip_blocklist_unblocked_by FOREIGN KEY (unblocked_by_user_id) REFERENCES auth_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_ip_block_history (
    ip_block_history_id   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ip_blocklist_id       BIGINT UNSIGNED NULL,
    client_ip             VARCHAR(45) NOT NULL,
    ip_version            ENUM('IPV4', 'IPV6') NOT NULL DEFAULT 'IPV4',
    block_scope           ENUM('LOGIN') NOT NULL DEFAULT 'LOGIN',
    event_type            ENUM('AUTO_BLOCK', 'MANUAL_BLOCK', 'UNBLOCK') NOT NULL,
    block_type            ENUM('AUTO', 'MANUAL') NULL,
    event_reason          VARCHAR(255) NULL,
    threshold_count       INT UNSIGNED NULL,
    failure_count_at_event INT UNSIGNED NULL,
    actor_user_id         BIGINT UNSIGNED NULL,
    actor_login_id        VARCHAR(50) NULL,
    actor_user_name       VARCHAR(100) NULL,
    client_ip_of_actor    VARCHAR(45) NULL,
    user_agent_of_actor   VARCHAR(255) NULL,
    occurred_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ip_block_history_id),
    KEY ix_auth_ip_block_history_ip_time (client_ip, occurred_at),
    KEY ix_auth_ip_block_history_event_time (event_type, occurred_at),
    CONSTRAINT fk_auth_ip_block_history_blocklist FOREIGN KEY (ip_blocklist_id) REFERENCES auth_ip_blocklist (ip_blocklist_id),
    CONSTRAINT fk_auth_ip_block_history_actor FOREIGN KEY (actor_user_id) REFERENCES auth_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_export_download_history (
    export_download_history_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id               BIGINT UNSIGNED NOT NULL,
    actor_login_id        VARCHAR(50) NOT NULL,
    actor_user_name       VARCHAR(100) NOT NULL,
    menu_id               BIGINT UNSIGNED NULL,
    menu_code             VARCHAR(50) NULL,
    export_scope          VARCHAR(50) NOT NULL,
    page_path             VARCHAR(255) NOT NULL,
    page_permission_code  VARCHAR(50) NOT NULL,
    export_permission_code VARCHAR(50) NOT NULL,
    export_type           VARCHAR(50) NOT NULL DEFAULT 'EXCEL',
    file_name             VARCHAR(255) NULL,
    filter_summary        VARCHAR(1000) NULL,
    row_count             INT UNSIGNED NULL,
    download_status       ENUM('SUCCESS', 'FAIL', 'BLOCKED') NOT NULL DEFAULT 'SUCCESS',
    reason_code           VARCHAR(50) NULL,
    redaction_applied     TINYINT(1) NOT NULL DEFAULT 1,
    client_ip             VARCHAR(45) NULL,
    user_agent            VARCHAR(255) NULL,
    downloaded_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (export_download_history_id),
    KEY ix_export_download_user_time (user_id, downloaded_at),
    KEY ix_export_download_menu_time (menu_code, downloaded_at),
    KEY ix_export_download_page_time (page_path, downloaded_at),
    CONSTRAINT fk_export_download_user FOREIGN KEY (user_id) REFERENCES auth_user (user_id),
    CONSTRAINT fk_export_download_menu FOREIGN KEY (menu_id) REFERENCES auth_menu (menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_system_setting_history (
    system_setting_history_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    change_scope          ENUM('SYSTEM_SETTING', 'IP_ALLOWLIST', 'IP_BLOCKLIST') NOT NULL DEFAULT 'SYSTEM_SETTING',
    target_key            VARCHAR(100) NOT NULL,
    target_label          VARCHAR(150) NOT NULL,
    actor_login_id        VARCHAR(50) NOT NULL,
    actor_user_name       VARCHAR(100) NOT NULL,
    before_value_summary  VARCHAR(2000) NULL,
    after_value_summary   VARCHAR(2000) NULL,
    change_reason         VARCHAR(255) NULL,
    redaction_applied     TINYINT(1) NOT NULL DEFAULT 1,
    changed_by_user_id    BIGINT UNSIGNED NOT NULL,
    client_ip             VARCHAR(45) NULL,
    user_agent            VARCHAR(255) NULL,
    changed_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (system_setting_history_id),
    KEY ix_system_setting_history_time (changed_at),
    KEY ix_system_setting_history_target_time (target_key, changed_at),
    KEY ix_system_setting_history_changed_by_time (changed_by_user_id, changed_at),
    CONSTRAINT fk_system_setting_history_changed_by FOREIGN KEY (changed_by_user_id) REFERENCES auth_user (user_id)
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
('PAGE_EXPORT_DOWNLOAD_AUDIT', '엑셀 다운로드 감사 페이지 접근', 'PAGE'),
('PAGE_SYSTEM_SETTING_AUDIT', '설정 변경 감사 페이지 접근', 'PAGE'),
('PAGE_SYSTEM_SETTINGS', '운영 설정 페이지 접근', 'PAGE'),
('ACTION_USER_CREATE', '사용자 생성', 'ACTION'),
('ACTION_USER_UPDATE', '사용자 수정', 'ACTION'),
('ACTION_USER_SOFT_DELETE', '사용자 소프트 삭제', 'ACTION'),
('ACTION_USER_RESTORE', '사용자 복구', 'ACTION'),
('ACTION_USER_ASSIGN_ROLE', '사용자 역할 부여/회수', 'ACTION'),
('ACTION_USER_RESET_PASSWORD', '사용자 비밀번호 초기화', 'ACTION'),
('ACTION_USER_UNLOCK', '잠금 계정 해제', 'ACTION'),
('ACTION_EXPORT_CHANNEL_EXCEL', '채널 화면 엑셀 다운로드 실행', 'ACTION'),
('ACTION_EXPORT_CONTENT_EXCEL', '콘텐츠 화면 엑셀 다운로드 실행', 'ACTION'),
('ACTION_IP_BLOCK_MANUAL', 'IP 수동 차단', 'ACTION'),
('ACTION_IP_BLOCK_RELEASE', '차단 IP 해제', 'ACTION'),
('ACTION_SYSTEM_SETTINGS_UPDATE', '운영 설정 수정', 'ACTION');
```

### 6.2 메뉴 등록

```sql
INSERT INTO auth_menu (menu_code, menu_name, menu_url, parent_menu_id, sort_order) VALUES
('MENU_DASHBOARD', '대시보드', 'index.php', NULL, 10),
('MENU_CHANNEL_STATUS', '채널 성과', 'channelPerformanceStatus.php', NULL, 20),
('MENU_CONTENT_STATUS', '콘텐츠 성과', 'contentPerformanceStatus.php', NULL, 30),
('MENU_USER_MANAGEMENT', '사용자 관리', 'admin/users.php', NULL, 80),
('MENU_LOGIN_AUDIT', '로그인 감사', 'admin/userAuditLogin.php', NULL, 90),
('MENU_MENU_ACCESS_AUDIT', '메뉴 접근 감사', 'admin/userAuditMenuAccess.php', NULL, 100),
('MENU_EXPORT_DOWNLOAD_AUDIT', '엑셀 다운로드 감사', 'admin/userAuditExportDownload.php', NULL, 110),
('MENU_SYSTEM_SETTING_AUDIT', '설정 변경 감사', 'admin/userAuditSettingChange.php', NULL, 120),
('MENU_SYSTEM_SETTINGS', '설정', 'admin/settings.php', NULL, 130);
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
 OR (m.menu_code = 'MENU_MENU_ACCESS_AUDIT' AND p.permission_code = 'PAGE_MENU_ACCESS_AUDIT')
 OR (m.menu_code = 'MENU_EXPORT_DOWNLOAD_AUDIT' AND p.permission_code = 'PAGE_EXPORT_DOWNLOAD_AUDIT')
 OR (m.menu_code = 'MENU_SYSTEM_SETTING_AUDIT' AND p.permission_code = 'PAGE_SYSTEM_SETTING_AUDIT')
 OR (m.menu_code = 'MENU_SYSTEM_SETTINGS' AND p.permission_code = 'PAGE_SYSTEM_SETTINGS');
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

### 6.6 시스템 설정 초기값

```sql
INSERT INTO auth_system_setting (
    setting_key, setting_name, setting_type, setting_value, description
) VALUES
('LOGIN_IP_BLOCK_THRESHOLD', '로그인 IP 자동 차단 기준 횟수', 'TEXT', '3', '설정된 횟수 이상 로그인 실패 시 해당 IP를 차단'),
('LOGIN_IP_BLOCK_WINDOW_MINUTES', '로그인 IP 자동 차단 판정 시간 구간(분)', 'TEXT', '15', '최근 지정 분 이내 로그인 실패 횟수를 기준으로 자동 차단'),
('LOGIN_WARNING_POPUP_ENABLED', '로그인 경고 팝업 사용 여부', 'BOOLEAN', '0', '로그인 직후 경고 팝업 노출 여부'),
('LOGIN_WARNING_POPUP_MESSAGE', '로그인 경고 팝업 문구', 'TEXT', '본 시스템은 승인된 사용자만 이용할 수 있으며 모든 접속은 기록됩니다.', '로그인 성공 시 노출할 경고 문구'),
('EXCEL_DOWNLOAD_WARNING_ENABLED', '엑셀 다운로드 경고 팝업 사용 여부', 'BOOLEAN', '1', '엑셀 다운로드 전 경고 팝업 노출 여부'),
('EXCEL_DOWNLOAD_WARNING_MESSAGE', '엑셀 다운로드 경고 팝업 문구', 'TEXT', '다운로드한 파일은 외부 공유를 금지하며 보안 정책에 따라 관리해야 합니다.', '엑셀 다운로드 전 노출할 경고 문구');
```

```sql
INSERT INTO auth_ip_allowlist (
    scope_code, scope_name, ip_version, cidr_notation, description, created_by, updated_by
) VALUES
('PAGE_SYSTEM_SETTINGS', '설정 페이지 접근 허용 IP', 'IPV4', '10.0.0.0/8', '사내망 허용 예시', 1, 1),
('PAGE_SYSTEM_SETTINGS', '설정 페이지 접근 허용 IP', 'IPV4', '192.168.0.0/16', '관리망 허용 예시', 1, 1);
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
WHERE r.role_code = 'CHANNEL_ANALYST'
  AND p.permission_code IN (
      'ACTION_EXPORT_CHANNEL_EXCEL'
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
WHERE r.role_code = 'CONTENT_ANALYST'
  AND p.permission_code IN (
      'ACTION_EXPORT_CONTENT_EXCEL'
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
      'PAGE_MENU_ACCESS_AUDIT',
      'PAGE_EXPORT_DOWNLOAD_AUDIT',
      'PAGE_SYSTEM_SETTING_AUDIT'
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

### 7.0 로그인 전 IP 차단 여부 검사

```sql
SELECT
    ip_blocklist_id,
    client_ip,
    block_type,
    block_reason,
    blocked_at
FROM auth_ip_blocklist
WHERE client_ip = :client_ip
  AND block_scope = 'LOGIN'
  AND is_active = 1
ORDER BY ip_blocklist_id DESC
LIMIT 1;
```

차단된 IP인 경우:

- 사용자 조회 전에 로그인 시도를 차단
- 공통 실패 문구 반환
- `auth_login_history`에 `LOGIN_BLOCKED_BY_IP` 이벤트 저장

```sql
INSERT INTO auth_login_history (
    user_id, login_id_input, actor_login_id, actor_user_name,
    event_type, result_status, reason_code, client_ip, user_agent
) VALUES (
    NULL, :login_id_input, NULL, NULL,
    'LOGIN_BLOCKED_BY_IP', 'BLOCKED', 'IP_BLOCKED', :client_ip, :user_agent
);
```

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
    user_id, login_id_input, actor_login_id, actor_user_name,
    event_type, result_status, reason_code, client_ip, user_agent
) VALUES (
    :user_id, :login_id_input, :actor_login_id, :actor_user_name,
    'LOGIN_SUCCESS', 'SUCCESS', NULL, :client_ip, :user_agent
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
    user_id, login_id_input, actor_login_id, actor_user_name,
    event_type, result_status, reason_code, client_ip, user_agent
) VALUES (
    :user_id, :login_id_input, :actor_login_id, :actor_user_name,
    'LOGIN_FAILURE', 'FAIL', :reason_code, :client_ip, :user_agent
);
```

공통 실패 메시지 예시:

- "로그인 정보가 올바르지 않거나 계정이 잠겨 있습니다."

### 7.3-1 IP 실패 횟수 집계 및 자동 차단

설정값:

- `LOGIN_IP_BLOCK_THRESHOLD`
- `LOGIN_IP_BLOCK_WINDOW_MINUTES`

```sql
SELECT COUNT(*) AS failed_count
FROM auth_login_history
WHERE client_ip = :client_ip
  AND event_type = 'LOGIN_FAILURE'
  AND attempted_at >= :window_started_at;
```

```sql
INSERT INTO auth_ip_blocklist (
    client_ip,
    ip_version,
    block_type,
    block_scope,
    block_reason,
    threshold_count,
    failure_count_at_block,
    is_active,
    blocked_by_user_id,
    blocked_at
) VALUES (
    :client_ip,
    :ip_version,
    'AUTO',
    'LOGIN',
    'LOGIN_FAILURE_THRESHOLD',
    :threshold_count,
    :failure_count_at_block,
    1,
    NULL,
    NOW()
) ON DUPLICATE KEY UPDATE
    ip_version = VALUES(ip_version),
    block_type = VALUES(block_type),
    block_reason = VALUES(block_reason),
    threshold_count = VALUES(threshold_count),
    failure_count_at_block = VALUES(failure_count_at_block),
    is_active = 1,
    blocked_by_user_id = NULL,
    blocked_at = NOW(),
    unblocked_by_user_id = NULL,
    unblocked_at = NULL,
    updated_at = NOW();
```

```sql
INSERT INTO auth_ip_block_history (
    ip_blocklist_id, client_ip, ip_version, block_scope, event_type, block_type,
    event_reason, threshold_count, failure_count_at_event,
    actor_user_id, actor_login_id, actor_user_name, client_ip_of_actor, user_agent_of_actor
) VALUES (
    :ip_blocklist_id, :client_ip, :ip_version, 'LOGIN', 'AUTO_BLOCK', 'AUTO',
    'LOGIN_FAILURE_THRESHOLD', :threshold_count, :failure_count_at_event,
    NULL, NULL, NULL, :client_ip, :user_agent
);
```

자동 차단 원칙:

- 최근 설정 시간 구간 내 실패 횟수가 기준 횟수 이상이면 자동 차단
- 이미 `is_active = 1`인 동일 IP 차단 레코드가 있으면 중복 생성하지 않음
- 자동 차단도 차단 목록에서 `SUPER_ADMIN`이 수동 해제 가능하게 함

### 7.3-2 공개 비밀번호 초기화 요청 생성

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

메뉴 URL 원칙:

- `auth_menu.menu_url`에는 leading slash 없는 앱 상대경로만 저장
- 실제 링크 출력 시에는 `build_app_url($menu_path)`로 현재 배포 prefix를 붙여 렌더
- 예: DB 저장값 `admin/users.php` -> 렌더 결과 `/MOT/admin/users.php` 또는 `/admin/users.php`

### 7.7 메뉴 접근 로그 기록

```sql
INSERT INTO auth_menu_access_log (
    user_id, actor_login_id, actor_user_name,
    menu_id, menu_code, page_path, query_summary, permission_code,
    access_result, response_status_code, deny_reason_code, redaction_applied,
    http_method, client_ip, user_agent
) VALUES (
    :user_id, :actor_login_id, :actor_user_name,
    :menu_id, :menu_code, :page_path, :query_summary, :permission_code,
    :access_result, :response_status_code, :deny_reason_code, 1,
    :http_method, :client_ip, :user_agent
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
- 미로그인/세션만료 접근은 `user_id = NULL`로 기록 가능해야 함
- `query_summary`는 allowlist된 키만 저장하고 토큰/자유입력 전문은 저장하지 않음
- CSS/JS/IMG 요청은 기록 대상에서 제외

### 7.8 운영 설정 / 허용 IP 조회

```sql
SELECT
    setting_key,
    setting_type,
    setting_value
FROM auth_system_setting
WHERE is_active = 1
  AND setting_key IN (
      'LOGIN_IP_BLOCK_THRESHOLD',
      'LOGIN_IP_BLOCK_WINDOW_MINUTES',
      'LOGIN_WARNING_POPUP_ENABLED',
      'LOGIN_WARNING_POPUP_MESSAGE',
      'EXCEL_DOWNLOAD_WARNING_ENABLED',
      'EXCEL_DOWNLOAD_WARNING_MESSAGE'
  );
```

```sql
SELECT
    cidr_notation
FROM auth_ip_allowlist
WHERE scope_code = 'PAGE_SYSTEM_SETTINGS'
  AND is_active = 1
ORDER BY ip_allowlist_id ASC;
```

```sql
SELECT
    ip_blocklist_id,
    client_ip,
    ip_version,
    block_type,
    block_reason,
    threshold_count,
    failure_count_at_block,
    blocked_at,
    unblocked_at,
    is_active
FROM auth_ip_blocklist
WHERE block_scope = 'LOGIN'
ORDER BY is_active DESC, blocked_at DESC, ip_blocklist_id DESC;
```

적용 원칙:

- 로그인 페이지에서 먼저 차단 IP 여부 확인
- 로그인 실패 횟수는 설정된 시간 구간과 기준 횟수로 판정
- 설정 페이지에서 차단 IP 목록 조회, 수동 차단, 수동 해제 수행
- 로그인 성공 후 `LOGIN_WARNING_POPUP_ENABLED = 1`이면 경고 팝업 출력
- 엑셀 다운로드 버튼 클릭 전 `EXCEL_DOWNLOAD_WARNING_ENABLED = 1`이면 경고 팝업 출력
- `admin/settings.php`는 현재 접속 IP가 허용 CIDR 목록에 포함될 때만 진입 허용

### 7.9 엑셀 다운로드 로그 기록

```sql
INSERT INTO auth_export_download_history (
    user_id, actor_login_id, actor_user_name,
    menu_id, menu_code, export_scope, page_path,
    page_permission_code, export_permission_code,
    export_type, file_name,
    filter_summary, row_count, download_status, reason_code,
    redaction_applied, client_ip, user_agent
) VALUES (
    :user_id, :actor_login_id, :actor_user_name,
    :menu_id, :menu_code, :export_scope, :page_path,
    :page_permission_code, :export_permission_code,
    'EXCEL', :file_name,
    :filter_summary, :row_count, :download_status, :reason_code,
    1, :client_ip, :user_agent
);
```

기록 원칙:

- 실제 파일 다운로드 성공 시 `SUCCESS`
- 권한 부족, 팝업 미동의, 예외 발생 시 `BLOCKED` 또는 `FAIL`
- 클라이언트의 `requestExcelExport()`가 `ajax_export_download_audit.php`로 현재 페이지 권한과 엑셀 버튼 노출 권한을 검증/기록한 뒤 `XLSX.writeFile()`을 호출
- 채널 화면은 `PAGE_CHANNEL_*` + `ACTION_EXPORT_CHANNEL_EXCEL` 조합으로 공식 버튼 노출/감사 여부를 결정
- 콘텐츠 화면은 `PAGE_CONTENT_*` + `ACTION_EXPORT_CONTENT_EXCEL` 조합으로 공식 버튼 노출/감사 여부를 결정
- 필터 조건은 allowlist된 필드만 요약 저장
- 메뉴 없는 직접 호출이면 `menu_id`, `menu_code`는 NULL 허용

### 7.10 설정 변경 이력 기록

```sql
INSERT INTO auth_system_setting_history (
    change_scope, target_key, target_label,
    actor_login_id, actor_user_name,
    before_value_summary, after_value_summary,
    change_reason, redaction_applied, changed_by_user_id, client_ip, user_agent
) VALUES (
    :change_scope, :target_key, :target_label,
    :actor_login_id, :actor_user_name,
    :before_value_summary, :after_value_summary,
    :change_reason, 1, :changed_by_user_id, :client_ip, :user_agent
);
```

기록 원칙:

- 일반 설정 변경은 `change_scope = 'SYSTEM_SETTING'`
- 허용 IP 레인지 변경은 `change_scope = 'IP_ALLOWLIST'`
- IP 차단 현재 상태 변경은 `change_scope = 'IP_BLOCKLIST'`
- 변경 전/후 값은 요약 문자열 또는 제한된 JSON만 저장
- 설정 저장 성공 후 개별 변경 항목 단위로 이력 적재
- 비밀번호, 토큰, 전체 원문 쿼리스트링은 저장 금지

---

## 8. 사용자 CRUD / 운영 설정 쿼리

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

### 8.11 운영 설정 저장

```sql
INSERT INTO auth_system_setting (
    setting_key, setting_name, setting_type, setting_value, description, updated_by
) VALUES
('LOGIN_IP_BLOCK_THRESHOLD', '로그인 IP 자동 차단 기준 횟수', 'TEXT', :login_ip_block_threshold, '설정된 횟수 이상 로그인 실패 시 해당 IP를 차단', :admin_user_id),
('LOGIN_IP_BLOCK_WINDOW_MINUTES', '로그인 IP 자동 차단 판정 시간 구간(분)', 'TEXT', :login_ip_block_window_minutes, '최근 지정 분 이내 로그인 실패 횟수를 기준으로 자동 차단', :admin_user_id),
('LOGIN_WARNING_POPUP_ENABLED', '로그인 경고 팝업 사용 여부', 'BOOLEAN', :login_warning_enabled, '로그인 성공 시 경고 팝업 노출 여부', :admin_user_id),
('LOGIN_WARNING_POPUP_MESSAGE', '로그인 경고 팝업 문구', 'TEXT', :login_warning_message, '로그인 성공 시 노출할 경고 문구', :admin_user_id),
('EXCEL_DOWNLOAD_WARNING_ENABLED', '엑셀 다운로드 경고 팝업 사용 여부', 'BOOLEAN', :excel_warning_enabled, '엑셀 다운로드 전 경고 팝업 노출 여부', :admin_user_id),
('EXCEL_DOWNLOAD_WARNING_MESSAGE', '엑셀 다운로드 경고 팝업 문구', 'TEXT', :excel_warning_message, '엑셀 다운로드 전 노출할 경고 문구', :admin_user_id)
ON DUPLICATE KEY UPDATE
    setting_value = VALUES(setting_value),
    updated_by = VALUES(updated_by),
    updated_at = NOW(),
    is_active = 1;
```

저장 로직:

1. `SUPER_ADMIN`이 설정 페이지 저장 요청
2. `ACTION_SYSTEM_SETTINGS_UPDATE` 권한 확인
3. IP 자동 차단 기준 횟수와 판정 시간 구간은 숫자 범위 검증
4. 팝업 ON/OFF 값은 `0/1`로 정규화
5. 문구는 길이 제한, 허용 태그 제한, 서버 측 이스케이프 적용
6. 각 설정 키별 변경 전/후 값을 `auth_system_setting_history`에 기록

설정 변경 이력 예시:

```sql
INSERT INTO auth_system_setting_history (
    change_scope, target_key, target_label,
    actor_login_id, actor_user_name,
    before_value_summary, after_value_summary,
    change_reason, redaction_applied, changed_by_user_id, client_ip, user_agent
) VALUES (
    'SYSTEM_SETTING',
    'EXCEL_DOWNLOAD_WARNING_MESSAGE',
    '엑셀 다운로드 경고 팝업 문구',
    :actor_login_id,
    :actor_user_name,
    :before_value_summary,
    :after_value_summary,
    :change_reason,
    1,
    :admin_user_id,
    :client_ip,
    :user_agent
);
```

### 8.12 로그인 IP 자동 차단 정책 저장

```sql
INSERT INTO auth_system_setting (
    setting_key, setting_name, setting_type, setting_value, description, updated_by
) VALUES
('LOGIN_IP_BLOCK_THRESHOLD', '로그인 IP 자동 차단 기준 횟수', 'TEXT', :login_ip_block_threshold, '설정된 횟수 이상 로그인 실패 시 해당 IP를 차단', :admin_user_id),
('LOGIN_IP_BLOCK_WINDOW_MINUTES', '로그인 IP 자동 차단 판정 시간 구간(분)', 'TEXT', :login_ip_block_window_minutes, '최근 지정 분 이내 로그인 실패 횟수를 기준으로 자동 차단', :admin_user_id)
ON DUPLICATE KEY UPDATE
    setting_value = VALUES(setting_value),
    updated_by = VALUES(updated_by),
    updated_at = NOW(),
    is_active = 1;
```

정책 저장 원칙:

1. 기준 횟수 예시: `3`
2. 판정 시간 구간 예시: `15분`
3. 설정값 변경 시 다음 로그인 실패부터 새 기준 적용
4. 변경 전/후 값은 `auth_system_setting_history`에 기록

### 8.13 차단 IP 수동 등록

```sql
INSERT INTO auth_ip_blocklist (
    client_ip,
    ip_version,
    block_type,
    block_scope,
    block_reason,
    threshold_count,
    failure_count_at_block,
    is_active,
    blocked_by_user_id,
    blocked_at
) VALUES (
    :client_ip,
    :ip_version,
    'MANUAL',
    'LOGIN',
    :block_reason,
    NULL,
    NULL,
    1,
    :admin_user_id,
    NOW()
) ON DUPLICATE KEY UPDATE
    ip_version = VALUES(ip_version),
    block_type = 'MANUAL',
    block_reason = VALUES(block_reason),
    threshold_count = NULL,
    failure_count_at_block = NULL,
    is_active = 1,
    blocked_by_user_id = VALUES(blocked_by_user_id),
    blocked_at = NOW(),
    unblocked_by_user_id = NULL,
    unblocked_at = NULL,
    updated_at = NOW();
```

```sql
INSERT INTO auth_ip_block_history (
    ip_blocklist_id, client_ip, ip_version, block_scope, event_type, block_type,
    event_reason, threshold_count, failure_count_at_event,
    actor_user_id, actor_login_id, actor_user_name, client_ip_of_actor, user_agent_of_actor
) VALUES (
    :ip_blocklist_id, :target_client_ip, :target_ip_version, 'LOGIN', 'MANUAL_BLOCK', 'MANUAL',
    :change_reason, NULL, NULL,
    :admin_user_id,
    :actor_login_id,
    :actor_user_name,
    :client_ip,
    :user_agent
);
```

```sql
INSERT INTO auth_system_setting_history (
    change_scope, target_key, target_label,
    actor_login_id, actor_user_name,
    before_value_summary, after_value_summary,
    change_reason, redaction_applied, changed_by_user_id, client_ip, user_agent
) VALUES (
    'IP_BLOCKLIST',
    :target_key,
    '로그인 차단 IP 목록',
    :actor_login_id,
    :actor_user_name,
    :before_value_summary,
    :after_value_summary,
    :change_reason,
    1,
    :admin_user_id,
    :client_ip,
    :user_agent
);
```

수동 차단 원칙:

1. `ACTION_IP_BLOCK_MANUAL` 권한 확인
2. 이미 활성 차단된 IP는 중복 등록하지 않음
3. 수동 차단 사유를 필수로 남기는 것을 권장

### 8.14 차단 IP 해제

```sql
UPDATE auth_ip_blocklist
SET is_active = 0,
    unblocked_by_user_id = :admin_user_id,
    unblocked_at = NOW(),
    updated_at = NOW()
WHERE ip_blocklist_id = :ip_blocklist_id
  AND is_active = 1;
```

```sql
INSERT INTO auth_ip_block_history (
    ip_blocklist_id, client_ip, ip_version, block_scope, event_type, block_type,
    event_reason, threshold_count, failure_count_at_event,
    actor_user_id, actor_login_id, actor_user_name, client_ip_of_actor, user_agent_of_actor
) VALUES (
    :ip_blocklist_id, :target_client_ip, :target_ip_version, 'LOGIN', 'UNBLOCK', :previous_block_type,
    :change_reason, :previous_threshold_count, :previous_failure_count_at_block,
    :admin_user_id,
    :actor_login_id,
    :actor_user_name,
    :client_ip,
    :user_agent
);
```

```sql
INSERT INTO auth_system_setting_history (
    change_scope, target_key, target_label,
    actor_login_id, actor_user_name,
    before_value_summary, after_value_summary,
    change_reason, redaction_applied, changed_by_user_id, client_ip, user_agent
) VALUES (
    'IP_BLOCKLIST',
    :target_key,
    '로그인 차단 IP 목록',
    :actor_login_id,
    :actor_user_name,
    :before_value_summary,
    :after_value_summary,
    :change_reason,
    1,
    :admin_user_id,
    :client_ip,
    :user_agent
);
```

해제 원칙:

1. `ACTION_IP_BLOCK_RELEASE` 권한 확인
2. 자동 차단/수동 차단 모두 같은 목록에서 해제 가능
3. 해제 이력과 해제 주체를 남김

### 8.15 설정 페이지 허용 IP 레인지 저장

```sql
UPDATE auth_ip_allowlist
SET is_active = 0,
    updated_by = :admin_user_id,
    updated_at = NOW()
WHERE scope_code = 'PAGE_SYSTEM_SETTINGS'
  AND is_active = 1;
```

```sql
INSERT INTO auth_ip_allowlist (
    scope_code, scope_name, ip_version, cidr_notation, description, is_active, created_by, updated_by
) VALUES
    ('PAGE_SYSTEM_SETTINGS', '설정 페이지 접근 허용 IP', :ip_version_1, :cidr_1, :description_1, 1, :admin_user_id, :admin_user_id)
ON DUPLICATE KEY UPDATE
    is_active = 1,
    description = VALUES(description),
    updated_by = VALUES(updated_by),
    updated_at = NOW();
```

저장 로직:

1. 저장 전 CIDR 형식 검증
2. IPv4/IPv6 분리 검증
3. 공백/중복 레인지 제거
4. 변경 전/후 허용 목록은 레드랙션된 요약값 또는 제한된 JSON으로만 기록
5. 저장 완료 후 `admin/settings.php` 진입 시 새 목록으로 즉시 검사
6. 현재 접속 IP가 새 허용 목록 밖이면 다음 요청부터 차단될 수 있으므로 저장 전 경고 문구 표시

허용 IP 변경 이력 예시:

```sql
INSERT INTO auth_system_setting_history (
    change_scope, target_key, target_label,
    actor_login_id, actor_user_name,
    before_value_summary, after_value_summary,
    change_reason, redaction_applied, changed_by_user_id, client_ip, user_agent
) VALUES (
    'IP_ALLOWLIST',
    'PAGE_SYSTEM_SETTINGS',
    '설정 페이지 접근 허용 IP',
    :actor_login_id,
    :actor_user_name,
    :before_value_summary,
    :after_value_summary,
    :change_reason,
    1,
    :admin_user_id,
    :client_ip,
    :user_agent
);
```

### 8.16 엑셀 다운로드 실행 이력 저장

```sql
INSERT INTO auth_export_download_history (
    user_id, actor_login_id, actor_user_name,
    menu_id, menu_code, export_scope, page_path,
    page_permission_code, export_permission_code,
    export_type, file_name,
    filter_summary, row_count, download_status, reason_code,
    redaction_applied, client_ip, user_agent
) VALUES (
    :user_id, :actor_login_id, :actor_user_name,
    :menu_id, :menu_code, :export_scope, :page_path,
    :page_permission_code, :export_permission_code,
    'EXCEL', :file_name,
    :filter_summary, :row_count, 'SUCCESS', NULL,
    1, :client_ip, :user_agent
);
```

다운로드 이력 저장 원칙:

1. 사용자가 `Excel` 버튼을 누르면 `requestExcelExport()`가 먼저 `ajax_export_download_audit.php`를 호출
2. 서버는 현재 페이지 권한과 엑셀 버튼 노출 권한을 확인하고 `SUCCESS`, `BLOCKED`, `FAIL` 중 하나로 기록
3. 조건 검색값은 `filter_summary`에 allowlist 기준으로만 남김
4. 결과 행 수는 `row_count`에 남김
5. 감사 화면에서는 `page_permission_code`와 `export_permission_code`를 같이 보여 "볼 수는 있었지만 버튼은 숨겨진 대상" 또는 "공식 UI 흐름 밖 호출" 사례를 구분할 수 있어야 함

---

## 9. 감사 조회 쿼리

### 9.1 최근 로그인 이력

```sql
SELECT
    lh.attempted_at,
    lh.login_id_input,
    COALESCE(lh.actor_login_id, lh.login_id_input) AS actor_login_id,
    COALESCE(lh.actor_user_name, u.user_name) AS actor_user_name,
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
    COALESCE(al.actor_login_id, u.login_id, 'ANONYMOUS') AS actor_login_id,
    COALESCE(al.actor_user_name, u.user_name, '익명 접근') AS actor_user_name,
    al.menu_code,
    al.page_path,
    al.permission_code,
    al.access_result,
    al.response_status_code,
    al.deny_reason_code,
    al.client_ip
FROM auth_menu_access_log al
LEFT JOIN auth_user u
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

### 9.4 최근 엑셀 다운로드 이력

```sql
SELECT
    eh.downloaded_at,
    eh.actor_login_id,
    eh.actor_user_name,
    eh.menu_code,
    eh.export_scope,
    eh.page_path,
    eh.page_permission_code,
    eh.export_permission_code,
    eh.file_name,
    eh.row_count,
    eh.download_status,
    eh.client_ip
FROM auth_export_download_history eh
ORDER BY eh.downloaded_at DESC
LIMIT 100;
```

### 9.5 최근 설정 변경 이력

```sql
SELECT
    sh.changed_at,
    sh.change_scope,
    sh.target_key,
    sh.target_label,
    sh.actor_login_id,
    sh.actor_user_name,
    sh.before_value_summary,
    sh.after_value_summary,
    sh.change_reason,
    sh.client_ip
FROM auth_system_setting_history sh
ORDER BY sh.changed_at DESC
LIMIT 100;
```

### 9.6 현재 차단 IP 목록 조회

```sql
SELECT
    b.ip_blocklist_id,
    b.client_ip,
    b.ip_version,
    b.block_type,
    b.block_reason,
    b.threshold_count,
    b.failure_count_at_block,
    b.is_active,
    b.blocked_at,
    blocker.user_name AS blocked_by_name,
    b.unblocked_at,
    unblocker.user_name AS unblocked_by_name
FROM auth_ip_blocklist b
LEFT JOIN auth_user blocker
  ON blocker.user_id = b.blocked_by_user_id
LEFT JOIN auth_user unblocker
  ON unblocker.user_id = b.unblocked_by_user_id
WHERE b.block_scope = 'LOGIN'
ORDER BY b.is_active DESC, b.blocked_at DESC, b.ip_blocklist_id DESC
LIMIT 200;
```

### 9.7 최근 IP 차단/해제 이력

```sql
SELECT
    bh.occurred_at,
    bh.client_ip,
    bh.event_type,
    bh.block_type,
    bh.event_reason,
    bh.threshold_count,
    bh.failure_count_at_event,
    COALESCE(bh.actor_login_id, 'SYSTEM') AS actor_login_id,
    COALESCE(bh.actor_user_name, '시스템 자동 처리') AS actor_user_name,
    bh.client_ip_of_actor
FROM auth_ip_block_history bh
ORDER BY bh.occurred_at DESC
LIMIT 200;
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
- [ ] 로그인 처리 전 차단 IP 여부 검사
- [ ] 로그인 여부 확인
- [ ] 유휴 만료/절대 만료 확인
- [ ] DB의 `account_status`, `deleted_at`, `acl_version`, `acl_global_version` 재검증
- [ ] 불일치 시 세션 파기 후 재로그인 요구
- [ ] 로그인 직후 `session_regenerate_id(true)` 수행
- [ ] `must_change_password = 1`이면 `changePassword.php`로 강제 이동
- [ ] `must_change_password = 1`이면 다른 메뉴 접근 차단
- [ ] `admin/settings.php` 요청이면 허용 IP 레인지 검사
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
- [ ] 엑셀 다운로드 실행 로그 기록
- [ ] IP 자동 차단/수동 차단/해제 이력 기록
- [ ] 허용/거부 결과 기록
- [ ] 비밀번호 초기화 요청/승인/반려/완료 기록
- [ ] 운영 설정 변경 기록
- [ ] 감사 이벤트마다 `actor_login_id`, `actor_user_name` 스냅샷 저장
- [ ] 미로그인/세션만료/익명 401/403 요청도 기록
- [ ] 로그 payload는 allowlist + redaction 적용 후 요약값만 저장
- [ ] `last_login_at`, `last_menu_access_at` 갱신

`includes/csrf.php` 책임:

- [ ] 토큰 생성
- [ ] 토큰 검증
- [ ] 로그인/사용자 CRUD/비밀번호 변경/설정 저장/승인/반려/Ajax 감사 기록 POST 요청에서 강제 사용
- [ ] Ajax POST는 토큰 검증 외에 `Origin` 또는 `Referer` same-origin 검증 수행

### 10.2 페이지별 적용

- [ ] `login.php` -> 차단 IP 검사 + CSRF + 공통 실패 메시지
- [ ] `401.php`, `403.php` 진입 또는 반환 시 익명/인증실패 접근 로그 남기기
- [ ] `index.php` -> `PAGE_DASHBOARD`, 섹션 권한 없는 쿼리는 실행하지 않기
- [ ] `channelPerformanceStatus.php` -> `PAGE_CHANNEL_STATUS_LIST`
- [ ] `channelPerformanceStatusView.php` -> `PAGE_CHANNEL_STATUS_VIEW`
- [ ] `contentPerformanceStatus.php` -> `PAGE_CONTENT_STATUS_LIST`
- [ ] `contentPerformanceStatusView.php` -> `PAGE_CONTENT_STATUS_VIEW`
- [ ] `contentPerformanceStatusViewGeneral.php` -> 유지 시 `PAGE_CONTENT_STATUS_VIEW_GENERAL`
- [ ] `ajax_titles.php` -> `API_AJAX_TITLES`
- [ ] `ajax_export_download_audit.php` -> 현재 화면의 `PAGE_*` + 대응 `ACTION_EXPORT_*` 검사 후 감사 기록 + POST + CSRF + same-origin 검증
- [ ] `changePassword.php` -> 로그인 사용자 전용, `must_change_password = 1` 처리 + POST + CSRF
- [ ] `passwordResetRequest.php` -> 공개 페이지, 공통 응답 + IP/계정 기준 요청 제한 + 감사 로그
- [ ] `admin/users.php` -> `PAGE_USER_MANAGEMENT`, `SUPER_ADMIN` 전용
- [ ] `admin/userForm.php` -> `PAGE_USER_MANAGEMENT` + 액션 권한 + POST + CSRF, `SUPER_ADMIN` 전용
- [ ] `admin/passwordResetRequests.php` -> `PAGE_USER_MANAGEMENT`, `SUPER_ADMIN` 전용 + POST + CSRF
- [ ] `admin/userAuditLogin.php` -> `PAGE_LOGIN_AUDIT`
- [ ] `admin/userAuditMenuAccess.php` -> `PAGE_MENU_ACCESS_AUDIT`
- [ ] `admin/userAuditExportDownload.php` -> `PAGE_EXPORT_DOWNLOAD_AUDIT`
- [ ] `admin/userAuditSettingChange.php` -> `PAGE_SYSTEM_SETTING_AUDIT`
- [ ] `admin/settings.php` -> `PAGE_SYSTEM_SETTINGS` + `ACTION_SYSTEM_SETTINGS_UPDATE` + `ACTION_IP_BLOCK_MANUAL` + `ACTION_IP_BLOCK_RELEASE` + 허용 IP 레인지 제한 + POST + CSRF, `SUPER_ADMIN` 전용

호환성 적용 원칙:

- [ ] 기존 PHP 파일명, URL, GET/POST 파라미터명은 바꾸지 않고 파일 상단 include와 권한 체크만 추가
- [ ] 기존 화면의 DOM id/class, 기존 JS 셀렉터, 기존 엑셀 다운로드 요청 파라미터는 유지
- [ ] 기존 비즈니스 조회 SQL은 유지하고, 권한이 없는 경우에만 실행 여부를 분기
- [ ] 감사 로그 INSERT 실패가 읽기 전용 화면을 깨뜨리지 않도록 `audit_safe_write()` 같은 완충 함수를 둠
- [ ] 로그인/설정 저장/사용자 CRUD/비밀번호 초기화 승인 같은 상태 변경 기능은 감사/상태 저장 실패 시 롤백 또는 중단
- [ ] 신규 CSS/JS는 인증/관리 페이지 전용 파일로 추가하고, 기존 공용 자산은 최소 수정 원칙을 적용

### 10.3 메뉴 출력

- [ ] 상단 메뉴를 하드코딩에서 DB 기반으로 전환
- [ ] 로그인 후 세션에 `allowed_menus` 저장
- [ ] `includes/head.php` 또는 별도 메뉴 렌더 파일에서 출력
- [ ] 설정 메뉴도 `auth_menu` / `auth_menu_permission` / `allowed_menus` 기반으로 출력
- [ ] `allowed_menus`는 별도 느슨한 쿼리 결과를 그대로 쓰지 않고, 최종 `permissions[]` 집합을 source of truth로 삼아 계산하거나 권한 로딩 쿼리와 동일한 `auth_user` / `auth_role` / `auth_role_permission` / `auth_permission` 활성 조건을 모두 반영
- [ ] 역할 비활성, 권한 비활성, 계정 잠금/삭제 상태가 메뉴 노출과 실제 `require_permission()` 판정에서 다르게 보이지 않도록 메뉴 계산과 페이지 접근 판정의 조건을 일치시킴
- [ ] `auth_menu.menu_url`은 `index.php`, `admin/users.php`처럼 앱 상대경로로 저장
- [ ] 실제 메뉴 href는 `build_app_url($menu_path)`로 렌더
- [ ] `MENU_SYSTEM_SETTINGS`는 `PAGE_SYSTEM_SETTINGS`만으로 기계적으로 노출하지 않고 현재 요청 IP가 허용 대역인지까지 확인한 뒤 렌더
- [ ] `admin/settings.php`는 메뉴 노출 여부와 무관하게 `PAGE_SYSTEM_SETTINGS` + 액션 권한 + 허용 IP 레인지 조건을 다시 검증하고, 필요 시 메뉴 숨김과 실제 접근 차단 조건을 같은 헬퍼로 공통화
- [ ] 루트 페이지와 `/admin` 페이지가 함께 쓸 수 있도록 자산 경로 prefix를 처리
- [ ] `<head>` 자산 출력과 상단 헤더/메뉴 렌더를 분리해서 공통화
- [ ] 기존 페이지에 이미 하드코딩된 헤더/메뉴를 한 번에 제거하지 않고, 공통 partial 적용 후 단계적으로 치환

### 10.4 신규 페이지 디자인 적용

- [ ] 신규 페이지는 기존 구현 페이지와 동일한 헤더, 타이틀, 컨텐츠 폭, 여백 리듬을 유지
- [ ] 기존 `comm.css`의 버튼, 테이블, 검색폼, 탭, 팝업 스타일을 우선 재사용
- [ ] 로그인/비밀번호 변경/사용자 관리/감사 화면도 기존 목록형 화면과 같은 정렬, 테이블 밀도, 라벨 표기 규칙을 따름
- [ ] 신규 팝업 페이지가 필요하면 기존 상세 팝업과 같은 크기감, 헤더 구조, 닫기 흐름을 따름
- [ ] 색상, 보더, radius, shadow, 폰트 크기 체계는 기존 페이지 기준에서 벗어나지 않음
- [ ] 신규 전용 CSS는 `auth-admin.css`처럼 별도 분리하되, 기존 공용 스타일을 대체하지 않고 보완만 수행
- [ ] 디자인 작업 시 현재 구현 페이지 스크린 또는 실제 클래스 구조를 기준선으로 삼아 육안 회귀 확인

### 10.5 현재 구조 주입 전 선행 정리

- [ ] `includes/head.php`를 루트 전용 자산 경로 고정 파일로 두지 않고, 공통 `<head>` 템플릿과 공통 헤더/메뉴 partial로 분리
- [ ] `/admin/*.php`는 `../css/...`, `../js/...`를 쓰고, 루트 페이지는 `css/...`, `js/...`를 쓰는 현재 차이를 공통 헬퍼로 흡수
- [ ] `window.open` 기반 팝업 흐름은 유지하되, 보호 페이지가 팝업으로 열릴 때 `401/403` 화면도 정상 렌더되도록 팝업 UX를 확인
- [ ] 페이지별 `.btn_excel` 핸들러를 제거하고 `requestExcelExport()` 또는 동등한 공통 함수로 통합
- [ ] 공통 Excel 함수는 현재 화면 식별자, 파일명, 필터 요약값을 표준화한 뒤 `ajax_export_download_audit.php`를 먼저 호출
- [ ] `ajax_export_download_audit.php`에서 `EXCEL_DOWNLOAD_WARNING_ENABLED` 확인 여부, 현재 페이지 권한 + 다운로드 버튼 노출 권한 검사, 감사 로그 적재를 일원화하고 실제 파일 생성은 `XLSX.writeFile()`로 클라이언트에서 수행
- [ ] 자동완성 호출은 공통 `autocompleteSource()` 또는 동등한 래퍼로 통합해서 `ajax_titles.php`의 `401/403` 응답을 안전하게 처리
- [ ] 자동완성은 권한 없음 또는 세션 만료 시 빈 목록으로 종료하고, 필요 시 로그인 유도 메시지를 선택적으로 표시

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
- [ ] 현재 저장소에 남아 있는 `index.html`, `channelPerformanceStatus.html`, `contentPerformanceStatus.html`, `contentPerformanceStatusView.html` 같은 정적 twin 파일이 운영에 남지 않도록 확인
- [ ] 운영 배포 산출물에서 문서/백업/압축/시안 파일 제외

최소 권장:

- 운영 서버에는 `.php`, `css`, `js`, `img`, `fonts`만 배포

---

## 12. 구현 순서 체크리스트

- [ ] 운영 전환 전 기존 대시보드 URL, HTML id/class, JS 파라미터, 엑셀 다운로드 호출 인자 현황을 기준선으로 캡처
- [ ] 운영 배포 대상에서 `index.html`, `channelPerformanceStatus.html`, `contentPerformanceStatus.html`, `*.bak` 등 정적 twin/백업 파일 제외 또는 웹 차단 선행
- [ ] 루트 페이지와 `/admin` 페이지가 함께 쓸 수 있는 자산 경로 헬퍼(`asset_prefix`, `base_path`, `url()` 등) 준비
- [ ] `includes/head.php`를 공통 `<head>` 출력과 공통 헤더/메뉴 partial로 분리
- [ ] 기존 하드코딩 헤더/메뉴가 있는 페이지부터 공통 partial 구조로 정리
- [ ] 자동완성 호출부를 공통 래퍼로 통합하고 `401/403` 실패 처리 추가
- [ ] 페이지별 `.btn_excel` 로직을 `requestExcelExport()` + `ajax_export_download_audit.php` 기준으로 통합
- [ ] DB 비밀정보를 환경변수/서버 설정으로 이동
- [ ] 앱 전용 MariaDB 계정 생성
- [ ] `auth_*` 테이블 생성
- [ ] 권한/메뉴/역할 데이터 등록
- [ ] 초기 `SUPER_ADMIN` 계정 생성 및 역할 부여
- [ ] 임시 비밀번호 자동 생성기 구현
- [ ] 인증/권한/감사/CSRF 공통 모듈 생성
- [ ] 상태 변경 POST/Ajax 전체에 CSRF 토큰 강제 적용
- [ ] Ajax POST에 `Origin`/`Referer` same-origin 검증 추가
- [ ] 로그인 실패 잠금 처리 구현
- [ ] 세션 하드닝 구현
- [ ] ACL 버전 비교 구현
- [ ] 최초 로그인 비밀번호 변경 강제 로직 구현
- [ ] `changePassword.php` 구현
- [ ] `passwordResetRequest.php` 공개 요청 페이지 구현
- [ ] 비밀번호 초기화 요청 승인/반려 화면 구현
- [ ] 승인 시 임시 비밀번호 자동 재발급 로직 구현
- [ ] 엑셀 다운로드 history 저장 로직 구현
- [ ] `ajax_export_download_audit.php` 권한 매핑 구현
- [ ] 채널 화면용 `ACTION_EXPORT_CHANNEL_EXCEL` 권한 매핑 구현
- [ ] 콘텐츠 화면용 `ACTION_EXPORT_CONTENT_EXCEL` 권한 매핑 구현
- [ ] 설정 변경 history 저장 로직 구현
- [ ] 감사 로그 snapshot 컬럼 적재 로직 구현
- [ ] 감사 로그 allowlist/redaction 유틸 구현
- [ ] `admin/settings.php` 구현
- [ ] `admin/userAuditExportDownload.php` 구현
- [ ] `admin/userAuditSettingChange.php` 구현
- [ ] 설정 페이지 허용 IP 레인지 검증 로직 구현
- [ ] 로그인 전 차단 IP 검사 로직 구현
- [ ] 로그인 실패 횟수의 IP 기준 집계 로직 구현
- [ ] 기준 횟수 초과 시 IP 자동 차단 로직 구현
- [ ] `auth_ip_blocklist` 자동/수동 차단 upsert 뒤에는 `LAST_INSERT_ID(ip_blocklist_id)` 또는 후속 `SELECT`로 정식 `ip_blocklist_id`를 다시 읽어 `auth_ip_block_history`에 같은 row id로 연결
- [ ] IP 자동 차단/수동 차단/해제는 현재 상태 테이블 변경과 history 적재를 하나의 트랜잭션으로 묶어 재차단 시에도 감사 체인이 끊기지 않게 구현
- [ ] 설정 페이지에서 IP 수동 차단/해제 기능 구현
- [ ] 로그인 경고 팝업 ON/OFF + 문구 설정 구현
- [ ] 엑셀 다운로드 경고 팝업 ON/OFF + 문구 설정 구현
- [ ] 각 PHP 진입 파일 상단 권한 체크 추가
- [ ] `index.php` 섹션별 쿼리 실행 분기 추가
- [ ] `ajax_titles.php` 권한 적용 후 자동완성 화면 회귀 확인
- [ ] 조회 권한은 있지만 엑셀 다운로드 권한이 없는 계정에서 `ajax_export_download_audit.php`가 `BLOCKED`로 기록되고 버튼이 노출되지 않는지 확인
- [ ] 팝업으로 열리는 상세/목록 페이지에서 `401/403` 동작과 사용자 경험 확인
- [ ] 사용자 CRUD 화면 구현
- [ ] 최근 로그인/최근 메뉴 접근 시각 표시 구현
- [ ] 로그인 감사/메뉴 접근 감사 화면 구현
- [ ] 상단 메뉴를 사용자 메뉴 기반으로 변경
- [ ] 운영 배포에서 `.html`, `.bak`, `.zip`, `.md` 제외
- [ ] 신규 기능은 `AUTH_ENFORCEMENT_ENABLED`, `AUDIT_LOGGING_ENABLED` 같은 전환 플래그 또는 동등한 서버 설정으로 단계 적용 가능하게 구성
- [ ] 1차 배포: 신규 DB 객체와 신규 페이지만 반영
- [ ] 2차 배포: 로그인/권한 공통 모듈 반영
- [ ] 3차 배포: 기존 대시보드 진입점 보호 적용
- [ ] 4차 배포: 설정/IP 차단/감사 세부 기능 활성화
- [ ] 단계별로 회귀 테스트 후 다음 단계 진행
- [ ] 역할별 테스트 계정으로 시나리오 테스트

---

## 13. 테스트 시나리오

- [ ] `SUPER_ADMIN`은 모든 메뉴/페이지/CRUD/감사 화면 접근 가능
- [ ] `SUPER_ADMIN`이 사용자 생성 시 임시 비밀번호가 자동 생성되고 DB에는 해시만 저장됨
- [ ] 생성된 사용자는 첫 로그인 후 `changePassword.php`로 강제 이동됨
- [ ] `CHANNEL_ANALYST`는 채널 TOP20만 보고 콘텐츠 페이지는 403
- [ ] `CONTENT_ANALYST`는 콘텐츠 TOP20만 보고 채널 페이지는 403
- [ ] 사용자 CRUD는 `SUPER_ADMIN`만 가능
- [ ] `AUDITOR`는 로그인/메뉴 접근/엑셀 다운로드/설정 변경 감사 화면만 조회 가능하고 CRUD는 불가
- [ ] 미로그인 사용자는 모든 보호 페이지 접근 시 로그인으로 이동
- [ ] 권한 철회 후 다음 요청에서 즉시 세션 무효화 또는 재인증 요구
- [ ] 소프트 삭제된 사용자는 로그인 불가, 감사 로그는 유지
- [ ] 공개 비밀번호 초기화 요청은 항상 동일한 응답 문구를 반환함
- [ ] 비밀번호 초기화 요청 승인 시 새 임시 비밀번호가 자동 발급되고 `must_change_password = 1`이 됨
- [ ] 승인된 사용자도 첫 로그인 후 비밀번호 변경 전에는 다른 메뉴 접근이 차단됨
- [ ] `SUPER_ADMIN`만 설정 페이지 접근 가능
- [ ] 허용 IP 레인지 밖에서는 `admin/settings.php` 접근이 403 또는 차단 처리됨
- [ ] 설정값에서 로그인 IP 자동 차단 기준 횟수를 변경하면 다음 실패부터 새 기준이 적용됨
- [ ] 지정된 횟수 이상 로그인 실패 시 해당 IP가 자동 차단됨
- [ ] 차단된 IP는 올바른 계정 정보를 입력해도 로그인 차단됨
- [ ] `SUPER_ADMIN`이 특정 IP를 수동 차단할 수 있음
- [ ] 차단 목록에서 차단 IP 해제 가능
- [ ] 로그인 경고 팝업이 설정값에 따라 노출/비노출됨
- [ ] 엑셀 다운로드 경고 팝업이 설정값에 따라 노출/비노출됨
- [ ] 로그인/엑셀 경고 문구 변경 시 즉시 반영됨
- [ ] 엑셀 다운로드 실행 시 `auth_export_download_history`에 누적 저장됨
- [ ] 채널/콘텐츠 화면은 페이지 권한과 별도로 엑셀 다운로드 권한이 없으면 Excel 버튼이 노출되지 않고 공식 다운로드 흐름은 `BLOCKED`로 감사 기록됨
- [ ] 다운로드 감사에는 `page_permission_code`, `export_permission_code`가 함께 남음
- [ ] 설정 변경 시 `auth_system_setting_history`에 변경 전/후 값이 누적 저장됨
- [ ] 감사 화면에서 로그인/메뉴 접근/엑셀 다운로드/설정 변경 이력을 각각 최근순으로 조회할 수 있음
- [ ] 동일 IP를 자동 차단 후 수동 차단해도 현재 상태 테이블에는 1건만 유지됨
- [ ] 비로그인 사용자의 직접 URL 접근 시도도 감사 조회에서 확인 가능
- [ ] 사용자명이 변경되어도 과거 감사 보고서의 행위자 표시는 당시 스냅샷 기준으로 유지됨
- [ ] 토큰/이메일/자유입력 전문은 감사 테이블에 raw 형태로 저장되지 않음

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
16. `admin/settings.php`는 `SUPER_ADMIN` 전용으로 두고, 권한 확인 전에 허용 IP 레인지 검사를 수행합니다.
17. 로그인 경고 팝업과 엑셀 다운로드 경고 팝업은 DB 설정값으로 ON/OFF와 문구를 제어합니다.
18. 엑셀 다운로드는 현재 화면의 내용을 클라이언트에서 저장하는 기능으로 두되, 공식 UI 흐름에서는 `ajax_export_download_audit.php`가 현재 페이지 권한과 다운로드 버튼 노출 권한을 함께 검사하고 감사 로그를 남깁니다.
19. 채널 화면은 `PAGE_CHANNEL_*` + `ACTION_EXPORT_CHANNEL_EXCEL`, 콘텐츠 화면은 `PAGE_CONTENT_*` + `ACTION_EXPORT_CONTENT_EXCEL` 조합으로 버튼 노출과 공식 다운로드 흐름을 제어합니다.
20. 설정 변경은 즉시 반영하되, 변경 이력과 변경 주체를 `auth_system_setting_history`에 남깁니다.
21. 엑셀 다운로드 실행 이력은 `auth_export_download_history`에 누적 저장하고, `page_permission_code`, `export_permission_code`를 함께 남깁니다.
22. `auth_menu.menu_url`은 leading slash 없는 앱 상대경로로 저장하고, 실제 메뉴 href는 `build_app_url()`로 생성합니다.
23. `last_*` 컬럼은 최신 상태 요약용이고, 실제 감사 추적은 history 테이블을 기준으로 합니다.
24. 로그인 페이지 진입 시 현재 접속 IP가 차단 목록에 있으면 사용자 조회 전에 먼저 차단합니다.
25. 로그인 IP 자동 차단 기준 횟수와 판정 시간 구간은 설정 페이지에서 `SUPER_ADMIN`이 변경할 수 있게 합니다.
26. 설정 메뉴도 다른 메뉴와 동일하게 권한 기반 메뉴 테이블을 통해 노출/비노출을 제어합니다.
27. IP 차단은 현재 상태 테이블 `auth_ip_blocklist`와 append-only 이력 테이블 `auth_ip_block_history`를 분리합니다.
28. 감사 보고서의 행위자는 현재 `auth_user` 조인값이 아니라 각 history 테이블의 스냅샷 컬럼을 우선 사용합니다.
29. `query_summary`, `filter_summary`, `before_value_summary`, `after_value_summary`는 allowlist + redaction이 끝난 요약값만 저장합니다.
30. 비로그인 401/403 직접 접근 시도도 감사 범위에 포함합니다.
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
I > 사용자가 엑셀 다운로드를 실행하면 `requestExcelExport()`가 현재 페이지 권한과 엑셀 다운로드 권한을 기준으로 `ajax_export_download_audit.php`를 먼저 호출  
J > 두 권한이 모두 허용되고 경고 팝업 확인이 끝나면 브라우저가 현재 화면 테이블을 `XLSX.writeFile()`로 저장  
K > 시스템이 다운로드 시각, 메뉴, 조건, 건수, 페이지 권한, 다운로드 권한을 이력으로 저장  
L > 로그아웃 시 세션 종료

### C-1. 로그인 IP 차단 플로우

A > 사용자가 로그인 페이지에서 아이디와 비밀번호 입력  
B > 시스템이 먼저 현재 접속 IP가 차단 목록에 있는지 검사  
C > 차단된 IP이면 로그인 차단 후 이력을 남김  
D > 차단되지 않은 경우에만 계정 검증 진행  
E > 최근 설정 시간 구간 내 로그인 실패 횟수가 기준 횟수 이상이면 해당 IP를 자동 차단  
F > 자동 차단된 IP도 설정 페이지의 차단 목록에서 `SUPER_ADMIN`이 해제 가능

### D. 채널 분석 담당자 플로우

A > 로그인  
B > 대시보드 진입  
C > 채널 TOP20 섹션만 조회 가능  
D > 콘텐츠 TOP20 섹션은 숨김  
E > 채널 성과 목록/상세 메뉴만 접근 가능  
F > 채널 화면 엑셀 다운로드 권한이 있으면 Excel 버튼이 노출되고 공식 다운로드 흐름이 진행되며, 없으면 버튼이 숨겨지고 우회 호출은 `BLOCKED`로 감사 기록  
G > 콘텐츠 관련 메뉴 직접 접근 시 403 처리

### E. 콘텐츠 분석 담당자 플로우

A > 로그인  
B > 대시보드 진입  
C > 콘텐츠 TOP20 섹션만 조회 가능  
D > 채널 TOP20 섹션은 숨김  
E > 콘텐츠 성과 목록/상세 메뉴 접근 가능  
F > 필요 시 제목 자동완성 API 사용  
G > 콘텐츠 화면 엑셀 다운로드 권한이 있으면 Excel 버튼이 노출되고 공식 다운로드 흐름이 진행되며, 없으면 버튼이 숨겨지고 우회 호출은 `BLOCKED`로 감사 기록  
H > 채널 관련 메뉴 직접 접근 시 403 처리

### F. 감사 조회 사용자 플로우

A > 로그인  
B > 본인에게 허용된 감사 메뉴 확인  
C > 로그인 감사 메뉴에서 최근 로그인 성공/실패/잠금/로그아웃 이력 조회  
D > 메뉴 접근 감사 메뉴에서 최근 메뉴 접근/거부 이력 조회  
E > 엑셀 다운로드 감사 메뉴에서 최근 다운로드 시각과 파일 이력 조회  
F > 설정 변경 감사 메뉴에서 최근 변경 전/후 값과 변경 주체 조회  
G > 사용자 CRUD 메뉴는 보이지 않으며 직접 접근 시 403 처리

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

### I. 운영 설정 페이지 플로우

A > `SUPER_ADMIN`이 `admin/settings.php` 진입  
B > 시스템이 로그인 여부, `PAGE_SYSTEM_SETTINGS` 권한, 허용 IP 레인지 포함 여부를 순서대로 검사  
C > 허용된 경우 설정 페이지에서 로그인 경고 팝업, 엑셀 다운로드 경고 팝업, 설정 페이지 허용 IP 레인지, 로그인 차단 기준 횟수, 로그인 차단 판정 시간 구간, 차단 IP 목록을 함께 조회  
D > `SUPER_ADMIN`이 ON/OFF, 문구, 허용 IP 목록, 로그인 차단 설정 수정  
E > 필요 시 특정 IP를 수동 차단하거나 차단 목록에서 해제  
F > 저장 시 시스템이 입력값 검증 후 DB 반영  
G > 변경 이력은 설정 변경 history로 저장되고 다음 요청부터 새 설정이 적용

### J. 권한 차단 / 예외 플로우

A > 사용자가 권한 없는 메뉴 URL 직접 입력  
B > 시스템이 로그인 여부와 권한을 먼저 검사  
C > 비로그인 상태이면 `login.php` 또는 `401.php`로 이동  
D > 로그인 상태지만 권한이 없으면 403 처리  
E > 이 접근 시도는 가능하면 감사 로그에 `DENIED`로 기록

---

## 16. 로직 변경 목록 (A(과거) → B(수정))

아래 목록은 현재 프로젝트 구조를 기준으로, 호환성 100%와 운영 이슈 0%에 최대한 가깝게 가기 위해 바뀐 로직을 `A(과거) -> B(수정)` 형태로 정리한 것입니다.

1. 공개 진입 구조 -> `login.php` 기반 인증 진입 구조
A(과거) > 대부분의 PHP 파일이 로그인 없이 직접 URL 진입 가능  
B(수정) > 보호 대상 PHP/API는 로그인 후에만 진입 가능하고, 미로그인 시 `login.php` 또는 `401.php`로 이동

2. 메뉴 숨김 중심 -> 서버 측 실제 접근 차단
A(과거) > 메뉴에서 안 보이더라도 URL을 직접 입력하면 접근 가능할 수 있음  
B(수정) > 메뉴 노출과 별개로 모든 진입 파일 상단에서 `require_permission()`을 수행해 직접 접근도 차단

3. 기존 조회 기능과 신규 보안 기능이 섞일 수 있는 구조 -> 기존 조회는 유지, 신규 쓰기는 `auth_*`에 한정
A(과거) > 인증/권한/감사 기능이 추가되면 기존 업무 테이블까지 영향이 갈 수 있음  
B(수정) > 기존 성과 데이터는 조회 전용으로 유지하고, 신규 상태 변경과 로그 적재는 `auth_*` 테이블에만 수행

4. 기존 업무 객체 수정 가능성 -> 기존 업무 객체 무변경 원칙
A(과거) > 기능 추가 과정에서 기존 테이블/뷰 컬럼 변경 가능성이 열려 있음  
B(수정) > `v_channel_follower_summary`, `content_daily_cache`, `v_content_snapshots_raw`, `tt_item_metrics`, `yt_video_metrics`, `channel_daily`, `m_channels`에는 신규 기능 때문에 `ALTER/UPDATE/DELETE`를 하지 않음

5. 단일 고권한 DB 계정 사용 -> 최소 권한 계정 또는 별도 스키마/DB 분리
A(과거) > 기존 앱 계정이 과도한 DB 권한을 가질 수 있음  
B(수정) > 대시보드 조회 계정과 인증/감사 계정을 분리하고, 가능하면 `auth_*`는 별도 스키마 또는 별도 DB로 운영

6. 기존 URL/파라미터 변경 가능성 -> URL/파라미터/DOM 고정
A(과거) > 인증 기능을 붙이면서 기존 URL, GET/POST 파라미터, JS 연동 인자가 바뀔 수 있음  
B(수정) > 기존 파일명, URL, 파라미터명, DOM id/class, JS 셀렉터는 유지하고 include와 권한 체크만 추가

7. 기존 조회 SQL 직접 수정 가능성 -> 기존 조회 SQL 본문 유지
A(과거) > 권한 기능을 붙이면서 기존 SELECT SQL 자체가 많이 바뀔 수 있음  
B(수정) > 기존 비즈니스 조회 SQL은 유지하고, 권한 없는 경우에만 해당 쿼리 실행을 생략

8. 세션 시작만 있는 로그인 구조 -> 세션 하드닝 구조
A(과거) > `session_start()` 중심의 단순 로그인 구조  
B(수정) > 보안 쿠키, `HttpOnly`, `Secure`, `SameSite`, 유휴/절대 만료, `session_regenerate_id(true)`, no-store 헤더를 포함한 세션 하드닝 구조

9. 로그인 후 권한 캐시 고정 -> 요청마다 ACL 버전 재검증
A(과거) > 로그인 시 세션에 담긴 권한이 세션 종료 전까지 유지될 수 있음  
B(수정) > 각 요청에서 `acl_version`, `acl_global_version`, `account_status`, `deleted_at`를 재검증해 권한 철회와 계정 잠금을 즉시 반영

10. 임시 비밀번호 수동 처리 -> 시스템 자동 발급 + 해시 저장
A(과거) > 관리자가 비밀번호를 직접 정하거나 평문 전달 흐름이 생길 수 있음  
B(수정) > `SUPER_ADMIN`이 계정 생성 시 시스템이 임시 비밀번호를 자동 생성하고 DB에는 `password_hash()` 결과만 저장

11. 최초 로그인 후 바로 사용 가능 -> 최초 비밀번호 변경 강제
A(과거) > 임시 비밀번호로 로그인 후 기존 메뉴에 바로 접근 가능할 수 있음  
B(수정) > `must_change_password = 1`이면 `changePassword.php` 외 다른 메뉴 접근을 차단

12. 비밀번호 초기화 즉시 처리 -> 요청 -> 승인 -> 임시 비밀번호 재발급 -> 최초 로그인 후 변경
A(과거) > 관리자가 비밀번호를 바로 바꾸는 단일 액션 위주  
B(수정) > 외부 업체를 포함해 초기화 요청을 남기고, `SUPER_ADMIN` 승인 후 임시 비밀번호 재발급과 최초 로그인 변경 절차를 거침

13. 사용자 관리 범위 불명확 -> `SUPER_ADMIN` 전용 사용자 CRUD
A(과거) > 사용자 생성/수정/삭제 권한의 담당 범위가 모호함  
B(수정) > 사용자 생성, 수정, 소프트 삭제, 복구, 역할 부여, 잠금 해제, 비밀번호 초기화 승인 모두 `SUPER_ADMIN`만 수행

14. 사용자 삭제 = 데이터 제거 가능성 -> 소프트 삭제 + 감사 유지
A(과거) > 계정 삭제 시 이력까지 손실될 수 있음  
B(수정) > `deleted_at` 기반 소프트 삭제를 사용하고, 기존 감사 로그는 유지

15. 설정 페이지 없음 또는 단순 설정 페이지 -> `SUPER_ADMIN` + 권한 + 허용 IP 레인지 제한
A(과거) > 운영 설정을 별도 보안 통제 없이 관리할 수 있음  
B(수정) > `admin/settings.php`는 `SUPER_ADMIN` 전용이고, `PAGE_SYSTEM_SETTINGS` 권한과 허용 IP 레인지 조건을 모두 만족해야 접근 가능

16. 설정 메뉴 하드코딩 가능성 -> 권한 기반 메뉴 출력
A(과거) > 설정 메뉴가 코드에 하드코딩되면 권한 없는 사용자에게 노출될 수 있음  
B(수정) > `auth_menu`, `auth_menu_permission`, `allowed_menus` 기준으로 설정 메뉴를 포함한 전체 메뉴를 출력

17. 로그인 실패 누적만 존재하거나 관리 없음 -> 계정/IP 기준 차단과 로그인 감사 추가
A(과거) > 무차별 대입 방어, 잠금, 실패 감사 설계가 부족함  
B(수정) > 실패 횟수, 잠금 시간, IP 기준 실패 집계, 자동 차단, 로그인 성공/실패/차단 감사 로그를 함께 운영

18. IP 차단 상태와 이력이 한 테이블에 혼재 -> 현재 상태 + append-only 이력 분리
A(과거) > 같은 IP가 자동/수동 차단으로 중복 기록될 수 있고 해제가 불안정할 수 있음  
B(수정) > `auth_ip_blocklist`는 현재 상태만 관리하고, `auth_ip_block_history`는 차단/해제 이력을 append-only로 기록

19. 차단 IP 중복 생성 가능 -> `(client_ip, block_scope)` 기준 단일 현재 상태 보장
A(과거) > 같은 IP에 활성 차단 레코드가 여러 건 생길 수 있음  
B(수정) > `UPSERT`와 유니크 제약으로 현재 활성 차단 상태를 1건으로 유지

20. 익명 직접 접근 감사 공백 -> 익명 401/403 시도까지 감사 포함
A(과거) > 로그인하지 않은 사용자의 직접 URL 탐색/차단 시도가 메뉴 접근 감사에서 빠질 수 있음  
B(수정) > `auth_menu_access_log.user_id`를 nullable로 두고, 미로그인/세션만료/익명 401/403 요청도 별도 감사 대상으로 기록

21. 감사 보고서가 현재 사용자 정보에 의존 -> 당시 행위자 스냅샷 우선
A(과거) > 과거 로그를 조회할 때 현재 `auth_user` 조인값에 따라 표시 이름이 바뀔 수 있음  
B(수정) > 모든 주요 history 테이블에 `actor_login_id`, `actor_user_name`을 저장하고 조회 시 이를 우선 사용

22. raw 요청값/필터/설정 diff 저장 -> 레드랙션된 요약값 저장
A(과거) > `query_string`, `filter_snapshot`, `before_value`, `after_value`를 원문으로 저장할 수 있음  
B(수정) > `query_summary`, `filter_summary`, `before_value_summary`, `after_value_summary`에 allowlist + redaction + 길이 제한을 적용한 요약값만 저장

23. 감사 대상이 로그인/메뉴 일부에 한정 -> 로그인/메뉴/엑셀/설정/IP 차단/초기화 요청까지 확장
A(과거) > 감사 범위가 좁아 포렌식과 운영 추적이 부족함  
B(수정) > 로그인 이력, 메뉴 접근, 엑셀 다운로드, 설정 변경, IP 차단/해제, 비밀번호 초기화 요청/승인/반려/완료를 모두 누적 저장

24. 읽기 화면도 감사 실패 시 같이 실패할 수 있음 -> 읽기 화면은 감사 적재 완충 처리
A(과거) > 감사 INSERT 실패가 일반 조회 화면 장애로 이어질 수 있음  
B(수정) > 대시보드/목록/감사 조회처럼 읽기 중심 화면은 감사 적재 실패 시 서버 에러 로그를 남기고 화면은 유지

25. 보안 중요 상태 변경도 부분 실패 가능 -> 보안 중요 액션은 `fail-closed`
A(과거) > 로그인, 설정 저장, 사용자 CRUD, 초기화 승인 중 일부 로그/상태 저장 실패를 놓칠 수 있음  
B(수정) > 로그인 성공 처리, 설정 저장, 사용자 CRUD, 비밀번호 초기화 승인/반려는 핵심 DB 반영과 감사 반영이 실패하면 트랜잭션 롤백 또는 중단

26. 일괄 전환 배포 -> 단계별 배포와 회귀 검증
A(과거) > 모든 인증/권한/감사 기능을 한 번에 붙여 회귀 이슈가 커질 수 있음  
B(수정) > `DB 객체 추가 -> 신규 페이지 공개 -> 공통 모듈 반영 -> 기존 페이지 보호 -> 설정/IP 차단/감사 활성화` 순서로 단계 배포

27. 운영 전환 시 기준선 부재 -> 기존 동작 기준선 확보 후 회귀 비교
A(과거) > 변경 전 URL, 파라미터, 엑셀 다운로드 인자, DOM 기준선이 없어 회귀 판단이 어려움  
B(수정) > 전환 전 기존 동작 기준선을 캡처하고 단계별 테스트 시 비교 기준으로 사용

28. 기존 공용 스타일 직접 수정 가능성 -> 신규 인증/관리 스타일 분리
A(과거) > 인증/관리 UI 추가 때문에 기존 `comm.css`를 크게 흔들 수 있음  
B(수정) > 기존 톤앤매너는 유지하고, 신규 인증/관리 화면 전용 CSS를 별도 파일로 분리

29. 설정/감사/보호 기능을 항상 즉시 강제 -> 단계적 활성화 가능
A(과거) > 운영 전환 순간 모든 기능이 동시에 강제되면 장애 대응 여지가 적음  
B(수정) > `AUTH_ENFORCEMENT_ENABLED`, `AUDIT_LOGGING_ENABLED` 또는 동등한 서버 설정으로 단계 활성화 가능하게 설계

30. 대시보드 데이터 수정 권한 여지 존재 -> 대시보드 데이터는 끝까지 조회 전용
A(과거) > 계정/권한 모델을 붙이면서 대시보드 데이터 수정 권한이 같이 섞일 수 있음  
B(수정) > 대시보드 영역은 조회 전용으로 고정하고, 쓰기 기능은 사용자/설정/감사 관리 영역에만 한정

31. 신규 페이지마다 별도 디자인 도입 가능 -> 기존 페이지 디자인 톤 그대로 유지
A(과거) > 신규 로그인/관리/감사 페이지를 만들면서 기존 화면과 다른 색상, 버튼, 여백, 팝업 구조가 섞일 수 있음  
B(수정) > 기존 구현 페이지의 `comm.css` 기반 톤앤매너를 그대로 사용하고, 필요한 스타일만 별도 CSS에서 최소 보완

32. 루트 전용 헤드 파일 재사용 가능 가정 -> 자산 경로 추상화 후 공통화
A(과거) > `includes/head.php`를 그대로 `/admin` 페이지에서도 공통으로 쓰면 될 것처럼 볼 수 있음  
B(수정) > 루트와 `/admin`의 자산 경로 깊이가 다르므로, 먼저 `asset_prefix` 또는 동등한 경로 헬퍼를 두고 `<head>`와 헤더/메뉴 partial을 분리한 뒤 공통화

33. 페이지마다 다른 헤더/메뉴를 바로 DB 메뉴로 교체 가능 -> 공통 partial 정리 후 단계 치환
A(과거) > 각 페이지에 하드코딩된 헤더/메뉴를 한 번에 DB 메뉴 출력으로 바꿔도 된다고 볼 수 있음  
B(수정) > 기존 하드코딩 헤더/메뉴 구조를 공통 partial로 먼저 수렴시키고, 그 다음 `allowed_menus` 기반 렌더링으로 단계 치환

34. 엑셀 다운로드는 화면 조회 권한만 있으면 충분 -> 페이지 권한 + 다운로드 버튼 노출 권한으로 공식 UI 흐름 제어
A(과거) > 화면을 볼 수 있는 권한만 있으면 같은 화면의 엑셀 다운로드도 그대로 허용될 수 있음  
B(수정) > 공식 UI에서는 `PAGE_*` 권한과 별도 `ACTION_EXPORT_*` 권한을 함께 확인해 버튼 노출과 감사 흐름을 제어하고, 감사 로그에 두 권한 코드를 함께 남김

35. `auth_menu.menu_url`에 root-absolute URL 저장 가능 -> 앱 상대경로 저장 + `build_app_url()` 렌더
A(과거) > `/index.php`, `/admin/users.php`처럼 leading slash가 있는 URL을 DB에 저장해도 된다고 볼 수 있음  
B(수정) > `index.php`, `admin/users.php`처럼 앱 상대경로만 저장하고 렌더 시 `build_app_url($menu_path)`로 현재 배포 prefix를 붙임

36. `ajax_titles.php`만 권한 보호하면 자동완성도 그대로 동작 -> 호출부 실패 처리 선행
A(과거) > 현재 자동완성 호출부가 성공 응답만 가정해도 권한 API 적용 후 문제 없다고 볼 수 있음  
B(수정) > `ajax_titles.php`에 권한/세션 검사를 넣기 전에 공통 자동완성 래퍼를 두고 `401/403` 시 빈 목록 반환, 재로그인 유도 또는 조용한 종료를 처리

37. PHP 보호를 먼저 적용해도 우회 표면이 없음 -> 정적 twin/백업 파일 정리 후 보호 적용
A(과거) > `index.php` 등 PHP 진입점만 보호하면 충분하다고 볼 수 있음  
B(수정) > 현재 남아 있는 `.html`, `.bak` 파일이 운영에 배포되지 않도록 먼저 차단/제외한 뒤 PHP 인증 강제를 적용

38. 팝업 상세 화면 보호가 일반 페이지 보호와 동일 -> 팝업 UX까지 별도 확인
A(과거) > `window.open`으로 여는 상세/목록 페이지도 일반 페이지와 같은 방식으로만 막으면 된다고 볼 수 있음  
B(수정) > 팝업으로 `401/403`이 열릴 때 사용자 경험이 깨지지 않는지 확인하고, 필요 시 팝업 전용 안내나 로그인 유도 흐름을 추가

39. 루트 대시보드 진입 시 모든 TOP20 쿼리 즉시 실행 -> 로그인/권한 확인 후 허용 섹션만 실행
A(과거) > `index.php`에 진입하면 채널 TOP20과 콘텐츠 TOP20 쿼리가 항상 함께 실행됨  
B(수정) > 로그인과 `PAGE_DASHBOARD` 확인 후 진입시키고, `SECTION_DASHBOARD_CHANNEL_TOP20`, `SECTION_DASHBOARD_CONTENT_TOP20` 권한이 있는 섹션만 개별 쿼리를 실행

40. 목록/상세 팝업은 URL만 맞으면 바로 조회 -> 같은 URL 계약 유지 + 페이지 권한 선검사
A(과거) > `channelPerformanceStatus.php`, `channelPerformanceStatusView.php`, `contentPerformanceStatus.php`, `contentPerformanceStatusView.php`는 현재 URL과 GET 파라미터만 맞으면 바로 DB 조회를 수행  
B(수정) > 기존 URL과 GET 파라미터 계약은 유지하되, 각 파일 상단에서 로그인과 `PAGE_*` 권한을 먼저 확인한 뒤 허용된 경우에만 기존 조회 SQL을 실행

41. `$_GET` 기반 파라미터 파싱만으로 조회 범위 결정 -> 기존 파라미터 계약 유지 + 인증 레이어 선행
A(과거) > `build_channel_params()`, `build_content_params()`와 개별 페이지 로직이 `$_GET` 값만으로 조회 범위와 기본값을 결정  
B(수정) > `date`, `date_from`, `platform`, `channel`, `keyword`, `content_id`, `view_mode`, `limit` 이름과 기본값 규칙은 유지하되, 파라미터 파싱 전에 인증/권한 레이어를 선행하고 값 검증 실패 시 기존 기본값 규칙으로 복귀

42. 자동완성 API는 익명 GET 문자열 배열 반환 -> 같은 성공 계약 유지 + 세션/권한 보호 추가
A(과거) > `ajax_titles.php`는 비로그인 상태에서도 `platform`, `channel`, `q`를 받아 `content_daily_cache`에서 제목 문자열 배열을 바로 반환  
B(수정) > 요청 방식과 성공 응답(JSON 문자열 배열) 계약은 그대로 유지하되, `API_AJAX_TITLES` 권한과 세션을 확인하고 실패 시 `401/403`을 반환하며 호출부는 공통 래퍼로 빈 목록 처리

43. 페이지별 Excel 버튼이 즉시 파일 저장 -> 공통 감사 호출 후 동일한 클라이언트 저장
A(과거) > 각 화면의 `.btn_excel` 클릭 시 바로 `XLSX.writeFile()`이 실행되어 화면 테이블이 저장됨  
B(수정) > `requestExcelExport()`가 먼저 `ajax_export_download_audit.php`로 권한/감사 처리를 수행하고, 허용된 경우에만 기존처럼 화면의 `.tb1` 테이블을 클라이언트에서 저장

44. 상단 메뉴와 사용자 표시는 하드코딩 -> 로그인 사용자 정보 + `allowed_menus` 기반 렌더
A(과거) > `index.php` 등은 상단 메뉴와 사용자 표시가 하드코딩되어 있고 실제 로그인 계정/권한과 연결되지 않음  
B(수정) > 기존 디자인 톤은 유지하되 로그인 사용자 정보를 세션에서 렌더하고, 메뉴는 `allowed_menus` 기준으로 노출/비노출을 결정

45. 팝업 상세 이동 URL은 조회 화면에서 그대로 오픈 -> 같은 팝업 URL 유지 + 인증 실패 시 팝업 내 401/403 처리
A(과거) > 목록 화면의 `click_row`가 생성하는 팝업 URL은 별도 인증 흐름 없이 그대로 열림  
B(수정) > 현재 팝업 URL 구조는 그대로 유지하되, 팝업 진입 파일도 동일하게 로그인/권한 체크를 수행하고 실패 시 팝업 안에서 `401/403` 안내를 렌더

46. 일반 콘텐츠 상세 페이지는 유지 여부와 무관하게 동작 가능 -> 유지 시 별도 페이지 권한으로 보호
A(과거) > `contentPerformanceStatusViewGeneral.php`는 별도 권한 개념 없이 직접 호출 가능  
B(수정) > 일반 콘텐츠 상세를 유지하면 `PAGE_CONTENT_STATUS_VIEW_GENERAL` 권한으로 별도 보호하고, 유지하지 않으면 연결을 제거해 우회 진입점을 없앰

47. 플랫폼/채널 목록 조회는 페이지 진입과 무관하게 실행 가능 -> 페이지 접근 허용 후에만 같은 소스에서 조회
A(과거) > 플랫폼/채널 목록은 `v_channel_follower_summary`, `content_daily_cache`에서 페이지 진입과 함께 바로 조회됨  
B(수정) > 데이터 원본과 정렬은 유지하되, 해당 페이지 접근이 허용된 뒤에만 플랫폼/채널 목록을 로드해 필터 UI를 렌더

48. 엑셀 버튼은 모든 조회 사용자에게 같은 방식으로 노출 -> 페이지 권한 + 다운로드 노출 권한 기준 분기
A(과거) > 조회 화면을 열 수 있는 사용자는 같은 방식으로 Excel 버튼을 보고 바로 저장할 수 있음  
B(수정) > 기존 화면 저장 방식은 유지하되, Excel 버튼 노출은 `PAGE_*`와 `ACTION_EXPORT_*` 조합으로 제어하고 공식 UI 흐름의 시도 결과를 감사 로그에 남김

---

## 17. 현재 프로젝트 기준 조회 로직 정리

아래 내용은 현재 저장소 코드 기준의 실제 조회 로직 기준선입니다. 인증/권한 개편 시 값 로딩 회귀를 막으려면 이 계약을 유지한 상태에서 진입 제어만 얹는 것을 우선 원칙으로 둡니다.

### 17.1 공통 조회 계약

- 루트 대시보드와 팝업 조회 화면은 모두 `GET` 파라미터 기반으로 동작
- 날짜 파라미터는 주로 `date`, `date_from`을 사용
- 공통 필터 파라미터는 `platform`, `channel`, `keyword`, `content_id`, `view_mode`, `limit`
- `build_channel_params()`는 `date`가 없으면 `CURDATE()`, `date_from`이 없으면 `date - 6일`, `limit`은 `20/50/100`만 허용
- `build_content_params()`는 `date`가 없으면 `CURDATE()`, `date_from`이 없으면 `date - 6일`, `view_mode`는 `date/time/datetime`, `limit`은 `0/20/50/100`만 허용
- 채널명은 `channel_filter_values()`를 통해 `쎈정보`와 `ssen_info`를 동치로 처리
- 플랫폼/채널 라벨은 `platform_label()`, `channel_label()`로 화면 표시값을 변환

### 17.2 화면별 조회 로직

1. `index.php`
- 기준일 `date`가 없으면 `SELECT CURDATE()`로 오늘 날짜를 사용
- 좌측 TOP20은 `v_channel_follower_summary`에서 `snap_date = :snap_date` 조건으로 조회
- 정렬은 `follower_diff DESC, curr_follower_count DESC`, 고정 `LIMIT 20`
- 우측 TOP20은 `content_daily_cache`에서 `snap_date = :snap_date` 조건으로 조회
- 정렬은 `views_diff DESC, views DESC`, 고정 `LIMIT 20`

2. `channelPerformanceStatus.php`
- 단일 조회일 `date` 기준의 채널 목록 팝업
- 데이터 원본은 `v_channel_follower_summary`
- 필터는 `platform`, `channel`, `keyword`, `limit`
- `channel`은 단일값 또는 `IN (...)`으로 처리
- `keyword`는 `channel_name LIKE` 또는 `platform LIKE` 조건으로 처리
- 정렬은 `curr_follower_count DESC`
- `limit`은 `20/50/100/9999`만 허용
- 플랫폼 목록은 `v_channel_follower_summary`의 `DISTINCT platform`
- 채널 목록은 `query_channel_list()`로 `v_channel_follower_summary`의 `DISTINCT channel_name`

3. `channelPerformanceStatusView.php`
- `build_channel_params()`를 사용하며 `view_mode = date/time/datetime`을 지원
- `date` 모드는 `v_channel_follower_summary`를 날짜 범위(`date_from ~ date`)로 조회
- `time` 모드는 `channel_daily`를 `m_channels`와 조인해 시간대별 `MAX(follower_count)`를 조회
- `datetime` 모드는 `channel_daily + m_channels` 기반 시간대 집계 후 `LAG()`로 증감을 계산
- 공통 필터는 `platform`, `channel`, `keyword`, `limit`
- 플랫폼 목록은 `query_channel_platforms()`, 채널 목록은 `query_channel_list()`
- Excel은 화면의 `.tb1` 테이블을 클라이언트에서 저장

4. `contentPerformanceStatus.php`
- `build_content_params()` + `query_content_summary()` 조합을 사용
- 목록 데이터 원본은 `v_content_daily_perf`
- 기준일은 `date` 1일, 정렬은 `views_diff DESC, views DESC`
- 필터는 `platform`, `channel`, `keyword`, `content_id`, `limit`
- `keyword`는 `content_title LIKE` 또는 `channel_name LIKE`
- 플랫폼 목록과 채널 목록은 `content_daily_cache`에서 파생
- 검색어 자동완성은 `ajax_titles.php` 호출에 의존

5. `contentPerformanceStatusView.php`
- `build_content_params()` + `query_content_by_mode()` 조합을 사용
- `date` 모드는 `content_daily_cache`를 기준으로 TikTok/YouTube 지표 테이블(`tt_item_metrics`, `yt_video_metrics`)을 조인해 시청지표를 계산
- `time`/`datetime` 모드는 `v_content_snapshots_raw`를 기준으로 시간대별 집계를 수행하고, TikTok/YouTube 시간대 지표를 조인
- `platform`, `content_id`, `channel`, `keyword`, `date_from`, `date`, `view_mode`, `limit`에 의존
- 단일 콘텐츠 URL은 플랫폼별 원본 테이블에서 조회
- URL 조회 매핑:
- `youtube -> yt_m_videos.video_id`
- `tiktok -> tt_m_items.item_id`
- `meta_fb/meta_ig -> meta_m_posts.post_id`
- `naver_tv -> ntv_m_clips.item_no`
- `naver_blog -> nb_m_contents.content_id`
- 플랫폼이 영상 플랫폼(`youtube`, `naver_tv`, `tiktok`)이거나 `content_type = '영상'`이면 영상 지표 컬럼을 함께 렌더
- Excel은 화면의 `.tb1` 테이블을 클라이언트에서 저장

6. `contentPerformanceStatusViewGeneral.php`
- 일반 콘텐츠 상세 팝업이지만 조회 함수는 `query_content_by_mode()`를 그대로 사용
- `platform`, `content_id`, `channel`, `keyword`, `date_from`, `date`, `view_mode`, `limit` 계약은 `contentPerformanceStatusView.php`와 동일
- 일반 콘텐츠 화면은 `saves` 컬럼을 함께 렌더
- 자동완성은 `ajax_titles.php`를 동일하게 사용

7. `ajax_titles.php`
- 요청 방식은 현재 `GET`
- 요청 파라미터는 `platform`, `channel`, `q`
- 데이터 원본은 `content_daily_cache`
- 조건은 `content_title IS NOT NULL` + 선택적 `platform`, `channel`, `content_title LIKE`
- 응답은 `SELECT DISTINCT content_title ... LIMIT 30` 결과를 그대로 JSON 배열로 반환
- 현재 프론트는 이 응답을 jQuery UI autocomplete `response()`에 바로 전달

### 17.3 현재 조회에 사용되는 주요 DB 객체

- `v_channel_follower_summary`
- `channel_daily`
- `m_channels`
- `content_daily_cache`
- `v_content_daily_perf`
- `v_content_snapshots_raw`
- `tt_item_metrics`
- `yt_video_metrics`
- `yt_m_videos`
- `tt_m_items`
- `meta_m_posts`
- `ntv_m_clips`
- `nb_m_contents`

### 17.4 개편 시 동결해야 하는 현재 계약

- `GET` 파라미터 이름 `date`, `date_from`, `platform`, `channel`, `keyword`, `content_id`, `view_mode`, `limit`은 변경하지 않음
- `ajax_titles.php` 성공 응답은 현재처럼 문자열 배열 JSON을 유지
- 채널/콘텐츠 목록 화면에서 상세 팝업으로 이동하는 URL 파라미터 구조를 유지
- `build_channel_params()`, `build_content_params()`의 기본값 계산 규칙을 유지
- 현재 조회 SQL의 정렬 기준과 limit 허용값을 유지
- Excel 다운로드는 현재처럼 화면 테이블을 클라이언트에서 저장하는 방식 위에 감사/권한 노출만 덧붙이고, 조회 SQL 재구성은 별도 과제로 분리