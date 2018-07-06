const e = require('nanohtml')
const m = require('morphable')

function replaceWith(oldEl, newEl) {
  oldEl.parentNode.replaceChild(newEl, old);
}

module.exports.display = function(proxy, key, label = key) {
  if (key == 'hash' || key == 'target') {
    key += '_friendly';
  }
  const el = m(proxy => e`<code>${label}: ${proxy[key]}<br></code>`)
  document.getElementById('theApp').appendChild( el(proxy) )
}

module.exports.displayLength = function(proxy, key, label = key) {
  const el = m(proxy => e`<code>${label}: ${proxy[key].length}<br></code>`)
  document.getElementById('theApp').appendChild( el(proxy) )
}

// function shouldToString(val) {
//   console.log('val', val)
//   if (val == undefined) {
//     return false
//   } else if (val.constructor === Uint8Array) {
//     return true
//   } else {
//     return false
//   }
// }
