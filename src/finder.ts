import Config from './config/config'
import File from './file/file'
import FileList from './file/file-list'
import { FileType } from './types/file-type'
import Flag from './flag/flag'
import FlagList from './flag/flag-list'
import TargetFileListType from './types/target-file-list'
import RegExpType from './types/reg-exp'
import * as fs from 'fs'
import * as path from 'path'

export default class Finder {
  private readonly config: Config
  private fileList: FileList = new FileList([])
  readonly flagList: FlagList = new FlagList([])
  readonly targetFileList: TargetFileListType = {}

  public constructor(config: Config) {
    this.config = config
    this.setAllFile()
  }

  public async findFlag(): Promise<void> {
    for await (const file of this.fileList.toArray()) {
      await this.readFile(file)
    }
  }

  protected async readFile(filePath: File): Promise<void> {
    const regex = /rice-ball+( )+(start|line|file)( )+(?<flag>[a-z0-9_+=]*)/g
    let result
    const file = fs.readFileSync(filePath.getValue(), { encoding: 'utf8' })
    if ((result = regex.exec(file) as RegExpType | null) !== null) {
      this.flagList.push(new Flag(result.groups.flag))
      if (this.targetFileList[result.groups.flag] === undefined) {
        this.targetFileList[result.groups.flag] = [filePath.getValue()]
      }
      if (!this.targetFileList[result.groups.flag].includes(filePath.getValue())) {
        this.targetFileList[result.groups.flag].push(filePath.getValue())
      }
    }
  }

  protected setAllFile(): void {
    for (const dir of this.config.dirs) {
      this.searchFile(path.resolve(__dirname, process.cwd() + '/' + dir))
    }
  }

  protected searchFile(dirPath: string): void {
    const dirents = fs.readdirSync(dirPath, { withFileTypes: true })
    for (const dirent of dirents) {
      const path = `${dirPath}/${dirent.name}`

      if (dirent.isDirectory()) {
        this.searchFile(path)
        continue
      }

      if (!this.isSettingExtensions(dirent.name)) {
        continue
      }

      switch (this.getFileType(path)) {
        case FileType.File:
          this.fileList.push(new File(path))
          break
      }
    }
  }

  protected isSettingExtensions(fileName: string): boolean {
    const result = this.config.extensions.find((extension) => {
      return fileName.lastIndexOf(extension) > 0
    })
    return result !== undefined && this.config.extensions.includes(result)
  }

  protected getFileType(target: string) {
    try {
      const stat = fs.statSync(target)
      switch (true) {
        case stat.isFile():
          return FileType.File
        case stat.isDirectory():
          return FileType.Directory
        default:
          return FileType.Unknown
      }
    } catch (e) {
      return FileType.Unknown
    }
  }
}
