<!--
 * @Author: weisheng
 * @Date: 2023-05-24 11:51:28
 * @LastEditTime: 2023-05-26 10:48:56
 * @LastEditors: weisheng
 * @Description: 
 * @FilePath: \uni-mini-ci\README.md
 * 记得注释
-->
# uni-mini-ci

#### 介绍
`uni-mini-ci`是一个小程序端构建后支持 CI（持续集成）的插件，支持上传微信、企业微信、钉钉、支付宝平台的小程序。只需简单配置，即可轻松上传多个平台的小程序。

## 安装
```
yarn add uni-mini-ci -D
```


## 配置


### 配置文件

你可以使用`.minicirc`文件配置`uni-mini-ci`，在根目录下创建`.minicirc`文件

```json
// .minicirc
{
  "weixin": {
    "appid": "微信小程序appid",
    "privateKeyPath": "密钥文件相对项目根目录的相对路径，例如 key/private.appid.key",
    "projectPath": "微信小程序产物目录，例如 dist/build/mp-weixin"
  },
  "alipay": {
    "appid": "支付宝小程序appid",
    "toolId": "支付宝开放平台工具ID",
    "privateKey": "私钥文本内容",
    "projectPath": "支付宝小程序产物目录，例如 dist/build/mp-alipay",
    "autoincrement": true
  },
  "dd": {
    "appid": "钉钉小程序appid,钉钉开发者后台的 MiniAppId 选项",
    "token": "钉钉开发者后台的 API Token",
    "projectPath": "钉钉小程序产物目录，例如 dist/build/mp-alipay",
    "autoincrement": true
  },
  "version": "0.0.1",
  "desc": "版本描述"
}

```

### 添加命令

添加一条 [npm run script](https://docs.npmjs.com/cli/v9/commands/npm-run-script) 到 `package.json` 中:
```json
{
  "scripts": {
    // 上传到微信小程序
    "upload:weixin": "minici --platform weixin",
    // 上传到支付宝小程序
    "upload:alipay": "minici --platform alipay",
    // 上传到钉钉小程序
    "upload:dd": "minici --platform dd"
  }
}
```
目前`uni-mini-ci`支持一个选项`--platform`，目前支持的平台为：
- `weixin` 微信/企业微信
- `alipay` 支付宝小程序
- `dd` 钉钉小程序

## 上传小程序
配置完成后，可以在终端中执行命令进行上传操作：
- 执行`yarn upload:weixin` 命令上传到微信小程序
- 执行`yarn upload:alipay` 命令上传到支付宝小程序
- 执行`yarn upload:dd` 命令上传到钉钉小程序


我们也可以将上传命令与打包命令组合起来使用，例如：

```json
{
  "scripts": {
    // 打包并上传到微信小程序
    "upload:mp-weixin": "uni build -p mp-weixin && minici --platform weixin",
    // 打包并上传到支付宝小程序
    "upload:mp-alipay": "uni build -p mp-alipay && minici --platform alipay",
    // 打包并上传到钉钉小程序
    "upload:mp-dingtalk": "uni build -p mp-dingtalk && minici --platform dd"
  }
}
```

## 注意
> 支付宝和钉钉小程序不支持上传的版本号大于现有版本号，我们在测试环境调试可能会频繁的修改代码并上传，所以每次上传操作都指定版本号并不现实。针对这一问题，我们提供了`autoincrement`字段用于配置版本号是否自增，配置此字段为`true`时，`uni-mini-ci`会忽略配置文件中的`version`字段，并且上传版本号会在当前版本的小版本号上加一。而生产环境则不建议配置`autoincrement`字段，特殊情况可灵活使用。

## API

### 配置参数

| 参数        | 类型   | 说明                                                                                |
| :---------- | :----- | :---------------------------------------------------------------------------------- |
| weixin       | Object | （企业）微信小程序 CI 配置                                                          |
| alipay      | Object | 支付宝小程序配置                                                                    |
| dd          | Object | 钉钉小程序配置（3.6.0 版本开始支持）                                                |
| version     | string | 上传版本号，不传时默认读取 package.json 下的 taroConfig 下的 version 字段           |
| desc        | string | 上传时的描述信息，不传时默认读取 package.json 下的 taroConfig 下的 desc 字段        |

### （企业）微信小程序 CI 配置

| 参数                | 类型     | 说明                                                                                     |
| :------------------ | :------- | :--------------------------------------------------------------------------------------- |
| appid               | string   | 小程序/小游戏项目的 appid（必填）                                                                |
| privateKeyPath      | string   | 密钥文件相对项目根目录的相对路径，例如 key/private.appid.key，在获取项目属性和上传时用于鉴权使用 （必填）                          |
| projectPath         | string   | 微信小程序产物目录，例如 dist/build/mp-weixin（必填）                           |
| ignores             | string[] | 上传需要排除的目录(选填)                                                                 |
| robot               | number   | 指定使用哪一个 ci 机器人，可选值：1 ~ 30                      |
| setting             | Object   | 预览和上传时的编译设置，具体见下表                            |

#### 编译设置选项说明

| 参数             | 类型    | 说明                                                        |
| :--------------- | :------ | :---------------------------------------------------------- |
| es6              | boolean | 对应于微信开发者工具的 "es6 转 es5"                         |
| es7              | boolean | 对应于微信开发者工具的 "增强编译"                           |
| disableUseStrict | boolean | "增强编译" 开启时，是否禁用 JS 文件严格模式，默认为 false   |
| minifyJS         | boolean | 上传时压缩 JS 代码                                          |
| minifyWXML       | boolean | 上传时压缩 WXML 代码                                        |
| minifyWXSS       | boolean | 上传时压缩 WXSS 代码                                        |
| minify           | boolean | 上传时压缩所有代码，对应于微信开发者工具的 "上传时压缩代码" |
| codeProtect      | boolean | 对应于微信开发者工具的 "上传时进行代码保护"                 |
| autoPrefixWXSS   | boolean | 对应于微信开发者工具的 "上传时样式自动补全"                 |

官方 CI 文档[点这里](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)


### 支付宝小程序 CI 配置

| 参数                | 类型   | 说明                                                                                                                |
| :------------------ | :----- | :------------------------------------------------------------------------------------------------------------------ |
| appid               | string | 支付宝小程序 appid （必填）                                            |
| toolId              | string | 工具 id，[查看这里复制](https://open.alipay.com/dev/workspace/key-manage/tool)（必填）                                      |
| projectPath         | string   | 支付宝小程序产物目录，例如 dist/build/mp-alipay（必填）                          |
| privateKeyPath      | string | 密钥文件相对项目根目录的相对路径, 私钥可通过[支付宝开放平台开发助手](https://opendocs.alipay.com/common/02kipl)生成 |
| privateKey          | string | 私钥文本内容, 生成方式同上(privateKeyPath 和 privateKey 之间必须要填写其中一个)                |
| autoincrement          | boolean | 版本号是否自增（支付宝小程序上传版本号必须大于现有版本号，建议测试环境开启版本号自增）                |
| clientType          | string | 上传的终端,终端类型见下表（选填，默认值 alipay）                                                                    |

```
终端类型值及其含义：

alipay: 支付宝

ampe：AMPE

amap：高德

genie：天猫精灵

alios：ALIOS

uc：UC

quark：夸克

koubei：口碑

alipayiot：IoT

cainiao：菜鸟

alihealth：阿里健康

health:  阿里医院
```

官方 CI 文档[点这里](https://opendocs.alipay.com/mini/02q29z)

### 钉钉小程序 CI 配置

| 参数                | 类型   | 说明                                                                 |
| :------------------ | :----- | :------------------------------------------------------------------- |
| appid               | string | 钉钉小程序appid,钉钉开发者后台的 MiniAppId 选项（必填） |
| token               | string | 令牌，从钉钉后台获取 （必填）                                        |
| projectPath         | string   | 钉钉小程序产物目录，例如 dist/build/mp-alipay（必填）                           |
| autoincrement          | boolean | 版本号是否自增（钉钉小程序上传版本号必须大于现有版本号，建议测试环境开启版本号自增）                |

官方 CI 文档[点这里](https://github.com/open-dingtalk/dingtalk-design-cli)



### 模型定义

```ts
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
}


```
