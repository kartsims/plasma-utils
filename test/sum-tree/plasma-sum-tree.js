/* global describe it */
const assert = require('chai').assert
const PlasmaMerkleSumTree = require('../../src/sum-tree/plasma-sum-tree')
const TS = require('../../src/transaction-serialization')
const DT = require('../dummy-tx-utils')

const tr1 = new TS.TR(['0x43aaDF3d5b44290385fe4193A1b13f15eF3A4FD5', '0xa12bcf1159aa01c739269391ae2d0be4037259f3', 0, 2, 3, 4])
const tr2 = new TS.TR(['0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8', '0xa12bcf1159aa01c739269391ae2d0be4037259f4', 0, 6, 7, 5])
const tr3 = new TS.TR(['0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8', '0xa12bcf1159aa01c739269391ae2d0be4037259f4', 1, 100, 108, 5])
const sig = new TS.Sig([12345, 56789, 901234])
const TX1 = new TS.Transaction([tr1], [sig])
const TX2 = new TS.Transaction([tr2], [sig])
const TX3 = new TS.Transaction([tr3], [sig])
TX1.TRIndex = TX2.TRIndex = TX3.TRIndex = 0

describe('PlasmaMerkleSumTree', function () {
  it('should return undefined for an empty tree', function () {
    const tree = new PlasmaMerkleSumTree()
    assert.strictEqual(tree.root(), undefined)
  })
  it('should generate a single-leaf tree correctly', function () {
    const tree = new PlasmaMerkleSumTree([TX1])
    const root = tree.root()
    assert.strictEqual(root.data, '351a7a2ec4f370b6d2eea2199516c22f5582bf37b4a54173ca5abbca3d0a9c65' + 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    // assert.deepEqual(root.sum, new BN(4))
  })
  it('should generate an even tree correctly', function () {
    const tree = new PlasmaMerkleSumTree([TX1, TX2])
    const root = tree.root()
    assert.strictEqual(root.data, '80d452a7f386d2f79cabe5e4d73c2cc40d9708f2d3e30f78324076ba9c654c80' + 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    // assert.deepEqual(root.sum, new BN(8))
  })
  it('should generate an odd tree w/ multiple types correctly', function () {
    const tree = new PlasmaMerkleSumTree([TX1, TX2, TX3])
    const root = tree.root()
    tree.getBranch(2) // 2: 2 --> 0 -> 0, 3: 2 0 0, 4: 4, 2, 0, 5: 4 2 0 6: 6, 3.2 0
    assert.strictEqual(root.data, '53b9d5ee2f4899976fc22da622f299f6a62bfa0cc2edd2da3ca608a776a315e4' + 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    // assert.deepEqual(root.sum, new BN(11))
  })
  it('should succeed in generating a tree of 100 ordered transactions', function () {
    const TXs = DT.genNSequentialTransactions(100)
    assert.doesNotThrow(function () {return new PlasmaMerkleSumTree(TXs)})
    debugger
  })
})
