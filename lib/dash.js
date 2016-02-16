var crypto = require('crypto');
var request = require('request');
var querystring = require('querystring');

/* Auxiliary functions for sending signed requests to Poloniex. */
function signData(data, seckey) {
  var sign = crypto.createHmac("sha512", seckey).update(data);
  return sign.digest('hex');
}

function genNonce() {
  return new Date().getTime();
}


module.exports = {

  create: function(options) {
    /* Recognized keys in options:
     *  apiKey, apiSecret, baseURL
     */
    if (options === undefined) {
      options = {};
    }
    if (!options.tickerURL) {
      options.tickerURL = 'http://localhost:8450/v1/ticker/USD_DASH';
    }
    options.tradeURL = 'https://poloniex.com/tradingApi';

    return {
      apiKey: options.apiKey,
      apiSecret: options.apiSecret,
      tickerURL: options.tickerURL,
      tradeURL: options.tradeURL,
      fiat: null,

      signData: signData,

      ticker: function(cb) {
        request({
          url: this.tickerURL,
          method: 'GET'
        }, cb);
      },

      /* Make a call to the Poloniex trading API. */
      call: function(method, params, cb) {
        var data, headers = {};

        params.nonce = genNonce();
        params.command = method;
        data = querystring.stringify(params);
        headers = {
          'Key': this.apiKey,
          'Sign': signData(data, this.apiSecret)
        };

        var reqopts = {
          url: this.tradeURL,
          form: params,
          headers: headers,
          method: 'POST',
        };
        request(reqopts, cb);
      },

      accountBalance: function(cb) {
        var params = {};
        this.call('returnBalances', params, cb);
      },

      getAddresses: function(cb) {
        var params = {};
        this.call('returnDepositAddresses', params, cb);
      },

      generateDashAddress: function(cb) {
        var params = {
          currency: 'DASH'
        };
        this.call('generateNewAddress', params, cb);
      },

      withdrawDash: function(cb, amount, address) {
        var params = {
          amount: amount,
          address: address,
          currency: 'DASH'
        };
        this.call('withdraw', params, cb);
      },

      buyDash: function(cb, rate, amount) {
        var params = {
          amount: amount,
          rate: rate,
          currencyPair: 'USDT_DASH'
        };
        this.call('buy', params, cb);
      },

      sellDash: function(cb, rate, amount) {
        var params = {
          amount: amount,
          rate: rate,
          currencyPair: 'USDT_DASH'
        };
        this.call('sell', params, cb);
      }

    };
  }
};
