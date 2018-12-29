const MerkleSumTree = require('./sum-tree')
const MerkleTreeNode = require('./merkle-tree-node')
const BN = require('web3').utils.BN

class PlasmaMerkleSumTree extends MerkleSumTree {
  parseLeaves (leaves) {
    for (let i = 0; i < leaves.length - 1; i++) {
      let leaf = leaves[i]
      let nextLeaf = leaves[i+1]
      let enc = leaf.encode();
      leaves[i].TXData = '0x' + new BN(enc).toString(16, 2 * enc.length)
      let thisTR = leaf.transferRecords.elements[leaf.TRIndex]
      let nextTR = nextLeaf.transferRecords.elements[nextLeaf.TRIndex]
      let typeDiff = nextTR.type.sub(thisTR.type)
      let rangeDiff = (i === 0) ? nextTR.start : nextTR.start.sub(thisTR.start) // first one always starts at 0 in terms of proofs even if the first TR start isn't 0
      let coverage = typeDiff.toString(16, 8) + rangeDiff.toString(16, 24)
      leaves[i].range =  new BN(coverage, 16)// covers from the start of this tx to the start of the next, making an implicit notx in between
    }
    if (leaves.length === 1) { // weird edge case with only 1 TX in block --> covers 0 to end --> range = end+1
      let typeDiff = leaves[0].transferRecords.elements[0].type
      let rangeDiff = leaves[0].transferRecords.elements[0].end.add(new BN(1))
      debugger
      let coverage = typeDiff.toString(16, 8) + rangeDiff.toString(16, 24)
      leaves[0].range = new BN(coverage, 16)
    } else { // otherwise there's more than one tx and we set the last range as follows
      let lastLeaf = leaves[leaves.length-1] // set encoding data of last leaf since we missed it above
      let enc = lastLeaf.encode();
      leaves[leaves.length-1].TXData = '0x' + new BN(enc).toString(16, 2 * enc.length)  
      let lastTR = lastLeaf.transferRecords.elements[lastLeaf.TRIndex]
      leaves[leaves.length-1].range = lastTR.end.sub(lastTR.start).add(new BN(1))
    }
    return leaves.map((leaf) => {
      return new MerkleTreeNode(this.hash(leaf.TXData), leaf.range)
    })
  }
}

module.exports = PlasmaMerkleSumTree
