/* global describe it */
const assert = require('chai').assert
const tSerializer = require('../src/transaction-serialization')
const Web3 = require('web3')
const BN = Web3.utils.BN

describe('TransactionSerialization', function () {
  var tr1 = new tSerializer.SimpleSerializableElement(['0x43aaDF3d5b44290385fe4193A1b13f15eF3A4FD5', '0xa12bcf1159aa01c739269391ae2d0be4037259f3', 1, 2, 3, 4], tSerializer.schemas.TransferRecord)
  var tr1ProperEncoding = [67, 170, 223, 61, 91, 68, 41, 3, 133, 254, 65, 147, 161, 177, 63, 21, 239, 58, 79, 213, 161, 43, 207, 17, 89, 170, 1, 199, 57, 38, 147, 145, 174, 45, 11, 228, 3, 114, 89, 243, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4]
  var tr2 = new tSerializer.SimpleSerializableElement(['0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8', '0xa12bcf1159aa01c739269391ae2d0be4037259f4', 2, 3, 4, 5], tSerializer.schemas.TransferRecord)
  var tr2ProperEncoding = [234, 103, 79, 221, 231, 20, 253, 151, 157, 227, 237, 240, 245, 106, 169, 113, 107, 137, 142, 200, 161, 43, 207, 17, 89, 170, 1, 199, 57, 38, 147, 145, 174, 45, 11, 228, 3, 114, 89, 244, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5]
  var sig1 = new tSerializer.SimpleSerializableElement([12345, 56789, 901234], tSerializer.schemas.Signature)
  var sig1ProperEncoding = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 213, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 192, 114]
  var sig2 = new tSerializer.SimpleSerializableElement([12346, 56790, 901235], tSerializer.schemas.Signature)
  var sig2ProperEncoding = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 214, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 192, 115]
  var trList = new tSerializer.SimpleSerializableList([tr1, tr2, tr1], tSerializer.schemas.TransferRecord)
  var sigList = new tSerializer.SimpleSerializableList([sig1, sig2, sig1], tSerializer.schemas.Signature)
  var correctTRListEncoding = [3, 0, 0, 100].concat(tr1ProperEncoding).concat(tr2ProperEncoding).concat(tr1ProperEncoding)
  var correctSigListEncoding = [3, 0, 0, 96].concat(sig1ProperEncoding).concat(sig2ProperEncoding).concat(sig1ProperEncoding)
  let TX = new tSerializer.Transaction(trList, sigList)
  let correctTXEncoding = correctTRListEncoding.concat(correctSigListEncoding)
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
    var randomTR = genRandomTR()
    var encoding = randomTR.encode()
    var decoding = tSerializer.decodeElement(encoding, tSerializer.schemas.TransferRecord)
    assert.deepEqual(randomTR, decoding)
  })
  it('should decode a random Signature\'s encoding to itself', function () {
    var sig = genRandomSignature()
    var encoding = sig.encode()
    var decoding = tSerializer.decodeElement(encoding, tSerializer.schemas.Signature)
    assert.deepEqual(sig, decoding)
  })
  it('should decode a random list of TRs to itself', function () {
    var randomTR1 = genRandomTR()
    var randomTR2 = genRandomTR()
    var randomTR3 = genRandomTR()
    var randomTR4 = genRandomTR()
    var TRList = new tSerializer.SimpleSerializableList([randomTR1, randomTR2, randomTR3, randomTR4], tSerializer.schemas.TransferRecord)
    var encoding = TRList.encode()
    var decoding = tSerializer.decodeList(encoding, tSerializer.schemas.TransferRecord)
    assert.deepEqual(TRList, decoding)
  })
  it('should decode a random list of Signatures to itself', function () {
    var randomSig1 = genRandomSignature()
    var randomSig2 = genRandomSignature()
    var randomSig3 = genRandomSignature()
    var randomSig4 = genRandomSignature()
    var sigList = new tSerializer.SimpleSerializableList([randomSig1, randomSig2, randomSig3, randomSig4], tSerializer.schemas.Signature)
    var encoding = sigList.encode()
    var decoding = tSerializer.decodeList(encoding, tSerializer.schemas.Signature)
    assert.deepEqual(sigList, decoding)
  })
  it('should well-encode a Transaction', function () {
    var encoding = TX.encode()
    assert.deepEqual(encoding, correctTXEncoding)
  })
  it('should decode a random Transaction to itself', function () {
    var transactions = []
    var signatures = []
    for (var i = 0; i < 16; i++) { // let's do a full 16 sigs
      transactions[i] = genRandomTR()
      signatures[i] = genRandomSignature()
    }
    var TRList = new tSerializer.SimpleSerializableList(transactions, tSerializer.schemas.TransferRecord)
    var sigList = new tSerializer.SimpleSerializableList(signatures, tSerializer.schemas.Signature)
    var transaction = new tSerializer.Transaction(TRList, sigList)
    var encoding = transaction.encode()
    var decoding = tSerializer.decodeTransaction(encoding)
    assert.deepEqual(transaction, decoding)
  })
})

const genRandomSignature = function () {
  var v = genRandomArrayOfNBytes(32)
  var r = genRandomArrayOfNBytes(32)
  var s = genRandomArrayOfNBytes(32)
  return new tSerializer.SimpleSerializableElement([v, r, s], tSerializer.schemas.Signature)
}

const genRandomTR = function () {
  var sender = genRandomAddress()
  var recipient = genRandomAddress()
  var type = genRandomArrayOfNBytes(4)
  var coinID1 = genRandomArrayOfNBytes(12)
  var coinID2 = genRandomArrayOfNBytes(12)
  if (coinID1.lt(coinID2)) { // this makes sure offset after start
    var start = coinID1
    var offset = coinID2.sub(coinID1) // subtraction
  } else {
    var start = coinID2
    var offset = coinID1.sub(coinID2)
  }
  var block = genRandomArrayOfNBytes(32)
  var TR = new tSerializer.SimpleSerializableElement([sender, recipient, type, start, offset, block], tSerializer.schemas.TransferRecord)
  return TR
}

const genRandomAddress = function () {
  var addr = genRandomArrayOfNBytes(20)
  return tSerializer.decodeAddress(addr)
}

const genRandomArrayOfNBytes = function (numBytes) { // returns an int not byte array
  var arr = []
  for (var i = 0; i < numBytes; i++) {
    arr.push(Math.floor(Math.random() * (256)))
  }
  return new BN(arr)
}
