const MerkleSumTree = require('./sum-tree')
const MerkleTreeNode = require('./merkle-tree-node')

class PlasmaMerkleTreeNode {
  constructor (data, start, offset) {
    this.data = data
    this.start = start
    this.offset = offset
    this.sum = start + offset
  }

  isEmptyNode () {
    return this.start === 0 && this.offset === 0
  }
}

class PlasmaMerkleSumTree extends MerkleSumTree {
  emptyLeaf () {
    return new PlasmaMerkleTreeNode(0, 0, 0)
  }

  parseLeaves (leaves) {
    return leaves.map((leaf) => {
      return new PlasmaMerkleTreeNode(this.hash(leaf.data), leaf.start, leaf.offset)
    })
  }

  leafParent (left, right) {
    let sum = (right.isEmptyNode()) ? (left.sum) : (right.sum - left.start)
    return new MerkleTreeNode(this.hash(left.data + right.data), sum)
  }
}

module.exports = PlasmaMerkleSumTree
