const btcNet = require('./modules/network')
const blocks = require('./modules/blocks')
const btcMiner = require('bitcoin-miner')
const audio = require('./modules/audio')
const fastRoot = require('merkle-lib/fastRoot')
const crypto = require('crypto')
const w = require('./modules/web')
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
  previousblockhash: '0000000000000000000000000000000000000000000000000000000000000000',
  merkleroot: '871148c57dad60c0cde483233b099daa3e6492a91c13b337a5413a4c4f842978',
  set newHash(buffer) {
    this.hash = buffer
    this.hash_friendly = buffer.toString('hex')
  },
  set newTarget(buffer) {
    this.target = buffer
    this.target_friendly = buffer.toString('hex')
  },
  hash: undefined,
  target: undefined,
  time: undefined,
  bits: '180091c1',
  // target
  nonce: 0
})

let prospector // TODO: this feels weird & clonky
restartProspector()

// MINE

btcNet.events.on('block', newBlock)
btcNet.events.on('tx', newTransaction)
setInterval(swingPick, CONFIG.mineRate);

// VISUALIZE

if (isRunningInBrowser()) {
  w.display(ore, 'nonce')
  w.display(ore, 'time')
  w.display(ore, 'previousblockhash', 'last')
  w.displayLength(mempool, 'transactions', 'txs')
  w.display(ore, 'merkleroot', 'mrkl')
  w.display(ore, 'hash', 'hash')
  w.display(ore, 'target', 'trgt')
}

// DEBUG
if (process.env.NODE_ENV == 'development') {
  window.ore = ore
  window.mempool = mempool
  window.blockchain = blockchain

  window.newBlock = newBlock
  window.newTransaction = newTransaction
}

// FUNCTIONS
// (to be split into modules?)

function newBlock(blockhash) {
  // blockhash is hash string
  audio.beep()
  console.log('new block', blockhash)
  blocks.insert(blockhash)
  ore.previousblockhash = blockhash
  restartMempool()
  restartProspector()
}

function newTransaction(tx) {
  console.log('new tx', tx)
  mempool.transactions.push(tx)
  ore.merkleroot = merkleRoot(mempool.transactions)
}

function merkleRoot(txArr) {
  // TODO: really shouldn't be reBuffering the whole thing every time; store separate array?
  const hashArr = txArr.map( tx => Buffer.from(tx.txid, 'hex') ) // array of hash buffers
  return fastRoot(hashArr, sha256).toString('hex')
}

function restartMempool() {
  mempool.transactions.length = 0
  // more thorough than `= []`
  // https://stackoverflow.com/a/1234337/1489243
}

function restartProspector() {
  prospector = new btcMiner(ore)
  ore.target = prospector.getTarget().toString('hex')
  ore.nonce = 0
}

// attempt one block hash, then if (when) it fails increment nonce
function swingPick() {
  ore.time = Math.floor(Date.now() / 1000)
  ore.newHash = prospector.getHash(ore.nonce)
  if (!isRunningInBrowser()) {
    console.log('Trying nonce ' + ore.nonce + ': ' + ore.hash.toString('hex'))
  }
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

// UTILITIES

function isRunningInBrowser() {
  return process.browser
}

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest()
}
