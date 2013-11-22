define(['server'], function(server) {

	var accountData = function(api) {

		return {
			search : function(text) {
				return api.get("accounts/search/"+ text);
			}
		};
	}(server);

	return accountData;
})