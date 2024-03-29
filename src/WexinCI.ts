/*
 * @Author: weisheng
 * @Date: 2023-05-24 14:25:27
 * @LastEditTime: 2023-05-26 10:12:49
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-ci\src\WexinCI.ts
 * 记得注释
 */
import * as ci from 'miniprogram-ci'
import { CIOptions, ProjectType } from './interfaces'
import * as fs from 'fs-extra'
import * as path from 'path'

export async function wxupload(options: CIOptions) {
  const privateKeyPath = path.resolve(process.cwd(), options.weixin.privateKeyPath)
  if (!fs.existsSync(privateKeyPath)) {
    console.error(`"weixin.privateKeyPath"选项配置的路径不存在,本次上传终止:${privateKeyPath}`)
    process.exit(1)
  }
  const project = new ci.Project({
    type: 'miniProgram' as ProjectType,
    projectPath: options.weixin!.projectPath,
    appid: options.weixin!.appid,
    privateKeyPath: privateKeyPath,
    ignores: options.weixin!.ignores
  })
  try {
    const uploadResult = await ci.upload({
      version: options.version,
      project: project,
      desc: options.desc,
      onProgressUpdate: undefined,
      robot: options.weixin!.robot,
      setting: options.weixin!.setting
    })

    if (uploadResult.subPackageInfo) {
      const allPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__FULL__')
      const mainPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__APP__')
      const extInfo = `本次上传${allPackageInfo!.size / 1024}kb ${mainPackageInfo ? ',其中主包' + mainPackageInfo.size + 'kb' : ''}`
      console.log(`版本 ${options.version} 上传成功 ${new Date().toLocaleString()} ${extInfo}\n`)
    }
  } catch (error) {
    console.error(`上传失败 ${new Date().toLocaleString()} \n${error}`)
    process.exit(1)
  }
}
