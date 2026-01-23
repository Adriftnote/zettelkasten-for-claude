---
title: Tool Discovery Pattern
type: pattern
tags: [mcp, introspection, tool-management, metadata]
permalink: knowledge/concepts/tool-discovery-pattern
category: MCP/Tool
difficulty: intermediate
created: 2026-01-19
---

# Tool Discovery Pattern

## 📖 개요

시스템에서 사용 가능한 모든 도구를 동적으로 검색하고 조회하는 패턴입니다. 도구의 메타데이터(이름, 설명, 파라미터, 사용 예시 등)를 수집하여 모델이나 사용자가 어떤 도구를 사용할 수 있는지 알 수 있게 합니다. 런타임에 새 도구가 추가되어도 자동으로 발견됩니다.

## 🎭 비유

도서관의 검색 시스템입니다. 도서관에 어떤 책이 있는지, 제목이 뭔지, 어디에 있는지 검색할 수 있습니다. 새 책이 들어와도 시스템에 등록되면 검색 가능합니다. 사용자는 전체 목록을 보고 필요한 책을 찾습니다.

## ✨ 특징

- **Dynamic Discovery**: 런타임에 도구 목록 자동 생성
- **Rich Metadata**: 도구의 설명, 파라미터, 반환값 정보 포함
- **Self-describing**: 도구가 자신의 정보를 제공
- **Extensible**: 새 도구 추가 시 자동 발견
- **Searchable**: 도구를 이름, 카테고리, 태그로 검색

## 💡 예시

### 예시 1: 기본 도구 발견 시스템

```javascript
class Tool {
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this.category = config.category;
    this.parameters = config.parameters;
    this.examples = config.examples || [];
    this.tags = config.tags || [];
  }

  getMetadata() {
    return {
      name: this.name,
      description: this.description,
      category: this.category,
      parameters: this.parameters,
      examples: this.examples,
      tags: this.tags
    };
  }
}

class ToolDiscovery {
  constructor() {
    this.tools = new Map();
  }

  registerTool(tool) {
    this.tools.set(tool.name, tool);
    console.log(`[도구 등록] ${tool.name}`);
  }

  // 모든 도구 조회
  getAllTools() {
    return Array.from(this.tools.values()).map(t => t.getMetadata());
  }

  // 이름으로 도구 검색
  findByName(name) {
    return this.tools.get(name)?.getMetadata();
  }

  // 카테고리로 도구 검색
  findByCategory(category) {
    return Array.from(this.tools.values())
      .filter(t => t.category === category)
      .map(t => t.getMetadata());
  }

  // 태그로 도구 검색
  findByTag(tag) {
    return Array.from(this.tools.values())
      .filter(t => t.tags.includes(tag))
      .map(t => t.getMetadata());
  }

  // 도구 목록 출력
  printToolCatalog() {
    console.log('\n=== 도구 카탈로그 ===');
    const categories = {};

    for (const [name, tool] of this.tools) {
      if (!categories[tool.category]) {
        categories[tool.category] = [];
      }
      categories[tool.category].push(tool);
    }

    for (const [category, tools] of Object.entries(categories)) {
      console.log(`\n${category}:`);
      tools.forEach(t => {
        console.log(`  - ${t.name}: ${t.description}`);
      });
    }
  }
}

// 사용
const discovery = new ToolDiscovery();

const fileTool = new Tool({
  name: 'readFile',
  description: '파일의 내용을 읽습니다',
  category: 'File Operations',
  parameters: { filePath: 'string' },
  tags: ['file', 'io'],
  examples: ['readFile("/path/to/file.txt")']
});

const dbTool = new Tool({
  name: 'queryDatabase',
  description: '데이터베이스에 SQL 쿼리를 실행합니다',
  category: 'Database',
  parameters: { query: 'string', database: 'string' },
  tags: ['database', 'sql'],
  examples: ['queryDatabase("SELECT * FROM users", "main")']
});

discovery.registerTool(fileTool);
discovery.registerTool(dbTool);

// 모든 도구 조회
console.log(discovery.getAllTools());

// 카테고리로 검색
console.log(discovery.findByCategory('Database'));

// 태그로 검색
console.log(discovery.findByTag('file'));

discovery.printToolCatalog();
```

**출력**:
```
[도구 등록] readFile
[도구 등록] queryDatabase

=== 도구 카탈로그 ===

File Operations:
  - readFile: 파일의 내용을 읽습니다

Database:
  - queryDatabase: 데이터베이스에 SQL 쿼리를 실행합니다
```

### 예시 2: 자동 발견 (리플렉션)

```javascript
class AutoDiscoveryToolManager {
  constructor() {
    this.toolClasses = [];
  }

  // 도구 클래스 등록
  registerToolClass(ToolClass) {
    this.toolClasses.push(ToolClass);
  }

  // 도구 메타데이터 자동 추출
  discoverTools() {
    const discovered = [];

    for (const ToolClass of this.toolClasses) {
      const instance = new ToolClass();
      const metadata = this.extractMetadata(instance);
      discovered.push(metadata);
    }

    return discovered;
  }

  // 인스턴스에서 메타데이터 추출
  extractMetadata(toolInstance) {
    return {
      name: toolInstance.constructor.name,
      description: toolInstance.description || 'No description',
      methods: Object.getOwnPropertyNames(Object.getPrototypeOf(toolInstance))
        .filter(m => m !== 'constructor' && !m.startsWith('_')),
      version: toolInstance.version || '1.0.0'
    };
  }

  // 사용 가능한 도구 목록 출력
  printAvailableTools() {
    const tools = this.discoverTools();
    console.log('사용 가능한 도구:');
    tools.forEach((tool, idx) => {
      console.log(`${idx + 1}. ${tool.name}`);
      console.log(`   설명: ${tool.description}`);
      console.log(`   메서드: ${tool.methods.join(', ')}`);
    });
  }
}

// 도구 클래스 정의
class FileProcessor {
  description = '파일 처리 도구';
  version = '2.1.0';

  readFile() { /* ... */ }
  writeFile() { /* ... */ }
  deleteFile() { /* ... */ }
}

class APIClient {
  description = 'REST API 클라이언트';
  version = '1.5.0';

  get() { /* ... */ }
  post() { /* ... */ }
  put() { /* ... */ }
}

// 사용
const manager = new AutoDiscoveryToolManager();
manager.registerToolClass(FileProcessor);
manager.registerToolClass(APIClient);
manager.printAvailableTools();

// 출력:
// 사용 가능한 도구:
// 1. FileProcessor
//    설명: 파일 처리 도구
//    메서드: readFile, writeFile, deleteFile
// 2. APIClient
//    설명: REST API 클라이언트
//    메서드: get, post, put
```

### 예시 3: 계층적 도구 검색

```javascript
class HierarchicalToolDiscovery {
  constructor() {
    this.toolTree = {
      'Data Access': {
        'Database': [],
        'File System': [],
        'API': []
      },
      'Processing': {
        'Transform': [],
        'Analyze': []
      },
      'Output': {
        'Export': [],
        'Visualization': []
      }
    };
  }

  registerTool(hierarchy, toolName, metadata) {
    const [category, subcategory] = hierarchy;
    if (this.toolTree[category] && this.toolTree[category][subcategory]) {
      this.toolTree[category][subcategory].push({
        name: toolName,
        ...metadata
      });
    }
  }

  searchTools(keyword) {
    const results = [];

    for (const [category, subcats] of Object.entries(this.toolTree)) {
      for (const [subcategory, tools] of Object.entries(subcats)) {
        for (const tool of tools) {
          if (tool.name.includes(keyword) || tool.description.includes(keyword)) {
            results.push({
              category,
              subcategory,
              tool: tool.name
            });
          }
        }
      }
    }

    return results;
  }

  listHierarchy() {
    for (const [category, subcats] of Object.entries(this.toolTree)) {
      console.log(`\n[${category}]`);
      for (const [subcategory, tools] of Object.entries(subcats)) {
        console.log(`  ${subcategory}: ${tools.map(t => t.name).join(', ')}`);
      }
    }
  }
}

// 사용
const hierarchical = new HierarchicalToolDiscovery();
hierarchical.registerTool(['Data Access', 'Database'], 'SQL', { version: '1.0' });
hierarchical.registerTool(['Processing', 'Transform'], 'JsonTransform', { version: '2.0' });
hierarchical.registerTool(['Output', 'Export'], 'ExportCSV', { version: '1.5' });

hierarchical.listHierarchy();
// [Data Access]
//   Database: SQL
//   File System:
//   API:
// [Processing]
//   Transform: JsonTransform
//   Analyze:
// [Output]
//   Export: ExportCSV
//   Visualization:
```

## 🛠️ 해결/적용 방법

### 1단계: 도구 메타데이터 정의
- 각 도구에 이름, 설명, 파라미터, 반환값 정보 포함
- 카테고리, 태그, 예시 추가

### 2단계: 발견 메커니즘 구현
- 모든 도구 조회 메서드
- 검색 메서드 (이름, 카테고리, 태그)

### 3단계: 조직 체계 설계
- 계층적 분류 (필요시)
- 태그 시스템

### 4단계: 조회 인터페이스
- 모든 도구 목록 조회
- 상세 정보 조회
- 검색 기능

### 5단계: 문서 생성 (선택)
- 도구 카탈로그 자동 생성
- API 문서 자동화

## Relations

- used_by [[lazy-tool-loader|LazyToolLoader Pattern]] - loads discovered tools efficiently
- used_by [[dynamic-tool-fetching|Dynamic Tool Fetching]] - enables context-aware tool selection
- used_by [[hook-based-mcp-auto-activation|Hook-based MCP Auto-Activation]] - activates discovered tools
- mitigates_by [[consolidation-principle|Consolidation Principle]] - reduces tools to discover
- used_by [[token-optimization-strategy|Token Optimization Strategy]] - minimizes tool description tokens

