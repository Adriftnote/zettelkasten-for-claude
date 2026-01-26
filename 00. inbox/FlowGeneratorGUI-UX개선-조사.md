# FlowGeneratorGUI UX/UI 개선 조사

> PowerShell WinForms GUI의 UX/UI 개선 가능성 조사 결과

## 배경

FlowGeneratorGUI.ps1 (Flow Task Creator)의 사용성 개선을 위한 옵션 조사.

---

## 현재 GUI 분석

### 구성 요소

| 요소 | 현재 상태 |
|------|----------|
| 프레임워크 | PowerShell WinForms |
| 창 크기 | 720x620 고정 |
| 구조 | ListBox 3개 (Groups/Tasks/Subtasks) |
| 프리뷰 | TextBox (트리 텍스트) |
| 버튼 | +/- 텍스트 버튼 |

### 문제점

1. **계층 구조 비직관적**: 3개 ListBox가 분리되어 있어 전체 구조 파악 어려움
2. **고정 크기**: 창 크기 조절 불가
3. **구식 스타일**: Windows XP 느낌의 기본 WinForms
4. **도움말 없음**: 처음 사용자 혼란 가능
5. **드래그앤드롭 없음**: 순서 변경 시 삭제 후 재추가 필요

---

## 개선 옵션

### 옵션 1: WPF로 마이그레이션 (대규모)

#### 개요
WinForms → WPF (Windows Presentation Foundation) 전면 재작성

#### 장점
- 모던한 UI (Windows 테마 자동 적용)
- 고해상도 디스플레이 완벽 지원
- XAML로 디자인/로직 분리
- 반응형 레이아웃 쉬움
- 애니메이션, 스타일링 자유도 높음

#### 단점
- 전체 재작성 필요 (작업량 많음)
- PS2EXE 호환성 확인 필요
- XAML 학습 필요

#### 참고 자료
- [PowerShell WPF GUI Tutorial - ScriptRunner](https://www.scriptrunner.com/blog-admin-architect/powershell-wpf-gui-tutorial)
- [PowerShell GUI with WPF - Clayton Errington](https://claytonerrington.com/blog/powershell-gui-with-wpf/)
- [PowerShell XAML GUI - ScriptRunner](https://www.scriptrunner.com/resources/powershell-tips/powershell-xaml-gui)

---

### 옵션 2: TreeView로 변경 (중규모)

#### 개요
ListBox 3개 → TreeView 1개로 변경

#### 변경 전
```
[Groups ListBox] [Tasks ListBox] [Subtasks ListBox]
     Group 1          Task 1         Subtask 1
     Group 2          Task 2         Subtask 2
```

#### 변경 후
```
[TreeView]
Project
├── Group 1
│   ├── Task 1
│   │   ├── Subtask 1
│   │   └── Subtask 2
│   └── Task 2
└── Group 2
    └── Task 3
```

#### 장점
- 계층 구조 직관적 표현
- 드래그앤드롭으로 순서 변경 가능
- 코드 복잡도 감소 (이벤트 핸들러 단순화)
- 확장/축소 기능 내장

#### 단점
- 기존 ListBox 로직 전면 수정 필요
- TreeView 노드 관리 로직 새로 작성

#### 구현 핵심
```powershell
# TreeView 드래그앤드롭 설정
$treeView.AllowDrop = $true
$treeView.Add_ItemDrag({ ... })
$treeView.Add_DragEnter({ ... })
$treeView.Add_DragDrop({ ... })
```

#### 참고 자료
- [TreeView.ItemDrag Event - Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/api/system.windows.forms.treeview.itemdrag)
- [WinForms TreeView Drag and Drop - GitHub](https://github.com/NikolaGrujic91/WinForms-Tree-View-Drag-And-Drop)

---

### 옵션 3: 현재 WinForms에서 개선 (소규모)

#### 개요
기존 구조 유지하면서 점진적 개선

#### 개선 항목

| 항목 | 난이도 | 설명 |
|------|--------|------|
| **Tooltips 추가** | 쉬움 | 버튼/입력 필드에 설명 추가 |
| **색상/폰트 개선** | 쉬움 | 더 현대적인 색상 조합 |
| **창 크기 조절** | 중간 | Anchor/Dock 속성 활용 |
| **아이콘 버튼** | 중간 | +/- 대신 아이콘 이미지 |
| **입력 검증 피드백** | 중간 | 빨간 테두리, 실시간 에러 |
| **Context Menu** | 중간 | 우클릭 메뉴 (삭제/수정/복사) |
| **키보드 단축키** | 쉬움 | Enter로 추가, Delete로 삭제 |
| **Progress 표시** | 쉬움 | 폴더 생성 시 진행 상황 |

#### 구현 예시

**Tooltip 추가:**
```powershell
$tooltip = New-Object System.Windows.Forms.ToolTip
$tooltip.SetToolTip($btnAddGroup, "Add new group (Enter)")
```

**Anchor로 반응형:**
```powershell
$listGroups.Anchor = [System.Windows.Forms.AnchorStyles]::Top -bor
                     [System.Windows.Forms.AnchorStyles]::Left -bor
                     [System.Windows.Forms.AnchorStyles]::Bottom
```

**키보드 단축키:**
```powershell
$txtNewGroup.Add_KeyDown({
    if ($_.KeyCode -eq [System.Windows.Forms.Keys]::Enter) {
        $btnAddGroup.PerformClick()
    }
})
```

---

## 비교 요약

| 항목 | 옵션 1 (WPF) | 옵션 2 (TreeView) | 옵션 3 (개선) |
|------|-------------|------------------|--------------|
| 작업량 | 대 | 중 | 소 |
| UI 품질 | ★★★★★ | ★★★★☆ | ★★★☆☆ |
| 유지보수 | 좋음 | 보통 | 보통 |
| 학습 필요 | XAML | TreeView API | 없음 |
| PS2EXE 호환 | 확인 필요 | 호환 | 호환 |

---

## 추천

| 상황 | 추천 옵션 |
|------|----------|
| 빠른 개선 필요 | **옵션 3** - 현재 WinForms 점진적 개선 |
| 시간 있고 품질 중요 | **옵션 2** - TreeView로 변경 |
| 장기 유지보수 계획 | **옵션 1** - WPF 마이그레이션 |

---

## 도구

| 도구 | 설명 | 링크 |
|------|------|------|
| PoshGUI | 온라인 PowerShell GUI 디자이너 | [poshgui.com](https://poshgui.com/) |
| PowerShell Studio | 상용 GUI 디자이너 (SAPIEN) | [sapien.com](https://www.sapien.com/software/powershell_studio) |
| Visual Studio | WPF XAML 디자이너 | - |

---

## 관련 Task

- task-20260126-004: FlowGenerator GUI 버전 개발

