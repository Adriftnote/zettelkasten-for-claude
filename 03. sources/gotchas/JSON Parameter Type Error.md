---
title: JSON Parameter Type Error
type: note
permalink: gotchas/json-parameter-type-error
tags:
- json
- mcp
- api
- type-error
- serialization
- 400-bad-request
extraction_status: pending
---

# JSON Parameter Type Error

## Observations

### Problem Symptoms
- Metabase API error: Request failed with status code 400
- JSON parameter type confusion (Object vs String) in MCP tools or API calls
- String passed when Object expected → double serialization occurs

### Type Confusion Examples
- **Bad**: visualization_settings: "{\"column_settings\": ...}" (String - double encoded)
- **Good**: visualization_settings: { "column_settings": { ... } } (Object)
- **Gotcha**: Escaped characters (`\"`) indicate already stringified signal

### Correct Usage Pattern
- Check MCP tool parameter type first
- object type → pass JavaScript object
- string type → use JSON.stringify()
- Prefer native objects
- Separate complex settings into variables before passing

### Problematic Habits to Avoid
- Don't apply REST API habits directly to MCP tools
- Don't use curl/fetch style JSON.stringify()
- Don't guess "JSON must be string"
- Always check tool documentation/signature first

### Error Debugging
- 400 Bad Request → request payload validation failure
- Check actual JSON sent in API logs
- Double or more layers of escaped characters → type error

### Application Targets
- Metabase MCP tools (create_card, update_card, etc.)
- All MCP tools accepting JSON object parameters

## Relations
- Related: Metabase execute_card Parameters Array Required

## Observations

- [gotcha] JSON parameter type confusion: passing String when Object expected causes double serialization and 400 Bad Request #type-error #serialization
- [pattern] Escaped characters (`\"`) in parameter indicate already stringified JSON, signal of type error #debugging #diagnostic
- [solution] Check MCP tool parameter type first: object type → pass JavaScript object, string type → use JSON.stringify() #best-practice #mcp
- [warning] Don't apply REST API habits (curl/fetch JSON.stringify) directly to MCP tools without checking tool signature #anti-pattern
- [tech] 400 Bad Request from Metabase API typically indicates request payload validation failure from double-encoded JSON #api-error