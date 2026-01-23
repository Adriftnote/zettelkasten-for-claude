---
title: Watcher and /save Command Process Collision
type: note
permalink: gotchas/watcher-save-command-process-collision
tags:
- claude-code
- watcher
- history-tracker
- process-conflict
extraction_status: pending
---

# Watcher and History Tracker SDK Simultaneous Execution Collision

## Problem

```
Watcher running while /save executed → History Tracker result missing
- Disabling Watcher: normal operation
- After Watcher stop: /save suddenly returns result
```

## Occurrence Situation

1. `/work` execution → Watcher starts (background)
2. Work progresses
3. `/save` execution → History Tracker SDK called
4. SDK result times out or returns empty
5. Watcher termination → `/save` re-execution → **normal operation**

## Root Cause Hypothesis

| Hypothesis | Description |
|----------|------------|
| Process collision | Two History Tracker executions simultaneous → resource conflict |
| File locking | work_log.md concurrent access causes lock |
| Claude API simultaneous call | SDK Agent calling Claude API simultaneously → problem |

## Related Files
- `claude-agent-swarm/src/watcher.ts` - Watcher daemon
- `claude-agent-swarm/src/history-tracker.ts` - History Tracker Agent
- `.claude/commands/save.md` - /save command
- `.claude/commands/work.md` - /work command

## Workflow
- Watcher: chokidar monitors file changes → debounce → History Tracker execution
- /save: `npm run history -- --auto` direct call
- Both use History Tracker → collision possibility

## Solution Needed
1. Root cause analysis
2. Lock file mechanism implementation
3. /save option to suspend Watcher
4. Queue-based processing (prevent simultaneous execution)

## DO/DON'T

### DO
- Consider Watcher and History Tracker simultaneous execution
- Implement file lock mechanism (atomic write)
- Pause Watcher when /save executes

### DON'T
- Ignore concurrent process issues
- Simple retry as workaround

## Relations
- Related: History Tracker Process Management
- Related: Work Session Management

## Observations

- [bug] Watcher and /save command execute History Tracker simultaneously causing result timeout or empty response #process-conflict #watcher
- [cause] Both Watcher daemon and /save command call History Tracker concurrently without lock mechanism #concurrency #race-condition
- [pattern] /save fails while Watcher runs, succeeds immediately after Watcher stops #reproduction
- [solution] Implement file lock mechanism or queue-based processing to prevent simultaneous execution #fix-needed
- [warning] Simple retry is not a workaround, requires proper concurrent process handling #architecture