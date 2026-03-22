# 代码审查技能 (Code Review Skill)

这个技能能够在每次修改代码时自动进行代码审查，并生成详细的审查报告。

## 功能特性

### 审查维度
- **代码质量**: 检查编码规范、命名规范、代码复杂度、重复代码
- **安全**: 检测潜在安全漏洞、XSS风险、硬编码敏感信息
- **性能**: 识别性能瓶颈、不必要的计算、资源加载优化
- **可维护性**: 评估代码可读性、注释完整性、代码结构
- **最佳实践**: 框架特定规范、现代语法特性、类型完整性

### 支持的文件类型
- TypeScript (.ts, .tsx)
- JavaScript (.js, .jsx)
- Vue 单文件组件 (.vue)
- 样式文件 (.css, .scss, .less)

## 安装和配置

### 1. 安装依赖
确保项目已安装 TypeScript 和 tsx：

```bash
npm install -D tsx typescript
```

### 2. 配置 Git 钩子（可选但推荐）

#### 方法一：手动配置
复制钩子脚本到 Git 钩子目录：

```bash
# Windows
copy .trae\skills\code-review\git-hook.js .git\hooks\pre-commit

# Linux/Mac
cp .trae/skills/code-review/git-hook.js .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

#### 方法二：使用 Husky（推荐）
```bash
# 安装 husky
npm install -D husky

# 初始化 husky
npx husky init

# 添加 pre-commit 钩子
npx husky add .husky/pre-commit "node .trae/skills/code-review/git-hook.js"
```

### 3. 配置 package.json 脚本（可选）
在 `package.json` 中添加审查脚本：

```json
{
  "scripts": {
    "review": "tsx .trae/skills/code-review/run-review.ts",
    "review:staged": "node .trae/skills/code-review/git-hook.js"
  }
}
```

## 使用方法

### 手动审查指定文件
```bash
npx tsx .trae/skills/code-review/run-review.ts src/App.vue src/main.ts
```

### 审查所有变更文件
```bash
npm run review:staged
```

### 自动触发（Git 提交时）
配置 Git 钩子后，每次执行 `git commit` 时会自动运行代码审查：

```bash
git add .
git commit -m "feat: add new feature"
# 自动触发代码审查
```

## 审查报告

审查报告会生成在 `.trae/reports/code-review-report.md`，包含：

1. **审查概览**: 审查时间、文件数量、问题统计
2. **文件变更列表**: 每个文件的审查摘要
3. **详细审查结果**: 逐文件的问题详情
4. **改进建议**: 针对性的优化建议

### 问题严重级别
- 🔴 **严重 (Critical)**: 必须立即修复的安全漏洞或严重问题
- 🟠 **警告 (Warning)**: 建议修复的代码质量问题
- 🟡 **建议 (Suggestion)**: 可以改进的优化建议

## 自定义配置

编辑 `.trae/skills/code-review/skill.yaml` 可以自定义：

### 修改审查规则
```yaml
review_rules:
  code_quality:
    - 添加自定义规则
  security:
    - 添加安全检查规则
```

### 调整文件匹配模式
```yaml
triggers:
  - type: file_change
    patterns:
      - "**/*.ts"
      - "**/*.vue"
    exclude:
      - "tests/**"
```

### 自定义报告模板
```yaml
report_template: |
  # 自定义报告标题
  ## 自定义章节
```

## 在 CI/CD 中使用

### GitHub Actions 示例
```yaml
name: Code Review

on: [push, pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run code review
        run: |
          git diff --name-only HEAD^ HEAD | xargs npx tsx .trae/skills/code-review/run-review.ts
          
      - name: Upload review report
        uses: actions/upload-artifact@v3
        with:
          name: code-review-report
          path: .trae/reports/code-review-report.md
```

## 常见问题

### Q: 如何跳过代码审查？
A: 紧急情况下可以使用 `--no-verify` 参数跳过：
```bash
git commit -m "紧急修复" --no-verify
```

### Q: 报告文件被 Git 追踪吗？
A: 建议将 `.trae/reports/` 添加到 `.gitignore`：
```
.trae/reports/
```

### Q: 如何添加自定义审查规则？
A: 编辑 `review-script.ts` 中的相应检查方法，例如添加 `checkCustomRules` 方法。

## 文件结构

```
.trae/skills/code-review/
├── skill.yaml          # 技能配置文件
├── review-script.ts    # 核心审查逻辑
├── run-review.ts       # 执行脚本
├── git-hook.js         # Git 钩子脚本
└── README.md           # 使用文档
```

## 更新日志

### v1.0.0
- 初始版本发布
- 支持代码质量、安全、性能、可维护性、最佳实践五个维度的审查
- 支持 TypeScript、JavaScript、Vue 文件
- 提供 Git 钩子集成
- 生成 Markdown 格式审查报告
