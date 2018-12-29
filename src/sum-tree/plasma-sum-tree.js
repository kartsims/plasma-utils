const MerkleSumTree = require('./sum-tree')
const MerkleTreeNode = require('./merkle-tree-node')
const BN = require('web3').utils

class PlasmaMerkleSumTree extends MerkleSumTree {
  parseLeaves (leaves) {
    let bottom = []
    for (let i = 0; i < leaves.length - 1; i++) {
      let leaf = leaves[i]
      let nextLeaf = leaves[i+1]
      let enc = leaf.encode();
      bottom[i].TXData = '0x' + new BN(enc).toString(16, 2 * enc.length)
      let thisTR = leaf.transferRecords.elements[leaf.TRIndex]
      let nextTR = nextLeaf.transferRecords.elements[nextLeaf.TRIndex]
      bottom[i].range = nextTR.start.sub(thisTR.start) // covers from the start of this tx to the start of the next, making an implicit notx in between
    }
    if (leaves.length === 1) { // weird edge case with only 1 TX in block --> covers 0 to end --> range = end+1
      bottom[0].range = bottom[0].transferRecords.elements[0].end.add(new BN(1))
    } else { // otherwise there's more than one tx and we set the first and last ranges as follows
      bottom[0].range = leaves[1].transferRecords.elements[leaves[1].TRIndex] // first covers from 0 to second transaction's start
      let lastLeaf = leaves[leaves.length-1]
      let enc = lastLeaf.encode();
      bottom[leaves.length-1].TXData = '0x' + new BN(enc).toString(16, 2 * enc.length)
      let lastTR = lastLeaf.transferRecords.elements[lastLeaf.TRIndex]
      bottom[leaves.length-1].range = lastTR.end.sub(lastTR.start).add(new BN(1))
    }
    return bottom.map((bot) => {
      return new MerkleTreeNode(this.hash(bot.TXData), bot.range)
    })
  }
}

module.exports = PlasmaMerkleSumTree
