const ast = require('./nba-ast')
const {program, cap, cocap, substTarget, subst, ambient} = ast
const parallel = ast.context
const sequential = ast.list

function decodeProgram (js) {
  if (!Array.isArray(js))
    throw new Error()

  return new program(decodeParallel(js))
}

function decodeParallel (arr) {
  if (arr.length === 0)
    return []

  const decodedProcesses = arr.map(decode)
  const first = decodedProcesses.shift()
  if (arr.length === 1) {
    return new parallel(first,[])
  }
  return new parallel(first, decodedProcesses)
}
function decode (obj) {
  if (obj.op === 'create') {
    return new ambient(decodeName(obj.args[0]), decodeParallel(obj.next))
  }
  const decodedObject = decodeOp(obj)
  if (obj.next.length == 0) {
    return decodedObject
  }
  if (obj.next.length == 1) {
    return new sequential(decodedObject, decode(obj.next[0]))
  }
  return new sequential(decodedObject, decodeParallel(obj.next))
}

function decodeOp(ob) {
  switch (ob.op) {
    case 'in':
    case 'out':
    case 'read':
    case 'write':
      return new cap(ob.op, decodeName(ob.args[0]), ob.args.slice(1).map(decodeName))
    case 'in_':
    case 'out_':
    case 'read_':
    case 'write_':
      return new cocap(ob.op, ob.args.map(decodeName))
    case 'substitute':
      return new subst(decodeName(ob.args[0]))
    default:
      throw new Error()
  }
}

function decodeName (name) {
  if (name.subst !== undefined)
    return new substTarget(name.subst)

  return name
}

module.exports = {decode: decodeProgram}