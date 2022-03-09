import Flag from './flag'

export default class FlagList {
  private readonly flagList: Flag[]

  public constructor(value: Flag[]) {
    this.flagList = value
  }

  public push(value: Flag): void {
    if (this.includes(value)) {
      return
    }
    this.flagList.push(value)
  }

  public toArray(): Flag[] {
    return this.flagList
  }

  protected includes(value: Flag): boolean {
    return (
      this.flagList.find((flag) => {
        return flag.equal(value)
      }) !== undefined
    )
  }
}
