const nearley = require("nearley");
const grammar = require("./nba-parser.js");

module.exports = {parse: (syntax) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(syntax)
    return parser.results[0]
}}
