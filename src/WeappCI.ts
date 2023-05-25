/*
 * @Author: weisheng
 * @Date: 2023-05-24 14:25:27
 * @LastEditTime: 2023-05-25 14:55:18
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-ci\src\WeappCI.ts
 * 记得注释
 */
import * as ci from 'miniprogram-ci'
import { CIOptions, ProjectType } from './interfaces'
import * as fs from 'fs-extra'
import * as path from 'path'

export async function wxupload(options: CIOptions) {
  const privateKeyPath = path.resolve(process.cwd(), options.weapp.privateKeyPath)
  if (!fs.existsSync(privateKeyPath)) {
    console.error(`"weapp.privateKeyPath"选项配置的路径不存在,本次上传终止:${privateKeyPath}`)
    process.exit(1)
  }
  const project = new ci.Project({
    type: 'miniProgram' as ProjectType,
    projectPath: options.weapp!.projectPath,
    appid: options.weapp!.appid,
    privateKeyPath: privateKeyPath,
    ignores: options.weapp!.ignores
  })
  const uploadResult = await ci.upload({
    version: options.version,
    project: project,
    desc: options.desc,
    onProgressUpdate: undefined,
    robot: options.weapp!.robot,
    setting: options.weapp!.setting
  })

  if (uploadResult.subPackageInfo) {
    const allPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__FULL__')
    const mainPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__APP__')
    const extInfo = `本次上传${allPackageInfo!.size / 1024}kb ${mainPackageInfo ? ',其中主包' + mainPackageInfo.size + 'kb' : ''}`
    console.log(`上传成功 ${new Date().toLocaleString()} ${extInfo}\n`)
  }
}
