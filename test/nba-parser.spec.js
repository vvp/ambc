const assert = require('assert')
const seedrandom = require('seedrandom')

const parser = require('../src/nba-parser')
const fs = require('fs')

const PARSER_FIXTURES_PATH = 'test/nba-fixtures/'
const TRIM_LINEBREAKS_LEADING_WS = /\n */g

describe('NBA Parser', function () {

  it('Parses ambient syntax into JSON', () => {
    const fixtures = fs.readdirSync(PARSER_FIXTURES_PATH)
    while (fixtures.length > 0) {
      console.log(`Parsing: ${fixtures[0].split('.')[0]}`)
      const syntax = fs.readFileSync(PARSER_FIXTURES_PATH + fixtures[0]).toString().trim()
      // console.log(JSON.stringify(parse(syntax.toString().trim())))
      const result = fs.readFileSync(PARSER_FIXTURES_PATH + fixtures[1]).toString().trim()
      const nba = parser.parse(syntax)
      const nba2 = parser.decode(JSON.parse(result))

      console.log("nba.toJS(): " + JSON.stringify(nba.toJS()))
      console.log("nba2.toAlgebra(): " + nba2.toAlgebra())


      const rnd = seedrandom()
      const seed = rnd().toString()
      const abba = nba.simulateNondeterminism(seed).toJS()
      const otherAbba = nba.simulateNondeterminism(seed).toJS()
      assert.notStrictEqual(abba, otherAbba)
      assert.deepStrictEqual(abba, otherAbba)

      assert.deepStrictEqual(nba.toJS(), JSON.parse(result), `Failed at "${fixtures[0]}`)

      assert.deepStrictEqual(nba.toAlgebra(), syntax.replace(TRIM_LINEBREAKS_LEADING_WS, ''), `ToAlgebra failed at "${fixtures[0]}`)
      fixtures.splice(0, 2)
    }
  })
})
