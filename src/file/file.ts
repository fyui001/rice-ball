export default class File {
  private readonly file: string

  public constructor(value: string) {
    this.file = value
  }

  public getValue(): string {
    return this.file
  }
}
