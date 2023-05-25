#!/usr/bin/env node

export * from './interfaces'
import { wxupload } from './WexinCI'
import { aliupload } from './AlipayCI'
import { ddupload } from './DingtalkCI'

import { getConfig } from './utils/Config'

if (process.argv.length < 3) {
  console.error('🐛 参数缺失，请传入CI参数')
  process.exit(1)
}

const args = process.argv.splice(2)

// 参数合法校验
if (args.length % 2 !== 0 || args.length === 0) {
  const argsTxt = args.join() || '空'
  console.error(`🐛 参数错误，请确认传入参数是否正确，输入参数为：${argsTxt}`)
  process.exit(1)
}

const params: Record<string, string> = {}

for (let index = 0; index < args.length / 2; index++) {
  params[args[index * 2]] = args[index * 2 + 1]
}

if (params['--platform']) {
  getConfig().then((resp) => {
    switch (params['--platform']) {
      case 'weixin':
        wxupload(resp)
        break
      case 'alipay':
        aliupload(resp)
        break
      case 'dd':
        ddupload(resp)
        break
      default:
        console.error(`🐛 参数错误，请确认传入参数platform是否正确：${params['--platform']}`)
        process.exit(1)
    }
  })
} else {
  console.error('🐛 参数错误，请确认传入参数：--platform 是否正确')
  process.exit(1)
}
