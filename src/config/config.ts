import ConfigType from '../types/config'

export default class Config implements ConfigType {
  dirs: string[]
  extensions: string[]

  public constructor(value: ConfigType) {
    this.dirs = value.dirs
    this.extensions = value.extensions
  }
}
