---
title: NAS Docker 배포 경험 (n8n + Metabase)
type: workcase
permalink: sources/workcases/nas-docker-deploy-n8n-metabase
tags:
- NAS
- Docker
- 배포
- n8n
- Metabase
- Synology
- infrastructure
---

# NAS Docker 배포 경험 (n8n + Metabase)

> n8n + Metabase를 Synology NAS Docker로 이관하면서 학습한 내용 (2025-12-02 ~ 2025-12-10)
> source: C:\Projects\infra\nas-n8n-deploy, C:\Projects\infra\metabase-dashboard

## 상황 (Situation)

로컬 Windows PC에서 동작하던 n8n 워크플로우(TikTok/YouTube/Instagram 데이터 수집)를 Synology NAS Docker로 이전. PC 의존 제거 및 24시간 안정 실행 환경 필요. 이후 Metabase 대시보드도 동일 NAS에 배포.

## 핵심 아키텍처

### NAS 환경 정보
- NAS IP: 192.168.0.9
- SSH: `ssh admin123@192.168.0.9` (ed25519 키 인증)
- Container Manager (Docker) 사용

### Docker 컨테이너 구성

#### n8n (포트 5678)
```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports: ["5678:5678"]
    environment:
      - GENERIC_TIMEZONE=Asia/Seoul
      - TZ=Asia/Seoul
      - NODE_ENV=production
      - N8N_SECURE_COOKIE=false
      - WEBHOOK_URL=http://localhost:5678/
      - N8N_USER_FOLDER=/home/node/.n8n
    volumes:
      - /volume1/docker/n8n/data:/home/node/.n8n
      - /volume1/docker/n8n/files:/files
    user: "0:0"
```

#### Metabase (포트 3001)
```yaml
services:
  metabase:
    image: metabase/metabase:latest
    container_name: metabase
    ports: ["3001:3000"]
    volumes:
      - /volume1/docker/metabase/metabase-data:/metabase.db
      - /volume1/docker/n8n/databases:/databases:ro
    environment:
      MB_DB_FILE: /metabase.db/metabase.db
      MB_SITE_NAME: "Data Dashboard"
      JAVA_TIMEZONE: Asia/Seoul
    restart: unless-stopped
```

### NAS 볼륨 매핑 (n8n)

| 호스트 (NAS) | 컨테이너 | 용도 |
|---|---|---|
| /volume1/docker/n8n/data | /home/node/.n8n | n8n 데이터 (워크플로우, 실행기록) |
| /volume1/docker/n8n/files | /files | 파일 저장소 |
| /volume1/docker/n8n/databases | /mnt/nas1/n8n-data/databases | SQLite DB들 |
| /volume1/docker/n8n/tokens | /mnt/nas1/n8n-data/tokens | API 토큰 파일들 |

### SQLite DB 목록

| DB | 컨테이너 경로 |
|---|---|
| dashboard_atomic.db | /mnt/nas1/n8n-data/databases/dashboard_atomic.db |
| youtube_analytics.db | /mnt/nas1/n8n-data/databases/youtube_analytics.db |
| instagram_analytics.db | /mnt/nas1/n8n-data/databases/instagram_analytics.db |
| tiktok_analytics.db | /mnt/nas1/n8n-data/databases/tiktok_analytics.db |

## 트러블슈팅 & 학습

### 1. Docker 권한 문제
- **EACCES 에러** → `user: "0:0"` (root) 추가로 해결
- **Metabase AccessDeniedException** → `MB_DB_FILE` 환경변수 제거 + `user: 0:0` + `chmod 777`
- **SQLite 연결 실패** → `:ro` (읽기 전용) 제거 필요 (SQLite 저널 파일 생성 때문)
- Metabase에서 n8n DB 읽기만 할 때는 `:ro` 사용 가능

### 2. YouTube OAuth 문제
- Google OAuth는 IP 주소/비공식 도메인 콜백 불허
- **해결**: Device Flow 방식 전환 (콜백 URL 없이 인증)
- TikTok/Instagram/YouTube 3개 플랫폼 모두 파일 기반 토큰으로 통일

### 3. n8n Code 노드 fs 모듈
- 로컬 n8n은 샌드박스로 fs 모듈 비활성화
- **해결**: Read Binary File 노드 + `Buffer.from(base64)` 파싱
- 로컬/NAS 둘 다 작동하는 패턴

### 4. 경로 변환 규칙
- 로컬 Windows 경로 → NAS Linux 경로로 변환 필요
- 워크플로우 JSON 내 모든 경로 수정: `C:\...\databases\` → `/mnt/nas1/n8n-data/databases/`
- 호스트에서 파일 업로드: `/volume1/docker/n8n/databases/`
- 워크플로우에서 호출: `/mnt/nas1/n8n-data/databases/`
- **주의**: 두 경로 혼동 주의 (호스트 vs 컨테이너)

### 5. NAS DB 동기화 이슈
- DB 파일 교체 시 inode 변경 → Docker 마운트 끊김
- Metabase에서 DB 재연결 필요할 수 있음

### 6. N8N_SECURE_COOKIE
- HTTP 환경(NAS 로컬)에서 쿠키 에러 발생
- `N8N_SECURE_COOKIE=false` 설정으로 해결

## 이관 절차 (체크리스트)

### Phase 1: Docker 환경 구성
1. Container Manager 설치 확인
2. `/volume1/docker/{서비스명}/` 폴더 생성
3. docker-compose.yml 작성
4. 컨테이너 실행
5. 웹 UI 접속 확인
6. 타임존, 환경변수 설정

### Phase 2: 데이터/워크플로우 이관
1. 로컬에서 export (JSON)
2. NAS에서 import
3. Credential 재등록 (토큰 파일 업로드)
4. 경로 수정 (Windows → Linux)
5. 각 워크플로우 수동 실행 테스트

### Phase 3: 스케줄 검증
1. NAS 스케줄 트리거 활성화
2. 로컬 스케줄 비활성화 (중복 방지)
3. 3일간 자동 실행 확인
4. NAS를 Primary 환경으로 전환

### 롤백 계획
- NAS 스케줄 비활성화 → 로컬 스케줄 재활성화 → 문제 분석 후 재시도

## Playwright 배포 시 참고사항

### 추가 고려사항 (n8n/Metabase와 다른 점)
- **브라우저 세션**: persistent context로 세션 유지 필요
- **headless 모드**: NAS에서는 headless 필수 (GUI 없음)
- **Chromium 의존성**: Playwright Docker 이미지 사용 또는 별도 Chromium 설치
- **세션 만료**: 각 플랫폼 로그인 세션 만료 시 수동 재로그인 프로세스 필요
- **스케줄**: collect-channels(채널 일별) + collect-posts(게시물 스냅샷) 분리 또는 통합 결정
- **볼륨 마운트**: playwright-data (세션), databases (DB 공유), 스크립트 소스

### outputs 예정 문서
- `outputs/26.1Q/.../7. NAS Docker 배포 및 자동화.md` (완료예정: 3/18)

## 원본 프로젝트 위치

| 프로젝트 | 경로 |
|---|---|
| n8n NAS 배포 | C:\\Projects\\infra\\nas-n8n-deploy\\ |
| Metabase 대시보드 | C:\\Projects\\infra\\metabase-dashboard\\ |
| 데이터 모니터링 | C:\\Projects\\infra\\data-monitoring\\ |

## 관련 Task
- (해당 Task 연결 시 추가)

## Relations
- uses [[Docker]] (컨테이너 배포 환경)
- uses [[n8n]] (워크플로우 자동화 플랫폼)
- uses [[Metabase]] (데이터 대시보드)
- uses [[SQLite]] (경량 DB — 볼륨 마운트 + 저널 파일 이슈)
- uses [[OAuth]] (YouTube Device Flow 인증)
- implemented_in [[nas-ssh-connect]] (NAS SSH 접속 함수)
- implemented_in [[send-to-n8n]] (n8n 웹훅 전송 함수)
- applied_in [[playwright-sns-collector]] (동일 NAS에 후속 배포 예정)
- applied_in [[collect-channels]] (NAS 스케줄 실행으로 전환)
- applied_in [[collect-posts]] (NAS 스케줄 실행으로 전환)
- led_to [[n8n Docker webhook URL 설정 이슈]] (배포 후 webhook 문제 발생)
- led_to [[metabase-mcp-patterns-summary]] (Metabase 활용 패턴 정리)
- part_of [[SNS 기초 데이터 수집 자동화]] (전체 수집 파이프라인의 인프라 이관)

## Observations
- [fact] Docker에서 EACCES 에러 시 `user: "0:0"` (root)로 해결 가능 #Docker #권한
- [fact] Google OAuth는 IP 주소/비공식 도메인 콜백을 불허함 #OAuth #Google
- [fact] n8n Code 노드는 샌드박스로 fs 모듈 비활성화됨 #n8n
- [fact] DB 파일 교체 시 inode 변경으로 Docker 마운트 끊김 가능 #Docker #SQLite
- [solution] YouTube OAuth는 Device Flow 방식으로 콜백 URL 없이 인증 #OAuth #YouTube
- [solution] fs 모듈 대신 Read Binary File 노드 + `Buffer.from(base64)` 패턴 사용 #n8n
- [warning] 호스트 경로(`/volume1/...`)와 컨테이너 경로(`/mnt/...`) 혼동 주의 #Docker
- [warning] SQLite는 저널 파일 생성하므로 `:ro` 마운트 시 쓰기 실패 가능 #SQLite #Docker
- [method] 로컬→NAS 이관 시 워크플로우 JSON 내 모든 Windows 경로를 Linux 경로로 변환 #n8n #Docker
- [tech] HTTP 환경에서 `N8N_SECURE_COOKIE=false` 설정 필요 #n8n
- [tech] Metabase에서 n8n DB 읽기전용 접근 시 `:ro` 마운트 사용 가능 #Metabase #Docker
