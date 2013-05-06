var should = require("should");

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      var arr = [1,2,3];
      arr.should.include(2);
      arr.should.not.include(5);      
    })
  })
})

//run all tests
require("./feedTests");