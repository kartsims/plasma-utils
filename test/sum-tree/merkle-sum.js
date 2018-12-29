/* global describe it */
const assert = require('chai').assert
const MerkleSumTree = require('../../src/sum-tree/sum-tree')

describe('MerkleSumTree', function () {
  it('should return undefined for an empty tree', function () {
    const tree = new MerkleSumTree()
    assert.strictEqual(tree.root(), undefined)
  })
  it('should generate a single-leaf tree correctly', function () {
    const tree = new MerkleSumTree([
      {
        data: 'Hello',
        sum: 1
      }
    ])
    const root = tree.root()
    assert.strictEqual(root.data, '06b3dfaec148fb1bb2b066f10ec285e7c9bf402ab32aa78a5d38e34566810cd2' + '00000000000000000000000000000001')
    assert.deepEqual(root.sum, new BN(1))
  })
  it('should generate an even tree correctly', function () {
    const tree = new MerkleSumTree([
      {
        data: 'Hello',
        sum: 1
      },
      {
        data: 'World',
        sum: 2
      }
    ])
    const root = tree.root()
    assert.strictEqual(root.data, '6bd541b4745da14453470d5f4d3599a706354199c742c35eb17e4738faa1c2a8' + '00000000000000000000000000000003')
    assert.deepEqual(root.sum, new BN(3))
  })
  it('should generate an odd tree correctly', function () {
    const tree = new MerkleSumTree([
      {
        data: 'Hello',
        sum: 1
      },
      {
        data: 'World',
        sum: 2
      },
      {
        data: 'Works',
        sum: 3
      }
    ])
    const root = tree.root()
    assert.strictEqual(root.data, '7c0beda9f03a56707c7c57f60be76210516dd4bb756b5c5f331676f761eaf987' + '00000000000000000000000000000006')
    assert.deepEqual(root.sum, new BN(6))
  })
})
