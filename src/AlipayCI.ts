/*
 * @Author: weisheng
 * @Date: 2023-05-24 14:25:27
 * @LastEditTime: 2023-06-09 12:38:00
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-ci\src\AlipayCI.ts
 * 记得注释
 */
import { minidev, useDefaults } from 'minidev'
import { CIOptions, UploadRes } from './interfaces'
import * as path from 'path'
import * as fs from 'fs-extra'
import { compareVersion } from './utils/compareVersion'

export async function aliupload(options: CIOptions) {
  // eslint-disable-next-line prefer-const
  let { toolId, privateKey, privateKeyPath } = options.alipay
  if (!privateKey) {
    privateKeyPath = path.resolve(process.cwd(), options.alipay.privateKeyPath)
    if (!fs.existsSync(privateKeyPath)) {
      const uploadRes: UploadRes = {
        errorMsg: `"alipay.privateKeyPath"选项配置的路径不存在,本次上传终止:${privateKeyPath}`,
        platform: 'alipay'
      }
      return Promise.reject(uploadRes)
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
  //  SDK上传不支持设置描述信息; 版本号必须大于现有版本号
  try {
    const lasterVersion = await minidev.app.getUploadedVersion({
      appId,
      clientType
    })
    if (compareVersion(options.version, lasterVersion) <= 0) {
      const uploadRes: UploadRes = {
        version: options.version,
        appId: appId,
        errorMsg: `上传版本号 "${options.version}" 必须大于最新上传版本 "${lasterVersion}"`,
        platform: 'alipay'
      }
      return Promise.reject(uploadRes)
    }
    const result = await minidev.upload({
      project: options.alipay!.projectPath,
      appId,
      version: options.alipay!.autoincrement ? '' : options.version,
      clientType,
      experience: true
    })
    const uploadRes: UploadRes = {
      version: result.version,
      appId: appId,
      errorMsg: `上传成功 ${new Date().toLocaleString()} ${result.version}\n`,
      platform: 'alipay'
    }
    if (options.success && typeof options.success === 'function') {
      options.success(uploadRes)
    }
    return Promise.resolve(uploadRes)
  } catch (error) {
    const version = options.alipay!.autoincrement ? '' : options.version
    const uploadRes: UploadRes = {
      version: version,
      appId: appId,
      errorMsg: `上传失败 ${new Date().toLocaleString()} \n${error}`,
      platform: 'alipay'
    }
    if (options.fail && typeof options.fail === 'function') {
      options.fail(uploadRes)
    }
    return Promise.reject(uploadRes)
  }
}
