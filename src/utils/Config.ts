/*
 * @Author: weisheng
 * @Date: 2023-05-24 18:44:55
 * @LastEditTime: 2023-08-03 12:38:35
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
    try {
      const minicirc = JSON5.parse(source)
      return minicirc
    } catch (error) {
      console.error(`读取.minicirc文件失败 ${new Date().toLocaleString()} \n${error}`)
      process.exit(1)
    }
  }
})
export async function getConfig(): Promise<CIOptions> {
  const { data } = await joycon.load(['.minicirc'])
  const packageSource = fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8')
  const packageJson = JSON5.parse(packageSource)
  data.version = data.version ? data.version : packageJson.version
  data.desc = data.desc ? data.desc : packageJson.description
  return data
}
