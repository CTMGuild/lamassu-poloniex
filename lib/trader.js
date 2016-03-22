var poloniex = require('./common').poloniex;
var ticker = require('./ticker').ticker;


function getPrice(side, price, cb) {
  if (price) {
    cb(null, price);
    return;
  }

  ticker('USD', function(err, res) {
    if (err) {
      cb(err);
    }

    cb(null, res.USD.rates[side]);
  });
}


exports.purchase = function (satoshis, options, callback) {
  var amount = (satoshis / 1e8).toFixed(8);
  var rate;

  getPrice('bid', options ? options.price : null, function(err, res) {
    if (err) {
      return callback(err);
    }

    rate = res;

    poloniex.buyDash(function(err, raw, body) {
      if (err) {
        return callback(err);
      }
      data = JSON.parse(body);
      if (data.error) {
        return callback(new Error(data.error));
      }
      return callback(null, data);
    }, rate, amount);
  });
};

exports.sell = function (satoshis, options, callback) {
  var amount = (satoshis / 1e8).toFixed(8);
  var rate;

  getPrice('ask', options ? options.price : null, function(err, res) {
    if (err) {
      return callback(err);
    }

    rate = res;

    poloniex.sellDash(function(err, raw, body) {
      if (err) {
        return callback(err);
      }
      data = JSON.parse(body);
      if (data.error) {
        return callback(new Error(data.error));
      }
      return callback(null, data);
    }, rate, amount);
  });
};
