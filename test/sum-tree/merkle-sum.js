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
    assert.strictEqual(root.data, '06b3dfaec148fb1bb2b066f10ec285e7c9bf402ab32aa78a5d38e34566810cd20000000000000001')
    assert.strictEqual(root.sum, 1)
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
    assert.strictEqual(root.data, '2b4f9a6acea717fe0fb4bd5b7c0aaf5f09a7926db5f7f11fcfc648b0880feb7e0000000000000003')
    assert.strictEqual(root.sum, 3)
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
    assert.strictEqual(root.data, '7167636a248d9bb01310035817ec800400a43bfb598faea5aa9c162b23596f4b0000000000000006')
    assert.strictEqual(root.sum, 6)
  })
})
