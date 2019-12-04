const nearley = require("nearley")
const grammar = require("./nba-parser.js")
const {randomizer} = require('./nba-ast-randomizer.js')

module.exports = {parse: (syntax) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(syntax)
    let result = parser.results[0]
    const api = (ob) => ({
        simulateNondeterminism: (seed) => {
            return api(randomizer(seed, ob))
        },
        toJS: () => ob.toJS(),
        toAlgebra: () => ob.toAlgebra()
    })
    return api(result)
}}
