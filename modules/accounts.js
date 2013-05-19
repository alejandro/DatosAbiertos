"use strict";

var database = require("../modules/database.js");
var collectionName = "accounts";

var mod = function() {

	var getCollection = function() {
		return database.collection(collectionName);
	};

	var getByEmail = function(email) {
		return getCollection().then(function(col) {
			return col.getFirst({
				email: email
			});
		});
	};

	var create = function(email, displayName, firstName, lastName) {
		return getCollection().then(function(col) {
			return col.add({
				email : email,
				displayName: displayName,
				firstName: firstName,
				lastName: lastName				
			});
		});
	};

	return {
		getByEmail : getByEmail,
		create : create
	};
}();

module.exports = mod;
