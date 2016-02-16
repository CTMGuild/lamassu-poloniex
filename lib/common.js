var TICKER_CURRENCIES = {USD: 1};
/* Define the fallback Fiat currency used for trading at Poloniex. */
var DEFAULT_FIAT_CURRENCY = 'USD';

var dash = require('./dash').create();

exports.dash = dash;
exports.TICKER_CURRENCIES = TICKER_CURRENCIES;

exports.config = function (cfg) {
  dash.cfg = cfg;

  /* Key pair from Poloniex. */
  dash.apiKey = cfg.key || cfg.guid;
  dash.apiSecret = cfg.secret || cfg.password;

  dash.fiat = cfg.fiatCurrency || DEFAULT_FIAT_CURRENCY;
}

exports.balance = function (callback) {
  dash.accountBalance(function (err, req, body) {
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
