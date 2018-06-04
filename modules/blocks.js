let blockchain = []

module.exports.setBlockchain = function(arr) {
  blockchain = arr
}

module.exports.insert = function(block) {
  blockchain.splice(0, 0, block) // insert in pos 0
}
