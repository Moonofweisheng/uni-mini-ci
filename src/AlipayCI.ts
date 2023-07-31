/*
 * @Author: weisheng
 * @Date: 2023-05-24 14:25:27
 * @LastEditTime: 2023-05-26 10:35:03
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-ci\src\AlipayCI.ts
 * 记得注释
 */
import { minidev, useDefaults } from 'minidev'
import { CIOptions } from './interfaces'
import * as path from 'path'
import * as fs from 'fs-extra'
import { compareVersion } from './utils/compareVersion'

export async function aliupload(options: CIOptions) {
  // eslint-disable-next-line prefer-const
  let { toolId, privateKey, privateKeyPath } = options.alipay
  if (!privateKey) {
    privateKeyPath = path.resolve(process.cwd(), options.alipay.privateKeyPath)
    if (!fs.existsSync(privateKeyPath)) {
      console.error(`"alipay.privateKeyPath"选项配置的路径不存在,本次上传终止:${privateKeyPath}`)
      process.exit(1)
    } else {
      privateKey = fs.readFileSync(privateKeyPath, 'utf-8')
    }
  }

  useDefaults({
    config: {
      defaults: {
        'alipay.authentication.privateKey': privateKey,
        'alipay.authentication.toolId': toolId
      }
    }
  })

  const { clientType = 'alipay', appid: appId } = options.alipay!
  console.log('上传代码到阿里小程序后台', clientType)

  //  SDK上传不支持设置描述信息; 版本号必须大于现有版本号
  try {
    const lasterVersion = await minidev.app.getUploadedVersion({
      appId,
      clientType
    })
    if (compareVersion(options.version, lasterVersion) <= 0) {
      console.warn(`上传版本号 "${options.version}" 必须大于最新上传版本 "${lasterVersion}"`)
      process.exit(1)
    }
    const result = await minidev.upload({
      project: options.alipay!.projectPath,
      appId,
      version: options.alipay!.autoincrement ? '' : options.version,
      clientType,
      experience: true
    })
    console.log(`上传成功 ${new Date().toLocaleString()} ${result.version}\n`)
  } catch (error) {
    console.error(`上传失败 ${new Date().toLocaleString()} \n${error}`)
    process.exit(1)
  }
}
