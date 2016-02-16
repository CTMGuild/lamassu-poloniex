var should = require('chai').should();

var plugin = require('../main');
var common = require('../lib/common');


var REQUIRED_MOCK_PROPERTIES = ['key', 'secret', 'dest_address'];


// re-reads *uncached* version of config JSON
function requireFresh(file) {
  delete require.cache[require.resolve(file)];
  return require(file);
}


if (!process.env.TRAVIS) {
  describe(plugin.NAME + ' Wallet', function() {
    // NOTE: MAX timeout for each test
    this.timeout(7000);

    var configMock = null;

    describe('Mock config file', function() {

      it('`test/mockConfig.json` should exist', function() {
        should.not.Throw(function() {
          configMock = requireFresh('./mockConfig.json');
        });

        configMock.should.be.an('object');
      });

      if (REQUIRED_MOCK_PROPERTIES.length) {
        REQUIRED_MOCK_PROPERTIES.forEach(function(property) {
          it('should have \'' + property + '\' property', function() {
            configMock.should.have.property(property);
          });
        });
      }
    });

    describe('Credentials', function() {

      it('should have valid and activated API credentials', function(done) {
        should.not.Throw(function() {
          plugin.config(requireFresh('./mockConfig.json'));
        });

        plugin.balance(function(err) {
          should.not.exist(err);
          done();
        });
      });
    });

    describe('Requests', function() {

      it('should fail to send dash to an invalid address', function(done) {
        plugin.sendBitcoins('1abc', 0.001 * 1e8, null, function(err) {
          should.exist(err);

          err.message.should.have.string('Invalid address');

          done();
        });
      });

      it('should fail to send 0 dash', function(done) {
        plugin.sendBitcoins('1abc', 0, null, function(err) {
          should.exist(err);

          done();
        });
      });

      it('should successfully send dash', function(done) {
        /* XXX */
        plugin.sendBitcoins(configMock.dest_address, 0.1 * 1e8, null, function(err, txid) {
          should.not.exist(err);

          txid.should.be.a('string');

          done();
        });
      });

      it('should return a dash address', function(done) {
        plugin.newAddress({}, function(err, addy) {
          should.not.exist(err);
          addy.should.be.a('string');
          done();
        });
      });
    });

  });
}
