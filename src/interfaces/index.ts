/** 小程序上传平台 */
export type Platform = 'dd' | 'weixin' | 'alipay'

/**微信小程序类型 */
export type ProjectType = 'miniProgram' | 'miniGame' | 'miniProgramPlugin' | 'miniGamePlugin'

/** 微信小程序配置 */
export interface WeixinConfig {
  /** 微信小程序产物目录 */
  projectPath?: string
  /** 小程序/小游戏项目的 appid */
  appid: string
  /** 私钥文件路径，在获取项目属性和上传时用于鉴权使用 */
  privateKeyPath: string
  /** 类型，默认miniProgram 小程序 */
  type?: ProjectType
  /** 上传需要排除的目录 */
  ignores?: Array<string>
  /** 指定使用哪一个 ci 机器人，可选值：1 ~ 30 */
  robot?: number
  /** 预览和上传时的编译设置 */
  setting?: {
    /** 对应于微信开发者工具的 "es6 转 es5" */
    es6: boolean
    /** 对应于微信开发者工具的 "增强编译" */
    es7: boolean
    /** "增强编译" 开启时，是否禁用JS文件严格模式，默认为false */
    disableUseStrict: boolean
    /** 上传时压缩 JS 代码 */
    minifyJS: boolean
    /** 上传时压缩 WXML 代码 */
    minifyWXML: boolean
    /** 上传时压缩 WXSS 代码 */
    minifyWXSS: boolean
    /** 上传时压缩所有代码，对应于微信开发者工具的 "上传时压缩代码" */
    minify: boolean
    /** 对应于微信开发者工具的 "上传时进行代码保护" */
    codeProtect: boolean
    /** 对应于微信开发者工具的 "上传时样式自动补全" */
    autoPrefixWXSS: boolean
  }
}
/** 支付宝小程序终端类型 */
export type AlipayClientType =
  /** 支付宝 */
  | 'alipay'
  /** AMPE */
  | 'ampe'
  /** 高德 */
  | 'amap'
  /** 天猫精灵 */
  | 'genie'
  /** ALIOS */
  | 'alios'
  /** UC */
  | 'uc'
  /** 夸克 */
  | 'quark'
  /** 口碑 */
  | 'koubei'
  /** loT */
  | 'alipayiot'
  /** 菜鸟 */
  | 'cainiao'
  /** 阿里健康(医蝶谷) */
  | 'alihealth'
  /** 阿里医院 */
  | 'health'

/** 支付宝系列小程序配置 */
export interface AlipayConfig {
  /** 支付宝小程序产物目录 */
  projectPath?: string
  /** 小程序appid */
  appid: string
  /** 工具id */
  toolId: string
  /** 私钥文件路径，在获取项目属性和上传时用于鉴权使用(privateKeyPath和privateKey之间必须要填写其中一个) */
  privateKeyPath: string
  /** 私钥文本内容，在获取项目属性和上传时用于鉴权使用(privateKeyPath和privateKey之间必须要填写其中一个) */
  privateKey: string
  /** 上传的终端, 默认alipay */
  clientType?: AlipayClientType
  /** 是否版本号自增，配置后忽略 version 字段 */
  autoincrement?: boolean
}
/**钉钉小程序配置 */
export interface DingtalkConfig {
  /** 钉钉小程序产物目录 */
  projectPath?: string
  /** 钉钉小程序appid,即钉钉开放平台后台应用管理的 MiniAppId 选项（必填） */
  appid: string
  /** 令牌，从钉钉后台获取 */
  token: string
  /** 钉钉应用类型， 默认为:'dingtalk-biz' (企业内部应用) */
  projectType?: DingtalkProjectType
  /** 是否版本号自增，配置后忽略 version 字段 */
  autoincrement?: boolean
}

/**钉钉小程序类型 */
export type DingtalkProjectType =
  /** 第三方个人应用 */
  | 'dingtalk-personal'
  /** 第三方企业应用 */
  | 'dingtalk-biz-isv'
  /** 企业内部应用 */
  | 'dingtalk-biz'
  /** 企业定制应用 */
  | 'dingtalk-biz-custom'
  /** 工作台组件 */
  | 'dingtalk-biz-worktab-plugin'
/**配置参数 */
export interface CIOptions {
  /** 发布版本号，默认取 package.json 文件的 version 字段 */
  version?: string
  /** 版本发布描述， 默认取 package.json 文件的 description 字段 */
  desc?: string
  /** 微信小程序CI配置, 官方文档地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html */
  weixin?: WeixinConfig
  /** 支付宝系列小程序配置，官方文档地址： https://opendocs.alipay.com/mini/miniu/api */
  alipay?: AlipayConfig
  /** 钉钉小程序配置 */
  dd?: DingtalkConfig
  /** 上传成功的回调 */
  success?: (res: UploadRes) => void
  /** 上传失败的回调 */
  fail?: (res: UploadRes) => void
}

/**
 * 上传结果回调参数
 */
export interface UploadRes {
  /** 发布版本号 */
  version?: string
  /** 小程序appid */
  appId?: string
  /** 错误/成功信息 */
  errorMsg?: string
  /** 发布平台 */
  platform?: Platform
}
