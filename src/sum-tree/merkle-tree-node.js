BN = require('web3').utils.BN

class MerkleTreeNode {
  constructor (data, sum) {
    this.sum = new BN(sum)
    this.data = data.slice(2) + this.sum.toString(16,2 * 16) // 2*bytes = num chars in hex 
  }
}

module.exports = MerkleTreeNode
