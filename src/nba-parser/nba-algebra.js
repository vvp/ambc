const ImmutableJS = require('immutable')
const { List, Map } = ImmutableJS

const removeUnnecessaryParens = (expr) => expr.startsWith('(') ? expr.substring(1, expr.length - 2) : expr
const parallelAlgebra = (list, join) => list.map(x => toAlgebra(x, join)).join(join)

const opAlgebra = (map) => {
  let op = map.get('op')
  let argstring = toAlgebra(map.get('args'), ', ')
  switch (op) {
    case 'substitute':
      return `:${argstring}`
    case 'write':
      return `write (${argstring})`
    case 'write_':
      return `write_ (${argstring})`
    case 'read':
      return `read (${argstring})`
    case 'read_':
      return `read_ (${argstring})`
    case 'in':
      return `in (${argstring})`
    case 'in_':
      return `in_ (${argstring})`
    case 'out':
      return `out (${argstring})`
    case 'out_':
      return `out_ (${argstring})`
  }
}

const sequentialAlgebra = (map) => {
  let next = map.get('next')
  let amb = map.get('ambient')
  if (amb !== undefined)
    return `${amb}[${removeUnnecessaryParens(toAlgebra(next, '|'))}]`

  let opString = opAlgebra(map)
  const isLastOne = next === undefined || (List.isList(next) && next.size == 0)
  if (isLastOne)
    return opString

  if (Map.isMap(next)) {
    return `${opString}.${toAlgebra(next)}`
  }
  if (List.isList(next) && next.size > 1) {
    return `${opString}.(${toAlgebra(next, '|')})`
  }
  return `${opString}.${toAlgebra(next, '|')}`

}

const toAlgebra = (expr, join) => {
  if (List.isList(expr)) {
    return parallelAlgebra(expr, join)
  }
  if (Map.isMap(expr)) {
    return sequentialAlgebra(expr)
  }
  return expr
}

const algebraizeProgram = (program) => toAlgebra(program, '|')

module.exports = { toAlgebra: algebraizeProgram }