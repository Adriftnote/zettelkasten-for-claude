---
title: REF-091 Playwright Headless 모드 — Docker 환경 브라우저 실행 가이드
type: doc-summary
permalink: sources/reference/playwright-headless-docker-guide
tags:
- playwright
- headless
- docker
- chromium
date: 2026-03-10
---

# Playwright Headless 모드 — Docker 환경 브라우저 실행 가이드

Playwright에서 GUI 없이 Chromium을 실행하는 headless 모드 설정과 Docker 환경 최적화 플래그 정리.

## 📖 핵심 아이디어

Headless 모드는 브라우저 창(GUI) 없이 백그라운드에서 브라우저를 실행하는 방식이다. 모니터가 없는 서버/Docker/NAS 환경에서 Playwright를 돌리려면 필수이며, 추가로 Chromium의 리소스 제한 문제를 해결하는 플래그가 함께 필요하다.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| `headless: true` | GUI 없이 백그라운드 실행 (서버/Docker용) |
| `headless: false` | 브라우저 창 표시 (로컬 개발/디버깅용) |
| `--no-sandbox` | Docker root 사용자 환경에서 sandbox 비활성화 |
| `--disable-gpu` | GPU 없는 환경에서 CPU 100% 문제 방지 |
| `--disable-dev-shm-usage` | Docker 기본 공유메모리(64MB) 제한 회피 |
| `--init` 플래그 | PID=1 zombie 프로세스 방지 (docker run 옵션) |
| `--ipc=host` 플래그 | Chromium OOM 크래시 방지 (docker run 옵션) |

## 🔧 작동 방식 / 적용 방법

### 환경변수 기반 headless 분기

```javascript
// 환경변수로 headless 모드 제어
const HEADLESS = process.env.HEADLESS !== 'false';
// Docker: HEADLESS 미설정 → true (화면 없이)
// 로컬:  HEADLESS=false     → false (창 표시)
```

### Docker 전용 Chromium 실행 인자

```javascript
const browser = await chromium.launchPersistentContext(userDataDir, {
  headless: HEADLESS,
  args: [
    '--no-sandbox',            // root 사용자 필수
    '--disable-gpu',           // headless CPU 100% 방지
    '--disable-dev-shm-usage', // /dev/shm 64MB 제한 회피
  ],
});
```

### Docker 실행 명령

```bash
docker run --init --ipc=host \
  -e HEADLESS=true \
  -e WEBHOOK_BASE_URL=http://192.168.0.9:5678 \
  sns-collector
```

### 베이스 이미지

```
mcr.microsoft.com/playwright:v1.58.2-noble
```
- Ubuntu 24.04 기반, Chromium 포함
- package.json의 playwright 버전과 반드시 일치 필요
- Alpine Linux 미지원 (glibc 의존)

## 💡 실용적 평가 / 적용

**장점**
- 하드코딩 제거 → 동일 코드로 로컬 개발과 Docker 배포 가능
- 환경변수 하나로 모드 전환

**주의점**
- `--disable-gpu` 없으면 headless에서 CPU 100% 먹는 알려진 이슈 (playwright#37830)
- `--ipc=host`는 보안상 production에서는 `--shm-size=1gb` 대안 고려
- persistent context 사용 시 `/app/playwright-data/` 볼륨 마운트 필수 (세션 유지)

## 🔗 관련 개념

- [[NAS Docker 배포 경험 (n8n + Metabase)]] - (Docker NAS 배포 실전 경험, headless Playwright 참고사항 포함)
- [[playwright-sns-collector]] - (headless 설정이 적용되는 수집 모듈)

---

**작성일**: 2026-03-10
**분류**: DevOps / Browser Automation
**원본**: [Playwright Docker 공식 문서](https://playwright.dev/docs/docker), [CPU 100% 이슈 #37830](https://github.com/microsoft/playwright/issues/37830)