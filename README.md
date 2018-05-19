# ▢ Block
# ⛓ Chain
# 🔍 Saw (viewer)

A live HTML mining visualization/scoreboard of sorts.

Will show transactions coming in, nonces, merkel roots, and hashes being feebly attempted locally, and congratulates the winning miner every time a new block is mined, then shows that block being stacked on the blockchain.

In lieu of a README (which I am not nearly ready for), please enjoy my

## TODO.md
### API & Development
[ ] Figure out how tests work
[ ] Merkle roots: can I just [`merkle-tree-gen`](https://www.npmjs.com/package/merkle-tree-gen) my array of `txid`s which came in since the last block mined?
[ ] In the lightning-striking-a-shark-mid-attackishly small chance of my app mining something, how hard is it to make it capable of submitting block to network?
  [ ] Ethics of hardcoding my wallet address for the coinbase?

### Network
[ ] Transition to Bitpay API running locally instead of public API
[ ] Bitpay API: Can I quickly download only the last x blocks? I only need headers.

### Structure
[ ] Which is better: arrays of blocks, or blocks with properties like `height` and `isInChain`?
[ ] How can I do kind of a "rolling array"? Eg: I'll only need the last 5-100 blocks, and they can drop off after that.

### Design
[ ] Best way to tween things with morphable?
  [ ] Canvas? SVG? Good ol divs but everything absolute and with lots of CSS transitions?
[ ] Display in little endian or big? Probably big.
[ ] What to display in block?
  [ ] Height?
  [ ] Hash?
  [ ] Miner?
  [ ] Total transacted value?
[ ] Should I abbreviate hash like git does? If so, would have to be from right.

### Funs to Have
[ ] Dictionary of Well-known addresses
  [ ] Donation addresses (Wikipedia, Linux, xkcd, etc.)
  [ ] Satoshi
  [ ] Mine
[ ] Mobile interface
[ ] 

### Layout
```
┌────────────────┐   
│ ABC -.5฿-> KDS │ s  
│ DEF -10฿-> JSD │  h   ⦪
│ GHI - 1฿-> JJF │   r    ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐ ┌───┐
│ JKL - 2฿-> LKD │    i ➵ │ 9 ││ 8 ││ 7 ││ 6 ││ 5 ││ 4 ││ 3 ││ 2 │…│ 0 │
│ MNO - 2฿-> SLK │   n    └───┘└───┘└───┘└───┘└───┘└───┘└───┘└───┘ └───┘
│ PQR -.1฿-> XYZ │  k   ⦨        • t h e   b l o c k c h a i n •
│ …  [scroll]  … │ s 
└────────────────┘   
   Ver: 0000000002 ↢ constant
Merkle: 0000000000 ↢ recalc every incoming transaction
  Time: 1526767160 ↢ live
 Nonce: 0000000001 ↢ count up, reset every new block
 -----------------
  Hash: 0000ef2391 ↢ updates every has attempt, flashes green when solved by miner
 Miner: some guy!  ↢ what can I display about winning miner? IP? Pool? Coinbase addr?
```