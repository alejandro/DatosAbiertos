define(['server'], function(server) {

	var feedData = function(api) {

		return {
			getAll : function() {
				return api.get("feeds");
			},
			getById : function(id) {
				return api.get("feeds/" + id);
			},
			addCollection : function(name, feedId) {
				return api.post("feeds/" + feedId + "/collections", {
					name : name
				});
			},
			addField : function(name, dataType, feedId, collectionId) {
				return api.post("feeds/" + feedId + "/collections/" + collectionId + "/fields", {
					name : name,
					dataType : dataType
				});
			},
			modifyField : function(name, dataType, feedId, collectionId, fieldId) {
				return api.put("feeds/" + feedId + "/collections/" + collectionId + "/fields/" + fieldId, {
					name : name,
					dataType : dataType
				});
			},
			getCollectionData : function(collectionId, page, itemsPerPage) {
				return api.get("collections/" + collectionId + "/documents");
			},
			addDataToCollection : function(collectionId, doc) {
				return api.post("collections/" + collectionId + "/documents", doc);
			}
		};
	}(server);

	return feedData;
})