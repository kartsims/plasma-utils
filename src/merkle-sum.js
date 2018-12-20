const web3 = require('web3')

class Node {
  constructor (data, sum) {
    this.data = data
    this.sum = sum
  }
}

class MerkleSumTree {
  constructor (leaves) {
    if (!leaves) {
      leaves = []
    }

    leaves = leaves.map((leaf) => {
      return new Node(this.hash(leaf.data), leaf.sum)
    })

    this.levels = this.generate(leaves, [leaves])
  }

  root () {
    return this.levels[this.levels.length - 1][0]
  }

  hash (value) {
    return web3.utils.sha3(value).slice(2)
  }

  innerParent (left, right) {
    return new Node(this.hash(left.data + right.data), (left.sum + right.sum))
  }

  leafParent (left, right) {
    return this.innerParent(left, right)
  }

  generate (children, levels) {
    if (children.length <= 1) {
      return [children]
    }

    let parents = []
    for (let i = 0; i < children.length; i += 2) {
      let left = children[i]
      let right = (i + 1 === children.length) ? new Node(0, 0) : children[i + 1]
      let parent = (levels.length === 1) ? this.leafParent(left, right) : this.innerParent(left, right)
      parents.push(parent)
    }

    levels.push(parents)
    this.generate(parents, levels)
    return levels
  }
}

module.exports = MerkleSumTree
