#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Detailed link analysis - find top and bottom performers
"""

import re
import sys
from pathlib import Path
from collections import defaultdict

# Fix Windows console encoding
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def count_wikilinks(content):
    """Count [[wikilinks]] in content"""
    pattern = r'(?<!!)\[\[([^\]]+)\]\]'
    matches = re.findall(pattern, content)
    return len(matches)

def get_file_size(file_path):
    """Get file size in KB"""
    return file_path.stat().st_size / 1024

def analyze_all_files():
    base_path = Path('C:/claude-workspace/working/from-obsidian')

    all_files = []

    # Analyze all markdown files
    for md_file in base_path.rglob('*.md'):
        # Skip hidden folders and system files
        if any(part.startswith('.') for part in md_file.parts):
            continue

        try:
            content = md_file.read_text(encoding='utf-8')
            link_count = count_wikilinks(content)
            file_size = get_file_size(md_file)

            # Calculate link density (links per KB)
            density = link_count / file_size if file_size > 0 else 0

            # Get relative path
            rel_path = md_file.relative_to(base_path)
            folder = str(rel_path.parent)

            all_files.append({
                'path': str(rel_path),
                'folder': folder,
                'name': md_file.name,
                'links': link_count,
                'size_kb': file_size,
                'density': density,
                'lines': content.count('\n') + 1
            })
        except Exception as e:
            print(f"Error reading {md_file}: {e}", file=sys.stderr)

    return all_files

def main():
    print("파일 분석 중...", file=sys.stderr)
    files = analyze_all_files()

    if not files:
        print("분석할 파일이 없습니다.")
        return

    # Sort by link count
    files_by_links = sorted(files, key=lambda x: x['links'], reverse=True)

    print("# 상세 링크 밀도 분석\n")

    # Top performers
    print("## 링크 밀도 우수 사례 (Top 20)")
    print("| 순위 | 파일 | 링크 수 | 파일 크기 | 밀도 (링크/KB) |")
    print("|------|------|---------|-----------|----------------|")

    for i, f in enumerate(files_by_links[:20], 1):
        print(f"| {i} | `{f['path']}` | {f['links']} | {f['size_kb']:.1f} KB | {f['density']:.2f} |")

    # Bottom performers (files with 0 links)
    zero_links = [f for f in files if f['links'] == 0 and f['size_kb'] > 0.5]

    print(f"\n## 링크 없는 파일 ({len(zero_links)}개)")
    print("파일 크기 > 0.5 KB인 파일 중 링크가 전혀 없는 파일\n")

    # Group by folder
    by_folder = defaultdict(list)
    for f in zero_links:
        by_folder[f['folder']].append(f)

    for folder in sorted(by_folder.keys()):
        files_in_folder = by_folder[folder]
        print(f"### {folder} ({len(files_in_folder)}개)")
        for f in sorted(files_in_folder, key=lambda x: x['size_kb'], reverse=True)[:10]:
            print(f"- `{f['name']}` ({f['size_kb']:.1f} KB)")
        if len(files_in_folder) > 10:
            print(f"  _(나머지 {len(files_in_folder) - 10}개 생략)_")
        print()

    # Files with 1-2 links (low but not zero)
    low_links = [f for f in files if 1 <= f['links'] <= 2 and f['size_kb'] > 1.0]

    print(f"\n## 링크 부족 파일 (1-2개, {len(low_links)}개)")
    print("| 파일 | 링크 수 | 파일 크기 |")
    print("|------|---------|-----------|")

    for f in sorted(low_links, key=lambda x: x['size_kb'], reverse=True)[:30]:
        print(f"| `{f['path']}` | {f['links']} | {f['size_kb']:.1f} KB |")

    # Statistics
    print("\n## 전체 통계")
    total = len(files)
    zero_count = len([f for f in files if f['links'] == 0])
    low_count = len([f for f in files if 0 < f['links'] < 3])
    good_count = len([f for f in files if 3 <= f['links'] < 8])
    great_count = len([f for f in files if f['links'] >= 8])

    print(f"- 전체 파일: {total}개")
    print(f"- 링크 없음 (0개): {zero_count}개 ({zero_count/total*100:.1f}%)")
    print(f"- 부족 (1-2개): {low_count}개 ({low_count/total*100:.1f}%)")
    print(f"- 적정 (3-7개): {good_count}개 ({good_count/total*100:.1f}%)")
    print(f"- 우수 (8개+): {great_count}개 ({great_count/total*100:.1f}%)")

    avg_links = sum(f['links'] for f in files) / len(files)
    print(f"\n- 파일당 평균 링크: {avg_links:.1f}개")

if __name__ == '__main__':
    main()
