#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Create a simple text-based bar chart for link density
"""

import sys
from pathlib import Path
import statistics

# Fix Windows console encoding
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def count_wikilinks(content):
    """Count [[wikilinks]] in content"""
    import re
    pattern = r'(?<!!)\[\[([^\]]+)\]\]'
    matches = re.findall(pattern, content)
    return len(matches)

def analyze_folder(folder_path):
    """Analyze all .md files in a folder"""
    md_files = list(folder_path.glob('*.md'))
    if not md_files:
        return None

    link_counts = []
    for md_file in md_files:
        try:
            content = md_file.read_text(encoding='utf-8')
            link_count = count_wikilinks(content)
            link_counts.append(link_count)
        except Exception:
            continue

    if not link_counts:
        return None

    return {
        'file_count': len(link_counts),
        'avg_links': statistics.mean(link_counts),
    }

def draw_bar(value, max_value, width=50):
    """Draw a text bar chart"""
    filled = int((value / max_value) * width) if max_value > 0 else 0
    bar = '█' * filled + '░' * (width - filled)
    return bar

def main():
    base_path = Path('C:/claude-workspace/working/from-obsidian')

    folders_to_analyze = [
        ('01. concepts', '01. concepts'),
        ('02. knowledge/architectures', 'architectures'),
        ('02. knowledge/patterns', 'patterns'),
        ('02. knowledge/gotchas', 'gotchas'),
        ('02. knowledge/setup-and-guides', 'setup-and-guides'),
        ('02. knowledge/programming-basics', 'programming-basics'),
        ('02. knowledge/automation-and-workflow', 'automation'),
        ('02. knowledge/guides', 'guides'),
        ('knowledge-base/reports', 'kb/reports'),
        ('knowledge-base/reviews', 'kb/reviews'),
        ('knowledge-base/notes', 'kb/notes'),
        ('knowledge-base/work-cases', 'kb/work-cases'),
    ]

    results = []
    for folder_rel, display_name in folders_to_analyze:
        folder_path = base_path / folder_rel
        if folder_path.exists():
            stats = analyze_folder(folder_path)
            if stats:
                results.append((display_name, stats['avg_links'], stats['file_count']))

    # Sort by average links
    results.sort(key=lambda x: x[1], reverse=True)

    # Find max for scaling
    max_avg = max(r[1] for r in results)

    print("# 폴더별 평균 링크 수 비교\n")
    print("기준: 5-10개 (적정 범위)\n")

    for name, avg, count in results:
        bar = draw_bar(avg, max_avg)
        status = "✅" if avg >= 5 else "⚠️"
        print(f"{status} {name:25s} {bar} {avg:5.1f}개 ({count}개 파일)")

    print("\n" + "="*80)
    print("\n범례:")
    print("  ✅ = 적정 수준 이상 (평균 5개+)")
    print("  ⚠️ = 개선 필요 (평균 5개 미만)")
    print("\n목표: 모든 폴더가 평균 5-10개 범위")

if __name__ == '__main__':
    main()
