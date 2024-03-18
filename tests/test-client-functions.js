var assert = require('assert');
const client = require('../src/client-functions');



describe('client-functions', function () {
  describe('expiresOn2date', function () {
    it('date should be correct according to timestamp', function () {
      res =  client.expiresOn2date(1710929277);
      assert.equal(res.toISOString(), "2024-03-20T10:07:57.000Z");
    });
  });
  describe('isAccessTokenExpired', function () {
    it('access token expired should return expired when expired', function () {
      res =  client.isAccessTokenExpired(1710929277);
      assert.equal(res, true);
    });
    it('access token expired should return expired when not expired', function () {
        // This test will fail Saturday, November 11th 5111, 2:40:47 am	
        res =  client.isAccessTokenExpired(99147483647);
        assert.equal(res, false);
      });

  });
});
