---
title: Metabase API Dropdown Configuration - Both template-tags and parameters Required
type: note
permalink: patterns/metabase-api-dropdown-template-tags-parameters-both-required
tags:
- metabase
- api
- dropdown
- template-tags
- parameters
extraction_status: pending
---

# Metabase API Dropdown Configuration - Both template-tags and parameters Required

## Observations

### Problem Symptoms
- [gotcha] Setting only template-tags doesn't enable dropdown
- [gotcha] SQL variable definition and UI dropdown configuration are separate

### Role Division
- [pattern] template-tags = enable {{variable}} usage in SQL
- [pattern] parameters = render UI dropdown and connect to value source (Model)
- [gotcha] template-tags alone only enables SQL variable (no UI dropdown)

### Correct Implementation
- [step] template-tags: id, type, name required
- [step] parameters: id, target, values_source_type configuration
- [step] values_source_config.card_id → connect to Model ID

### parameters Key Fields
- [parameter] id - must match template-tag's id
- [parameter] target - ["variable", ["template-tag", "variable-name"]]
- [parameter] values_source_type: "card" - fetch from Model
- [parameter] values_source_config.card_id - Model ID

### How It Works
- [concept] template-tags = SQL parser recognizes {{variable}}
- [concept] parameters = Metabase UI engine renders dropdown
- [concept] Connected by id to complete the dropdown

## Relations
- Metabase Model for Dropdown Implementation (2026-01-09)
- Metabase Question API Complete Guide (2026-01-09)