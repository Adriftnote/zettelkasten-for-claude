---
title: update_dashboard_card Call Deletes All Cards
type: note
permalink: gotchas/update-dashboard-card-deletes-all-cards
tags:
- metabase
- mcp
- bug
- dashboard
- card
- deletion
extraction_status: pending
---

# update_dashboard_card Call Deletes All Cards

## Observations

### Critical Bug
- `update_dashboard_card` call deletes entire dashboard cards
- Function must not be used
- After call get_dashboard_cards returns empty array []

### Bug Root Cause
- @easecloudio/mcp-metabase-server package bug
- Metabase API returns dashcards field
- Code references dashboard.cards (doesn't exist)
- Result: Empty array sent in PUT request
- Metabase replaces all cards with empty array → deletion

### Bug Fix Location
- File: C:\\Users\\RL\\AppData\\Local\\npm-cache\\_npx\\...\\dashboard-tools.js:431-436
- Approach 3 (PUT /api/dashboard/:id/cards) disabled
- Replaced with clear error message

### Alternative Method
- Card position/size changes use Metabase UI directly
- Programming requires different API

### Recovery Procedure
- For deleted cards: use add_card_to_dashboard to re-add individually
- Dashboard requires re-arrangement

## Relations
- Related: Metabase update_dashboard Does Not Handle Dashcards
- Related: Metabase Text Card via MCP