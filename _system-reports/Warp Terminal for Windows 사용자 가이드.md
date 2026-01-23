---
title: Warp Terminal for Windows 사용자 가이드
type: note
permalink: knowledge/warp-terminal-for-windows-sayongja-gaideu
tags:
- warp-terminal
- windows
- claude-code
- cli-tools
- productivity
- korean
---

# Warp Terminal for Windows 사용자 가이드

**작성**: 2026-01-15
**대상**: Windows 사용자, Claude Code 워크플로우

---

## 1. 필수 키보드 단축키

### 기본 네비게이션
| 단축키 | 기능 |
|--------|------|
| `CTRL-SHIFT-P` | Command Palette 열기 (설정, 기능 검색) |
| `CTRL-,` | Settings 열기 |
| `CTRL-SHIFT-/` | 키보드 단축키 목록 보기 |

### 탭 관리 (Tab Management)
| 단축키 | 기능 |
|--------|------|
| `CTRL-SHIFT-T` | 새 탭 열기 |
| `CTRL-SHIFT-W` | 현재 탭 닫기 |
| `CTRL-SHIFT-LEFT` | 탭을 왼쪽으로 이동 |
| `CTRL-SHIFT-RIGHT` | 탭을 오른쪽으로 이동 |
| `CTRL-PGUP` | 이전 탭 활성화 |
| `CTRL-PGDN` | 다음 탭 활성화 |
| `CTRL-1 ~ CTRL-8` | 1~8번째 탭 즉시 전환 |
| `CTRL-9` | 마지막 탭으로 이동 |
| `CTRL-ALT-T` | 닫은 탭 다시 열기 |

### 분할 창 (Split Panes)
- 문서 참조: [Split Panes | Warp](https://docs.warp.dev/terminal/windows/split-panes)

### 글로벌 핫키
- **기능**: Warp 윈도우를 어디서나 표시/숨김 (포커스 상관없음)
- **설정**: Settings > Features > Keys > "Show/hide all windows" 드롭다운
- **용도**: Claude Code 작업 중 빠르게 터미널 띄우기

---

## 2. 생산성 향상 기능

### Block 기반 인터페이스
- **설명**: 명령어와 출력이 원자적 단위(Block)로 그룹화됨
- **장점**: 이력 관리, 재실행, 컨텍스트 추적 용이
- **클라우드 타입 워크플로우**: 명령어별로 입력/출력을 깔끔하게 관리

### Active AI 기능
- **AI 명령어 제안**: 자연언어로 명령어 설명 입력 → AI가 셸 명령어 생성
- **보안**: Secret Redaction 기능으로 민감 정보 자동 마스킹
- **주의**: AI 요청 소비
  - 실시간 명령어 제안 시 입력 중에도 요청 소비 (제출 전)
  - 복잡한 상호작용은 여러 요청 사용
  - 대용량 컨텍스트/파일 첨부 시 요청 증가

### IDE 같은 입력 에디터
- 현대적인 텍스트 에디터 경험 (일반 터미널과 다름)
- 마우스 지원, 다중 행 편집, 문법 강조

---

## 3. 세션/탭 관리 팁

### Session Restoration (세션 복구)
- **기능**: Warp 종료 후 재실행 시 이전 윈도우, 탭, 창 분할 상태 복구
- **포함**: 마지막 몇 개 Block 히스토리 포함
- **설정**: Settings에서 "Restore session on startup" 활성화

### Launch Configurations (시작 설정 저장)
- **용도**: 자주 사용하는 윈도우/탭/창 분할 구성 저장
- **장점**: 프로젝트별 작업 환경 빠르게 재현
- **예시**: Claude Code 작업용 (메인 탭), 빌드 모니터링 탭, 로그 탭 등

### Tabs 커스터마이징
- 각 탭에 **제목** 및 **ANSI 색상** 지정 가능
- 시각적 구분으로 작업 효율성 증대

---

## 4. Claude Code와의 통합

### 자동 통합 설정
```bash
# Claude Code에서 실행
/terminal-setup
```
- **기능**: Warp의 `Shift+Enter` 키바인딩 자동 설정
- **효과**: Claude Code 프롬프트 창에서 Enter → Warp에서 명령어 실행

### 상보적 역할
| 도구 | 강점 | 용도 |
|------|------|------|
| **Warp** | 터미널 네이티브 AI, 블록 기반 UI | 대화형 명령어 실행, 히스토리 관리 |
| **Claude Code** | CLI 통합, 서브 에이전트 | 코드 생성, 자동화, 마크다운 문서 편집 |

### WARP.md 파일 활용
- **호환성**: `agents.md`, `claude.md`, `WARP.md` 모두 지원
- **용도**: Warp 에이전트와 정보 공유
- **효과**: 프로젝트별 설정/규칙 일관성 유지

### 통합 시 주의사항
- **Warpify 이슈**: Claude Code 세션에서 Warpify 기능 사용 시 셸 초기화 코드가 직접 출력되는 문제
  - **해결**: Claude Code 세션 내에서는 일반 터미널 사용, Warp 네이티브 세션에서 Warpify 활용

---

## 5. Windows 특화 고려사항

### 지원 셸
| 셸 | 지원 | 비고 |
|----|------|------|
| **PowerShell** | ✓ | 권장 (Windows 표준) |
| **WSL** | ✓ | Linux 워크플로우 |
| **Git Bash** | ✓ | Git 기반 프로젝트 |
| **CMD** | ✗ | 기본 기능 부족으로 미지원 |

### 플랫폼 지원
- **x64**: 표준
- **ARM64**: 최신 Windows on ARM 지원

### 알려진 제한 사항

#### 1. 그래픽 드라이버 호환성
- **문제**: NVIDIA 572.xx 이상, AMD 23.10.x 이상에서 충돌
  - Launch Configuration 열기 시 크래시
  - 투명도 적용 실패
- **해결**: 그래픽 드라이버 버전 확인, 필요시 다운그레이드 검토

#### 2. 구형 프로세서
- **문제**: AMD Phenom II 등 SSE4.1 미지원 프로세서에서 실행 불가
- **이유**: Rust 기반 렌더링 엔진의 instruction set 요구사항
- **영향**: 레거시 하드웨어 사용자 제약

#### 3. ConPTY (Windows Terminal Protocol) 이슈
- **배경**: Warp 팀이 Microsoft ConPTY를 fork하여 개선
- **개선사항**: 모든 escape sequence 전달, 순서 보정, 터미널 상태 캐싱 개선
- **사용자 영향**: 대부분 투명함 (자동 처리)

#### 4. WSL 호환성
- WSL 지원은 설정마다 성공 정도가 다름
- 테스트 후 사용 권장

---

## 6. 카스텀 키보드 단축키 설정

### 설정 파일 위치 (Windows)
```
%LOCALAPPDATA%\warp\Warp\config\keybindings.yaml
```

### 단축키 커스터마이징 프로세스
1. **백업**: 기존 `keybindings.yaml` 저장
2. **편집**: YAML 형식으로 단축키 수정
3. **선택 사항**: GitHub에 공개된 [Keysets](https://github.com/warpdotdev/keysets) 사용

### 기본 단축키 vs 커스텀
- **기본값 사용**: Settings > Keyboard Shortcuts에서 "Default" 선택
- **초기화**: 오류 발생 시 `keybindings.yaml` 삭제 후 재실행

---

## 7. Claude Code 워크플로우 최적화 팁

### 권장 설정
1. **Global Hotkey 설정**: `CTRL-BACKTICK` 또는 선호 단축키
   - Claude Code 작업 중 빠르게 터미널 전환
   
2. **Session Restoration 활성화**
   - 이전 세션 자동 복구로 작업 연속성 유지

3. **프로젝트별 탭 구성**
   - 탭 1: 메인 작업 (Claude Code 실행)
   - 탭 2: 빌드/테스트 모니터링
   - 탭 3: 로그 확인
   - 탭 4: 임시 스크립트 실행

4. **Launch Configuration 저장**
   - 자주 사용하는 프로젝트별 환경 구성 미리 저장
   - 프로젝트 재개 시 시간 절약

### AI 기능 효율적 사용
- **명령어 제안**: 복잡한 셸 문법 → AI 제안으로 빠르게 생성
- **요청 절약**: 자동 제안 끄기 → 필요할 때만 AI 호출
  - Settings > Features > Active AI에서 조정

---

## 8. 참고 자료

### 공식 문서
- [Keyboard Shortcuts | Warp](https://docs.warp.dev/getting-started/keyboard-shortcuts)
- [Global Hotkey | Warp](https://docs.warp.dev/terminal/windows/global-hotkey)
- [Tabs | Warp](https://docs.warp.dev/terminal/windows/tabs)
- [Session Management | Warp](https://docs.warp.dev/terminal/sessions)
- [Launch Configurations | Warp](https://docs.warp.dev/terminal/sessions/launch-configurations)
- [Session Restoration | Warp](https://docs.warp.dev/terminal/sessions/session-restoration)

### Claude Code 통합
- [Optimize your terminal setup - Claude Code Docs](https://code.claude.com/docs/en/terminal-config)
- [Warp VS Claude Code - Warp University](https://www.warp.dev/university/getting-started/warp-vs-claude-code)

### 커뮤니티 자료
- [GitHub - Warp Keysets](https://github.com/warpdotdev/keysets)
- [Known Issues | Warp](https://docs.warp.dev/support-and-billing/known-issues)

---

## 요약

**Warp + Claude Code 통합 근본 목표:**
- **Warp**: AI 기반 터미널 네이티브 환경, 블록 기반 히스토리 관리
- **Claude Code**: 문맥 기반 코드 에이전트, 문서 자동화
- **결합**: 최소 단축키로 코드 생성 → 즉시 실행 → 결과 확인 → 다음 개선

**Windows 사용자 체크리스트:**
- [ ] Global Hotkey 설정 (기본값: 없음, 직접 설정)
- [ ] PowerShell 또는 WSL 선택 (CMD 제외)
- [ ] `/terminal-setup` 실행 (Claude Code)
- [ ] 그래픽 드라이버 버전 확인 (NVIDIA, AMD)
- [ ] Session Restoration 활성화
- [ ] 탭 구성 및 Launch Configuration 저장
