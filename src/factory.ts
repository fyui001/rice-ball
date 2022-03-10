import Finder from './finder'
import Flag from './flag/flag'
import * as fs from 'fs'

export default class Factory {
  finder: Finder

  public constructor(finder: Finder) {
    this.finder = finder
  }

  public async execDelete(selectedFlag: Flag) {
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
        } else if (this.isIgnoreEnd(line)) {
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
    return /rice-ball+( )+(start)( )+(?<flag>[a-z0-9_\-=]*)/g
  }

  protected isBoxInDeleteEndRegExp(): RegExp {
    return /rice-ball+( )+(end)( )+(?<flag>[a-z0-9_\-=]*)/g
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
    const regex = /rice-ball+( )+(file)( )+(?<flag>[a-z0-9_\-=]*)/g
    return regex.exec(line) !== null
  }

  protected isLineDelete(line: string): boolean {
    const regex = /rice-ball+( )+(line)( )+(?<flag>[a-z0-9_\-=]*)/g
    return regex.exec(line) !== null
  }
}
