---
extraction_status: pending
permalink: 03.-sources/reviews/basic-memory-comprehensive-guide
---

# Basic Memory MCP Server: Comprehensive Research Guide

**Research Date:** 2026-01-21
**Latest Version:** v0.17.7 (January 19, 2026)
**Official Documentation:** https://docs.basicmemory.com
**GitHub Repository:** https://github.com/basicmachines-co/basic-memory

---

## Table of Contents

1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [MCP Tools Reference](#mcp-tools-reference)
4. [Knowledge Graph Structure](#knowledge-graph-structure)
5. [Memory URL Format (memory://)](#memory-url-format-memory)
6. [Best Practices](#best-practices)
7. [Advanced Features](#advanced-features)
8. [CLI Commands](#cli-commands)
9. [Integration Guides](#integration-guides)
10. [Recent Updates & Changelog](#recent-updates--changelog)
11. [Practical Examples](#practical-examples)

---

## Overview

**Basic Memory** is an open-source knowledge management system that enables persistent AI conversations through the Model Context Protocol (MCP). It allows LLMs like Claude to read and write structured Markdown files on your computer, creating a local knowledge graph that persists across conversations.

### Key Tagline
> "AI conversations that actually remember. Never re-explain your project to your AI again."

### Core Capabilities

- **Local-first architecture**: All knowledge remains in files you control
- **Bidirectional integration**: Both humans and AI read/write the same Markdown files
- **Knowledge graph navigation**: LLMs follow semantic links between topics
- **MCP protocol support**: Works with Claude Desktop, Claude Code, VS Code, Cursor
- **Real-time synchronization**: Optional cloud sync with bidirectional capabilities
- **Multi-platform**: Desktop, web, and mobile support through cloud offering
- **Obsidian compatible**: Works seamlessly with Obsidian.md for visualization

### Architecture Principles

1. **File-first**: Markdown files are the source of truth
2. **Structured yet simple**: Familiar Markdown with semantic patterns
3. **Traversable graph**: Relations create navigable knowledge networks
4. **Lightweight**: Local files + SQLite database indexing
5. **Standard formats**: Compatible with existing editors and tools

---

## Installation & Setup

### Quick Start (Recommended)

```bash
# Install using uv (recommended)
uv tool install basic-memory

# Alternative: pip
pip install basic-memory

# Verify installation
basic-memory --version
```

### Claude Desktop Configuration

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "basic-memory": {
      "command": "uvx",
      "args": ["basic-memory", "mcp"]
    }
  }
}
```

### Claude Code Configuration

```bash
# Add MCP server (user scope)
claude mcp add -s user basic-memory uvx basic-memory mcp

# Verify with
claude mcp list

# Check tools available
/mcp
```

### Cloud Setup (Alternative)

```bash
# Create account at app.basicmemory.com first, then:
claude mcp add -s user -t http basic-memory-cloud https://cloud.basicmemory.com/mcp

# Authenticate via OAuth flow
```

### Smithery Installation

```bash
npx -y @smithery/cli install @basicmachines-co/basic-memory --client claude
```

---

## MCP Tools Reference

### Knowledge Management Tools

#### **write_note**
Creates or updates notes with semantic observations and relations.

**Parameters:**
- `title` (required): Note title (primary identifier)
- `content` (required): Markdown content
- `folder` (required): Directory path within project
- `tags` (optional): Array or comma-separated string
- `note_type` (optional): Default "note"
- `project` (required in v0.15+): Project name

**Usage:**
```
Create a note titled "Authentication Strategies" in folder "architecture"
with content about JWT vs OAuth approaches
```

#### **read_note**
Retrieves existing notes with contextual information.

**Parameters:**
- `identifier` (required): Title, path, or permalink
- `project` (optional): Project name
- `page` (optional): Pagination (default 1)
- `page_size` (optional): Items per page (default 10)

**Usage:**
```
Read the note "Authentication Strategies"
What do I know about JWT authentication?
```

#### **edit_note**
Incremental note modifications while preserving structure.

**Parameters:**
- `identifier` (required): Title or permalink
- `operation` (required): append, prepend, find_replace, replace_section
- `content` (required): Content to add/replace
- `find_text` (optional): For find_replace operation
- `section` (optional): For replace_section operation
- `expected_replacements` (optional): Default 1
- `project` (optional): Project name

**Operations:**
- `append`: Add content to end
- `prepend`: Add content to beginning
- `find_replace`: Search and replace text
- `replace_section`: Replace entire section by heading

**Usage:**
```
Append a new observation about refresh tokens to "Authentication Strategies"
Replace the "Security Considerations" section with updated best practices
```

#### **view_note**
Display notes as formatted artifacts for enhanced readability.

**Parameters:**
- `identifier` (required): Title or permalink
- `project` (optional): Project name
- `page`, `page_size` (optional): Pagination

**Usage:**
```
Show me the "Authentication Strategies" note as a formatted artifact
```

#### **delete_note**
Removes notes from knowledge base (updates database and search index).

**Parameters:**
- `identifier` (required): Title or permalink
- `project` (optional): Project name

#### **move_note**
Relocate/rename notes while maintaining database consistency.

**Parameters:**
- `identifier` (required): Current title or permalink
- `destination_path` (required): New file path
- `project` (optional): Project name

### Search and Discovery Tools

#### **search_notes**
Full-text search across knowledge base.

**Parameters:**
- `query` (required): Search query
- `project` (optional): Project name
- `search_type` (optional): "text" (default)
- `entity_types` (optional): Filter by entity types
- `types` (optional): Filter by note types
- `after_date` (optional): Filter by date
- `page`, `page_size` (optional): Pagination

**Usage:**
```
Find all notes about authentication
Search for "JWT" in my architecture documentation
```

#### **recent_activity**
Shows recently modified content with natural language timeframes.

**Parameters:**
- `project` (optional): Specific project, or omit for cross-project discovery
- `timeframe` (optional): "2 days ago", "last week", "yesterday", "today", "7d"
- `type` (optional): Filter by type(s)
- `depth` (optional): Relationship depth (default 1)

**Usage:**
```
What have I been working on in the past week?
Show recent activity from the last 3 days
```

#### **build_context**
Load context from memory:// URLs to navigate knowledge graph.

**Parameters:**
- `url` (required): memory:// URL or path pattern
- `timeframe` (optional): Time window (default "7d")
- `depth` (optional): Relationship traversal depth (default 1)
- `max_related` (optional): Max related items (default 10)
- `page`, `page_size` (optional): Pagination
- `project` (optional): Project name

**Usage:**
```
Load context from memory://architecture/auth*
Build context for memory://projects/*/requirements
```

#### **list_directory**
Browse knowledge base structure with filtering.

**Parameters:**
- `dir_name` (optional): Directory path (default "/")
- `depth` (optional): Traversal depth (default 1)
- `file_name_glob` (optional): Pattern matching
- `project` (optional): Project name

### Project Management Tools

#### **list_memory_projects**
Show all available projects with status and statistics.

**No parameters required**

**Usage:**
```
Show all my Basic Memory projects
What projects are available?
```

#### **create_memory_project**
Initialize new knowledge projects.

**Parameters:**
- `project_name` (required): Unique project name
- `project_path` (required): File system path
- `set_default` (optional): Set as default (default false)

#### **delete_project**
Remove project configuration (doesn't delete files).

**Parameters:**
- `project_name` (required): Project to remove

#### **sync_status**
Check file synchronization status across projects.

**No parameters required**

### Utility Tools

#### **read_content**
Access raw file content (text, images, binary) without knowledge graph processing.

**Parameters:**
- `path` (required): File path
- `project` (optional): Project name

#### **canvas**
Create Obsidian canvas visualizations of knowledge graphs.

**Parameters:**
- `nodes` (required): Array of node objects
- `edges` (required): Array of edge objects
- `title` (required): Canvas title
- `folder` (required): Destination folder
- `project` (optional): Project name

**Usage:**
```
Create a canvas visualization of my project architecture and dependencies
Visualize character relationships in my writing project
```

---

## Knowledge Graph Structure

### File Format

Basic Memory uses a **file-first architecture** where all knowledge is stored in plain Markdown files with three main components:

### 1. Frontmatter (YAML Metadata)

```yaml
---
title: Document Title
type: note
tags: [tag1, tag2]
permalink: custom-path
---
```

**Key fields:**
- `title`: Primary identifier for creating links (required)
- `type`: Note type (default: "note")
- `tags`: Array of tags for categorization
- `permalink`: Stable identifier (auto-generated if not provided)

### 2. Observations

Observations capture discrete facts using the pattern:

```markdown
[category] Content #tags (context)
```

**Format breakdown:**
- `[category]`: Classification of information type
- `Content`: The main information/fact
- `#tags`: Optional additional categorization
- `(context)`: Optional supporting details

**Common categories:**
- `[tech]` - Technical implementation details
- `[design]` - Architectural decisions
- `[feature]` - User capabilities
- `[decision]` - Strategic choices
- `[method]` - Approaches and techniques
- `[requirement]` - Project requirements
- `[problem]` - Issues identified
- `[solution]` - Resolutions
- `[insight]` - Key learnings
- `[fact]` - General facts
- `[tip]` - Practical advice
- `[principle]` - Guiding principles
- `[technique]` - Specific methods
- `[preference]` - Personal choices
- `[age]`, `[occupation]`, `[motivation]` - Entity attributes

**Example observations:**
```markdown
## Observations

- [method] Pour over extracts more floral notes than French press
- [tip] Grind size should be medium-fine for pour over #brewing
- [preference] Ethiopian beans for fruity notes
- [tech] JWT tokens expire after 15 minutes
- [decision] Using OAuth 2.0 for third-party authentication #security
- [requirement] System must support 10,000 concurrent users
```

### 3. Relations

Relations form the knowledge graph by connecting documents using WikiLink syntax:

```markdown
## Relations

- implements [[OAuth 2.0 Specification]]
- depends_on [[User Authentication Service]]
- relates_to [[Security Best Practices]]
- part_of [[Authentication System]]
- extends [[Base Authentication]]
- pairs_with [[Authorization Module]]
- contrasts_with [[Session-based Auth]]
- causes [[Token Refresh Flow]]
```

**Common relation types:**
- `implements` - Realizes or executes a concept
- `depends_on` / `requires` - Dependency relationship
- `relates_to` - General association
- `part_of` - Component relationship
- `extends` - Inheritance or expansion
- `pairs_with` - Complementary relationship
- `contrasts_with` - Difference or alternative
- `causes` - Causal relationship
- `drives_plot` - Narrative driver (writing)
- `creates_tension` - Story element (writing)

**Relation format:**
```markdown
- relation_type [[Target Document]] (optional context)
```

### Complete Example Note

```markdown
---
title: JWT Authentication
type: note
tags: [security, authentication, backend]
permalink: jwt-auth-2024
---

## Observations

- [tech] JSON Web Tokens provide stateless authentication
- [decision] Using RS256 signing algorithm for enhanced security #crypto
- [requirement] Tokens must expire within 15 minutes
- [problem] Refresh token rotation needed to prevent replay attacks
- [solution] Implement sliding refresh window with blacklist
- [tip] Store tokens in httpOnly cookies, not localStorage #frontend

## Relations

- implements [[OAuth 2.0 Specification]]
- depends_on [[User Service]]
- part_of [[Authentication System]]
- contrasts_with [[Session-based Authentication]]
- relates_to [[API Security]]
```

### Knowledge Graph Features

- **Automatic graph building**: System builds knowledge graph from document connections
- **Bidirectional navigation**: Follow relations in both directions
- **Pattern matching**: Query by patterns like `memory://auth*`
- **Semantic search**: Search across content and metadata
- **Entity extraction**: Automatic entity recognition and tracking

### Permalinks & Stability

- Each document receives a unique, stable permalink
- Permalinks persist even when files move in directory structure
- Auto-generated from title if not specified
- Used for reliable long-term references

---

## Memory URL Format (memory://)

The `memory://` URL scheme is Basic Memory's addressing system for navigating and referencing documents.

### Basic Usage Patterns

#### By Permalink
```
memory://auth-approaches-2024
```

#### By Title
```
memory://Authentication Approaches
```
(Automatically resolves to the document)

#### By Path
```
memory://project/auth-approaches
memory://architecture/decisions/jwt-auth
```

### Pattern Matching

Memory URLs support wildcards for powerful queries:

#### Prefix Matching
```
memory://auth*
```
All documents with permalinks starting with "auth"

#### Suffix Matching
```
memory://*/approaches
```
All documents with permalinks ending with "approaches"

#### Folder Patterns
```
memory://project/*/requirements
```
All requirements documents in the project folder

#### Relation Traversal
```
memory://docs/search/implements/*
```
Follow all "implements" relations from search docs

### Pattern Examples

```
memory://architecture/*             → All architecture documents
memory://*/security                 → All security-related docs
memory://features/*/requirements    → Requirements in features folder
memory://auth/depends_on/*          → All dependencies of auth docs
```

### Using memory:// URLs

#### In Conversations
```
Load context from memory://architecture/auth*
Build context for memory://projects/*/requirements
What's in memory://decisions/2026/*?
```

#### In build_context Tool
```python
build_context(
    url="memory://architecture/*/security",
    depth=2,
    timeframe="30d"
)
```

### Best Practices

1. **Use permalinks** for stable references that survive file moves
2. **Pattern matching** for dynamic queries across related documents
3. **Relation traversal** to explore knowledge graph connections
4. **Combine with timeframe** to focus on recent work
5. **Set appropriate depth** for relationship traversal (1-3 typically)

---

## Best Practices

### AI Assistant Guidelines

#### 1. Project Discovery First

**Always begin conversations by listing available projects:**
```
Show me all available Basic Memory projects
```

This prevents implicit context assumptions and ensures working with the correct knowledge base.

#### 2. Permission-Based Recording

**Always ask before recording** conversations to Basic Memory:
- Confirm what will be saved
- Explain how it supports future interactions
- Get explicit consent for knowledge capture

#### 3. Search Before Creating

**Check for existing notes to avoid duplication:**
```
Search for notes about authentication before creating new one
```

When similar content exists, **update rather than create new entries**.

#### 4. Rich Connections

Include **3-5 observations and 2-3 relations per note** for meaningful knowledge graph:

```markdown
## Observations

- [decision] Chose JWT over sessions for scalability
- [tech] Using RS256 algorithm with 15-minute expiry
- [problem] Token refresh needed without full re-auth
- [solution] Sliding refresh window with rotation
- [requirement] Must support 10K concurrent sessions

## Relations

- implements [[OAuth 2.0 Standard]]
- depends_on [[User Service]]
- part_of [[API Security Layer]]
```

#### 5. Specificity Over Generic Relations

**Avoid overusing `relates_to`**; be precise about relationship types:

❌ Bad:
```markdown
- relates_to [[User Service]]
- relates_to [[API Gateway]]
```

✅ Good:
```markdown
- depends_on [[User Service]]
- integrates_with [[API Gateway]]
```

#### 6. Progressive Elaboration

Build knowledge **incrementally across sessions**:
- Start with core concepts
- Add details over time
- Update existing notes rather than creating duplicates
- Let knowledge graph grow organically

#### 7. Exact Titles in Relations

Use **precise entity names** when creating relations:

```markdown
- implements [[OAuth 2.0 Authorization Framework]]
```

Not:
```markdown
- implements [[oauth]] or [[OAuth stuff]]
```

#### 8. Consistent Organization

Establish **clear folder structures**:

```
architecture/
  decisions/
  diagrams/
  patterns/
specs/
  features/
  requirements/
decisions/
  2026-01/
  2026-02/
meetings/
  weekly/
  planning/
research/
  references/
  experiments/
```

### Writing Great Notes

#### Structure for Discovery

Use **consistent categories** across related notes:
- Same category names for similar facts
- Predictable folder organization
- Systematic tagging approach

#### Context in Observations

Include **contextual information** when helpful:

```markdown
- [decision] Using PostgreSQL for relational data (MongoDB tested but lacked ACID guarantees)
- [metric] API latency averages 45ms (target: <100ms)
```

#### Link Generously

Create **connections early and often**:
- Link to related concepts immediately
- Cross-reference between projects
- Connect decisions to requirements
- Link problems to solutions

#### Review and Refine

**Regularly review AI-generated content:**
- Check for accuracy
- Add missing context
- Improve categorization
- Strengthen relations

### Multi-Project Workflow

#### Project Selection Strategies

**Default Project Mode:**
```bash
# Set default project
basic-memory project default work-notes

# All operations use this project unless overridden
```

**Explicit Project Selection:**
```
Write a note about API design in project "backend-docs"
Search for authentication in project "security-wiki"
```

**Cross-Project Discovery:**
```
Show recent activity across all projects (last 7 days)
```

#### Project Organization

**Separate projects by:**
- Codebase (one per major project)
- Domain (personal, work, learning)
- Purpose (documentation, research, notes)

**Keep projects focused** to maintain performance and relevance.

### Obsidian Integration

#### Vault Setup

**Option 1: Existing Vault**
```bash
basic-memory project add main ~/Documents/ObsidianVault
```

**Option 2: New Dedicated Vault**
Create Obsidian vault pointing to `~/.basic-memory/` directory

#### Visualization Features

**Graph View:**
- Visualize knowledge networks
- Nodes = documents
- Edges = relations
- Customize colors and filters

**Backlinks Panel:**
- See all references to current note
- Contextual snippets
- Bidirectional linking

**Canvas Feature:**
- Create visual knowledge maps
- Organize concepts spatially
- Mix notes, images, embeds

#### Recommended Plugins

- **Dataview**: Query knowledge base
- **Kanban**: Task management
- **Calendar**: Temporal navigation
- **Templates**: Structural consistency

### Forward References

**Relations can reference entities that don't exist yet:**

```markdown
## Relations

- will_implement [[Future Feature X]]
- planned_for [[Q2 2026 Roadmap]]
```

These resolve automatically when target documents are created later, enabling flexible knowledge graph expansion.

---

## Advanced Features

### Canvas Visualizations

Basic Memory leverages Obsidian's Canvas feature to create visual knowledge maps.

#### Creation Process

1. **Request** visualization from Claude:
```
Create a canvas visualization of my authentication architecture
Visualize character relationships in my novel
Map out the project components and their dependencies
```

2. **Generation**: Canvas file (.canvas JSON) automatically created

3. **View**: Open in Obsidian's Canvas feature

4. **Refine**: Request adjustments as needed

#### Visualization Types

**Document Maps:**
- Connect notes and documents
- Show information hierarchy

**Concept Maps:**
- Visual representations of ideas
- Relationship networks

**Process Diagrams:**
- Workflows and sequences
- Step-by-step procedures

**Thematic Analysis:**
- Ideas organized around themes
- Cluster related concepts

**Relationship Networks:**
- Entity connections
- Knowledge graph visualization

#### Data Sources

Visualizations can be created from:
- Existing documents in knowledge base
- Current conversation content
- Search results
- Custom themes and relationships

#### Technical Details

Canvas files include:
- **Nodes**: Concepts or documents
- **Edges**: Relationships between nodes
- **Positioning**: Visual layout
- **Metadata**: Additional context

Files are JSON format, fully compatible with Obsidian.

#### Best Practices

- **Be specific** about what to visualize
- **Indicate detail level** desired
- **Specify visualization type** if known
- **Start simple**, elaborate later
- **Provide context** about relevant documents

### Cloud Synchronization

#### Setup

```bash
# Authenticate
bm cloud login

# Configure credentials
bm cloud setup

# Initial sync (bidirectional)
bm project bisync --name my-vault --resync

# Regular sync after edits
bm project bisync --name my-vault
```

#### Features

- **Bidirectional sync**: Cloud ↔ Local
- **Multi-device**: Work across devices
- **Conflict resolution**: Automatic handling
- **Background operations**: Non-blocking syncs
- **Project-scoped**: Sync specific projects

#### Upload Files

```bash
bm cloud upload ~/my-notes --project research --create-project
```

### Import Capabilities

#### Claude Conversations

```bash
# Import conversation history
basic-memory import claude conversations

# Import Claude projects
basic-memory import claude projects

# Target specific project
basic-memory --project=work import claude conversations
```

#### ChatGPT Conversations

```bash
basic-memory import chatgpt
```

#### JSON Memory Files

```bash
basic-memory import memory-json /path/to/memory.json
```

### Search Capabilities

#### Full-Text Search

```
Search for "JWT authentication"
Find notes about API design
```

#### Filtered Search

```
Search for authentication notes created after 2025-12-01
Find notes tagged with #security
```

#### Entity-Based Search

```
Find all notes about the User Service entity
```

#### Advanced Patterns

```
Search for memory://architecture/* containing "microservices"
```

---

## CLI Commands

### Core Commands

#### cloud - Cloud Authentication & Operations

```bash
# Authenticate
bm cloud login

# Check status
bm cloud status

# Logout
bm cloud logout

# Upload files
bm cloud upload ~/my-notes --project research --create-project

# Setup sync
bm cloud setup
```

#### import - Import External Knowledge

```bash
# Import Claude conversations
basic-memory import claude conversations

# Import Claude projects
basic-memory import claude projects

# Import ChatGPT
basic-memory import chatgpt

# Import JSON memory
basic-memory import memory-json /path/to/memory.json

# Target specific project
basic-memory --project=work import claude conversations
```

#### project - Multi-Project Management

```bash
# List all projects
basic-memory project list

# Add new project
basic-memory project add work ~/work-basic-memory

# Set default project
basic-memory project default work

# Remove project
basic-memory project remove personal

# View project info
basic-memory project info
```

#### status - System Information

```bash
# Basic status
basic-memory status

# Verbose details
basic-memory status --verbose

# JSON output
basic-memory status --json
```

#### tool - Direct MCP Tool Access

```bash
# Create note
basic-memory tool write-note --title "My Note" --content "Content here"

# Search notes
basic-memory tool search-notes --query "authentication"

# Read note
basic-memory tool read-note --identifier "My Note"
```

### stdin Integration

The `write-note` tool accepts piped input:

#### Pipe
```bash
echo "Content here" | basic-memory tool write-note --title "Note"
```

#### Heredoc
```bash
cat << EOF | basic-memory tool write-note --title "Multi-line Note" --folder "notes"
# My Note

This is a multi-line note with structured content.

## Section 1
Content here
EOF
```

#### File Redirection
```bash
basic-memory tool write-note --title "README" --folder "docs" < README.md
```

### Project-Scoped Operations

```bash
# Run MCP server for specific project
basic-memory --project=personal mcp

# Import to specific project
basic-memory --project=work import claude conversations
```

### Installation & Updates

```bash
# Install (stable)
pip install basic-memory

# Install (beta)
pip install basic-memory --pre

# Check version
basic-memory --version

# Alias usage
bm --version
```

---

## Integration Guides

### Claude Code Integration

#### Setup

**Cloud (Recommended):**
```bash
claude mcp add -s user -t http basic-memory-cloud https://cloud.basicmemory.com/mcp
```

**Local:**
```bash
uv tool install basic-memory
claude mcp add -s user basic-memory uvx basic-memory mcp
```

#### Verification

```bash
# Check MCP servers
claude mcp list

# In Claude Code
/mcp
```

#### Key Capabilities

- **Structured documentation**: Create and maintain living docs
- **Project-scoped knowledge**: Separate knowledge bases per codebase
- **Context without limits**: Reference docs without exceeding context window
- **Search across projects**: Find information quickly
- **Track work history**: Recent activity tracking

#### Best Practices

**1. Organize by Project:**
Keep separate knowledge bases for different codebases to maintain performance.

**2. Use Consistent Structure:**
Maintain organized folder hierarchies:
```
project-name/
  architecture/
  decisions/
  apis/
  troubleshooting/
```

**3. Leverage memory:// URLs:**
Reference documentation directly:
```
Load context from memory://architecture/auth-flow
```

**4. Complement CLAUDE.md:**
- CLAUDE.md: Project instructions and preferences
- Basic Memory: Detailed knowledge and documentation

#### Troubleshooting

```bash
# Verify installation
basic-memory --version

# Check MCP status
/mcp

# Review logs
tail -f ~/.basic-memory/logs/
```

### Obsidian Integration

#### Setup Options

**Existing Vault:**
```bash
basic-memory project add main ~/path/to/obsidian-vault
basic-memory project default main
```
Restart Claude Desktop after configuration.

**New Vault:**
Create Obsidian vault pointing to Basic Memory directory (default: `~/.basic-memory/`)

#### Cloud Sync

```bash
# Authenticate
bm cloud login

# Configure
bm cloud setup

# Initial sync
bm project bisync --name my-vault --resync

# Regular sync
bm project bisync --name my-vault
```

#### Visualization Features

**Graph View:**
- Nodes represent documents
- Connections show relations
- Customizable colors/filters

**Backlinks Panel:**
- All references to current note
- Contextual snippets
- Bidirectional navigation

**Tag Explorer:**
- Hierarchical tag structures
- Searchable organization

#### Native Compatibility

- **WikiLinks**: `[[Document Title]]` → clickable references
- **YAML frontmatter**: Metadata support
- **Markdown observations**: Tag annotations
- **Canvas files**: Visual mapping

#### Recommended Plugins

- **Dataview**: Query knowledge base with SQL-like syntax
- **Kanban**: Task and project management
- **Calendar**: Navigate notes by date
- **Templates**: Ensure consistent structure

### ChatGPT Integration

#### Requirements

- ChatGPT Pro ($200/month)
- Remote MCP server access
- Developer mode enabled

#### Capabilities

When enabled in ChatGPT's developer mode:
- Access all 17+ MCP tools
- write_note, read_note, edit_note
- Project management tools
- Search and discovery

#### Data Storage

All data stored locally as Markdown files, even when using ChatGPT interface.

---

## Recent Updates & Changelog

### v0.17.7 (January 19, 2026) - Latest

**Focus:** MCP Registry & Bug Fixes

- Published to official MCP Registry at registry.modelcontextprotocol.io
- Fixed entity creation with proper external identifiers
- Removed OpenPanel telemetry

### v0.17.6 (January 17, 2026)

- Fixed Docker container Python symlink issues
- Cleaned up internal logging configuration

### v0.17.5 (January 11, 2026)

- Python 3.14 compatibility
- Resolved CLI hanging issues on exit
- Updated dependencies

### v0.17.4 (January 5, 2026)

**Critical Fix:**
- Restored search index persistence across server restarts
- **Action required**: Users upgrading from v0.16.3-v0.17.3 should run `basic-memory reset` to rebuild indexes

### v0.17.0 (December 28, 2025)

**Major Features:**
- Completed API v2 migration for MCP tools
- Auto-formatting on file save
- Anonymous usage telemetry
- `allow_discovery` parameter for cross-project tools

**Performance:**
- Instant startup (<1 second) regardless of knowledge base size

### v0.16.0 (November 10, 2025)

**Major Update:**

**Cloud Sync:**
- Simplified project-scoped sync with rclone
- Background sync operations
- Circuit breaker patterns for resilience

**Windows Compatibility:**
- Significantly enhanced Windows support
- Unicode handling improvements

**Other:**
- PostgreSQL database backend support (v0.16.3)
- Performance optimizations

### v0.15.0 (Earlier Release)

**Breaking Changes:**

**Project Parameters Now Required:**
- Most MCP tools require explicit `project` parameter
- Removed `switch_project()` and `get_current_project()`
- Projects specified via:
  - Explicit `project` parameter
  - Automatic resolution with `default_project_mode`
  - Single project lock with `--project` flag

**Performance Improvements:**
- API response times improved 3-4x
- `read_note` endpoint: 75ms (from 250ms)
- Directory operations: 10-100x faster (v0.15.1)

**Other Features:**
- Cloud projects support
- Multi-project conversation improvements
- Python 3.13 support

### Project Modes

Three operational modes accommodate different workflows:

**1. Multi-Project (Default):**
- Explicit project selection required
- Best for managing multiple knowledge bases

**2. Default Project Mode:**
- Automatic single project selection
- Override capability available
- Set via: `basic-memory project default <name>`

**3. Single Project Mode:**
- Locked via `--project` flag
- For automation and security
- Example: `basic-memory --project=personal mcp`

---

## Practical Examples

### Example 1: Software Documentation

#### Creating Architecture Note

```markdown
---
title: Microservices Architecture
type: note
tags: [architecture, backend, microservices]
permalink: microservices-arch-2026
---

## Observations

- [decision] Adopted microservices for better scalability and team autonomy
- [tech] Using Docker and Kubernetes for containerization
- [pattern] API Gateway handles routing and authentication
- [requirement] Each service must be independently deployable
- [challenge] Distributed tracing needed for debugging
- [solution] Implemented OpenTelemetry for observability

## Relations

- part_of [[System Architecture]]
- implements [[Domain-Driven Design]]
- depends_on [[Kubernetes Cluster]]
- relates_to [[Service Mesh]]
- contrasts_with [[Monolithic Architecture]]
```

#### Querying Architecture Knowledge

```
Search for all architecture decisions
Load context from memory://architecture/*
What's our approach to service communication?
Show recent architecture changes (last 30 days)
```

### Example 2: Research Organization

#### Creating Research Note

```markdown
---
title: Large Language Model Memory Systems
type: research
tags: [llm, memory, ai, research]
permalink: llm-memory-research
---

## Observations

- [finding] Memory-augmented LLMs outperform base models on long-context tasks
- [technique] Retrieval-augmented generation (RAG) most common approach
- [limitation] Context windows still limited despite recent expansions
- [insight] Persistent memory enables multi-session reasoning
- [source] "Attention Is All You Need" paper introduced transformers (2017)
- [trend] Moving from stateless to stateful LLM interactions

## Relations

- part_of [[AI Research]]
- relates_to [[RAG Systems]]
- implements [[Vector Databases]]
- contrasts_with [[Traditional Databases]]
- extends [[Transformer Architecture]]
```

### Example 3: Writing Project (Novel)

#### Character Note

```markdown
---
title: Sarah Chen
type: character
tags: [protagonist, main-character, detective]
permalink: character-sarah-chen
---

## Observations

- [age] 34 years old
- [occupation] Homicide detective, SFPD
- [personality] Analytical, obsessive about details, struggles with work-life balance
- [background] Grew up in Chinatown, first generation American
- [motivation] Solving her partner's murder drives main investigation
- [weakness] Trust issues stem from betrayal in past case
- [growth] Learns to delegate and trust her team
- [physical] 5'6", athletic build, short black hair

## Relations

- partners_with [[Marcus Rodriguez]]
- conflicts_with [[Captain Williams]]
- mentors [[Detective Rookie Jamie]]
- investigates [[The Waterfront Case]]
- relates_to [[Chinatown Setting]]
```

#### Plot Note

```markdown
---
title: The Waterfront Case
type: plot
tags: [main-plot, mystery, investigation]
permalink: waterfront-case-plot
---

## Observations

- [premise] Series of murders connected to waterfront development project
- [inciting_incident] Sarah's partner Marcus found dead at construction site
- [midpoint] Discovery that victims all testified against same developer
- [climax] Confrontation at abandoned warehouse during storm
- [resolution] Developer's CFO revealed as killer, development halted
- [theme] Corruption and gentrification in urban development

## Relations

- drives_plot [[Main Story Arc]]
- involves [[Sarah Chen]]
- involves [[Marcus Rodriguez]]
- set_in [[San Francisco Waterfront]]
- creates_tension [[Personal vs Professional]]
```

### Example 4: Meeting Notes

```markdown
---
title: Q1 Planning Meeting - 2026-01-15
type: meeting
tags: [planning, quarterly, team]
permalink: q1-planning-2026-01
---

## Observations

- [decision] Focus Q1 on mobile app performance improvements
- [action] Sarah to lead performance audit by end of January
- [metric] Target: reduce app startup time from 3s to <1s
- [concern] Backend team capacity constraints noted
- [resource] Approved hiring 2 additional backend engineers
- [timeline] Mobile v2.0 launch planned for March 15
- [risk] Third-party API dependency could impact timeline

## Relations

- part_of [[Q1 2026 Goals]]
- relates_to [[Mobile App Roadmap]]
- depends_on [[Backend Team]]
- follows [[Q4 Retrospective]]
```

### Example 5: Learning & Research

```markdown
---
title: Rust Ownership Model
type: learning
tags: [rust, programming, concepts]
permalink: rust-ownership
---

## Observations

- [concept] Ownership ensures memory safety without garbage collection
- [rule] Each value has exactly one owner at a time
- [rule] When owner goes out of scope, value is dropped
- [technique] Borrowing allows references without transferring ownership
- [distinction] Mutable vs immutable borrows have different rules
- [benefit] Compile-time memory safety guarantees
- [challenge] Steep learning curve compared to GC languages
- [tip] Use `clone()` sparingly; prefer borrowing

## Relations

- part_of [[Rust Programming Language]]
- implements [[Memory Safety]]
- contrasts_with [[Garbage Collection]]
- relates_to [[Lifetimes in Rust]]
- required_for [[Concurrent Programming in Rust]]
```

### Example 6: Using Canvas Visualization

**Request:**
```
Create a canvas visualization showing the relationships between my
authentication system components
```

**Result:**
- Visual map with nodes for each component
- Edges showing dependencies and data flow
- Grouped by layers (frontend, API, backend, database)
- Opens in Obsidian Canvas for further editing

### Example 7: Cross-Project Discovery

```
Show me all activity across my projects in the last week
```

**Returns:**
- Notes created/updated in "work-docs" project
- Research additions in "learning-wiki" project
- Character development in "novel-2026" project
- Aggregated timeline of all changes

### Example 8: Progressive Knowledge Building

**Session 1:**
```
Create a note about JWT authentication basics
```

**Session 2:**
```
Add observations about refresh token rotation to the JWT authentication note
```

**Session 3:**
```
Create a new note about OAuth 2.0 and link it to the JWT note
```

**Session 4:**
```
Search for all security-related authentication notes
Create a canvas visualization of our authentication knowledge
```

---

## Sources

### Official Documentation
- [Basic Memory Documentation](https://docs.basicmemory.com/)
- [Getting Started Guide](https://docs.basicmemory.com/getting-started/)
- [User Guide](https://docs.basicmemory.com/user-guide/)
- [MCP Tools Reference](https://docs.basicmemory.com/guides/mcp-tools-reference/)
- [CLI Reference](https://docs.basicmemory.com/guides/cli-reference/)
- [Knowledge Format](https://docs.basicmemory.com/guides/knowledge-format/)
- [AI Assistant Guide](https://docs.basicmemory.com/guides/ai-assistant-guide/)
- [Canvas Visualizations](https://docs.basicmemory.com/guides/canvas/)
- [Latest Releases](https://docs.basicmemory.com/latest-releases/)

### Integration Guides
- [Claude Code Integration](https://docs.basicmemory.com/integrations/claude-code/)
- [Obsidian Integration](https://docs.basicmemory.com/integrations/obsidian/)
- [ChatGPT Integration](https://docs.basicmemory.com/integrations/chatgpt/)

### How-To Guides
- [Writing Organization](https://docs.basicmemory.com/how-to/writing-organization/)
- [Code Project Documentation](https://docs.basicmemory.com/how-to/project-documentation/)

### Repository & Community
- [GitHub Repository](https://github.com/basicmachines-co/basic-memory)
- [GitHub CLAUDE.md](https://github.com/basicmachines-co/basic-memory/blob/main/CLAUDE.md)
- [Changelog](https://github.com/basicmachines-co/basic-memory/blob/main/CHANGELOG.md)
- [GitHub Releases](https://github.com/basicmachines-co/basic-memory/releases)
- [Discord Community](https://discord.gg/tyvKNccgqN)

### Third-Party Resources
- [PulseMCP: Basic Memory](https://www.pulsemcp.com/servers/basicmachines-memory)
- [Playbooks: Basic Memory MCP](https://playbooks.com/mcp/basicmachines-memory)
- [Skywork AI Deep Dive](https://skywork.ai/skypage/en/A-Deep-Dive-into-Basic-Memory-The-Local-First-MCP-Server-for-Persistent-AI-Knowledge/1972541885506449408)
- [Medium: Adding Memory to Claude Code](https://medium.com/@brentwpeterson/adding-memory-to-claude-code-with-mcp-d515072aea8e)

---

## Quick Reference Card

### Most Common Commands

```bash
# Installation
uv tool install basic-memory

# MCP Setup (Claude Code)
claude mcp add -s user basic-memory uvx basic-memory mcp

# Project Management
basic-memory project list
basic-memory project add <name> <path>
basic-memory project default <name>

# Common Prompts
"Create a note about [topic] in folder [path]"
"Search for notes about [query]"
"What have I been working on this week?"
"Load context from memory://[path]"
"Create a canvas visualization of [topic]"
```

### Note Template

```markdown
---
title: Your Title
type: note
tags: [tag1, tag2]
---

## Observations

- [category] Fact or insight #optional-tag (optional context)

## Relations

- relation_type [[Related Document]]
```

### Observation Categories

`[tech]` `[design]` `[feature]` `[decision]` `[requirement]` `[problem]` `[solution]` `[insight]` `[method]` `[tip]` `[principle]`

### Relation Types

`implements` `depends_on` `part_of` `extends` `relates_to` `contrasts_with` `requires` `pairs_with` `causes`

---

**Document Version:** 1.0
**Last Updated:** 2026-01-21
**Compiled by:** Claude Code (Sonnet 4.5)