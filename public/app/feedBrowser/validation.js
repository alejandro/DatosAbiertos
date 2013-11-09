define(['server'], function(server) {

	var validation = function(api) {

		return {
			preValidateNewDocument : function(feedId, collectionId, newDocument) {
				return api.post("validation/feeds/" + feedId + "/collections/" + collectionId, newDocument);
			},
			preValidateModification : function(feedId, collectionId, docId, mods) {
				return api.put("validation/feeds/" + feedId + "/collections/" + collectionId + "/documents/" + docId, mods);
			}
		};
	}(server);

	return validation;
})