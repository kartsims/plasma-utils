MerkleSum = require('./lib/merkle-sum');

ms = new MerkleSum([
  {
    data: 'Hello',
    sum: 1
  },
  {
    data: 'World',
    sum: 2
  },
  {
    data: 'Everyone',
    sum: 4
  }
]);

console.log(ms.levels);
