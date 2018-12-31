const assert = require('chai').assert
const BN = require('web3').utils.BN
const PlasmaMerkleSumTree = new require('./sum-tree')
const ST = new PlasmaMerkleSumTree()

const checkBranchValidity = function(leafIndex, transaction, proof, root) {
    const index = new BN(leafIndex).toString(2, proof.length / 2) // path bitstring
    const path = index.split("").reverse().join("") // reverse ordering so we start with the bottom
    let encoding = transaction.encode()
    encoding = '0x' + new BN(encoding).toString(16, 2 * encoding.length)
    const leafParent = (path[0] == '0') ? proof[0] : proof[1]
    if ('0x' + leafParent.data.slice(0, 2 * 32) !== ST.hash(encoding)) return false // wasn't the right TX!
    for (let i = 1; i < path.length; i++) {
        const bit = path[i]
        const potentialParent = (bit === '0') ? proof[2 * i] : proof[2 * i + 1]
        const actualParent = ST.parent(proof[2 * (i - 1)], proof[2 * (i - 1) + 1])
        if (!areNodesEquivalent(actualParent, potentialParent)) return false
    }
    const potentialRoot = (proof.length > 1) ? ST.parent(proof[proof.length-2], proof[proof.length-1]) : proof[proof.length]
	//TODO check if sum is ffffffff
    if (areNodesEquivalent(potentialRoot, root)) return true
    return false // something didn't work!
}

const areNodesEquivalent = function(a, b) {
    if (!(BN.isBN(a.sum) && BN.isBN(b.sum))) return false
    if (!a.sum.eq(b.sum)) return false
    if (a.data !== b.data) return false
    return true
}

module.exports = checkBranchValidity