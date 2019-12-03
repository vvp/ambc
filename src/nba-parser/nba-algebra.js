
const removeUnnecessaryParens = (expr) => expr.startsWith('(') ? expr.substring(1, expr.length - 2) : expr
const parallelAlgebra = (list, join) => list.map(x => toAlgebra(x, join)).join(join)

const opAlgebra = (map) => {
  let op = map.op
  let argstring = toAlgebra(map.args, ', ')
  switch (op) {
    case 'create':
      return `${argstring}[${removeUnnecessaryParens(toAlgebra(map.next, '|'))}]`
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
  let next = map.next

  let opString = opAlgebra(map)
  const isLastOne = next === undefined || (Array.isArray(next) && next.length == 0) || map.op === 'create'
  if (isLastOne)
    return opString

  if (Array.isArray(next) && next.length > 1) {
    return `${opString}.(${toAlgebra(next, '|')})`
  }
  return `${opString}.${toAlgebra(next, '|')}`

}

const toAlgebra = (expr, join) => {
  if (Array.isArray(expr)) {
    return parallelAlgebra(expr, join)
  }
  if (typeof expr === 'object') {
    return sequentialAlgebra(expr)
  }
  return expr
}

const algebraizeProgram = (program) => toAlgebra(program, '|')

module.exports = { toAlgebra: algebraizeProgram }