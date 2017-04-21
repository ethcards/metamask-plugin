const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const TokenTracker = require('eth-token-tracker')
const TokenCell = require('./token-cell.js')

module.exports = TokenList

inherits(TokenList, Component)
function TokenList () {

  // Hard coded for development for now:
  const tokens = [
    { address: '0x48c80F1f4D53D5951e5D5438B54Cba84f29F32a5', symbol: 'REP', balance: 'aa'},
    { address: '0xc66ea802717bfb9833400264dd12c2bceaa34a6d', symbol: 'MKR', balance: '1000', decimals: 18},
    { address: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d', symbol: 'GOL', balance: 'ff'},
    { address: '0xaec2e87e0a235266d9c5adc9deb4b2e29b54d009', symbol: 'SNGLS', balance: '0' },
  ]

  this.state = { tokens }
  Component.call(this)
}

TokenList.prototype.render = function () {
  const tokens = this.state.tokens

  return (
    h('ol', tokens.map((tokenData) => {
      console.log('rendering token with', tokenData)
      return h(TokenCell, tokenData)
    }))
  )
}

TokenList.prototype.componentDidMount = function () {
  const { userAddress } = this.props

  this.tracker = new TokenTracker({
    userAddress,
    provider: web3.currentProvider,
    tokens: this.state.tokens,
  })

  this.setState({ tokens: this.tracker.serialize() })
  this.tracker.on('update', (tokenData) => this.setState({ tokens: tokenData }))
  this.tracker.updateBalances()
}

TokenList.prototype.componentWillUnmount = function () {
  this.tracker.stop()
}