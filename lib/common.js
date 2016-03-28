var TICKER_CURRENCIES = {USD: 1};
/* Define the fallback Fiat currency used for trading at Poloniex. */
var DEFAULT_FIAT_CURRENCY = 'USD';

var poloniex = require('./poloniex').create();

exports.poloniex = poloniex;
exports.TICKER_CURRENCIES = TICKER_CURRENCIES;

exports.config = function (cfg) {
  poloniex.cfg = cfg;

  /* Key pair from Poloniex. */
  if (cfg.hasOwnProperty('key') && cfg.key != undefined && cfg.key != 'none') {
    poloniex.apiKey = cfg.key;
  } else if (cfg.hasOwnProperty('guid') && cfg.guid != undefined && cfg.guid != 'none') {
    poloniex.apiKey = cfg.guid;
  }
  if (cfg.hasOwnProperty('secret') && cfg.secret != undefined && cfg.secret != 'none') {
    poloniex.apiSecret = cfg.secret;
  } else if (cfg.hasOwnProperty('password') && cfg.password != undefined && cfg.password != 'none') {
    poloniex.apiSecret = cfg.password;
  }

  poloniex.fiat = cfg.fiatCurrency || DEFAULT_FIAT_CURRENCY;
}

exports.balance = function (callback) {
  poloniex.accountBalance(function (err, req, body) {
    if (err) {
      return callback(err);
    }
    var data = JSON.parse(body);
    if (data.error) {
      return callback(new Error(data.error));
    }

    var amount;
    var balances = {};
    var currencies = ['USDT', 'DASH'];
    currencies.forEach(function(curr) {
      amount = parseFloat(data[curr]);
      if (curr == 'DASH') {
        amount *= 1e8;
      }
      balances[curr] = amount;
    });

    callback(null, balances);
  });
};
