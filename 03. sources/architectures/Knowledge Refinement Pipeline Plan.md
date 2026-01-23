---
title: Knowledge Refinement Pipeline Plan
type: note
permalink: architecture/knowledge-refinement-pipeline-plan
tags:
- architecture
- knowledge-management
- pipeline
- claude-mem
- basic-memory
extraction_status: pending
---

# Knowledge Refinement Pipeline Plan

## Overview

[plan] claude-mem 원시 데이터를 정제하여 Basic Memory 지식 그래프로 구축하는 파이프라인 #architecture #knowledge-management

## Architecture

```
claude-mem (SQLite) → Markdown (검토/정제) → Basic Memory (구조화)
```

## Components

### 1. Source: claude-mem

[source] claude-mem SQLite database contains raw session observations #claude-mem
[fact] 1000+ observations accumulated from work sessions #data-volume
[limitation] Raw data has duplicates and noise requiring curation #data-quality

### 2. Processing: Markdown Curation

[process] Extract valuable knowledge from claude-mem observations #extraction
[process] Write curated content as Markdown files in knowledge-base #curation
[process] Add [[WikiLink]] connections between related notes #linking

### 3. Target: Basic Memory SQLite

[target] Structured entities from Markdown notes #entity
[target] Searchable observations with tags #observation  
[target] Knowledge graph via relations between notes #relation

## Directory Structure

relates_to [[Progressive Loader Implementation History]]

[structure] knowledge/ folder for reusable knowledge (DO/DON'T patterns) #folder
[structure] reviews/ folder for error analysis and learnings #folder
[structure] architecture/ folder for system design documents #folder

## Workflow

### Manual Curation Process

1. [step] Query claude-mem for valuable observations using search tool #workflow
2. [step] Review and filter relevant knowledge #workflow
3. [step] Write Markdown with semantic markup and WikiLinks #workflow
4. [step] Run `basic-memory sync` to update SQLite index #workflow

### Automation Support

[tool] /compound skill extracts knowledge from reviews/ to knowledge/ #automation
[tool] /remember skill saves decisions to MCP Memory #automation

## Goals

[goal] Transform ephemeral session logs into permanent knowledge assets #outcome
[goal] Enable fast semantic search across curated knowledge #outcome
[goal] Build connected knowledge graph with meaningful relations #outcome

## Related

relates_to [[Basic Memory Setup Complete]]
depends_on [[claude-mem]]
