#!/usr/bin/env python3
"""
불완전한 frontmatter를 가진 마크다운 파일 검사
- frontmatter는 있지만 title, type, tags 중 하나라도 누락된 파일 찾기
"""

import os
import re
from pathlib import Path

def extract_frontmatter(file_path):
    """파일에서 frontmatter 추출"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        if not lines or not lines[0].strip() == '---':
            return None

        # 두 번째 --- 찾기
        frontmatter_lines = []
        for i, line in enumerate(lines[1:], 1):
            if line.strip() == '---':
                return '\n'.join(frontmatter_lines)
            frontmatter_lines.append(line)

        return None  # closing --- 없음
    except Exception as e:
        return None

def check_frontmatter_fields(frontmatter):
    """frontmatter에 필수 필드가 있는지 확인"""
    if frontmatter is None:
        return None

    has_title = bool(re.search(r'^title:', frontmatter, re.MULTILINE))
    has_type = bool(re.search(r'^type:', frontmatter, re.MULTILINE))
    has_tags = bool(re.search(r'^tags:', frontmatter, re.MULTILINE))

    missing = []
    if not has_title:
        missing.append('title')
    if not has_type:
        missing.append('type')
    if not has_tags:
        missing.append('tags')

    return missing if missing else []

def main():
    base_dir = Path(r'C:\claude-workspace\working\from-obsidian')

    incomplete_files = []

    # 모든 .md 파일 검사
    for md_file in base_dir.rglob('*.md'):
        frontmatter = extract_frontmatter(md_file)
        if frontmatter is not None:  # frontmatter가 있는 경우만
            missing_fields = check_frontmatter_fields(frontmatter)
            if missing_fields:
                rel_path = md_file.relative_to(base_dir)
                incomplete_files.append((str(rel_path), missing_fields))

    # 결과 출력
    if incomplete_files:
        print(f"불완전한 frontmatter를 가진 파일: {len(incomplete_files)}개\n")
        for file_path, missing in incomplete_files:
            print(f"  {file_path}")
            print(f"    누락 필드: {', '.join(missing)}\n")
    else:
        print("모든 파일의 frontmatter가 완전합니다.")

if __name__ == '__main__':
    main()
