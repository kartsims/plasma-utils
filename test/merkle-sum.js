const assert = require('chai').assert;
const MerkleSum = require('../lib/merkle-sum');

describe('MerkleSum', function() {
  it('should return undefined for an empty tree', function() {
    const ms = new MerkleSum();
    assert.strictEqual(ms.root(), undefined);
  });
  it('should generate a single-leaf tree correctly', function() {
    const ms = new MerkleSum([
      {
        data: 'Hello',
        sum: 1
      }
    ]);
    const root = ms.root();
    assert.strictEqual(root.data, '06b3dfaec148fb1bb2b066f10ec285e7c9bf402ab32aa78a5d38e34566810cd2');
    assert.strictEqual(root.sum, 1);
  });
  it('should generate an even tree correctly', function() {
    const ms = new MerkleSum([
      {
        data: 'Hello',
        sum: 1
      },
      {
        data: 'World',
        sum: 2
      }
    ]);
    const root = ms.root();
    assert.strictEqual(root.data, '8fe4d16a1b991fd49c07d938b5af69e2d82a0424471cbcaa4045994dc21a0b90');
    assert.strictEqual(root.sum, 3);
  });
  it('should generate an odd tree correctly', function() {
    const ms = new MerkleSum([
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
    ]);
    const root = ms.root();
    assert.strictEqual(root.data, '896ba16210f322a4c07819c09b9d33f60dc640a2ffd7e6b77967d6bf1f18e058');
    assert.strictEqual(root.sum, 6);
  });
});
