import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, basename, extname } from 'path';

interface ReviewIssue {
  line: number;
  severity: 'critical' | 'warning' | 'suggestion';
  category: string;
  message: string;
  suggestion: string;
}

interface FileReviewResult {
  filePath: string;
  issues: ReviewIssue[];
  summary: string;
}

interface ReviewConfig {
  filePath: string;
  content: string;
  extension: string;
}

class CodeReviewer {
  private results: FileReviewResult[] = [];

  async reviewFiles(filePaths: string[]): Promise<FileReviewResult[]> {
    this.results = [];
    
    for (const filePath of filePaths) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const extension = extname(filePath);
        
        const result = await this.reviewFile({
          filePath,
          content,
          extension
        });
        
        this.results.push(result);
      } catch (error) {
        console.error(`Error reviewing file ${filePath}:`, error);
      }
    }
    
    return this.results;
  }

  private async reviewFile(config: ReviewConfig): Promise<FileReviewResult> {
    const issues: ReviewIssue[] = [];
    const lines = config.content.split('\n');

    // 通用代码质量检查
    issues.push(...this.checkCodeQuality(lines, config));
    
    // 安全检查
    issues.push(...this.checkSecurity(lines, config));
    
    // 性能检查
    issues.push(...this.checkPerformance(lines, config));
    
    // 可维护性检查
    issues.push(...this.checkMaintainability(lines, config));
    
    // 最佳实践检查（根据文件类型）
    issues.push(...this.checkBestPractices(lines, config));

    return {
      filePath: config.filePath,
      issues,
      summary: this.generateFileSummary(issues)
    };
  }

  private checkCodeQuality(lines: string[], config: ReviewConfig): ReviewIssue[] {
    const issues: ReviewIssue[] = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();

      // 检查行长度
      if (line.length > 120) {
        issues.push({
          line: lineNum,
          severity: 'suggestion',
          category: '代码质量',
          message: '行长度超过120个字符',
          suggestion: '考虑将长行拆分为多行或使用变量提取'
        });
      }

      // 检查console.log
      if (/console\.(log|debug|warn|error)/.test(trimmedLine)) {
        issues.push({
          line: lineNum,
          severity: 'warning',
          category: '代码质量',
          message: '发现调试代码 console.log',
          suggestion: '生产环境中应移除调试代码'
        });
      }

      // 检查TODO注释
      if (/TODO|FIXME|XXX/i.test(trimmedLine) && trimmedLine.startsWith('//')) {
        issues.push({
          line: lineNum,
          severity: 'suggestion',
          category: '代码质量',
          message: '发现待办事项注释',
          suggestion: '确保及时处理TODO项目'
        });
      }
    });

    return issues;
  }

  private checkSecurity(lines: string[], config: ReviewConfig): ReviewIssue[] {
    const issues: ReviewIssue[] = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();

      // 检查eval使用
      if (/\beval\s*\(/.test(trimmedLine)) {
        issues.push({
          line: lineNum,
          severity: 'critical',
          category: '安全',
          message: '发现 eval() 使用',
          suggestion: '避免使用eval，使用更安全的替代方案'
        });
      }

      // 检查innerHTML
      if (/\.innerHTML\s*=/.test(trimmedLine)) {
        issues.push({
          line: lineNum,
          severity: 'warning',
          category: '安全',
          message: '发现 innerHTML 赋值',
          suggestion: '使用 textContent 或确保内容已正确转义'
        });
      }

      // 检查硬编码密钥
      if (/(api[_-]?key|secret|password|token)\s*[:=]\s*["\'][^"\']+["\']/i.test(trimmedLine)) {
        issues.push({
          line: lineNum,
          severity: 'critical',
          category: '安全',
          message: '发现可能的硬编码敏感信息',
          suggestion: '使用环境变量或配置文件存储敏感信息'
        });
      }
    });

    return issues;
  }

  private checkPerformance(lines: string[], config: ReviewConfig): ReviewIssue[] {
    const issues: ReviewIssue[] = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();

      // 检查循环中的DOM操作
      if (/for\s*\(|while\s*\(/.test(trimmedLine)) {
        // 检查接下来的几行是否有DOM操作
        for (let i = index + 1; i < Math.min(index + 5, lines.length); i++) {
          if (/document\.(getElementById|querySelector)|\.appendChild|\.innerHTML/.test(lines[i])) {
            issues.push({
              line: lineNum,
              severity: 'warning',
              category: '性能',
              message: '循环中可能存在DOM操作',
              suggestion: '将DOM操作移到循环外部或使用文档片段'
            });
            break;
          }
        }
      }

      // 检查未优化的图片
      if (/\.(jpg|jpeg|png|gif)/i.test(trimmedLine) && !/lazy/.test(trimmedLine)) {
        issues.push({
          line: lineNum,
          severity: 'suggestion',
          category: '性能',
          message: '图片可能缺少懒加载优化',
          suggestion: '考虑添加 loading="lazy" 属性'
        });
      }
    });

    return issues;
  }

  private checkMaintainability(lines: string[], config: ReviewConfig): ReviewIssue[] {
    const issues: ReviewIssue[] = [];
    let functionLength = 0;
    let functionStartLine = 0;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();

      // 检测函数开始
      if (/^(function|const|let|var)\s+\w+\s*[=:]?\s*\(|\w+\s*\([^)]*\)\s*\{/.test(trimmedLine)) {
        functionStartLine = lineNum;
        functionLength = 1;
      }

      // 计算函数长度
      if (functionStartLine > 0) {
        functionLength++;
        
        // 检查函数是否过长
        if (functionLength === 50) {
          issues.push({
            line: functionStartLine,
            severity: 'warning',
            category: '可维护性',
            message: '函数长度超过50行',
            suggestion: '考虑将函数拆分为更小的函数'
          });
        }
      }

      // 检测函数结束（简化检测）
      if (trimmedLine === '}' && functionStartLine > 0) {
        functionStartLine = 0;
        functionLength = 0;
      }

      // 检查魔法数字
      if (/\b\d{3,}\b/.test(trimmedLine) && !/const|let|var/.test(trimmedLine)) {
        issues.push({
          line: lineNum,
          severity: 'suggestion',
          category: '可维护性',
          message: '发现魔法数字',
          suggestion: '将数字提取为有意义的常量'
        });
      }
    });

    return issues;
  }

  private checkBestPractices(lines: string[], config: ReviewConfig): ReviewIssue[] {
    const issues: ReviewIssue[] = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();

      // TypeScript 特定检查
      if (config.extension === '.ts' || config.extension === '.tsx') {
        // 检查any类型
        if (/:\s*any\b/.test(trimmedLine)) {
          issues.push({
            line: lineNum,
            severity: 'warning',
            category: '最佳实践',
            message: '使用了 any 类型',
            suggestion: '使用具体的类型定义替代 any'
          });
        }

        // 检查非空断言
        if (/!\./.test(trimmedLine)) {
          issues.push({
            line: lineNum,
            severity: 'suggestion',
            category: '最佳实践',
            message: '使用了非空断言操作符',
            suggestion: '添加空值检查或使用可选链操作符'
          });
        }
      }

      // Vue 文件检查
      if (config.extension === '.vue') {
        // 检查Options API（建议使用Composition API）
        if (/export\s+default\s*\{/.test(trimmedLine)) {
          const hasSetup = lines.some(l => /setup\s*\(/.test(l));
          if (!hasSetup) {
            issues.push({
              line: lineNum,
              severity: 'suggestion',
              category: '最佳实践',
              message: '使用 Options API',
              suggestion: '考虑使用 Composition API 以获得更好的代码组织'
            });
          }
        }
      }
    });

    return issues;
  }

  private generateFileSummary(issues: ReviewIssue[]): string {
    if (issues.length === 0) {
      return '✅ 未发现问题';
    }

    const critical = issues.filter(i => i.severity === 'critical').length;
    const warning = issues.filter(i => i.severity === 'warning').length;
    const suggestion = issues.filter(i => i.severity === 'suggestion').length;

    return `🔴 ${critical} 严重 | 🟠 ${warning} 警告 | 🟡 ${suggestion} 建议`;
  }

  generateReport(results: FileReviewResult[]): string {
    const timestamp = new Date().toLocaleString('zh-CN');
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    const criticalCount = results.reduce((sum, r) => 
      sum + r.issues.filter(i => i.severity === 'critical').length, 0);
    const warningCount = results.reduce((sum, r) => 
      sum + r.issues.filter(i => i.severity === 'warning').length, 0);
    const suggestionCount = results.reduce((sum, r) => 
      sum + r.issues.filter(i => i.severity === 'suggestion').length, 0);

    let report = `# 代码审查报告\n\n`;
    report += `## 审查概览\n`;
    report += `- **审查时间**: ${timestamp}\n`;
    report += `- **审查文件**: ${results.length} 个文件\n`;
    report += `- **发现问题**: ${totalIssues} 个问题\n`;
    report += `- **严重级别**: 🔴 严重 ${criticalCount} | 🟠 警告 ${warningCount} | 🟡 建议 ${suggestionCount}\n\n`;

    report += `## 文件变更列表\n`;
    results.forEach(result => {
      const fileName = basename(result.filePath);
      report += `- **${fileName}**: ${result.summary}\n`;
    });
    report += `\n`;

    report += `## 详细审查结果\n\n`;
    results.forEach(result => {
      const fileName = basename(result.filePath);
      report += `### ${fileName}\n\n`;
      
      if (result.issues.length === 0) {
        report += `✅ 未发现问题\n\n`;
      } else {
        result.issues.forEach(issue => {
          const severityEmoji = issue.severity === 'critical' ? '🔴' : 
                               issue.severity === 'warning' ? '🟠' : '🟡';
          report += `${severityEmoji} **第 ${issue.line} 行** - ${issue.category}\n`;
          report += `- 问题: ${issue.message}\n`;
          report += `- 建议: ${issue.suggestion}\n\n`;
        });
      }
    });

    report += `## 改进建议汇总\n\n`;
    if (totalIssues === 0) {
      report += `🎉 恭喜！所有文件都通过了代码审查。\n`;
    } else {
      report += `1. 优先处理 🔴 严重级别的问题\n`;
      report += `2. 及时修复 🟠 警告级别的问题\n`;
      report += `3. 逐步改进 🟡 建议级别的问题\n`;
      report += `4. 遵循项目的编码规范和最佳实践\n`;
    }

    report += `\n---\n`;
    report += `*此报告由自动代码审查工具生成*\n`;

    return report;
  }

  saveReport(report: string, outputPath: string): void {
    const dir = dirname(outputPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(outputPath, report, 'utf-8');
  }
}

// 导出供外部使用
export { CodeReviewer, ReviewIssue, FileReviewResult, ReviewConfig };
export default CodeReviewer;
