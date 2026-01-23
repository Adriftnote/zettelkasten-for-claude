---
title: Metabase Text Card Addition Pattern
type: note
permalink: patterns/metabase-text-card-addition-pattern
tags:
- metabase
- mcp
- dashboard
- text-card
- visualization
extraction_status: pending
---

# Metabase Text Card Addition Pattern

## Observations

### Text Card Creation Method
- [pattern] Use card_id: null in add_card_to_dashboard
- [pattern] null = Text Card (card with no data)
- [example] Use for section titles, markdown text boxes, etc.

### Required Parameters
- [parameter] visualization_settings.text → text content (markdown supported)
- [parameter] visualization_settings.virtual_card.display → "heading" or "text"
- [parameter] visualization_settings.virtual_card.name → card name
- [parameter] size_x: 24 (typically full width)
- [parameter] size_y: 1 (heading height typically 1)

### Display Types
- [reference] `heading` - for section separation
- [reference] `text` - for markdown text box

### Prerequisites
- [requirement] MCP server modification (dashboard-tools.js) needed
- [requirement] Schema: card_id: type: ["number", "null"]
- [requirement] Validation: card_id === undefined (null allowed)
- [requirement] API: Direct PUT method usage

## Relations
- Metabase Dashboard Card Update Behavior: Related issue documentation (2026-01-09)