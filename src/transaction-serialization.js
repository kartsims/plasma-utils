const web3 = require('web3')
const BN = web3.utils.BN

const isSerializableList = function (potentialList) {
  return potentialList instanceof SimpleSerializableList
}

const isSignatureList = function (potentialSigList) {
  const isList = isSerializableList(potentialSigList)
  if (isList) {
    return potentialSigList.elementsType === 'Signature'
  }
  return false
}

const isTransferList = function (potentialTransferList) {
  const isList = isSerializableList(potentialTransferList)
  const areTransfers = potentialTransferList.elementsType === 'TransferRecord'
  return isList && areTransfers
}

const getFieldBytes = function (field) { // TODO ADD THE RECURSIVE SERZN
  const typeChecker = field[1]
  if (typeChecker === web3.utils.isAddress) {
    return 20
  } else {
    return typeChecker(0) // type checker should always allow encoding 0 and when it does returns the number of bytes in encoding
  }
}

const getfieldsTotalBytes = function (fields) {
  let numBytes = 0
  for (let i = 0; i < fields.length; i++) {
    numBytes += getFieldBytes(fields[i])
  }
  return numBytes
}

// input: encoding of SimpleSerializableElement as byte array,
//       element schema
//
// output: SimpleSerializablEelement
const decodeElement = function (encoding, schema) {
  let decodedFields = []
  const fields = schema.fields
  if (encoding.length !== getfieldsTotalBytes(fields)) {throw new Error('whoops--the encoding is the wrong length for this schema')}
  let currentPos = 0
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    const fieldTypeChecker = field[1]
    const fieldBytesLen = getFieldBytes(field)
    const byteSlice = encoding.slice(currentPos, currentPos + fieldBytesLen)
    if (fieldTypeChecker === web3.utils.isAddress) {
      decodedFields[i] = decodeAddress(byteSlice)
    } else {
      decodedFields[i] = new BN(byteSlice)
    }
    currentPos += fieldBytesLen
  }
  return new SimpleSerializableElement(decodedFields, schema);
}

// input: encoding of SimpleSerializableList as a byte array,
//       elements' schema
//
// output: SimpleSerializableList
const decodeList = function (encoding, schema) {
  const numElements = encoding[0] // first byte is number of elements
  const elementLen = new BN(encoding.slice(1, 4)).toNumber() // next three is their size
  let elements = []
  for (let i = 0; i < numElements; i++) {
    const startPos = 4 + i * elementLen
    const endPos = startPos + elementLen
    const slice = encoding.slice(startPos, endPos)
    elements[i] = decodeElement(slice, schema)
  }
  return new SimpleSerializableList(elements, schema)
}

// A deserialized object.  Invoke with new SSE([values],schemas.schema)
// Allows for encoding with .encode(), decode with decodeElement(encoding,schemas.schema)
// Check type via element.elementType property (returns string)
class SimpleSerializableElement {
  constructor (values, schema) {
    this.elementType = schema.typeName
    this.fields = schema.fields
    this.numFields = this.fields.length
    if (this.numFields === 0) {throw new Error('whoops--schema is empty')}
    if (this.numFields !== values.length) {throw new Error('whoops--passed different sized array than number of fields in schema')}
    for (let i = 0; i < this.numFields; i++) {
      const field = this.fields[i]
      const typeChecker = field[1]
      let value
      if (typeChecker === web3.utils.isAddress) {
        value = values[i]
      } else {
        value = new BN(values[i])
      }
      if (!field[1](value)) {throw new Error('whoops--type checker failed for the ' + i + 'th value')}
      this[field[0]] = value
    }
  }

  encode () {
    let encoding = []
    for (let i = 0; i < this.fields.length; i++) {
      let bytesToAdd = []
      const field = this.fields[i]
      const fieldName = field[0]
      const fieldChecker = field[1]
      const encodingFunction = field[2]
      const fieldValue = this[fieldName]
      if(!fieldChecker(fieldValue)) {throw new Error('whoops--type checker failed for the ' + i + 'th value')}
      bytesToAdd = encodingFunction(fieldValue)
      encoding = encoding.concat(bytesToAdd)
    }
    return encoding
  }
}

// A deserialized List.  Invoke with new SSL([values],schemas.schema)
// Allows for encoding with .encode(), decode with decodeList(encoding,schemas.schema)
// Check elements' type via element.elementsType property (returns string)
class SimpleSerializableList {
  constructor (inputElements, schema) {
    this.elementsType = schema.typeName
    this.numElements = inputElements.length
    this.elements = []
    if (!(inputElements[0] instanceof SimpleSerializableElement)) {throw new Error('whoops--the first element isn\'t a SimpleSerializableElement object')}
    for (let i = 0; i < this.numElements; i++) {
      if (inputElements[i % this.numElements].fields !== inputElements[(i + 1) % this.numElements].fields) {
        throw new Error('whoops--one of the elements in the array isn\'t a serializable object!')
      } // ^ make sure all same type
      this.elements[i] = inputElements[i]
    }
  }

  encode () {
    let encoding = []
    encoding[0] = new BN(this.numElements).toArray('be', 1)[0]
    const numBytesPerElement = new BN(
      getfieldsTotalBytes(this.elements[0].fields)
    )
    encoding = encoding.concat(numBytesPerElement.toArray('be', 3))
    for (let i = 0; i < this.numElements; i++) {
      const elementEncoding = this.elements[i].encode()
      encoding = encoding.concat(elementEncoding)
    }
    return encoding
  }
}

const isIntExpressibleInBytes = function (numBytes) {
  return function (i) {
    const b = new BN(i).toArray()
    if (b.length <= numBytes) {
      return numBytes
    } else {
      return false
    }
  }
}

const intToNBytes = function (numBytes) {
  return function (numToEncode) {
    return numToEncode.toArray('be', numBytes)
  }
}

const encodeAddress = function (address) {
  const without0x = address.substring(2) // remove '0x' from string
  return new BN(without0x, 16).toArray('be', 20) // decode hex string to 20-long big endian array
  
}

const decodeAddress = function (encodedAddr) {
  const asBN = new BN(encodedAddr, 'be')
  return '0x' + asBN.toString(16, 40) // 40-long hex string
}

// This is the schemas object which allows us
// to define new serializations, like so:
// [{schema:{
//     typeName:'name',
//     fields:[
//         ['field_name', type_checker_function, encodingFunction]
//     ]
// }}]
// !!!!NOTE!!!! -- we must pass byte arrays instead of JS numbers if the number exceeds 2^53
let schemas = {
  TransferRecord: {
    typeName: 'TransferRecord',
    fields: [
      ['sender', web3.utils.isAddress, encodeAddress],
      ['recipient', web3.utils.isAddress, encodeAddress],
      ['type', isIntExpressibleInBytes(4), intToNBytes(4)],
      ['start', isIntExpressibleInBytes(12), intToNBytes(12)],
      ['end', isIntExpressibleInBytes(12), intToNBytes(12)],
      ['block', isIntExpressibleInBytes(32), intToNBytes(32)]
    ]
  },
  Signature: {
    typeName: 'Signature',
    fields: [
      ['v', isIntExpressibleInBytes(32), intToNBytes(32)],
      ['r', isIntExpressibleInBytes(32), intToNBytes(32)],
      ['s', isIntExpressibleInBytes(32), intToNBytes(32)]
    ]
  }
}

class TR {
  constructor(arg) {
    let thisTR = {}
    if (arg.length === getfieldsTotalBytes(schemas.TransferRecord.fields)) { // it's an encoding
      thisTR = decodeElement(arg, schemas.TransferRecord)
    } else if (arg instanceof SimpleSerializableElement) { // already a TR
      thisTR = arg
    } else if (arg instanceof Array) { // ordered array of elements
      thisTR = new SimpleSerializableElement(arg, schemas.TransferRecord)
    } else {
      thisTR = new SimpleSerializableElement([
        arg.sender, arg.recipient, arg.type, arg.start, arg.end, arg.block
      ], schemas.TransferRecord)
    }
    thisTR.typedStart = new BN(thisTR.type.toString(16, 8) + thisTR.start.toString(16, 24), 16)
    thisTR.typedEnd = new BN(thisTR.type.toString(16, 8) + thisTR.end.toString(16, 24), 16)
    return thisTR
  }
}

class TRList {
  constructor(TRs) {
    if (isTransferList(TRs)) {
      return TRs
    } else if (TRs instanceof Array && typeof TRs[0] === 'number') {
      let serList = decodeList(TRs, schemas.TransferRecord)
      serList.elements = serList.elements.map((transfer) => {
        transfer.typedStart = new BN(transfer.type.toString(16, 8) + transfer.start.toString(16, 24), 16)
        transfer.typedEnd = new BN(transfer.type.toString(16, 8) + transfer.end.toString(16, 24), 16)
        return transfer
      })
      return serList
    } else if (!(TRs[0] instanceof SimpleSerializableElement)) {
      TRs = TRs.map((transfer) => {
        return new TR(transfer)
      })
    }
    return new SimpleSerializableList(TRs, schemas.TransferRecord)
  }
}

class Sig {
  constructor(arg) {
  if (arg.length === getfieldsTotalBytes(schemas.Signature.fields)) { // it's an encoding
      return decodeElement(arg, schemas.Signature)
    } else if (arg instanceof SimpleSerializableElement) { // already a TR
      return arg
    } else if (arg instanceof Array) { // ordered array of elements
      return new SimpleSerializableElement(arg, schemas.Signature)
    } else {
      return new SimpleSerializableElement([
        arg.v, arg.r, arg.s
      ], schemas.Signature)
    }
  }
}

class SigList {
  constructor(sigs) {
    if (isSignatureList(sigs)) {
      return sigs
    } else if (sigs instanceof Array && typeof sigs[0] === 'number') {
      return decodeList(sigs, schemas.Signature)
    } else if (!(sigs[0] instanceof SimpleSerializableElement)) {
      sigs = sigs.map((sig) => {
        return new Sig(sig)
      })
    }
    return new SimpleSerializableList(sigs, schemas.Signature)
  }
}

class Transaction {
  constructor (TRs, sigs) {
    let thisTransaction = {}
    if (typeof sigs === 'undefined') { // then it's just been passed an encoding
      return decodeTransaction(TRs) // TRs is actually the encoding
    }
      this.transfers = new TRList(TRs)
      this.signatures = new SigList(sigs)
  }
  encode () {
    return this.transfers.encode().concat(this.signatures.encode())
  }
}

const decodeTransaction = function (encoding) {
  const numTRs = encoding[0]
  const totalTRBytes = 4 + numTRs * getfieldsTotalBytes(schemas.TransferRecord.fields)
  const numSigs = encoding[totalTRBytes] // first byte after the transactions
  if (numTRs !== numSigs) {throw new Error('oops-- badly formed transaction encoding')}
  const TRSlice = encoding.slice(0, totalTRBytes) // first totalTRBytes
  const sigSlice = encoding.slice(totalTRBytes) // this gets the rest
  let TRList = decodeList(TRSlice, schemas.TransferRecord)
  TRList.elements = TRList.elements.map((transfer) => {
    transfer.typedStart = new BN(transfer.type.toString(16, 8) + transfer.start.toString(16, 24), 16)
    transfer.typedEnd = new BN(transfer.type.toString(16, 8) + transfer.end.toString(16, 24), 16)
    return transfer
  })
  const sigList = decodeList(sigSlice, schemas.Signature)
  return new Transaction(TRList, sigList)
}

module.exports = {
  schemas,
  SimpleSerializableElement,
  SimpleSerializableList,
  decodeElement,
  decodeList,
  encodeAddress,
  decodeAddress,
  Transaction,
  decodeTransaction,
  TR,
  Sig,
  TRList,
  SigList
}
