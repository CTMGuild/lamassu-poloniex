var async = require('async');
var common = require('./common');


function send_result(result, callback) {
  var currency, tick = {};

  for (var i = 0; i < result.length; i++) {
    currency = result[i].market.split('_')[0];
    tick[currency] = {
      currency: currency,
      rates: {
        ask: parseFloat(result[i].ask_display),
        bid: parseFloat(result[i].bid_display)
      }
    }
  }

  callback(null, tick);
}

function get_ticker(currency, cb) {
  if (!common.TICKER_CURRENCIES[currency]) {
    return cb(new Error('Currency ' + currency + ' is not supported'));
  }

  var data;

  common.dash.ticker(function(err, raw, body) {
    if (err) {
      return cb(err);
    }
    data = JSON.parse(body);
    if (data.error) {
      return cb(new Error(data.error));
    }
    return cb(null, data);
  }, currency + '_BTC');
}

function ticker(currencies, callback) {
  if (typeof currencies === 'string') {
    currencies = [currencies];
  }
  if (!currencies.length) {
    return callback(new Error('No currency specified'));
  }

  async.map(currencies, get_ticker, function(err, results) {
    if (err) {
      return callback(err);
    }
    send_result(results, callback);
  });
}

/* Support both lamassu-admin and lamassu-server */
ticker.factory = function() {
  return {ticker: ticker};
}

module.exports.ticker = ticker;
