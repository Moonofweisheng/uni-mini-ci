/*
 * @Author: weisheng
 * @Date: 2023-05-24 18:44:55
 * @LastEditTime: 2023-05-24 20:21:56
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \uni-mini-ci\src\utils\Config.ts
 * 记得注释
 */
import JoyCon from 'joycon'
import * as fs from 'fs-extra'
import * as JSON5 from 'json5'
import { CIOptions } from '../interfaces'
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

export async function getConfig(): Promise<CIOptions> {
  const { data } = await joycon.load(['.minicirc'])
  return data
}
