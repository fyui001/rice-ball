import File from './file'

export default class FileList {
  private readonly fileList: File[]

  public constructor(value: File[]) {
    this.fileList = value
  }

  public push(value: File): void {
    this.fileList.push(value)
  }

  public apply(value: File[]): void {
    this.fileList.push.apply(value)
  }

  public toArray(): File[] {
    return this.fileList
  }
}
