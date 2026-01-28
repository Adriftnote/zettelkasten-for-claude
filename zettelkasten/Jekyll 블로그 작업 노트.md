---
title: Jekyll 블로그 작업 노트
type: note
tags:
- jekyll
- github-pages
- blog
- writing
---

# Jekyll 블로그 작업 노트

## 프로젝트 정보

- **Repository**: https://github.com/Adriftnote/adriftnote.github.io
- **URL**: https://adriftnote.github.io
- **테마**: 커스텀 (카드형 레이아웃, 미니멀)

## Jekyll 설정 팁

### future: true 설정

GitHub Pages는 UTC 기준. 한국(UTC+9)에서 오늘 날짜로 글 쓰면 "미래" 취급되어 안 보임.

```yaml
# _config.yml
future: true
```

### 테이블 스타일링

Jekyll 기본 테마에 테이블 CSS 없음. 직접 추가 필요.

```css
.post-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.post-content th,
.post-content td {
  border: 1px solid var(--color-border);
  padding: 0.75rem 1rem;
  text-align: left;
}

.post-content th {
  background: #f8f8f8;
  font-weight: 600;
}
```

## 글쓰기 스타일

### Klinkenborg 스타일 (Several Short Sentences)

- 한 문장, 한 생각
- 짧은 문장 위주
- 단, 너무 잘게 쪼개면 리듬 깨짐 ("Recognition. Meaning." 같은 한 단어 문장 피하기)
- 완결된 생각 단위 유지
- 긴 문장과 짧은 문장 적절히 섞기

**좋은 예:**
> When two people look at the same screen, one points and says "this part right here." Instant understanding.
>
> But looking at different things? The conversation falls apart.

**피할 것:**
> Recognition. Meaning. (너무 짧음, 의미 전달 약함)

## 썸네일 이미지

### 설정 방법

포스트 front matter에 추가:

```yaml
---
layout: post
title: "글 제목"
thumbnail: /assets/images/thumbnail.png
---
```

### 저작권 주의

- 영화/드라마 공식 이미지 사용 = 저작권 침해
- 작은 개인 블로그는 현실적으로 리스크 낮음
- 하지만 프로페셔널하게 가려면 오리지널 이미지 권장
- AI 이미지 생성 or 스톡 이미지 (Unsplash, Pexels) 활용

## AI 협업 표시

글 하단에 자동 표시:

```html
<!-- _layouts/post.html -->
<footer class="post-footer">
  <p class="written-with">Written with Claude</p>
  ...
</footer>
```

## 파일 구조

```
adriftnote.github.io/
├── _config.yml
├── _layouts/
│   ├── default.html
│   ├── home.html      # 카드 그리드
│   └── post.html      # 개별 글
├── _posts/
│   └── YYYY-MM-DD-title.md
├── assets/
│   ├── css/style.css
│   └── images/
└── index.html
```

## 다음 글 주제

- MCP (Model Context Protocol) - AI에게 도구 연결하기
- "이런 걸 가능하게 해주는 게 있는데, 다음 글에서 다뤄보겠다" 로 떡밥 뿌려둠

## 관련 문서

- [[Claude 파일 인식 방식]] - 두 번째 글의 기반 자료
- [[ai-for-office-blog-project]] - 프로젝트 기획 문서
