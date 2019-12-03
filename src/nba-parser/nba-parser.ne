@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace

@{%

const ast = require('./nba-ast.js')
%}

main -> PARALLEL {% ([parallel]) => ast.program(parallel) %}

OPERATION ->
    VARIABLE {% id %} |
    CAPABILITY {% id %} |
    MESSAGE_OP {% id %}

AMBIENT ->
    NAME "[" _ PARALLEL _ "]" {% ([name,,,parallel]) => ast.ambient(name, parallel) %} |
    NAME "[" _ "]" {% ([name]) => ast.ambient(name, []) %}

CAPABILITY ->
    READS {% id %}  |
    WRITES {% id %}  |
    INS {% id %}  |
    OUTS {% id %}


READS ->
    "read" _ "(" NAME _ "," _ NAMES ")" {% ([,,,target,,,,names]) => ast.cap('read', target, names) %} |
    "read_" _ "(" MESSAGES ")" {% ([,,,messages]) => ast.cocap('read_', messages) %} |
    "read_" _ "(" _ ")" {% ([]) => ast.cocap('read_', []) %}

WRITES ->
    "write" _ "(" NAME _ "," _ MESSAGES ")" {% ([,,,target,,,,messages]) => ast.cap('write', target, messages) %} |
    "write_" _ "(" NAMES ")" {% ([,,,names]) => ast.cocap('write_', names) %} |
    "write_" _ "(" _ ")" {% ([]) => ast.cocap('write_', []) %}

INS ->
    "in" _ "(" NAME _ "," _ NAME ")" {% ([,,,name,,,,pw]) => ast.cap('in', name, pw) %} |
    "in_" _ "(" NAME _ "," _ NAME ")" {% ([,,,name,,,,pw]) => ast.cocap('in_', [name, pw]) %}

OUTS ->
    "out" _ "(" NAME _ "," _ NAME ")" {% ([,,,name,,,,pw]) => ast.cap('out', name, pw) %} |
    "out_" _ "(" NAME _ "," _ NAME ")" {% ([,,,name,,,,pw]) => ast.cocap('out_', [name, pw]) %}

MESSAGE_OP ->
    ":" NAME {% ([,name]) => ast.subst(name)  %}

MESSAGE ->
    SEQUENTIAL {% id %} |
    NAME  {% id %}

MESSAGES ->
    MESSAGES _ "," _ MESSAGE {% ([left,,,,right]) => ast.array(left, right) %} |
    MESSAGE {% ([msg]) => ast.array([], msg)  %}


SEQUENTIAL ->
    OPERATION _ "." _ SEQUENTIAL {% ([first,,,,rest]) => ast.list(first, rest) %} |
    OPERATION {% id %} |
    "(" _ PARALLEL _ ")" {% ([,,first]) => ast.array([], first) %} |
    AMBIENT {% id %}

PARALLEL ->
    PARALLEL _ "|" _ SEQUENTIAL {% ([left,,,,right]) => ast.array(left, right) %} |
    SEQUENTIAL {% ([seq]) => ast.array([], seq) %}


NAMES ->
    NAMES _ "," _ NAME {% ([left,,,,right]) => ast.array(left, right) %} |
    NAME {% ([name]) => ast.array([], name) %}


NAME -> [_a-z0-9_]:+ {% ([name]) => name.join('') %}
VARIABLE -> [A-Z]:+ {% ([variable]) => variable.join('') %}