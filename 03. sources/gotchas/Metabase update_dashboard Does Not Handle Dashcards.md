---
title: Metabase update_dashboard Does Not Handle Dashcards
type: note
permalink: gotchas/metabase-update-dashboard-no-dashcards
tags:
- metabase
- api
- dashboard
- mcp
- card
extraction_status: pending
---

# Metabase update_dashboard Does Not Handle Dashcards

## Observations

### API Purpose by Function
- `update_dashboard` → Metadata only (name, parameters)
- `add_card_to_dashboard` → Add card
- `update_dashboard_card` → Change card position/size
- `remove_card_from_dashboard` → Remove card

### Cautions
- Including dashcards field in update_dashboard may be ignored or delete cards
- Never use dashcards field
- Card operations must use individual APIs (add_card, update_dashboard_card)

### Root Cause
- Metabase API design: PUT /api/dashboard/:id handles metadata only
- PUT /api/dashboard/:id/cards is deprecated
- MCP server doesn't filter dashcards field, causing unexpected behavior

### Recovery
- Cards deleted case: use add_card_to_dashboard to re-add individually

## Relations
- Related: update_dashboard_card Deletes All Cards