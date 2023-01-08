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
      name: 'localBranches',
      default: '',
      choices,
    },
    {
      type: 'confirm',
      message: '是否同时删除远程分支? 默认为false',
      name: 'removeOrigin',
      default: false,
    },
  ])
  .then((answers) => {
    const str = answers.localBranches.join(' ');
    execaCommand('git branch -D ' + str)
      .then(() => {  
        console.log('已成功删除本地分支：' + str)
      })
      .catch((err) => {
        console.log('删除本地分支失败' + err)
      })
    if (answers.removeOrigin) {
      execaCommand('git push origin --delete ' + str)
      .then(() => {  
        console.log('已成功删除远程分支：' + str)
      })
      .catch((err) => {
        console.log('删除远程分支失败' + err)
      })
    }
  })
  .catch((error) => {
    console.log('error', error);
  });
}).catch((err) => {
  console.info('获取本地分支失败：', err)
});
