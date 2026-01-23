---
title: Metabase MCP Dashboard Tools - Update/Delete Bug
type: note
permalink: gotchas/metabase-mcp-dashboard-update-delete-bug
tags:
- metabase
- mcp
- bug
- dashboard
- dangerous
extraction_status: pending
---

# Metabase MCP Dashboard Tools - Update/Delete Bug

## Observation

Metabase MCP `update_dashboard_card` method has critical bug that deletes all dashboard cards.

### Root Cause

API response field name (`dashcards`) vs code reference (`cards`) mismatch:

```javascript
// Bug: References cards instead of dashcards field
const updatedCards = (dashboard.cards || []).filter(...);
```

Result: Empty array sent in PUT request, deleting all cards

### Solution

**Cannot solve by simple field name fix** - Fundamental compatibility issue:
- API response format: `{ dashcards: [...] }`
- PUT request format: `{ cards: [...] }`
- Format difference is structural incompatibility

Implement location: `dashboard-tools.js:431-436`

```javascript
throw new McpError(ErrorCode.InternalError,
  "update_dashboard_card is not supported by Metabase API. Use Metabase UI to update card position/size.");
```

### Text Card (Section/Heading) Addition

Simultaneously added Text Card support to `add_card_to_dashboard`:

- Schema: `card_id` type changed to `["number", "null"]`
- Validation: `card_id === undefined` check (remove falsy check)
- API: Use PUT only (discard POST)

Test success: Can add section title with `card_id: null`

### Architecture Issues

1. **API Contract Mismatch**: Response (`dashcards`) vs code (`cards`)
2. **Missing Defensive Programming**: No schema validation before destructive operation
3. **Inconsistent Error Handling**: Different fallback patterns per method
4. **No Version Abstraction**: No Metabase API version difference handling

### Recommendations

- Add API response schema validation
- Document magic values (`id: -1`)
- Implement API version abstraction layer
- Strengthen integration test coverage

---

## Relations

- **Knowledge**: update_dashboard_card usage prohibited (needs separate documentation)
- **Related**: Metabase API schema management pattern
- **Date**: 2025-12-09

## Observations

- [bug] Metabase MCP `update_dashboard_card` method has critical bug - deletes all dashboard cards due to field name mismatch #metabase #mcp #critical #dangerous
- [cause] API response uses `dashcards` field but code references `cards` field, resulting in empty array sent to PUT request #metabase #api-contract
- [decision] Cannot fix by simple field name change - fundamental incompatibility between GET response format and PUT request format requires method to be disabled #metabase #architecture
- [solution] Added Text Card (Section/Heading) support to `add_card_to_dashboard` with `card_id: null` parameter #metabase #feature
- [warning] API response schema validation missing before destructive operations - needs defensive programming #metabase #best-practice