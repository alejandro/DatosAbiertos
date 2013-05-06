define(['server'],function(server){
	
	var feedData = function(api){
		
		return {
			getAll: function(){
				return api.get("feeds");
			}
		};
	}(server);
	
	return feedData;
})