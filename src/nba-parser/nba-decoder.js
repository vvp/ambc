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
  const args = ob.args.map(decodeArg)
  switch (ob.op) {
    case 'in':
    case 'out':
      return new cap(ob.op, args[0], args[1])
    case 'read':
    case 'write':
      return new cap(ob.op, args[0], args.slice(1))
    case 'in_':
    case 'out_':
      return new cap(ob.op, args[0], args[1])
    case 'read_':
    case 'write_':
      return new cocap(ob.op, args)
    case 'substitute':
      return new subst(args[0])
    default:
      throw new Error()
  }
}

function decodeArg (arg) {
  if (arg.subst !== undefined)
    return new substTarget(arg.subst)

  if (arg.op !== undefined) {
    return decode(arg)
  }

  return arg
}

function decodeName (name) {
  if (name.subst !== undefined)
    return new substTarget(name.subst)

  return name
}

module.exports = {decode: decodeProgram}