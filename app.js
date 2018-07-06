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
  version: 536870912, // 2 in reverse endian hex, or something like that
  previousblockhash: '0000000000000000000000000000000000000000000000000000000000000000',
  merkleroot: '0000000000000000000000000000000000000000000000000000000000000000',
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
  restartProspector() // get new merkleRoot
}

function merkleRoot(txArr) {
  // TODO: how expensive is mapping & Buffering whole mempool each time?
  // Should I use a setter instead, and store all Buffers in separate merkle-ready mempool.merkleLeaves array?
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
  ore.newTarget = prospector.getTarget()
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
