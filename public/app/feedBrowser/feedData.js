define(['server'],function(server){
	
	var feedData = function(api){
		
		return {
			getAll: function(){
				return api.get("feeds");
			},
			getById: function(id){
				return api.get("feeds/"+id);
			},
			create: function(newFeed){
				return api.post("feeds", newFeed);
			}			
		};
	}(server);
	
	return feedData;
})