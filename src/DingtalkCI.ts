/*
 * @Author: weisheng
 * @Date: 2023-05-24 14:25:27
 * @LastEditTime: 2023-06-08 21:45:46
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-ci\src\DingtalkCI.ts
 * 记得注释
 */
import { sdk as opensdk } from 'dingtalk-miniapp-opensdk'
import { CIOptions, UploadRes } from './interfaces'
import * as path from 'path'

export async function ddupload(options: CIOptions) {
  opensdk.setConfig({
    appKey: '',
    appSecret: '',
    accessToken: options.dd!.token,
    host: 'https://oapi.dingtalk.com'
  })
  let hasDone = false
  let uploadRes: UploadRes = {}
  try {
    await opensdk.miniUpload({
      project: options.dd!.projectPath,
      miniAppId: options.dd!.appid,
      packageVersion: options.dd!.autoincrement ? '' : options.version,
      onProgressUpdate: (info: any) => {
        const { data = {} as any, status } = info
        const logId = path.basename(data.logUrl || '')
        const log = data.log
        if (status === 'success') {
          if (!hasDone) {
            console.log('构建成功')
            console.log('本次上传版本号', data.version)
            hasDone = true
            uploadRes = {
              version: data.version,
              appId: options.dd!.appid,
              errorMsg: `上传成功 ${new Date().toLocaleString()} ${data.version}\n`,
              platform: 'dd'
            }
            if (options.success && typeof options.success === 'function') {
              options.success(uploadRes)
            }
            return Promise.resolve(uploadRes)
          }
        } else if (status === 'building') {
          console.log(`构建中，正在查询构建结果。 ${logId ? `logId: ${logId}` : ''}`)
        } else if (status === 'overtime') {
          uploadRes = {
            version: options.dd!.autoincrement ? '' : options.version,
            appId: options.dd!.appid,
            errorMsg: `构建超时，请重试 ${new Date().toLocaleString()} ${data.version || options.dd!.autoincrement ? '' : options.version}\n`,
            platform: 'dd'
          }
          if (options.fail && typeof options.fail === 'function') {
            options.fail(uploadRes)
          }
          return Promise.reject(uploadRes)
        } else if (status === 'failed') {
          uploadRes = {
            version: options.dd!.autoincrement ? '' : options.version,
            appId: options.dd!.appid,
            errorMsg: `构建失败 ${new Date().toLocaleString()} ${
              data.version || options.dd!.autoincrement ? '' : options.version
            }\n ${logId}:${log}\n`,
            platform: 'dd'
          }
          if (options.fail && typeof options.fail === 'function') {
            options.fail(uploadRes)
          }
          return Promise.reject(uploadRes)
        }
      }
    })
  } catch (error: any) {
    uploadRes = {
      version: options.dd!.autoincrement ? '' : options.version,
      appId: options.dd!.appid,
      errorMsg: `上传失败 ${new Date().toLocaleString()} \n${error.message}`,
      platform: 'dd'
    }
    if (options.fail && typeof options.fail === 'function') {
      options.fail(uploadRes)
    }
    return Promise.reject(uploadRes)
  }
}
