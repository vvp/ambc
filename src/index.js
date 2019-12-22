const irParser = require('./ir')
const parse = require('./nba-parser').parse
const js2amb = require('js2amb')
const io = require('orbit-db-io')
const fs = require('fs')

const ambients = { irParser, parse }

const js = {
  irParser: (js) => {
    const ambientSyntax = js2amb(js)
    return ambients.irParser.parse(ambientSyntax)
  },
  parse: (js) => {
    const ambientSyntax = js2amb(js)
    const res = ambients.parse(ambientSyntax)
    return JSON.stringify(res.toJS())
  }
}

const output = async (ipfs, ambient, argv) => {
  // console.log(argv)
  // --format option
  let result
  switch (argv.format) {
    case 'ambient':
      result = ambient
      break
    case 'ir':
      result = js.irParser.parse(ambient)
      break
    default:
      result = js.parse(ambient)
      break
  }

  // --display flag
  // -o option
  if (argv.display) return result
  if (argv.o) {
    fs.writeFileSync(argv.o, result)
    return 'Wrote program to ' + argv.o
  }

  const hash = await io.write(ipfs, 'dag-cbor', result)
  return hash
}

module.exports = { ambients, js, output }
