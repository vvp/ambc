const nearley = require("nearley");
const grammar = require("./nba-parser.js");
const {toAlgebra} = require('./nba-algebra.js')

module.exports = {parse: (syntax) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(syntax)
    return {
        toJS: () => parser.results[0].toJS(),
        toAlgebra: () => toAlgebra(parser.results[0])
    }
}}
