#!/usr/bin/env node

export * from './interfaces'
import { wxupload } from './WexinCI'
import { aliupload } from './AlipayCI'
import { ddupload } from './DingtalkCI'

import { getConfig } from './utils/Config'
import { CIOptions, Platform } from './interfaces'

if (process.argv.length < 3) {
  console.log('🐛 参数缺失，请传入CI参数')
  process.exit(1)
}

const args = process.argv.splice(2)

// 参数合法校验
if (args.length % 2 !== 0 || args.length === 0) {
  const argsTxt = args.join() || '空'
  console.log(`🐛 参数错误，请确认传入参数是否正确，输入参数为：${argsTxt}`)
  process.exit(1)
}

const params: Record<string, string> = {}

for (let index = 0; index < args.length / 2; index++) {
  params[args[index * 2]] = args[index * 2 + 1]
}

if (params['--platform']) {
  getConfig().then((resp) => {
    checkCIOptions(resp, params['--platform'] as Platform)
    switch (params['--platform']) {
      case 'weixin':
        console.log('上传代码到微信小程序后台')
        wxupload(resp)
          .then((resp) => {
            console.log(resp.errorMsg)
            process.exit(0)
          })
          .catch((error) => {
            console.log(error.errorMsg)
            process.exit(1)
          })
        break
      case 'alipay':
        console.log('上传代码到阿里小程序后台')
        aliupload(resp)
          .then((resp) => {
            console.log(resp.errorMsg)
            process.exit(0)
          })
          .catch((error) => {
            console.log(error.errorMsg)
            process.exit(1)
          })
        break
      case 'dd':
        console.log('上传代码到钉钉小程序后台')
        ddupload(resp)
          .then((resp: any) => {
            console.log(resp.errorMsg)
            process.exit(0)
          })
          .catch((error) => {
            console.log(error.errorMsg)
            process.exit(1)
          })
        break
      default:
        console.log(`🐛 参数错误，请确认传入参数platform是否正确：${params['--platform']}`)
        process.exit(1)
    }
  })
} else {
  console.log('🐛 参数错误，请确认传入参数：--platform 是否正确')
  process.exit(1)
}

/**
 * 校验CI参数填写是否正确
 * @param options CI参数
 * @param platform 平台
 */
function checkCIOptions(options: CIOptions, platform: Platform) {
  if (!options) {
    console.log('🐛 配置文件 .minicirc 、.minicirc.js 缺失，请按照文档配置后继续。')
    process.exit(1)
  }
  if (!options[platform]) {
    console.log(`🐛 配置文件缺少${platform}平台的配置`)
    process.exit(1)
  }
}
