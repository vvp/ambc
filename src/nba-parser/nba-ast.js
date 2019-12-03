const ImmutableJS = require('immutable')
const {List, Map} = ImmutableJS

function flatParallel (x) {
  return (x !== undefined && Array.isArray(x) && x.length == 1) ? x[0] : x
}

function flatten (x) {
  if (!Array.isArray(x)) return x
  return x.reduce((acc, val) => acc.concat(flatten(val)), [])
}

function normalizeNext (arr) {
  return flatParallel(flatten(arr))
}

function normalizeArgs (arr) {
  return flatten(arr)
}

const ambient = (name, parallel) => ({
  ambient: name,
  next: normalizeNext(parallel)
})

const cap = (op, target, args) => ({
  op: op,
  args: normalizeArgs([target, args])
})

const cocap = (op, args) => ({
  op: op,
  args: normalizeArgs(args)
})

const subst = (name) => ({
  op: 'substitute', args: normalizeArgs(name)
})

const array = (arr, item) => arr.concat([item])

const list = (first, rest) => {
  let next = { next: normalizeNext(rest) }
  return Object.assign(first, next)
}

const program = (program) => ImmutableJS.fromJS(program)

module.exports = { ambient, cap, cocap, subst, array, list, program }