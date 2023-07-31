/*
 * @Author: weisheng
 * @Date: 2023-05-24 14:25:27
 * @LastEditTime: 2023-07-31 11:14:36
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-ci\src\DingtalkCI.ts
 * 记得注释
 */
import { sdk as opensdk } from 'dingtalk-miniapp-opensdk'
import { CIOptions } from './interfaces'
import * as path from 'path'

export async function ddupload(options: CIOptions) {
  opensdk.setConfig({
    appKey: '',
    appSecret: '',
    accessToken: options.dd!.token,
    host: 'https://oapi.dingtalk.com'
  })
  let hasDone = false
  try {
    console.log('上传代码到钉钉小程序后台')
    const result = await opensdk.miniUpload({
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
          }
        } else if (status === 'building') {
          console.log(`构建中，正在查询构建结果。 ${logId ? `logId: ${logId}` : ''}`)
        } else if (status === 'overtime') {
          console.log('构建超时，请重试', log)
        } else if (status === 'failed') {
          console.log('构建失败', logId)
          console.error(log)
          process.exit(1)
        }
      }
    })
    console.log(`版本 ${result.packageVersion} 上传成功 ${new Date().toLocaleString()}`)
  } catch (error: any) {
    console.error(`上传失败 ${new Date().toLocaleString()} \n${error.message}`)
    process.exit(1)
  }
}
