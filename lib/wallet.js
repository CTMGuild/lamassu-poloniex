var dash = require('./common').dash;


function genAddress(callback) {
  dash.generateDashAddress(function(err, raw, body) {
    if (err) {
      return callback(err);
    }
    data = JSON.parse(body);
    if (!data.success) {
      callback(new Error("could not get a DASH address: " + data.response));
    } else {
      callback(null, data.response);
    }
  });
}

function newAddress(info, callback) {
  /* XXX Poloniex does not actually support new address generation, it limits
   * it to 1 per day.
   **/
  dash.getAddresses(function(err, raw, body) {
    if (err) {
      return callback(err);
    }
    data = JSON.parse(body);
    if (!data.DASH) {
      genAddress(callback);
    } else {
      callback(null, data.DASH);
    }
  });
};

exports.newAddress = newAddress;

exports.sendBitcoins = function (address, satoshis, fee, callback) {
  var data, amount = (satoshis / 1e8).toFixed(8);

  /* XXX */
  dash.withdrawDash(function(err, raw, body) {
    if (err) {
      return callback(err);
    }
    data = JSON.parse(body);
    if (data.error) {
      return callback(new Error(data.error));
    }
    callback(null, data.transaction_id);
  }, amount, address);
};

