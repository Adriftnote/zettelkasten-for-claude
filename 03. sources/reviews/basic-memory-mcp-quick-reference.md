---
extraction_status: pending
permalink: 03.-sources/reviews/basic-memory-mcp-quick-reference
---

# Basic Memory MCP - Quick Reference Guide

A concise cheat sheet for Basic Memory MCP tools based on comprehensive testing.

---

## Core Operations

### Create Note
```javascript
write_note({
  project: "project-name",
  title: "Note Title",
  folder: "folder/path",
  content: "# Content\n\nBody text...",
  note_type: "note",  // or "reference", "concept"
  tags: "tag1, tag2"  // or ["tag1", "tag2"]
})
```

### Read Note
```javascript
// By title
read_note({project: "project-name", identifier: "Note Title"})

// By permalink
read_note({project: "project-name", identifier: "folder/note-permalink"})
```

### Edit Note
```javascript
// Append
edit_note({
  project: "project-name",
  identifier: "Note Title",
  operation: "append",
  content: "\n## New Section\nContent..."
})

// Prepend
edit_note({
  project: "project-name",
  identifier: "Note Title",
  operation: "prepend",
  content: "## First Section\nContent...\n"
})

// Find and Replace
edit_note({
  project: "project-name",
  identifier: "Note Title",
  operation: "find_replace",
  find_text: "old text",
  content: "new text"
})

// Replace Section
edit_note({
  project: "project-name",
  identifier: "Note Title",
  operation: "replace_section",
  section: "Findings",  // heading without ##
  content: "## Findings\nNew content..."
})
```

### Delete Note
```javascript
delete_note({project: "project-name", identifier: "Note Title"})
// Returns: true (success) or false (failure)
// ⚠️ Does NOT work on canvas files
```

---

## Search & Discovery

### Text Search
```javascript
search_notes({
  project: "project-name",
  query: "search terms",
  search_type: "text",  // default
  page_size: 10
})
```

### Simple Search
```javascript
search({query: "search terms"})
// Returns: [{id, title, url}]
```

### Build Context (Recommended)
```javascript
build_context({
  project: "project-name",
  url: "folder/note-permalink",  // or "folder/*" for wildcards
  depth: 1,  // 1-3
  timeframe: "7d",  // or "today", "last week"
  max_related: 10
})
```

### Recent Activity
```javascript
recent_activity({
  project: "project-name",
  timeframe: "today",  // or "7d", "last week", "30d"
  type: "entity"  // optional: "entity", "relation"
})
```

---

## File Operations

### List Directory
```javascript
list_directory({
  project: "project-name",
  dir_name: "folder/path",  // or "/" for root
  depth: 1,
  file_name_glob: "*.md"  // optional filter
})
```

### Read Raw Content
```javascript
read_content({
  project: "project-name",
  path: "folder/file.md"
})
```

### Move Note
```javascript
move_note({
  project: "project-name",
  identifier: "Note Title",
  destination_path: "new/folder/Note Title.md"
})
```

### View Formatted Note
```javascript
view_note({
  project: "project-name",
  identifier: "Note Title"
})
```

---

## Canvas

### Create Canvas
```javascript
canvas({
  project: "project-name",
  title: "Canvas Name",
  folder: "diagrams",
  nodes: [
    {
      id: "node1",
      type: "text",  // or "file", "link", "group"
      text: "# Content",
      x: 0, y: 0,
      width: 250, height: 150
    }
  ],
  edges: [
    {
      id: "edge1",
      fromNode: "node1",
      toNode: "node2",
      fromSide: "right",  // top, right, bottom, left
      toSide: "left"
    }
  ]
})
```

---

## Parameter Quick Reference

### Timeframes (Natural Language)
- `"today"`, `"yesterday"`
- `"last week"`, `"last month"`
- `"7d"`, `"30d"`, `"24h"`

### Search Types
- `"text"` - Keyword matching (reliable)
- `"semantic"` - Meaning-based (may need config)

### Result Types
- `"entity"` - Notes, concepts, documents
- `"relation"` - Connections between entities
- `"observation"` - Annotations, highlights

### Note Types
- `"note"` - General notes (default)
- `"reference"` - Reference material
- `"concept"` - Concept definitions
- Custom types allowed

### Edit Operations
- `"append"` - Add to end
- `"prepend"` - Add to beginning
- `"find_replace"` - Replace exact text
- `"replace_section"` - Replace entire heading section

---

## Common Patterns

### Research Note Template
```javascript
write_note({
  project: "obsidian-kb",
  title: "Research Topic",
  folder: "notes",
  content: `
# Research Topic

## Context
Background information...

## Observations
- [category] Key finding
- [category] Another finding

## Relations
- relates_to [[Prior Work]]
- builds_on [[Foundation]]
  `,
  note_type: "note",
  tags: "research, active"
})
```

### Find and Update Pattern
```javascript
// 1. Search
const results = search_notes({
  project: "obsidian-kb",
  query: "outdated info",
  search_type: "text"
})

// 2. Update each result
for (const result of results.results) {
  edit_note({
    project: "obsidian-kb",
    identifier: result.title,
    operation: "find_replace",
    find_text: "outdated info",
    content: "updated info"
  })
}
```

### Explore Topic Pattern
```javascript
// 1. Find related content
const context = build_context({
  project: "obsidian-kb",
  url: "notes/topic",
  depth: 2,
  timeframe: "30d",
  max_related: 20
})

// 2. Review related notes
for (const result of context.results) {
  console.log(result.primary_result.title)
  console.log(result.related_results)
}
```

### Weekly Review Pattern
```javascript
const activity = recent_activity({
  project: "obsidian-kb",
  timeframe: "last week"
})
// Review recent notes and connections
```

---

## Tips & Tricks

### Wikilinks
- Use `[[note-name]]` in content for automatic relation detection
- Relations extracted and stored in database
- Case-insensitive matching

### Permalinks
- Auto-generated: lowercase + hyphens
- Stable across moves
- Use for programmatic access

### Tags
- String format: `"tag1, tag2, tag3"`
- Array format: `["tag1", "tag2", "tag3"]`
- Both work identically

### Frontmatter
- Automatically added/maintained
- Contains: title, type, permalink, tags
- Don't edit manually unless necessary

### Search Optimization
- Use build_context instead of search_notes for related content
- Wildcards work in build_context: `"folder/*"`
- Filter by timeframe to reduce results

### Canvas Layout
- Standard spacing: 50-100px between nodes
- Use negative coordinates for positioning
- Node size: 200-300px width typical

---

## Limitations

1. **Semantic Search**: May return empty results without configuration
2. **Canvas Deletion**: delete_note doesn't work - use file system
3. **Relation IDs**: From search results may not be directly fetchable
4. **Windows Line Endings**: Content includes `\r\n` on Windows

---

## Error Handling

### Note Not Found
```javascript
// Returns helpful error with suggestions
{
  error: "Document not found",
  suggestions: ["Try searching", "Check permalink", "Create new note"]
}
```

### Invalid Operation
```javascript
// Returns false or descriptive error
{
  error: "'note' is not a valid SearchItemType",
  hint: "Use 'types' parameter instead of 'entity_types'"
}
```

### Deletion Failed
```javascript
delete_note(...) // Returns: false
// Reason: Canvas files or non-existent notes
```

---

## Best Practices

1. **Creating Notes**
   - Use descriptive titles
   - Include wikilinks for relations
   - Add relevant tags
   - Choose appropriate note_type

2. **Searching**
   - Start with build_context for exploration
   - Use text search for reliability
   - Apply timeframe filters
   - Set max_related to control context size

3. **Editing**
   - Verify text/section exists first
   - Use specific operations (not generic replace)
   - Check result messages
   - Handle errors gracefully

4. **Organization**
   - Use folders for logical grouping
   - Move notes to archive when done
   - Create canvas for visualizations
   - Regular reviews with recent_activity

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Note not found | Check title vs permalink, try search |
| Edit not working | Verify exact text match, check section name |
| Canvas won't delete | Use file system tools instead |
| Search returns nothing | Try text search, check spelling |
| Relations not showing | Ensure wikilink format: `[[note-name]]` |
| Timeframe not working | Use quotes: `"7d"` or `"last week"` |

---

## Testing Date
2026-01-21

## Project Tested
obsidian-kb

## Full Report
See: `basic-memory-mcp-tools-test-report.md`