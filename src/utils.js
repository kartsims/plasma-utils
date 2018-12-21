const int32ToHex = (x) => {
  x &= 0xFFFFFFFF
  let hex = x.toString(16).toUpperCase()
  return ('0000000000000000' + hex).slice(-16)
}

module.exports = {
  int32ToHex: int32ToHex
}
