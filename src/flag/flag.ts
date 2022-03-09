export default class Flag {
  private readonly flag: string

  public constructor(value: string) {
    this.flag = value
  }

  public getValue(): string {
    return this.flag
  }

  public equal(value: Flag) {
    return this.flag === value.getValue()
  }
}
