const utils = require('../utils')

class MerkleTreeNode {
  constructor (data, sum) {
    this.data = data + utils.int32ToHex(sum)
    this.sum = sum
  }
}

module.exports = MerkleTreeNode
