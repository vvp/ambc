const seedrandom = require('seedrandom')

const randomizer = (seed, ob) => {
  return randomize(new seedrandom(seed),ob)
}

const randomizeArrayOrder = (rng, array) => {
  let arr = array.slice(0)
  for (let i = arr.length - 1; i > 0; i--) {
    const randomLocation = Math.floor(rng() * (i + 1));
    let temp = randomize(rng, arr[i])
    arr[i] = array[randomLocation]
    arr[randomLocation] = temp
  }
  return arr
}

const randomize = (rng, ob) => {
  if (Array.isArray(ob)) {
    return randomizeArrayOrder(rng, ob)
  }
  ob = Object.assign({}, ob)
  if (typeof ob === 'object' && ob.next !== undefined) {
    ob.next = randomize(rng, ob.next)
  }
  return ob
}

module.exports = {randomizer}