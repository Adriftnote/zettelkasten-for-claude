---
title: structure
type: note
permalink: zettelkasten/structure
---

# MOT 프로젝트 구조 정리

## 1. 프로젝트 개요

- 형태: PHP 기반의 단일 대시보드형 웹 애플리케이션
- 목적: 채널 성과와 콘텐츠 성과를 날짜/기간 기준으로 조회하고 팝업 상세 화면으로 drill-down
- 주요 기술:
  - PHP + PDO
  - MariaDB (`mot_dashboard`)
  - jQuery / jQuery UI Datepicker / jQuery UI Autocomplete
  - SheetJS(xlsx) 기반 Excel 다운로드
- 구조 특징:
  - 프레임워크 없이 파일 단위로 라우팅
  - ORM/마이그레이션 없음
  - SQL이 PHP 파일에 직접 포함되어 있음
  - 공통 로직은 `includes/` 아래 함수 파일로 분리

> 참고: 아래 DB 구조는 현재 코드가 참조하는 SQL 객체 기준으로 정리한 내용입니다. 이 저장소 안에는 DDL, 마이그레이션, ERD 파일이 없어서 실제 DB의 전체 컬럼/인덱스는 코드로 확인 가능한 범위까지만 기술했습니다.

## 2. 루트 구조

```text
MOT/
├─ index.php                                  # 메인 대시보드
├─ channelPerformanceStatus.php               # 채널 성과 목록 팝업
├─ channelPerformanceStatusView.php           # 채널 성과 상세 팝업
├─ contentPerformanceStatus.php               # 콘텐츠 성과 목록 팝업
├─ contentPerformanceStatusView.php           # 콘텐츠 성과 상세 팝업
├─ contentPerformanceStatusViewGeneral.php    # 일반 콘텐츠 상세 대체/레거시 페이지
├─ ajax_titles.php                            # 콘텐츠 제목 자동완성 API
├─ index.html                                 # 정적 시안/초기 HTML
├─ channelPerformanceStatus.html              # 정적 시안
├─ channelPerformanceStatusView.html          # 정적 시안
├─ contentPerformanceStatus.html              # 정적 시안
├─ contentPerformanceStatusView.html          # 정적 시안
├─ channelPerformanceStatusView.php.bak       # 백업 파일
├─ contentPerformanceStatus.php.bak           # 백업 파일
├─ mot.zip                                    # 별도 압축 산출물
├─ config/
│  └─ db.php                                  # PDO 연결 설정
├─ includes/
│  ├─ head.php                                # 공통 head + 공통 script/css 로드
│  ├─ helpers.php                             # 포맷/라벨/공통 WHERE 생성 함수
│  ├─ render.php                              # 검색 UI 렌더 함수(현재 미사용)
│  └─ queries/
│     ├─ channel.php                          # 채널 조회 파라미터/쿼리 함수
│     ├─ content.php                          # 콘텐츠 조회 파라미터/쿼리 함수
│     └─ content.php.bak-20260416-watchtime   # watch time 작업 백업
├─ js/
│  ├─ common.js                               # 숫자 표시/팝업 오픈 공통 동작
│  ├─ jquery-3.7.1.min.js
│  └─ jquery-ui.min.js
├─ css/
│  ├─ comm.css                                # 메인 스타일
│  ├─ media.css                               # 반응형/미디어 쿼리 스타일
│  ├─ reset.css                               # CSS reset
│  ├─ jquery-ui.css                           # jQuery UI 스타일
│  ├─ fonts.css                               # Pretendard font-face
│  └─ fonts/                                  # Pretendard 폰트 파일
└─ img/
   ├─ common/                                 # 로고/아이콘/UI 이미지
   └─ sub/                                    # 서브 버튼 아이콘
```

## 3. 화면/라우팅 구조

### 3.1 메인 대시보드

- `index.php`
  - 당일(또는 선택일) 기준으로 두 개의 요약 패널을 표시
  - 좌측: 채널 구독자 증가 TOP 20
  - 우측: 콘텐츠 조회수 증가 TOP 20
  - 행 클릭 시 팝업 상세 페이지로 이동
  - 10분 주기 자동 새로고침 포함

### 3.2 채널 영역

- `channelPerformanceStatus.php`
  - 특정 일자의 채널 목록 조회
  - 플랫폼/채널/키워드/건수 필터 제공
  - 행 클릭 시 `channelPerformanceStatusView.php`로 이동

- `channelPerformanceStatusView.php`
  - 채널 상세 조회
  - `view_mode`
    - `date`: 일자별
    - `time`: 시간대별
    - `datetime`: 일자+시간대별
  - `v_channel_follower_summary` 또는 `channel_daily + m_channels` 조합 사용

### 3.3 콘텐츠 영역

- `contentPerformanceStatus.php`
  - 특정 일자의 콘텐츠 성과 목록 조회
  - 플랫폼/채널/키워드/건수 필터 제공
  - 행 클릭 시 `contentPerformanceStatusView.php`로 이동

- `contentPerformanceStatusView.php`
  - 콘텐츠 상세 조회
  - 조회수/좋아요/댓글/공유수 변화량 표시
  - 영상 플랫폼(`youtube`, `naver_tv`, `tiktok`)은 시청시간 관련 지표 추가 표시
  - 콘텐츠 원본 URL을 DB에서 조회해 제목 링크 제공

- `contentPerformanceStatusViewGeneral.php`
  - 일반 콘텐츠용 상세 페이지 성격의 대체 구현
  - 현재 다른 PHP 페이지에서 직접 연결되지는 않음
  - 내부에서 자기 자신으로만 라우팅하므로 레거시 또는 분기 실험 파일로 보는 것이 적절함

### 3.4 자동완성 API

- `ajax_titles.php`
  - `content_daily_cache`에서 콘텐츠 제목 목록 조회
  - `platform`, `channel`, `q` 파라미터 지원
  - JSON 반환

## 4. 공통 모듈 구조

### 4.1 DB 연결

- `config/db.php`
  - MariaDB 연결 정보 정의
  - DB명: `mot_dashboard`
  - 문자셋: `utf8mb4`
  - `getDB(): PDO` 싱글턴 함수 제공

### 4.2 공통 유틸

- `includes/helpers.php`
  - 플랫폼 라벨 매핑
  - 채널 라벨 매핑
  - 숫자/증감 포맷
  - HTML escape
  - 공통 필터 WHERE 절 생성

주요 플랫폼 코드:

- `youtube`
- `tiktok`
- `meta_fb`
- `meta_ig`
- `facebook`
- `instagram`
- `naver_blog`
- `naver_tv`
- `naver_cafe`

### 4.3 쿼리 계층

- `includes/queries/channel.php`
  - 채널 조회 파라미터 파싱
  - 채널 요약/상세/플랫폼 목록/채널 목록 조회

- `includes/queries/content.php`
  - 콘텐츠 조회 파라미터 파싱
  - 콘텐츠 요약/상세/플랫폼 목록/채널 목록/제목 자동완성 조회
  - 콘텐츠 URL 조회
  - TikTok/YouTube watch time 계산 로직 포함

### 4.4 공통 UI

- `includes/head.php`
  - 공통 `<head>` 템플릿
  - CSS/JS 로드
  - SheetJS CDN 로드

- `includes/render.php`
  - 검색 박스 렌더링 함수 `render_search_box()`
  - 현재 실제 PHP 화면에서는 호출되지 않음

### 4.5 프론트 동작

- `js/common.js`
  - 숫자 컬럼의 locale formatting
  - `.click_row` 클릭 시 새 창 팝업 오픈

- `css/comm.css`
  - 전반적인 레이아웃/테이블/팝업 UI 스타일 정의

## 5. 데이터 흐름

### 5.1 사용자 흐름

1. 사용자가 `index.php` 접속
2. 메인 요약 패널에서 채널/콘텐츠 행 클릭
3. 목록 팝업 또는 상세 팝업 오픈
4. 검색 조건 변경 시 GET 파라미터로 자기 페이지 재호출
5. Excel 다운로드는 현재 렌더된 HTML 테이블을 클라이언트에서 xlsx로 변환

### 5.2 코드 흐름

1. 각 진입 PHP 파일에서 `config/db.php` 로드
2. `helpers.php` 및 목적별 query 파일 로드
3. GET 파라미터 정규화
4. SQL 실행 후 결과 배열 획득
5. 서버 렌더링 HTML 출력
6. jQuery가 날짜 선택기, 자동완성, 팝업, Excel 다운로드를 담당

## 6. DB 구조

## 6.1 연결 정보

- DBMS: MariaDB
- 데이터베이스명: `mot_dashboard`
- 연결 방식: PDO MySQL 드라이버
- 문자셋/콜레이션: `utf8mb4`, `utf8mb4_unicode_ci`

## 6.2 코드에서 확인되는 핵심 DB 객체

### A. 리포팅/집계 뷰 및 캐시

#### `v_channel_follower_summary`

채널 구독자/팔로워 증감 요약 뷰로 사용됩니다.

코드에서 확인되는 컬럼:

- `snap_date`
- `platform`
- `channel_name`
- `prev_follower_count`
- `curr_follower_count`
- `follower_diff`

사용 위치:

- `index.php`
- `channelPerformanceStatus.php`
- `channelPerformanceStatusView.php`
- `includes/queries/channel.php`

#### `content_daily_cache`

콘텐츠 일 단위 성과 캐시 테이블 또는 물리화 캐시 성격의 객체로 보입니다.

코드에서 확인되는 컬럼:

- `snap_date`
- `platform`
- `channel_name`
- `content_id`
- `content_title`
- `content_type`
- `views`
- `views_diff`
- `likes`
- `likes_diff`
- `comments`
- `comments_diff`
- `shares`
- `shares_diff`
- `saves`
- `reactions`

사용 위치:

- `index.php`
- `ajax_titles.php`
- `includes/queries/content.php`

#### `v_content_daily_perf`

특정 일자의 콘텐츠 비교 성과 뷰입니다.

코드에서 확인되는 컬럼:

- `snap_date`
- `platform`
- `channel_name`
- `content_id`
- `content_title`
- `content_type`
- `views`
- `prev_views`
- `views_diff`
- `likes`
- `prev_likes`
- `likes_diff`
- `comments`
- `prev_comments`
- `comments_diff`

사용 위치:

- `includes/queries/content.php`의 `query_content_summary()`
- 결과적으로 `contentPerformanceStatus.php`

#### `v_content_snapshots_raw`

콘텐츠 시간대별 원시 스냅샷 집계 뷰입니다.

코드에서 확인되는 컬럼:

- `snap_date`
- `snap_hour`
- `platform`
- `channel_name`
- `content_id`
- `content_title`
- `content_type`
- `views`
- `likes`
- `comments`
- `shares`

사용 위치:

- `includes/queries/content.php`의 `query_content_by_mode()`

### B. 원천/마스터 테이블

#### `channel_daily`

채널 단위 시계열 원천 테이블입니다.

코드에서 확인되는 컬럼:

- `captured_at`
- `platform`
- `channel_id`
- `follower_count`

사용 목적:

- 시간대별/일자+시간대별 채널 상세 조회

#### `m_channels`

채널 마스터 테이블입니다.

코드에서 확인되는 컬럼:

- `platform`
- `channel_id`
- `channel_name`

사용 목적:

- `channel_daily`의 `channel_id`를 사람 읽을 수 있는 `channel_name`으로 매핑

### C. 플랫폼별 시청시간 지표 테이블

#### `tt_item_metrics`

TikTok 콘텐츠 메트릭 원천 테이블입니다.

코드에서 확인되는 컬럼:

- `item_id`
- `captured_at`
- `total_watch_time_sec`

사용 목적:

- 일/시간 단위 최신 snapshot 선별
- `LAG()`로 watch time 증가분 계산

#### `yt_video_metrics`

YouTube 영상 메트릭 원천 테이블입니다.

코드에서 확인되는 컬럼:

- `video_id`
- `captured_at`
- `watch_time_ms`
- `avg_view_duration_ms`
- `avg_pct_watched`

사용 목적:

- 총 시청시간
- 시간별 시청시간 증가량
- 평균 시청시간
- 시청 완료율 계산

### D. 콘텐츠 원본 URL 조회용 마스터

#### `yt_m_videos`

- 키 컬럼: `video_id`
- URL 컬럼: `url`

#### `tt_m_items`

- 키 컬럼: `item_id`
- URL 컬럼: `url`

#### `meta_m_posts`

- 키 컬럼: `post_id`
- URL 컬럼: `url`
- `meta_fb`, `meta_ig` 공용으로 사용

#### `ntv_m_clips`

- 키 컬럼: `item_no`
- URL 컬럼: `url`

#### `nb_m_contents`

- 키 컬럼: `content_id`
- URL 컬럼: `uri`
- 조회 후 `http -> https` 보정 수행

## 6.3 화면별 DB 사용 매핑

| 화면/파일 | 역할 | 주요 DB 객체 |
|---|---|---|
| `index.php` | 메인 요약 대시보드 | `v_channel_follower_summary`, `content_daily_cache` |
| `channelPerformanceStatus.php` | 채널 목록 | `v_channel_follower_summary` |
| `channelPerformanceStatusView.php` | 채널 상세 | `v_channel_follower_summary`, `channel_daily`, `m_channels` |
| `contentPerformanceStatus.php` | 콘텐츠 목록 | `v_content_daily_perf`, `content_daily_cache` |
| `contentPerformanceStatusView.php` | 콘텐츠 상세 | `content_daily_cache`, `v_content_snapshots_raw`, `tt_item_metrics`, `yt_video_metrics`, URL 마스터 테이블 |
| `contentPerformanceStatusViewGeneral.php` | 일반 콘텐츠 상세 대체 구현 | `content_daily_cache`, `v_content_snapshots_raw`, URL 마스터 테이블 |
| `ajax_titles.php` | 자동완성 | `content_daily_cache` |

## 6.4 개념적 데이터 모델

```text
channel_daily --------┐
                      ├─> m_channels와 결합 -> 시간대별 채널 상세
v_channel_follower_summary
                      └─> 메인/목록/일자별 채널 집계

content_daily_cache ------------------------------┐
v_content_daily_perf -----------------------------┤
v_content_snapshots_raw --------------------------┤
tt_item_metrics + yt_video_metrics --------------┤
yt_m_videos / tt_m_items / meta_m_posts / ... ---┘
                              ↓
                    콘텐츠 목록/상세/원본 링크 제공
```

## 7. 파일 성격별 분류

### 7.1 실제 실행 경로

- `index.php`
- `channelPerformanceStatus.php`
- `channelPerformanceStatusView.php`
- `contentPerformanceStatus.php`
- `contentPerformanceStatusView.php`
- `ajax_titles.php`

### 7.2 정적 시안/초기 HTML

- `index.html`
- `channelPerformanceStatus.html`
- `channelPerformanceStatusView.html`
- `contentPerformanceStatus.html`
- `contentPerformanceStatusView.html`

이 파일들은 PHP 로직 없이 마크업 중심의 정적 샘플 역할로 보는 것이 적절합니다.

### 7.3 백업/임시 성격 파일

- `channelPerformanceStatusView.php.bak`
- `contentPerformanceStatus.php.bak`
- `includes/queries/content.php.bak-20260416-watchtime`
- `mot.zip`

## 8. 현재 구조의 특징 및 주의점

- 프레임워크가 없어서 파일 간 의존관계가 단순하지만, SQL/HTML/JS가 페이지별로 섞여 있어 수정 범위가 넓어질 수 있습니다.
- DB 스키마 정의 파일이 저장소에 없으므로 운영 DB 변경 이력은 별도로 관리되고 있을 가능성이 큽니다.
- `config/db.php`에 DB 접속 정보가 하드코딩되어 있습니다.
- `includes/render.php`는 공통화 시도 흔적이지만 현재 미사용입니다.
- `contentPerformanceStatusViewGeneral.php`는 현재 메인 흐름에서 연결되지 않는 별도 구현입니다.
- 팝업 오픈 로직이 `js/common.js`에 공통으로 묶여 있어, `.click_row` 클래스가 붙은 모든 행은 새 창으로 열립니다.

## 9. 요약

이 프로젝트는 `index.php`를 중심으로 채널/콘텐츠 성과를 팝업으로 drill-down 하는 전통적인 PHP 대시보드 구조입니다.  
코드 기준으로 보면 DB는 `mot_dashboard` 하나에 채널 집계 뷰, 콘텐츠 캐시/성과 뷰, 플랫폼별 원천 메트릭 테이블, URL 마스터 테이블이 함께 구성되어 있고, PHP는 이 객체들을 직접 조회해 화면을 렌더링합니다.