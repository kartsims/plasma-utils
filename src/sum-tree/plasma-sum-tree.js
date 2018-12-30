const MerkleSumTree = require('./sum-tree')
const MerkleTreeNode = require('./merkle-tree-node')
const BN = require('web3').utils.BN

class PlasmaMerkleSumTree extends MerkleSumTree {
  parseLeaves (leaves) {
    leaves = leaves.map((leaf) => {
      let enc = leaf.encode()
      let TR = leaf.transferRecords.elements[leaf.TRIndex]
      return {
        data: this.hash('0x' + new BN(enc).toString(16, 2 * enc.length)),
        typedStart: TR.type.toString(16, 8) + TR.start.toString(16, 24),
        typedEnd: TR.type.toString(16, 8) + TR.end.toString(16, 24)
      }
    })
    leaves[0].start = 0 // start of the leaf's coverage is 0 to the sum tree, even if TR is not
    leaves.push({typedStart: new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',16)}) // add a fake final TR which happens at the final coinpost
    for (let i = 0; i < leaves.length - 1; i++) {
      leaves[i].range = leaves[i+1].typedStart.sub(leaves[i].typedStart)
    }
    return leaves.map((leaf) => {
      return new MerkleTreeNode(leaf.data, leaf.range)
    })
  }

  getBranch(leafIndex) {
    if (leafIndex >= this.levels[0].length || leafIndex < 0) {throw new Error('invalid branch index requested')}
    // let path = new BN(leafIndex).toString(2, this.levels.length-1)
    let proof = []
    let nodeIndex = Math.floor((leafIndex + 1) / 2) * 2
    for (let i = 0; i < this.levels.length; i++) {
      proof.push(this.levels[i][nodeIndex])
      proof.push(this.levels[i][nodeIndex+1])
      nodeIndex = Math.floor(nodeIndex / 2)
    }
    return proof.map((node) => {
      return (node === undefined) ? this.emptyLeaf() : node
    })
  }
}

module.exports = PlasmaMerkleSumTree
