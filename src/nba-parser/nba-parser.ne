@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace

@{%

function flatParallel(x) {
 return (x !== undefined && Array.isArray(x) && x.length == 1) ? x[0] : x
}

function flatten(x) {
  if (!Array.isArray(x)) return x
  return x.reduce((acc, val) => acc.concat(flatten(val)), []);
}
%}

main -> PARALLEL {% id %}

OPERATION ->
    VARIABLE {% id %} |
    CAPABILITY {% id %} |
    MESSAGE_OP {% id %}

AMBIENT ->
    NAME "[" _ PARALLEL _ "]" {% ([name,,,parallel]) => ({ambient: name, next: flatParallel(parallel)}) %} |
    NAME "[" _ "]" {% ([name]) => ({ambient: name}) %}

CAPABILITY ->
    READS {% id %}  |
    WRITES {% id %}  |
    INS {% id %}  |
    OUTS {% id %}


READS ->
    "read" _ "(" NAME _ "," _ NAMES ")" {% ([,,,target,,,,names]) => ({op: 'read', args: flatten([target,names])}) %} |
    "read_" _ "(" MESSAGES ")" {% ([,,,messages]) => ({op: 'read_', args: flatten(messages)}) %} |
    "read_" _ "(" _ ")" {% ([]) => ({op: 'read_', args: []}) %}

WRITES ->
    "write" _ "(" NAME _ "," _ MESSAGES ")" {% ([,,,target,,,,messages]) => ({op: 'write', args: flatten([target, messages])}) %} |
    "write_" _ "(" NAMES ")" {% ([,,,names]) => ({op: 'write_', args: flatten(names)}) %} |
    "write_" _ "(" _ ")" {% ([]) => ({op: 'write_', args: []}) %}

INS ->
    "in" _ "(" NAME _ "," _ NAME ")" {% ([,,,name,,,,pw]) => ({op: 'in', args: [name, pw]})  %} |
    "in_" _ "(" NAME _ "," _ NAME ")" {% ([,,,name,,,,pw]) => ({op: 'in_', args: [name, pw]})  %}

OUTS ->
    "out" _ "(" NAME _ "," _ NAME ")" {% ([,,,name,,,,pw]) => ({op: 'out', args: [name, pw]})  %} |
    "out_" _ "(" NAME _ "," _ NAME ")" {% ([,,,name,,,,pw]) => ({op: 'out_', args: [name, pw]})  %}

MESSAGE_OP ->
    ":" NAME {% ([,name]) => ({op: 'substitute', args: name}) %}

MESSAGE ->
    SEQUENTIAL {% id %} |
    NAME  {% id %}

MESSAGES ->
    MESSAGES _ "," _ MESSAGE {% ([left,,,,right]) => left.concat([right]) %} |
    MESSAGE {% ([msg]) => [msg]  %}


SEQUENTIAL ->
    OPERATION _ "." _ SEQUENTIAL {% ([first,,,,rest]) => {
      let next = {next: rest}
      return Object.assign(first, next)
    } %} |
    OPERATION {% ([first]) => first %} |
    "(" _ PARALLEL _ ")" {% ([,,first]) => flatParallel(first) %} |
    AMBIENT {% ([first]) => first %}

PARALLEL ->
    PARALLEL _ "|" _ SEQUENTIAL {% ([left,,,,right]) => left.concat([right]) %} |
    SEQUENTIAL {% ([seq]) => [seq] %}


NAMES ->
    NAMES _ "," _ NAME {% ([left,,,,right]) => left.concat([right]) %} |
    NAME {% ([name]) => [name] %}


NAME -> [_a-z0-9_]:+ {% ([name]) => name.join('') %}
VARIABLE -> [A-Z]:+ {% ([variable]) => variable.join('') %}