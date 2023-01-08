#!/usr/bin/env node
import { execaCommand } from 'execa'
import inquirer from 'inquirer'

execaCommand('git branch')
 .then((res = '') => {
  const branchStr = res.stdout || ''
  const choices = branchStr.trim().split('\n')
    .filter((branch) => {
      return branch && !['master', 'gray-release', 'release'].includes(branch.trim()) && !branch.startsWith('*')
    })
    .map((branch) => branch.trim());
  if (!choices.length) {
    console.log('暂无可删除的本地分支')
    return
  }
  inquirer
  .prompt([
    {
      type: 'checkbox',
      message: '请选择要删除的分支（已自动过滤master、gray-release、release分支）',
      name: 'removeLocal',
      default: '',
      choices,
    },
    {
      type: 'confirm',
      message: '是否同时删除远程分支?',
      name: 'removeOrigin',
      default: false,
    },
  ])
  .then((answers) => {
    const branchStr = answers.removeLocal.join(' ');
    execaCommand('git branch -d ' + (answers.removeOrigin ? '-r ' : '') + branchStr)
      .then(() => {  
        console.log('已成功删除分支：' + branchStr)
      })
      .catch((err) => {
        console.log('删除分支失败' + err)
      })
  })
  .catch((error) => {
    console.log('error', error);
  });
}).catch((err) => {
  console.info('获取本地分支失败：', err)
});
