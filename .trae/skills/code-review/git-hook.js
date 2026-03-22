#!/usr/bin/env node
/**
 * Git pre-commit 钩子脚本
 * 在提交前自动运行代码审查
 * 
 * 安装方法:
 * 1. 复制此文件到 .git/hooks/pre-commit
 * 2. 添加执行权限: chmod +x .git/hooks/pre-commit
 * 
 * 或者使用 husky:
 * npx husky add .husky/pre-commit "node .trae/skills/code-review/git-hook.js"
 */

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

// 获取暂存区的文件列表
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8'
    });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('获取暂存文件失败:', error);
    return [];
  }
}

// 过滤需要审查的文件
function filterReviewableFiles(files) {
  const reviewableExtensions = [
    '.ts', '.tsx', '.js', '.jsx', '.vue',
    '.css', '.scss', '.less'
  ];
  
  return files.filter(file => {
    // 排除特定目录
    if (file.startsWith('node_modules/')) return false;
    if (file.startsWith('dist/')) return false;
    if (file.startsWith('.git/')) return false;
    
    // 检查扩展名
    const ext = path.extname(file).toLowerCase();
    return reviewableExtensions.includes(ext);
  });
}

// 主函数
async function main() {
  console.log('🔍 Git Pre-commit Hook: 运行代码审查...\n');
  
  const stagedFiles = getStagedFiles();
  
  if (stagedFiles.length === 0) {
    console.log('没有暂存的文件需要审查');
    process.exit(0);
  }
  
  const reviewableFiles = filterReviewableFiles(stagedFiles);
  
  if (reviewableFiles.length === 0) {
    console.log('暂存的文件中无需审查的代码文件');
    process.exit(0);
  }
  
  console.log(`📁 发现 ${reviewableFiles.length} 个需要审查的文件:`);
  reviewableFiles.forEach(file => console.log(`  - ${file}`));
  console.log('');
  
  // 检查是否安装了 tsx
  const tsxPath = path.join(process.cwd(), 'node_modules', '.bin', 'tsx');
  const runReviewPath = path.join(process.cwd(), '.trae', 'skills', 'code-review', 'run-review.ts');
  
  if (!existsSync(runReviewPath)) {
    console.error('❌ 找不到代码审查脚本:', runReviewPath);
    process.exit(1);
  }
  
  try {
    // 运行代码审查
    const command = `npx tsx "${runReviewPath}" ${reviewableFiles.map(f => `"${f}"`).join(' ')}`;
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('\n✅ 代码审查通过，允许提交');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 代码审查未通过');
    console.error('请修复问题后再提交，或使用 --no-verify 跳过检查（不推荐）');
    process.exit(1);
  }
}

main();
