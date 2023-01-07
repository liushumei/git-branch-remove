#!/usr/bin/env node
import { execaCommand, execaCommandSync } from 'execa'
import inquirer from 'inquirer'

function getGitBranch() {
  const res = execaCommandSync('git status');
  console.info('res----', res)
  return res.stdout;
}
const branches = getGitBranch()
// console.info('branched', branches)
// inquirer
//   .prompt([
//     {
//       type: 'checkbox',
//       message: '请选择要删除的分支',
//       name: 'branches',
//       default: '',
//       choices: ['branch1', 'jkac', 'haha'],
//     },
//     {
//       type: 'confirm',
//       message: '是否同时删除远程分支?',
//       name: 'isRemoveOrigin',
//       default: false,
//     },
//   ])
//   .then((answers) => {
//     console.log('answers', answers);
//   })
//   .catch((error) => {
//     console.log('error', error);
//   });
