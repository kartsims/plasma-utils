/* global describe it */
const assert = require('chai').assert
const TS = require('../../src/transaction-serialization')
const Web3 = require('web3')
const BN = Web3.utils.BN

describe('TransactionSerialization', function () {
  const tr1 = new TS.TR(['0x43aaDF3d5b44290385fe4193A1b13f15eF3A4FD5', '0xa12bcf1159aa01c739269391ae2d0be4037259f3', 1, 2, 3, 4])
  const tr1ProperEncoding = [67, 170, 223, 61, 91, 68, 41, 3, 133, 254, 65, 147, 161, 177, 63, 21, 239, 58, 79, 213, 161, 43, 207, 17, 89, 170, 1, 199, 57, 38, 147, 145, 174, 45, 11, 228, 3, 114, 89, 243, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4]
  const tr2 = new TS.TR(['0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8', '0xa12bcf1159aa01c739269391ae2d0be4037259f4', 2, 3, 4, 5])
  const tr2ProperEncoding = [234, 103, 79, 221, 231, 20, 253, 151, 157, 227, 237, 240, 245, 106, 169, 113, 107, 137, 142, 200, 161, 43, 207, 17, 89, 170, 1, 199, 57, 38, 147, 145, 174, 45, 11, 228, 3, 114, 89, 244, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5]
  const sig1 = new TS.Sig([12345, 56789, 901234])
  const sig1ProperEncoding = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 213, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 192, 114]
  const sig2 = new TS.Sig([12346, 56790, 901235])
  const sig2ProperEncoding = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 214, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 192, 115]
  const trList = new TS.TRList([tr1, tr2, tr1])
  const sigList = new TS.SigList([sig1, sig2, sig1])
  const correctTRListEncoding = [3, 0, 0, 100].concat(tr1ProperEncoding).concat(tr2ProperEncoding).concat(tr1ProperEncoding)
  const correctSigListEncoding = [3, 0, 0, 96].concat(sig1ProperEncoding).concat(sig2ProperEncoding).concat(sig1ProperEncoding)
  const TX = new TS.Transaction(trList, sigList)
  const correctTXEncoding = correctTRListEncoding.concat(correctSigListEncoding)
  it('should well-encode a TransferRecord', function () {
    assert.deepEqual(tr1.encode(), tr1ProperEncoding)
  })
  it('should well-encode a Signature', function () {
    assert.deepEqual(sig1.encode(), sig1ProperEncoding)
  })
  it('should well-encode a list of TransferRecords', function () {
    assert.deepEqual(trList.encode(), correctTRListEncoding)
  })
  it('should well-encode a list of Signatures', function () {
    assert.deepEqual(sigList.encode(), correctSigListEncoding)
  })
  it('should decode a random TransferRecords\' encoding to itself', function () {
    const randomTR = genRandomTR()
    const encoding = randomTR.encode()
    const decoding = new TS.TR(encoding)
    assert.deepEqual(randomTR, decoding)
  })
  it('should decode a random Signature\'s encoding to itself', function () {
    const sig = genRandomSignature()
    const encoding = sig.encode()
    const decoding = new  TS.Sig(encoding)
    assert.deepEqual(sig, decoding)
  })
  it('should decode a random list of TRs to itself', function () {
    randomTRs = Array.from({ length: 4 }, () => { return genRandomTR() })
    const TRList = new TS.TRList(randomTRs)
    const encoding = TRList.encode()
    const decoding = new TS.TRList(encoding)
    assert.deepEqual(TRList, decoding)
  })
  it('should decode a random list of Signatures to itself', function () {
    randomSigs = Array.from({ length: 4 }, () => { return genRandomSignature() })
    const sigList = new TS.SigList(randomSigs)
    const encoding = sigList.encode()
    const decoding = new TS.SigList(encoding)
    assert.deepEqual(sigList, decoding)
  })
  it('should well-encode a Transaction', function () {
    const encoding = TX.encode()
    assert.deepEqual(encoding, correctTXEncoding)
  })
  it('should decode a random Transaction to itself', function () {
    let transactions = []
    let signatures = []
    for (let i = 0; i < 16; i++) { // let's do a full 16 sigs
      transactions[i] = genRandomTR()
      signatures[i] = genRandomSignature()
    }
    const TRList = new TS.TRList(transactions)
    const sigList = new TS.SigList(signatures)
    const transaction = new TS.Transaction(TRList, sigList)
    const encoding = transaction.encode()
    debugger
    const decoding = new TS.Transaction(encoding)
    assert.deepEqual(transaction, decoding)
  })
})

const genRandomSignature = function () {
  const v = genRandomArrayOfNBytes(32)
  const r = genRandomArrayOfNBytes(32)
  const s = genRandomArrayOfNBytes(32)
  return new TS.Sig([v, r, s])
}

const genRandomTR = function () {
  const sender = genRandomAddress()
  const recipient = genRandomAddress()
  const type = genRandomArrayOfNBytes(4)
  const coinID1 = genRandomArrayOfNBytes(12)
  const coinID2 = genRandomArrayOfNBytes(12)
  let start, end
  if (coinID1.lt(coinID2)) {
    start = coinID1
    end = coinID2
  } else {
    start = coinID2
    end = coinID1
  }
  const block = genRandomArrayOfNBytes(32)
  const TR = new TS.TR([sender, recipient, type, start, end, block])
  return TR
}

const genRandomAddress = function () {
  const addr = genRandomArrayOfNBytes(20)
  return TS.decodeAddress(addr)
}

const genRandomArrayOfNBytes = function (numBytes) { // returns an int not byte array
  let arr = []
  for (let i = 0; i < numBytes; i++) {
    arr.push(Math.floor(Math.random() * (256)))
  }
  return new BN(arr)
}
