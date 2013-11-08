define(['server'], function(server) {

	var feedData = function(api) {

		return {
			getValidators : function(dataType) {
				return api.get("validatorTypes/"+ dataType);
			},
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
			addField : function(name, dataType, rules, feedId, collectionId) {
				return api.post("feeds/" + feedId + "/collections/" + collectionId + "/fields", {
					name : name,
					dataType : dataType,
					rules: rules
				});
			},
			modifyField : function(name, dataType, rules, feedId, collectionId, fieldId) {
				return api.put("feeds/" + feedId + "/collections/" + collectionId + "/fields/" + fieldId, {
					name : name,
					dataType : dataType,
					rules: rules
				});
			},
			getDocument : function(collectionId, documentId) {
				return api.get("collections/" + collectionId + "/documents").then(function(docs) {
					console.log(documentId);
					console.log(docs[0]);
					return _.find(docs, function(d) {
						return d._id == documentId
					});
				});
			},
			getCollectionData : function(collectionId, page, itemsPerPage) {
				return api.get("collections/" + collectionId + "/documents");
			},
			addDataToCollection : function(collectionId, doc) {
				return api.post("collections/" + collectionId + "/documents", doc);
			},
			modifyDocument : function(collectionId, documentId, changes) {
				return api.put("collections/" + collectionId + "/documents/" + documentId, changes);
			},
			archiveDocument : function(collectionId, documentId) {
				return api.delete("collections/" + collectionId + "/documents/" + documentId);
			}
		};
	}(server);

	return feedData;
})