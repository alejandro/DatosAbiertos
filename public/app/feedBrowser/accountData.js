define(['server'], function(server) {

	var accountData = function(api) {

		return {
			me: function(){
				return api.get("accounts/me");
			},
			search : function(text) {
				return api.get("accounts/search/"+ text);
			}
		};
	}(server);

	return accountData;
})