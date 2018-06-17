const btcNet = require('./modules/network')
const blocks = require('./modules/blocks')
const btcMiner = require('bitcoin-miner')
const m = require('morphable') // ❤ you Luke

const CONFIG = {
  maxNonce: 2147483647,
  mineRate: 1
}

// TODO: Create some init Promise to populate all these with proper start values

let mempool = m({
  transactions: []
})

let blockchain = m({
  blocks: []
})
blocks.setBlockchain(blockchain.blocks)

let ore = m({
  version: 536870912,
  previousblockhash: '00000000000000000061abcd4f51d81ddba5498cff67fed44b287de0990b7266',
  merkleroot: '871148c57dad60c0cde483233b099daa3e6492a91c13b337a5413a4c4f842978',
  hash: undefined,
  time: undefined,
  bits: '180091c1',
  // target
  nonce: 0 // will be 45291998
})

// MINE

btcNet.events.on('block', newBlock)
btcNet.events.on('tx', tx => {
  console.log('new tx')
})
setInterval(swingPick, CONFIG.mineRate);

// FUNCTIONS
// (to be split into modules?)

function newBlock(blockhash) {
  // blockhash is hash string
  console.log('new block', blockhash)
  blocks.insert(blockhash)
  ore.previousblockhash = blockhash
  restartProspector()
}

function restartProspector() {
  ore.nonce = 0
}

// attempt one block hash, then if (when) it fails increment nonce
function swingPick() {
  ore.hash = prospector.getHash(ore.nonce)
  ore.time = Math.floor(Date.now() / 1000)
  console.log('Trying nonce ' + ore.nonce + ': ' + ore.hash.toString('hex'))
  if (isGold(ore.hash)) {
    console.log('Mined! Nonce: ' + ore.nonce)
    console.log('Man, really shoulda incorporated sending to Blockchain')
  } else {
    ore.nonce = ++ore.nonce % CONFIG.maxNonce; // rollover to 0
  }
}

// check if hash < target
function isGold(hash) {
  return prospector.checkHash(hash)
}

const prospector = new btcMiner(ore);

let found = false;
ore.target = prospector.getTarget()
