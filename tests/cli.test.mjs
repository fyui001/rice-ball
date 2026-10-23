import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bin = path.join(root, 'dist/bin/index.js')

const flags = [
  'example_flag_css',
  'example_flag_js',
  'example-flag-php',
  'example_flag_py',
  'example_flag_scss',
  'abc',
  'example_flag_ts',
]

function readTree(dir) {
  return Object.fromEntries(
    fs
      .readdirSync(dir)
      .sort()
      .map((name) => [name, fs.readFileSync(path.join(dir, name), 'utf8')]),
  )
}

function runSelecting(cwd, index) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [bin], { cwd })
    let stdout = ''
    let answered = false
    child.stdout.on('data', (chunk) => {
      stdout += chunk
      if (!answered && stdout.includes('Please choice delete flag.')) {
        answered = true
        child.stdin.write('\x1b[B'.repeat(index) + '\r')
      }
    })
    child.on('error', reject)
    child.on('close', (code) => resolve({ code, stdout }))
  })
}

for (const [index, flag] of flags.entries()) {
  test(`deletes the code marked with ${flag}`, async (t) => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'rice-ball-'))
    t.after(() => fs.rmSync(cwd, { recursive: true, force: true }))
    fs.cpSync(path.join(root, 'tests/Example'), path.join(cwd, 'tests/Example'), { recursive: true })
    fs.copyFileSync(path.join(root, 'rice-ball.json'), path.join(cwd, 'rice-ball.json'))

    const { code, stdout } = await runSelecting(cwd, index)

    assert.equal(code, 0)
    assert.match(stdout, new RegExp(`Deleted choose flag '${flag}'\\.`))
    assert.deepEqual(readTree(path.join(cwd, 'tests/Example')), readTree(path.join(root, 'tests/Expected', flag)))
  })
}
