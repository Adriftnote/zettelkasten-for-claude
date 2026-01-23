---
title: 'Bug Analysis: Distinguish Symptom Occurrence Version and Bug Introduction
  Version'
type: note
permalink: gotchas/bug-analysis-symptom-vs-introduction-version
tags:
- debugging
- version
- analysis
- bug-tracking
- root-cause
extraction_status: pending
---

# Bug Analysis: Distinguish Symptom Occurrence Version and Bug Introduction Version

## Observations

### Problem Phenomenon
- v2.0.63 OK, v2.0.64 NG → Mistake: "v2.0.64 introduced bug"
- Symptoms become visible in version confused as bug introduction version

### Correct Analysis Method
- Investigate bug history on GitHub Issues
- Confirm actual introduction version (may be much older)
- Confirm deterioration cause (another version change)
- Understand root cause and trigger separately

### Root Cause vs Trigger
- **Root Cause**: Actual technical bug problem (example: NTFS timestamp precision)
- **Trigger**: Change that reveals root cause (example: auto-compacting addition)
- Can be introduced in different versions

### Investigation Priority
1. Check GitHub Issues for bug report timing
2. Compare reported version and current version
3. Analyze key changes in that version
4. Check earlier versions for root cause discovery

## Relations
- Related: Claude Code Windows Timestamp Bug

## Basic Memory Observations
- [pattern] Symptom occurrence version often mistaken for bug introduction version #debugging #version-analysis
- [fact] Root cause and trigger can be introduced in different versions #bug-tracking #root-cause
- [decision] Always investigate GitHub Issues history before attributing bugs to specific versions #methodology #investigation
- [tip] Distinguish between technical bug (root cause) and change that reveals it (trigger) #analysis #debugging
- [warning] Visible symptoms in v2.0.64 don't mean bug was introduced in v2.0.64 #version-control #gotcha