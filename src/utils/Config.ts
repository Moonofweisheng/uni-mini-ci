/*
 * @Author: weisheng
 * @Date: 2023-05-24 18:44:55
 * @LastEditTime: 2023-06-08 21:35:56
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-ci\src\utils\Config.ts
 * 记得注释
 */
import JoyCon from 'joycon'
import * as fs from 'fs-extra'
import * as JSON5 from 'json5'
import { CIOptions } from '../interfaces'
import * as path from 'path'
const joycon = new JoyCon({
  packageKey: 'uni-mini-ci'
})
joycon.addLoader({
  test: /\.minicirc$/,
  load(filePath: string) {
    const source = fs.readFileSync(filePath, 'utf-8')
    return JSON5.parse(source)
  }
})

/**
 * 获取CI配置
 * @param cwd 工作目录
 * @returns
 */
export async function getConfig(cwd?: string): Promise<CIOptions> {
  const { data } = await joycon.load(['.minicirc.js', '.minicirc'], cwd)
  try {
    const packageSource = fs.readFileSync(path.resolve(cwd || process.cwd(), 'package.json'), 'utf-8')
    const packageJson = JSON5.parse(packageSource)
    data.version = data.version ? data.version : packageJson.version
    data.desc = data.desc ? data.desc : packageJson.description
  } catch (error) {
    /* empty */
  }
  return data
}
