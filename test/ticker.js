var should = require('chai').should();

var plugin = require('../main');
var common = require('../lib/common');


var currencies = Object.keys(common.TICKER_CURRENCIES);
var testCurrencies = [];
for (var i = 0; i < currencies.length; i++) {
  if (common.TICKER_CURRENCIES[currencies[i]]) {
    testCurrencies.push(currencies[i]);
  }
}


// Checks structure and values of object returned by `.balance()`
function checkCurrency(results, currency) {
  results.should.be.an('object');
  results.should.have.property(currency);

  var curr = results[currency];
  curr.should.be.an('object');
  curr.should.have.property('currency');
  curr.currency.should.equal(currency);

  curr.should.have.property('rates');

  var rates = curr.rates;
  rates.should.be.an('object');

  rates.should.have.property('ask');
  var askRate = parseFloat(rates.ask);
  isNaN(askRate).should.not.equal(true, 'The ask rate should be a float');

  rates.should.have.property('bid');
  var bidRate = parseFloat(rates.bid);
  isNaN(bidRate).should.not.equal(true, 'The bid rate should be a float');

  askRate.should.be.at.least(bidRate);

  return rates;
}


describe(plugin.NAME + ' Ticker (' + testCurrencies.join(', ') + ')', function() {

  // NOTE: MAX timeout for each test
  this.timeout(7000);

  // single currency fetch as a string
  it('should read ' + testCurrencies[0] + ' ticker', function(done) {
    plugin.ticker(testCurrencies[0], function(err, results) {
      should.not.exist(err, 'There should be no error');
      should.exist(results);

      checkCurrency(results, testCurrencies[0]);

      done();
    });
  });


  var tmpCurrency = testCurrencies.length >= 2 ? testCurrencies[1] : testCurrencies[0];

  // single currenct fetch as a array
  it('should read ticker in [' + tmpCurrency + ']', function(done) {
    plugin.ticker([tmpCurrency], function(err, results) {
      should.not.exist(err, 'There should be no error');
      should.exist(results);

      checkCurrency(results, tmpCurrency);

      done();
    });
  });


  // will be used in following tests
  var unsupportedCurrency = 'XYZ';

  // single *not* supported currency fetch
  it('should fail to read ticker in ' + unsupportedCurrency, function(done) {
    plugin.ticker([unsupportedCurrency], function(err, results) {
      should.exist(err);
      should.not.exist(results);

      done();
    });
  });


  // only make sense if there's more than one supported currency
  if (testCurrencies.length >= 2) {
    // multiple supported currencies fetch
    it('should read ticker in ' + testCurrencies.join(', '), function(done) {

      this.timeout(15000);

      plugin.ticker(testCurrencies, function(err, results) {
        should.not.exist(err, 'There should be no error');
        should.exist(results);

        for (var i in testCurrencies) {
          checkCurrency(results, testCurrencies[i]);
        }

        done();
      });
    });


    // multiple supported and not supported currencies
    var mix2Currencies = [unsupportedCurrency].concat(testCurrencies);
    it('should fail to read ticker in ' + mix2Currencies.join(', '), function(done) {
      plugin.ticker(mix2Currencies, function(err, results) {
        should.exist(err);
        should.not.exist(results);

        done();
      });
    });
  }


  // mix of supported AND not supported currencies
  var mixCurrencies = [testCurrencies[0], unsupportedCurrency];
  it('should fail to read ticker with ' + mixCurrencies.join(', '), function(done) {
    plugin.ticker(mixCurrencies, function(err, results) {
      should.exist(err);
      should.not.exist(results);

      done();
    });
  });


  // ticker request with empty array
  var emptyArray = [];
  it('should fail to read ticker with empty array', function(done) {
    plugin.ticker(emptyArray, function(err, results) {
      should.exist(err);
      should.not.exist(results);

      done();
    });
  });

});
