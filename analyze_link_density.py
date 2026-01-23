#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Analyze wikilink density across Obsidian vault folders.
Counts [[wikilinks]] in markdown files and generates statistics.
"""

import re
import os
import sys
from pathlib import Path
from collections import defaultdict
import statistics

# Fix Windows console encoding
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def count_wikilinks(content):
    """Count [[wikilinks]] in content, excluding [[link|alias]]"""
    # Match [[...]] but not image embeds ![[...]]
    pattern = r'(?<!!)\[\[([^\]]+)\]\]'
    matches = re.findall(pattern, content)
    return len(matches)

def analyze_folder(folder_path):
    """Analyze all .md files in a folder"""
    md_files = list(folder_path.glob('*.md'))

    if not md_files:
        return None

    link_counts = []
    files_detail = []

    for md_file in md_files:
        try:
            content = md_file.read_text(encoding='utf-8')
            link_count = count_wikilinks(content)
            link_counts.append(link_count)
            files_detail.append((md_file.name, link_count))
        except Exception as e:
            print(f"Error reading {md_file}: {e}")
            continue

    if not link_counts:
        return None

    return {
        'file_count': len(link_counts),
        'total_links': sum(link_counts),
        'avg_links': statistics.mean(link_counts),
        'median_links': statistics.median(link_counts),
        'max_links': max(link_counts),
        'min_links': min(link_counts),
        'files': sorted(files_detail, key=lambda x: x[1], reverse=True)
    }

def main():
    base_path = Path('C:/claude-workspace/working/from-obsidian')

    # Define main content folders to analyze
    folders_to_analyze = [
        '01. concepts',
        '02. knowledge/architectures',
        '02. knowledge/patterns',
        '02. knowledge/gotchas',
        '02. knowledge/setup-and-guides',
        '02. knowledge/programming-basics',
        '02. knowledge/automation-and-workflow',
        '02. knowledge/guides',
        'knowledge-base/reports',
        'knowledge-base/reviews',
        'knowledge-base/notes',
        'knowledge-base/work-cases',
    ]

    results = {}

    for folder_rel in folders_to_analyze:
        folder_path = base_path / folder_rel
        print(f"DEBUG: Checking {folder_path}", flush=True)
        if folder_path.exists():
            stats = analyze_folder(folder_path)
            if stats:
                results[folder_rel] = stats
                print(f"DEBUG: Found {stats['file_count']} files with avg {stats['avg_links']:.1f} links", flush=True)
        else:
            print(f"DEBUG: Path does not exist", flush=True)

    # Print results
    print("# 폴더별 링크 밀도 분석\n")
    print("## 통계")
    print("| 폴더 | 파일 수 | 평균 링크 | 중앙값 | 최대 | 최소 | 상태 |")
    print("|------|---------|----------|--------|------|------|------|")

    for folder, stats in sorted(results.items(), key=lambda x: x[1]['avg_links'], reverse=True):
        avg = stats['avg_links']
        status = "✅" if avg >= 5 else "⚠️"

        print(f"| {folder} | {stats['file_count']} | {avg:.1f} | {stats['median_links']:.1f} | "
              f"{stats['max_links']} | {stats['min_links']} | {status} |")

    # Low-density folders
    print("\n## 링크 부족 폴더 (평균 <5)")
    low_density = [(f, s) for f, s in results.items() if s['avg_links'] < 5]

    if low_density:
        for folder, stats in sorted(low_density, key=lambda x: x[1]['avg_links']):
            avg = stats['avg_links']
            needed = 6 - avg
            print(f"- **{folder}**: 평균 {avg:.1f}개 → 목표 6개 ({needed:.1f}개 추가 필요)")
            print(f"  - 파일 수: {stats['file_count']}, 중앙값: {stats['median_links']:.1f}")
    else:
        print("없음 - 모든 폴더가 기준을 충족합니다!")

    # High-density folders
    print("\n## 우수 사례 (평균 ≥8)")
    high_density = [(f, s) for f, s in results.items() if s['avg_links'] >= 8]

    if high_density:
        for folder, stats in sorted(high_density, key=lambda x: x[1]['avg_links'], reverse=True):
            print(f"- **{folder}**: 평균 {stats['avg_links']:.1f}개")
            print(f"  - 가장 많은 링크: {stats['max_links']}개")
            print(f"  - 중앙값: {stats['median_links']:.1f}개")

            # Show top 3 files
            print(f"  - 상위 3개 파일:")
            for filename, count in stats['files'][:3]:
                print(f"    - {filename}: {count}개")
    else:
        print("없음")

    # Moderate folders
    print("\n## 적정 수준 (평균 5-8)")
    moderate = [(f, s) for f, s in results.items() if 5 <= s['avg_links'] < 8]

    if moderate:
        for folder, stats in sorted(moderate, key=lambda x: x[1]['avg_links'], reverse=True):
            print(f"- **{folder}**: 평균 {stats['avg_links']:.1f}개 ✅")
    else:
        print("없음")

    # Overall statistics
    print("\n## 전체 통계")
    total_files = sum(s['file_count'] for s in results.values())
    total_links = sum(s['total_links'] for s in results.values())
    all_avgs = [s['avg_links'] for s in results.values()]

    print(f"- 전체 파일 수: {total_files}")
    print(f"- 전체 링크 수: {total_links}")
    if total_files > 0:
        print(f"- 파일당 평균 링크: {total_links / total_files:.1f}개")
    if all_avgs:
        print(f"- 폴더 평균의 평균: {statistics.mean(all_avgs):.1f}개")
        print(f"- 폴더 평균의 중앙값: {statistics.median(all_avgs):.1f}개")

if __name__ == '__main__':
    main()
