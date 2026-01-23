import os
import re
from collections import Counter, defaultdict

# Initialize counters
wikilink_pattern = re.compile(r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]')
tag_pattern = re.compile(r'#([a-zA-Z0-9_/-]+)')

backlinks = Counter()
outlinks = {}
tags_per_file = {}
all_tags = Counter()

# Walk through vault
for root, dirs, files in os.walk('.'):
    # Skip system directories
    if '.obsidian' in root or '.claude' in root:
        continue
    
    for filename in files:
        if not filename.endswith('.md'):
            continue
        
        filepath = os.path.join(root, filename)
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Count outgoing wikilinks
            links = wikilink_pattern.findall(content)
            outlinks[filepath] = len(links)
            
            # Count backlinks (incoming links)
            for link in links:
                backlinks[link] += 1
            
            # Count tags
            tags = tag_pattern.findall(content)
            tags_per_file[filepath] = len(tags)
            all_tags.update(tags)
            
        except Exception as e:
            print(f"Error reading {filepath}: {e}")

# Print top backlinked notes (hub notes)
print("=== TOP 30 HUB NOTES (by incoming links) ===")
for target, count in backlinks.most_common(30):
    print(f"{count:3d} | {target}")

print("\n=== BACKLINK STATISTICS ===")
if backlinks:
    print(f"Total unique link targets: {len(backlinks)}")
    print(f"Total backlinks: {sum(backlinks.values())}")
    print(f"Average backlinks per target: {sum(backlinks.values())/len(backlinks):.2f}")

