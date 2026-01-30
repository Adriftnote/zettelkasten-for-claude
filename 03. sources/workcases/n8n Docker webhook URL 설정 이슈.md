---
title: n8n Docker webhook URL 설정 이슈
type: note
permalink: troubleshooting/n8n-docker-webhook-url-seoljeong-isyu
tags:
- n8n
- docker
- webhook
- localhost
- 네트워크
---

# n8n Docker webhook URL 설정 이슈

## 증상
- n8n 워크플로우의 webhook 노드에서 production URL이 `http://localhost:5678/webhook/...`로 표시됨
- 하지만 실제로 외부(Chrome 확장프로그램 등)에서 접근하려면 `http://192.168.0.9:5678/webhook/...` 사용해야 함

## 원인
- n8n이 Docker에서 실행될 때 `WEBHOOK_URL` 또는 `N8N_HOST` 환경변수가 설정되지 않음
- Docker 내부에서는 localhost가 컨테이너 자체를 가리키므로 표시가 localhost로 됨

## 해결 방법
Docker compose 또는 환경변수에서 설정:
```
WEBHOOK_URL=http://192.168.0.9:5678
```
또는
```
N8N_HOST=192.168.0.9
```

## 실제 영향
- **작동에는 영향 없음** - 확장프로그램에서 192.168.0.9 주소로 직접 설정하면 정상 작동
- 단지 n8n UI에서 보여주는 production URL 표시만 localhost로 나옴

## 관련 사례
- 2026-01-30: Social Analytics Extractor 페이스북 webhook 저장 실패
- 확장프로그램 webhook URL을 192.168.0.9로 변경하여 해결
