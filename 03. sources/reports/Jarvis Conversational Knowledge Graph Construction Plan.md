---
title: Jarvis Conversational Knowledge Graph Construction Plan
type: note
permalink: reports/jarvis-conversational-knowledge-graph-construction-plan
extraction_status: pending
---

# Jarvis Conversational Knowledge Graph Construction Plan

**Written:** 2024-12-30  
**Goal:** Transform all conversations with AI into a knowledge graph to build a personalized AI dataset

---

## 📋 Project Overview

### Core Objectives
1. **Knowledge DB Integration:** Same conversational context with AI across all devices
2. **Personalized Dataset:** Acquire structured data for future personalized AI training
3. **Complete Privacy:** All data managed on home computer (Ubuntu)

### Overall Workflow
```
Conversation with Claude
    ↓
jarvis_save → SQLite storage
    ↓
GitHub auto sync
    ↓
Home computer (nightly cron)
    ↓
Conversation → Entity/Relation extraction → Knowledge graph generation
    ↓
Personalized AI dataset
```

### Core Principles
- Complete separation from company network (no VPN needed)
- Automatic graph generation from conversation history
- Temporal tracking - recording thought evolution
- Eventually use TypeDB for inference capabilities

---

## 🎯 Technology Stack

### Phase 1: Prototype (Validation)

| Component | Choice | Reason |
|-----------|--------|--------|
| **Graph DB** | Neo4j | Graphiti official support, rapid validation |
| **Automation Framework** | Graphiti | Automatic Entity/Relation extraction, built-in Temporal |
| **LLM** | Claude API | Superior Korean language performance |
| **Note Storage** | SQLite | Maintain existing jarvis structure |
| **Sync** | GitHub | Simple and reliable |

### Phase 2: Final Goal

| Component | Choice | Reason |
|-----------|--------|--------|
| **Graph DB** | TypeDB | Powerful inference engine, Type System |
| **Automation** | Graphiti code reuse | 80% logic reusable |
| **Query Language** | TypeQL | Enable complex inference |

---

## 🏗️ System Architecture

### Overall Diagram

```
┌─────────────────────────────────┐
│  Anywhere (office/home/mobile)  │
│  Claude Desktop / Code / Web    │
└────────────┬────────────────────┘
             │
             ▼
      ┌──────────────┐
      │ jarvis_save  │
      │  (MCP)       │
      └──────┬───────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌─────────┐      ┌─────────┐
│ SQLite  │      │ GitHub  │
│ (notes) │      │ (sync)  │
└─────────┘      └────┬────┘
                      │
                      ▼
          ┌───────────────────┐
          │  Home Ubuntu      │
          │  (nightly batch)  │
          └─────────┬─────────┘
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
  ┌────────┐  ┌────────┐  ┌─────────┐
  │Graphiti│  │ Neo4j  │  │ TypeDB  │
  │(auto)  │─▶│ (temp) │─▶│ (final) │
  └────────┘  └────────┘  └─────────┘
                                │
                                ▼
                        ┌──────────────┐
                        │ Personalized │
                        │ AI Dataset   │
                        └──────────────┘
```

### Data Flow

**Real-time:**
1. Conversation → jarvis_save
2. SQLite storage
3. GitHub push

**Nightly (home computer):**
1. GitHub pull
2. Extract new conversations
3. Auto-generate Entity/Relation
4. Store in graph DB
5. Export dataset

---

## 📅 Implementation Roadmap

### Week 1: Graphiti + Neo4j Prototype

**Goal:** Validate automatic conversation → graph generation

**Tasks:**
- [ ] Install Neo4j Docker
- [ ] Install and configure Graphiti
- [ ] Test with sample conversations
- [ ] Verify automatic Entity/Relation extraction
- [ ] Verify Temporal properties

**Validation Criteria:**
- Entity auto-extraction accuracy >70%
- Relation auto-inference functioning
- Search functionality working normally

---

### Week 2-3: Jarvis Integration

**Goal:** Generate graphs from actual conversation data

**Tasks:**
- [ ] Modify jarvis_save MCP (add Git push)
- [ ] Write home computer nightly processing script
- [ ] Configure Cron (daily 11pm)
- [ ] Test with one week of real usage

**Validation Criteria:**
- GitHub sync stability
- Automatic nightly execution
- Confirm data accumulation in Neo4j

---

### Week 4-5: TypeDB Migration Preparation

**Goal:** Design TypeDB schema and prepare migration

**Tasks:**
- [ ] Install TypeDB
- [ ] Design schema (Entity, Relation, Temporal)
- [ ] Define inference rules
- [ ] Write Neo4j → TypeDB migration script
- [ ] Parallel testing (Neo4j + TypeDB)

**TypeDB Schema Essentials:**
- Entity Types: person, concept, technology, organization, event
- Relation Types: include temporal properties (valid_from, valid_to, invalid_at)
- Inference Rules: automate inference, Temporal invalidation

**Validation Criteria:**
- TypeDB schema loads successfully
- Migration script works
- Inference rules functioning

---

### Week 6: Complete Migration

**Goal:** Full migration to TypeDB

**Tasks:**
- [ ] Migrate existing Neo4j data → TypeDB
- [ ] Change jarvis nightly processing to TypeDB
- [ ] Rewrite Graphiti logic for TypeDB
- [ ] Implement dataset Export functionality

**Final Structure:**
- SQLite (original conversation storage)
- GitHub (sync)
- TypeDB (final knowledge graph)
- Export script (AI training data)

---

## 🔄 TypeDB Migration Plan

### Why Graphiti → TypeDB?

| Feature | Graphiti (Neo4j) | TypeDB |
|---------|------------------|--------|
| **Auto Entity Extraction** | ✅ | ⚠️ Manual implementation |
| **Auto Relation Inference** | ✅ | ⚠️ Manual implementation |
| **Temporal Tracking** | ✅ | ⚠️ Manual implementation |
| **Type System** | ⚠️ Weak | ✅ Strong |
| **Inference Engine** | ❌ | ✅ Built-in |
| **Polymorphism** | ❌ | ✅ |
| **Complex Queries** | ⚠️ | ✅ |

### Migration Strategy

**Phased Migration (Recommended):**
1. **Week 1-3:** Validate automation with Neo4j + Graphiti
2. **Week 4-5:** Study Graphiti logic, design TypeDB schema
3. **Week 6:** Migrate to TypeDB, reuse 80% of Graphiti code

**Parallel Operation (Optional):**
- Graphiti (Neo4j): Continue using for auto-extraction
- TypeDB: Use for complex inference and queries
- Daily night sync Neo4j → TypeDB

### Migration Ready Conditions

✅ **Ready for migration when:**
- [ ] Graphiti running stably for 1+ week
- [ ] 100+ conversation data accumulated
- [ ] TypeDB schema completed
- [ ] Migration script testing completed

---

## 🎁 Expected Benefits

### Immediate Benefits (Phase 1)
- ✅ Same conversational context with AI anywhere
- ✅ Automatic conversation history structuring
- ✅ Auto Entity/Relation extraction
- ✅ Track thought evolution over time

### Long-term Benefits (Phase 2)
- ✅ Discover hidden relationships via TypeDB inference
- ✅ Enable complex knowledge queries
- ✅ High-quality dataset for personalized AI training
- ✅ Complete data ownership

---

## 💡 Key Decisions

### 1. Graphiti First vs Direct TypeDB Implementation?
**Decision:** Graphiti first → TypeDB migration

**Reason:**
- Rapid validation (3 days vs 15 days)
- 80% of Graphiti logic reusable
- Minimize risk

### 2. Data Storage Location
**Decision:** Home computer Ubuntu

**Reason:**
- Complete privacy
- Separate from company network
- Free (no cloud costs)

### 3. Sync Method
**Decision:** GitHub

**Reason:**
- Simple and reliable
- Automatic version control
- No SQLite file conflicts

### 4. Nightly Processing Time
**Decision:** Daily 11pm (Cron)

**Reason:**
- Home computer idle time
- Distribute GraphRAG processing load
- Latest graph available next morning

---

## 📊 Success Metrics

### Phase 1 (End of Week 3)
- [ ] Conversation → graph conversion success rate >70%
- [ ] Entity extraction accuracy >70%
- [ ] Uninterrupted operation for one week
- [ ] 100+ conversation data accumulated

### Phase 2 (End of Week 6)
- [ ] Complete migration to TypeDB
- [ ] 5+ inference rules functioning
- [ ] Dataset Export functionality completed
- [ ] Complex queries respond in <5 seconds

---

## ⚠️ Risk Management

### Technical Risks

| Risk | Probability | Mitigation |
|------|-------------|------------|
| Low Entity extraction accuracy | Medium | LLM prompt tuning, manual correction |
| Neo4j → TypeDB migration failure | Medium | Keep Neo4j running in parallel |
| Nightly processing script error | Medium | Log monitoring, alerts |
| GitHub sync conflicts | Low | Consider append-only log approach |

### Schedule Risks

| Risk | Probability | Mitigation |
|------|-------------|------------|
| TypeDB learning curve | High | Graphiti first, adequate study time |
| Graphiti bugs | Medium | Community support, manual implementation backup |
| Home computer setup delay | Medium | Phase 1 starts on dev PC |

---

## 📚 References

### Official Documentation
- **Graphiti:** https://github.com/getzep/graphiti
- **Neo4j:** https://neo4j.com/docs/
- **TypeDB:** https://typedb.com/docs
- **jarvis MCP:** (refer to existing implementation)

### Learning Materials
- Graphiti Quickstart: https://github.com/getzep/graphiti/tree/main/examples
- TypeQL Tutorial: https://typedb.com/docs/typeql/overview
- Temporal Knowledge Graphs Paper: Zep Architecture Paper

### Community
- Graphiti Discord: https://discord.gg/zep
- TypeDB Forum: https://forum.typedb.com
- Neo4j Community: https://community.neo4j.com

---

## 🎯 Next Steps

### Immediate Actions (Before home computer setup)
1. Read Graphiti documentation thoroughly
2. Read TypeDB documentation thoroughly
3. Practice sample schema design

### After home computer setup
1. Install Ubuntu
2. Install Docker
3. Install Neo4j + Graphiti
4. Run tests

### Week 1 Goals
- Confirm Graphiti functionality
- Establish jarvis integration plan
- Achieve first successful graph generation

---

## 📝 Change History

| Date | Change |
|------|--------|
| 2024-12-30 | Initial version - Graphiti → TypeDB migration strategy established |

---

**Document End**

This plan will continue to be updated as implementation progresses.