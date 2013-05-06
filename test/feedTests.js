var feedModule = require("../modules/feeds.js");

describe('Feeds', function(){
  
  describe('when getting a list of feeds', function(){
    it('return a list of feeds', function(){
      feedModule.getAll().on('success', function(feeds){
      	feeds.should.not.be.empty;
      })
    })
  })
  
  describe('when getting one feed by id', function(){
    it('return the expected feed', function(){
      feedModule.get(1).on('success', function(feed){
      	feed.should.exist
      })      
    })
  })
  
  describe('when archiving one feed by id', function(){
    it('set the archive bit', function(){
      feedModule.archive(1).on('success', function(feed){
      	feed.archived.should.equal(true);
      })      
    })
  })  
  
})