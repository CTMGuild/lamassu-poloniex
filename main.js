var _ = require('lodash');

var common = require('./lib/common');
var ticker = require('./lib/ticker').ticker;
var trader = require('./lib/trader');
var wallet = require('./lib/wallet');

var plugin_cfg = {};

module.exports = {
  NAME: 'Dash',
  COIN: 'DASH',
  SUPPORTED_MODULES: ['ticker', 'trader', 'wallet'],
  config: function(local_cfg) {
    if (local_cfg) {
      _.merge(plugin_cfg, local_cfg);
    }
    common.config(plugin_cfg);
  },
  /* Ticker dependencies. */
  ticker: ticker,
  /* Trader dependencies. */
  sell: trader.sell,
  purchase: trader.purchase,
  /* Wallet dependencies. */
  sendBitcoins: wallet.sendBitcoins,
  newAddress: wallet.newAddress,
  /* Trader and Wallet dependencies. */
  balance: common.balance
}
