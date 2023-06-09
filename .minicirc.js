// eslint-disable-next-line
module.exports = {
  "weixin": {
    "appid": "微信小程序appid",
    "privateKeyPath": "密钥文件相对项目根目录的相对路径，例如 key/private.appid.key",
    "projectPath": "微信小程序产物目录，例如 dist/build/mp-weixin",
  },
  "alipay": {
    "appid": "支付宝小程序appid",
    "toolId": "支付宝开放平台工具ID",
    "privateKey": "私钥文本内容",
    "projectPath": "支付宝小程序产物目录，例如 dist/build/mp-alipay",
  },
  "dd": {
    "appid": "钉钉小程序appid,钉钉开发者后台的 MiniAppId 选项",
    "token": "钉钉开发者后台的 API Token",
    "projectPath": "钉钉小程序产物目录，例如 dist/build/mp-alipay",
  },
  "version": "0.0.1",
  "desc": "版本描述",
  success: (res) => {
    console.log(res);
  }
}