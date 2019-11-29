// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


function flatParallel(x) {
 return (x !== undefined && Array.isArray(x) && x.length == 1) ? x[0] : x
}

function flatten(x) {
  if (!Array.isArray(x)) return x
  return x.reduce((acc, val) => acc.concat(flatten(val)), []);
}
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "main", "symbols": ["PARALLEL"], "postprocess": id},
    {"name": "OPERATION", "symbols": ["VARIABLE"], "postprocess": id},
    {"name": "OPERATION", "symbols": ["CAPABILITY"], "postprocess": id},
    {"name": "OPERATION", "symbols": ["MESSAGE_OP"], "postprocess": id},
    {"name": "AMBIENT", "symbols": ["NAME", {"literal":"["}, "_", "PARALLEL", "_", {"literal":"]"}], "postprocess": ([name,,,parallel]) => ({ambient: name, next: flatParallel(parallel)})},
    {"name": "AMBIENT", "symbols": ["NAME", {"literal":"["}, "_", {"literal":"]"}], "postprocess": ([name]) => ({ambient: name})},
    {"name": "CAPABILITY", "symbols": ["READS"], "postprocess": id},
    {"name": "CAPABILITY", "symbols": ["WRITES"], "postprocess": id},
    {"name": "CAPABILITY", "symbols": ["INS"], "postprocess": id},
    {"name": "CAPABILITY", "symbols": ["OUTS"], "postprocess": id},
    {"name": "READS$string$1", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"a"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "READS", "symbols": ["READS$string$1", "_", {"literal":"("}, "NAME", "_", {"literal":","}, "_", "NAMES", {"literal":")"}], "postprocess": ([,,,target,,,,names]) => ({op: 'read', args: flatten([target,names])})},
    {"name": "READS$string$2", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"a"}, {"literal":"d"}, {"literal":"_"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "READS", "symbols": ["READS$string$2", "_", {"literal":"("}, "MESSAGES", {"literal":")"}], "postprocess": ([,,,messages]) => ({op: 'read_', args: flatten(messages)})},
    {"name": "READS$string$3", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"a"}, {"literal":"d"}, {"literal":"_"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "READS", "symbols": ["READS$string$3", "_", {"literal":"("}, "_", {"literal":")"}], "postprocess": ([]) => ({op: 'read_', args: []})},
    {"name": "WRITES$string$1", "symbols": [{"literal":"w"}, {"literal":"r"}, {"literal":"i"}, {"literal":"t"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "WRITES", "symbols": ["WRITES$string$1", "_", {"literal":"("}, "NAME", "_", {"literal":","}, "_", "MESSAGES", {"literal":")"}], "postprocess": ([,,,target,,,,messages]) => ({op: 'write', args: flatten([target, messages])})},
    {"name": "WRITES$string$2", "symbols": [{"literal":"w"}, {"literal":"r"}, {"literal":"i"}, {"literal":"t"}, {"literal":"e"}, {"literal":"_"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "WRITES", "symbols": ["WRITES$string$2", "_", {"literal":"("}, "NAMES", {"literal":")"}], "postprocess": ([,,,names]) => ({op: 'write_', args: flatten(names)})},
    {"name": "WRITES$string$3", "symbols": [{"literal":"w"}, {"literal":"r"}, {"literal":"i"}, {"literal":"t"}, {"literal":"e"}, {"literal":"_"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "WRITES", "symbols": ["WRITES$string$3", "_", {"literal":"("}, "_", {"literal":")"}], "postprocess": ([]) => ({op: 'write_', args: []})},
    {"name": "INS$string$1", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "INS", "symbols": ["INS$string$1", "_", {"literal":"("}, "NAME", "_", {"literal":","}, "_", "NAME", {"literal":")"}], "postprocess": ([,,,name,,,,pw]) => ({op: 'in', args: [name, pw]})},
    {"name": "INS$string$2", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"_"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "INS", "symbols": ["INS$string$2", "_", {"literal":"("}, "NAME", "_", {"literal":","}, "_", "NAME", {"literal":")"}], "postprocess": ([,,,name,,,,pw]) => ({op: 'in_', args: [name, pw]})},
    {"name": "OUTS$string$1", "symbols": [{"literal":"o"}, {"literal":"u"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "OUTS", "symbols": ["OUTS$string$1", "_", {"literal":"("}, "NAME", "_", {"literal":","}, "_", "NAME", {"literal":")"}], "postprocess": ([,,,name,,,,pw]) => ({op: 'out', args: [name, pw]})},
    {"name": "OUTS$string$2", "symbols": [{"literal":"o"}, {"literal":"u"}, {"literal":"t"}, {"literal":"_"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "OUTS", "symbols": ["OUTS$string$2", "_", {"literal":"("}, "NAME", "_", {"literal":","}, "_", "NAME", {"literal":")"}], "postprocess": ([,,,name,,,,pw]) => ({op: 'out_', args: [name, pw]})},
    {"name": "MESSAGE_OP", "symbols": [{"literal":":"}, "NAME"], "postprocess": ([,name]) => ({op: 'substitute', args: name})},
    {"name": "MESSAGE", "symbols": ["SEQUENTIAL"], "postprocess": id},
    {"name": "MESSAGE", "symbols": ["NAME"], "postprocess": id},
    {"name": "MESSAGES", "symbols": ["MESSAGES", "_", {"literal":","}, "_", "MESSAGE"], "postprocess": ([left,,,,right]) => left.concat([right])},
    {"name": "MESSAGES", "symbols": ["MESSAGE"], "postprocess": ([msg]) => [msg]},
    {"name": "SEQUENTIAL", "symbols": ["OPERATION", "_", {"literal":"."}, "_", "SEQUENTIAL"], "postprocess":  ([first,,,,rest]) => {
          let next = {next: rest}
          return Object.assign(first, next)
        } },
    {"name": "SEQUENTIAL", "symbols": ["OPERATION"], "postprocess": ([first]) => first},
    {"name": "SEQUENTIAL", "symbols": [{"literal":"("}, "_", "PARALLEL", "_", {"literal":")"}], "postprocess": ([,,first]) => flatParallel(first)},
    {"name": "SEQUENTIAL", "symbols": ["AMBIENT"], "postprocess": ([first]) => first},
    {"name": "PARALLEL", "symbols": ["PARALLEL", "_", {"literal":"|"}, "_", "SEQUENTIAL"], "postprocess": ([left,,,,right]) => left.concat([right])},
    {"name": "PARALLEL", "symbols": ["SEQUENTIAL"], "postprocess": ([seq]) => [seq]},
    {"name": "NAMES", "symbols": ["NAMES", "_", {"literal":","}, "_", "NAME"], "postprocess": ([left,,,,right]) => left.concat([right])},
    {"name": "NAMES", "symbols": ["NAME"], "postprocess": ([name]) => [name]},
    {"name": "NAME$ebnf$1", "symbols": [/[_a-z0-9_]/]},
    {"name": "NAME$ebnf$1", "symbols": ["NAME$ebnf$1", /[_a-z0-9_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "NAME", "symbols": ["NAME$ebnf$1"], "postprocess": ([name]) => name.join('')},
    {"name": "VARIABLE$ebnf$1", "symbols": [/[A-Z]/]},
    {"name": "VARIABLE$ebnf$1", "symbols": ["VARIABLE$ebnf$1", /[A-Z]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "VARIABLE", "symbols": ["VARIABLE$ebnf$1"], "postprocess": ([variable]) => variable.join('')}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
