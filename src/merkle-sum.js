const web3 = require('web3');

class Node {
  constructor(data, sum) {
    this.data = data;
    this.sum = sum;
  }
}

class MerkleSum {
  constructor(leaves) {
    if (!leaves) {
      leaves = [];
    }

    leaves = leaves.map((leaf) => {
      return new Node(this.hash(leaf.data), leaf.sum);
    });

    this.levels = this.generate(leaves, [leaves]);
  }

  root() {
    return this.levels[this.levels.length - 1][0];
  }

  hash(value) {
    return web3.utils.sha3(value).slice(2);
  }

  parent(left, right) {
    return new Node(this.hash(left.data + right.data), (left.sum + right.sum));
  }

  generate(children, levels) {
    if (children.length <= 1) {
      return [children];
    }

    let parents = [];
    for (let i = 0; i < children.length; i += 2) {
      let left = children[i];
      let right = (i + 1 == children.length) ? new Node(0, 0) : children[i + 1];
      parents.push(this.parent(left, right));
    }

    levels.push(parents);
    this.generate(parents, levels);
    return levels;
  }
}

module.exports = MerkleSum;
