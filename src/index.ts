import Enquirer from 'enquirer'
import Config from './config/config'
import Finder from './finder'
import EnquirerType from './types/enquirer'
import Factory from './factory'
import Flag from './flag/flag'

async function cliStart(finder: Finder): Promise<void> {
  const factory = new Factory(finder)
  const flags = finder.flagList.toArray().map((flag) => flag.getValue())

  if (flags.length === 0) {
    console.log('Not found flag to choose from.')
    return
  }
  const question = {
    type: 'select',
    name: 'selectedFlag',
    message: 'Please choice delete flag.',
    choices: flags,
  }
  const answer: EnquirerType = await Enquirer.prompt(question)
  await factory.execDelete(new Flag(answer.selectedFlag))
  console.log(`Deleted choose flag '${answer.selectedFlag}'.`)
}

export default async function main(): Promise<void> {
  const RiceBall = require(process.cwd() + '/rice-ball.json')
  const config = new Config(RiceBall)
  const finder = await new Finder(config)
  await finder.findFlag()
  await cliStart(finder)
}
