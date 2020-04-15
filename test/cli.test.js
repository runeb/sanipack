const path = require('path')
const execa = require('execa')
const tap = require('tap')
const pkg = require('../package.json')

const sanipack = path.resolve(__dirname, '..', pkg.bin.sanipack)

tap.test('shows help if no command is given', async (t) => {
  const {stdout, stderr, exitCode} = await execa(sanipack, {reject: false})
  t.equal(exitCode, 2)
  t.equal(stderr, '')
  t.includes(stdout, pkg.description)
  t.includes(stdout, pkg.binname)
})

tap.test('shows error + help on unknown commands', async (t) => {
  const {stdout, stderr, exitCode} = await execa(sanipack, ['lolwat'], {reject: false})
  t.equal(exitCode, 2)
  t.equal(stderr, 'Unknown command "lolwat"')
  t.includes(stdout, pkg.description)
  t.includes(stdout, pkg.binname)
})

tap.test('shows no stack trace without --debug', async (t) => {
  const {stdout, stderr, exitCode} = await execa(sanipack, ['version', '--major', '--minor'], {
    reject: false,
  })
  t.equal(exitCode, 1)
  t.equal(stdout, '')
  t.includes(stderr, 'only one can be used at a time')
  t.doesNotHave(stderr, '/cmds/version.js:')
})

tap.test('shows stack trace with --debug', async (t) => {
  const {stdout, stderr, exitCode} = await execa(
    sanipack,
    ['version', '--debug', '--major', '--minor'],
    {reject: false}
  )
  t.equal(exitCode, 1)
  t.equal(stdout, '')
  t.includes(stderr, 'only one can be used at a time')
  t.includes(stderr, '/cmds/version.js:')
})
