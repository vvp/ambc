
const toAlgebra = (x) => x !== undefined && x.toAlgebra !== undefined ? x.toAlgebra() : x
const toJS = (x) => {
  if (x === undefined)
    return x

  if (Array.isArray(x))
    return x.map(toJS)

  if (x.toJS !== undefined)
    return x.toJS()

  return x
}

const initOp = (obj) => {
  if (obj.next !== undefined)
    return obj

  obj.next = []
  return obj
}

function program (context) {
  this.globalContext = context
  this.toJS = () => toJS(this.globalContext)
  this.toAlgebra = () => toAlgebra(this.globalContext)
}

function ambient (name, par) {
  this.name = name
  this.context = par
  this.toJS = () => initOp({op: 'create', args: [this.name], next:toJS(this.context)})
  this.toAlgebra = () => `${this.name}[${toAlgebra(this.context)}]`
}

function subst( target ) {
  this.op = 'substitute'
  this.args = [target]
  this.toJS = () => initOp({op: this.op, args:toJS(this.args)})
  this.toAlgebra = () => `:${this.args[0]}`
}

function cap( op, target, names ) {
  this.op = op
  this.args = [target].concat(names)
  this.toJS = () => initOp({op: this.op, args:toJS(this.args)})
  this.toAlgebra = () => `${this.op} (${this.args.map(toAlgebra).join(', ')})`
}

function cocap( op, names ) {
  this.op = op
  this.args = names
  this.toJS = () => initOp({op: this.op, args:toJS(this.args)})
  this.toAlgebra = () => `${this.op} (${this.args.map(toAlgebra).join(', ')})`
}

function parallel(first, rest) {
  this.ctx = (first instanceof parallel ? first.ctx : [first]).concat(rest instanceof parallel ? rest.ctx : rest )
  this.toJS = () => toJS(this.ctx)
  this.toAlgebra = () => `${this.ctx.map(toAlgebra).join('|')}`
}

function sequential(first, rest) {
  Object.assign(this, first)
  this.next = rest
  this.toJS = () => {
    const target = toJS(first)
    const next = toJS(this.next)
    target.next = Array.isArray(next) ? next : [next]
    return target
  }
  this.toAlgebra = () => `${toAlgebra(first)}.${this.next instanceof parallel ? `(${toAlgebra(this.next)})` : toAlgebra(this.next)}`
}

module.exports = {
  program,
  ambient,
  subst,
  cap,
  cocap,
  context: parallel,
  list: sequential,
  array: (arr, item) => arr.concat(item)
}