#!/usr/bin/env node
import { CodeReviewer } from './review-script';

/**
 * 代码审查执行脚本
 * 用法: npx tsx .trae/skills/code-review/run-review.ts [文件路径...]
 */

async function main() {
  // 获取命令行参数（文件路径列表）
  const filePaths = process.argv.slice(2);
  
  if (filePaths.length === 0) {
    console.log('用法: npx tsx .trae/skills/code-review/run-review.ts <文件路径...>');
    console.log('示例: npx tsx .trae/skills/code-review/run-review.ts src/App.vue src/main.ts');
    process.exit(1);
  }

  console.log('🔍 开始代码审查...');
  console.log(`📁 待审查文件: ${filePaths.length} 个`);
  console.log('');

  const reviewer = new CodeReviewer();
  
  try {
    const results = await reviewer.reviewFiles(filePaths);
    const report = reviewer.generateReport(results);
    
    // 保存报告
    const outputPath = '.trae/reports/code-review-report.md';
    reviewer.saveReport(report, outputPath);
    
    console.log(report);
    console.log(`\n📄 报告已保存至: ${outputPath}`);
    
    // 根据问题严重程度设置退出码
    const hasCritical = results.some(r => 
      r.issues.some(i => i.severity === 'critical')
    );
    
    if (hasCritical) {
      console.log('\n❌ 发现严重问题，请优先处理！');
      process.exit(1);
    } else {
      console.log('\n✅ 代码审查完成');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ 代码审查执行失败:', error);
    process.exit(1);
  }
}

main();
