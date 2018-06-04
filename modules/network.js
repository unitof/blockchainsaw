const btcLive = require('bitcoin-live-transactions')

const network = new btcLive()

network.connect()

module.exports = network
