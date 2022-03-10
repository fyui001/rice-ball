import Finder from './finder'
import Flag from './flag/flag'
import * as fs from 'fs'

export default class Factory {
  finder: Finder
  flag: Flag | undefined

  public constructor(finder: Finder) {
    this.finder = finder
  }

  public async execDelete(selectedFlag: Flag) {
    this.flag = selectedFlag
    for await (const filePath of this.finder.targetFileList[selectedFlag.getValue()]) {
      const file = fs.readFileSync(filePath, { encoding: 'utf8' })
      if (this.isFileDelete(file)) {
        fs.unlinkSync(filePath)
        continue
      }

      const boxInStartRegex = this.isBoxInDeleteStartRegExp()
      const boxInEndRegex = this.isBoxInDeleteEndRegExp()
      let rewrittenText = ''
      let isDelete = false
      let isIgnore = false

      for await (let line of file.split('\n')) {
        line += line === '\n' ? '' : '\n'
        if ((boxInStartRegex.exec(line) !== null || isDelete) && !isIgnore) {
          isDelete = true
          if (this.isIgnoreStart(line)) {
            isIgnore = true
          }
          if (boxInEndRegex.exec(line) !== null) {
            isDelete = false
          }
          line = ''
        } else if (this.isIgnoreEnd(line) && isIgnore) {
          line = ''
          isIgnore = false
        }
        if (this.isLineDelete(line)) {
          line = ''
        }
        rewrittenText += line
      }
      fs.writeFileSync(filePath, rewrittenText.substr(0, rewrittenText.length - 1))
    }
  }

  protected isBoxInDeleteStartRegExp(): RegExp {
    return new RegExp(`rice-ball+( )+(start)( )+(${this.flag?.getValue()})`, 'g')
  }

  protected isBoxInDeleteEndRegExp(): RegExp {
    return new RegExp(`rice-ball+( )+(end)( )+(${this.flag?.getValue()})`, 'g')
  }

  protected isIgnoreStart(line: string): boolean {
    const regex = /rice-ball+( )+(ignore)( )+(start)/g
    return regex.exec(line) !== null
  }

  protected isIgnoreEnd(line: string): boolean {
    const regex = /rice-ball+( )+(ignore)( )+(end)/g
    return regex.exec(line) !== null
  }

  protected isFileDelete(line: string): boolean {
    const regex = new RegExp(`rice-ball+( )+(file)( )+(${this.flag?.getValue()})`, 'g')
    return regex.exec(line) !== null
  }

  protected isLineDelete(line: string): boolean {
    const regex = new RegExp(`rice-ball+( )+(line)( )+(${this.flag?.getValue()})`, 'g')
    return regex.exec(line) !== null
  }
}
