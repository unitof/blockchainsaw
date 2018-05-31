const btcEvents = require('bitcoin-live-transactions')
const btcMiner = require('bitcoin-miner')
const m = require('morphable') // ❤ you Luke

const CONFIG = {}

// TODO: Create some init Promise to populate all these with proper start values

let transactions = m({
  transactions: []
})

let ore = m({
  currentBlock: {
    version: 536870912,
    previousblockhash: '00000000000000000061abcd4f51d81ddba5498cff67fed44b287de0990b7266',
    merkleroot: '871148c57dad60c0cde483233b099daa3e6492a91c13b337a5413a4c4f842978',
    time: 1515252561,
    bits: '180091c1'
  },
  // target
  // hash
  nonce: 45191988 // will be 45291998
  // time?
})

let blockchain = m({
  blocks: []
})

const prospector = new btcMiner(ore.currentBlock);

let found = false;
ore.target = prospector.getTarget()
while (ore.nonce < 8561950000 && !found) {
  ore.hash = prospector.getHash(ore.nonce);
  found = prospector.checkHash(ore.hash);
  console.log('Trying nonce ' + ore.nonce + ': ' + ore.hash.toString('hex'))
  if (found) {
    console.log('Mined! Nonce: ' + ore.nonce)
  }
  ore.nonce++;
}
