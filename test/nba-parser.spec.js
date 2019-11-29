const assert = require('assert')

const parser = require('../src/nba-parser')
const fs = require('fs')

const PARSER_FIXTURES_PATH = 'test/nba-fixtures/'

describe('NBA Parser', function () {

  it('Parses ambient syntax into JSON', () => {
    const fixtures = fs.readdirSync(PARSER_FIXTURES_PATH)
    while (fixtures.length > 0) {
      console.log(`Parsing: ${fixtures[0].split('.')[0]}`)
      const syntax = fs.readFileSync(PARSER_FIXTURES_PATH + fixtures[0]).toString().trim()
      // console.log(JSON.stringify(parse(syntax.toString().trim())))
      const result = fs.readFileSync(PARSER_FIXTURES_PATH + fixtures[1]).toString().trim()
      let value = parser.parse(syntax)
      console.log(JSON.stringify(value))
      assert.deepStrictEqual(value, JSON.parse(result), `Failed at "${fixtures[0]}`)
      fixtures.splice(0, 2)
    }
  })
})
