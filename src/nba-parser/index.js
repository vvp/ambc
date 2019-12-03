const nearley = require("nearley");
const grammar = require("./nba-parser.js");
const {toAlgebra} = require('./nba-algebra.js')

module.exports = {parse: (syntax) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(syntax)
    const result = parser.results[0]

    return {
        toJS: () => result,
        toAlgebra: () => toAlgebra(result)
    }
}}
