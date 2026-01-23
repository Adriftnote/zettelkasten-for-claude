---
title: MCP CLI LazyToolLoader Pattern
type: note
permalink: patterns/mcp-cli-lazy-tool-loader-pattern
tags:
- mcp
- cli
- pattern
- lazy-loading
- cache
- performance
extraction_status: pending
---

# MCP CLI LazyToolLoader Pattern

## Observations

### Problem: Client not initialized
- [error] Connect at registration time → fetch tool list → disconnect immediately
- [error] At execution time, client already disconnected → error
- [cause] Registration time and execution time are separated

### Wrong Pattern (Anti-pattern)
- [bad] client.connect() at registration → fetch tool list → disconnect immediately
- [bad] Later on user execution → client already disconnected
- [bad] Connect to server every time → slow and unnecessary server load

### LazyToolLoader Pattern
- [pattern] Get tool list from cache (no connection)
- [pattern] Create new client and connect at execution time (Lazy Connect)
- [pattern] Disconnect immediately after tool execution
- [pattern] Manage cache with ToolCache (24-hour TTL)

### ToolCache Role
- [step] If cache exists and fresh, return it (no connection)
- [step] If no cache, connect once to fetch tools
- [step] Save tool list to disk
- [step] Use cached list afterwards

### Performance Improvement
- [metric] Without cache: 0.983s
- [metric] With cache: 0.475s (2.1x faster)
- [metric] CPU usage: 0.370s → 0.037s (10x improvement)

### Cache Management
- [pattern] mcp-cli refresh <server> - refresh specific server cache
- [pattern] mcp-cli clear-cache - delete all cache
- [pattern] TTL: 24 hours (configurable)

### Application Scope
- [use-case] CLI tools with external server connections (MCP, API, etc.)
- [use-case] Tool registration and execution time are separated
- [use-case] Tool list doesn't change frequently

### Pattern Flow
- [before] Start → Connect → Fetch tool list → Disconnect → ... → Execute (fails)
- [after] Start → Get tool list from cache → ... → Connect at execution time → Execute → Disconnect

## Relations