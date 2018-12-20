/* global describe it */
const assert = require('chai').assert
const PlasmaMerkleSumTree = require('../../src/sum-tree/plasma-sum-tree')

describe('PlasmaMerkleSumTree', function () {
  it('should return undefined for an empty tree', function () {
    const tree = new PlasmaMerkleSumTree()
    assert.strictEqual(tree.root(), undefined)
  })
  it('should generate a single-leaf tree correctly', function () {
    const tree = new PlasmaMerkleSumTree([
      {
        data: 'tx1',
        start: 0,
        offset: 2
      }
    ])
    const root = tree.root()
    assert.strictEqual(root.data, '5194ead3df889a15f3d33e47bcc128114dbb9dcd1147f2de8a8ffba6a815f248')
    assert.strictEqual(root.sum, 2)
  })
  it('should generate an even tree correctly', function () {
    const tree = new PlasmaMerkleSumTree([
      {
        data: 'tx1',
        start: 0,
        offset: 2
      },
      {
        data: 'tx2',
        start: 3,
        offset: 2
      }
    ])
    const root = tree.root()
    assert.strictEqual(root.data, '48c01c280e10f6722e4c2679c01f5290a70ee2c0f60b7850abab69f87eea0b7f')
    assert.strictEqual(root.sum, 5)
  })
  it('should generate an odd tree correctly', function () {
    const tree = new PlasmaMerkleSumTree([
      {
        data: 'tx1',
        start: 0,
        offset: 2
      },
      {
        data: 'tx2',
        start: 3,
        offset: 2
      },
      {
        data: 'tx3',
        start: 6,
        offset: 0
      }
    ])
    const root = tree.root()
    assert.strictEqual(root.data, '317f97485179d95bf1dd71492f80b10e9d8a40cbbebc445d15d0edd5697fff3c')
    assert.strictEqual(root.sum, 11)
  })
})
