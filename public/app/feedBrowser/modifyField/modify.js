define(['feedBrowser/feedData', 'durandal/app'], function(feedData, app) {

	var name = ko.observable();
	var selectedDataType = ko.observable();
	var saved = ko.observable(false);
	var fieldId = ko.observable();
	var feedId = ko.observable();
	var collectionId = ko.observable();
	var rules = ko.observableArray([]);
	var validatorTypes = ko.observableArray([]);
	var selectedValidatorType = ko.observable();
	var selectedValidatorValue = ko.observable();

	var addValidationRule = function() {
		var newRule = {
			name : selectedValidatorType().name,
			code : selectedValidatorType().code,
			value : selectedValidatorValue()
		};		
		rules.push(newRule);
		selectedValidatorValue("");		
	};

	var removeValidationRule = function(rule) {
		rules.remove(rule);
	};

	var loadValidatorTypes = function(type) {
		return feedData.getValidators(type).done(function(data) {
			validatorTypes(data);
		});
	};

	selectedDataType.subscribe(function(val) {
		loadValidatorTypes(val);
	});

	var loadField = function(feedId, collectionId, fieldId) {
		return feedData.getById(feedId).done(function(feed) {
			name(feed.name);

			var collection = _.find(feed.collections, function(c) {
				return c._id == collectionId
			});

			var field = _.find(collection.fields, function(f) {
				return f._id == fieldId;
			});

			name(field.name);
			selectedDataType(field.dataType);
			loadValidatorTypes(field.dataType);
			rules(field.rules||[]);
		});
	};

	return {
		saved : saved,
		name : name,
		selectedDataType : selectedDataType,
		dataTypes : ['text', 'number', 'date'],
		rules : rules,
		validatorTypes : validatorTypes,
		selectedValidatorType : selectedValidatorType,
		selectedValidatorValue : selectedValidatorValue,
		addValidationRule : addValidationRule,
		removeValidationRule : removeValidationRule,
		save : function() {
			feedData.modifyField(name(), selectedDataType(), rules(), feedId(), collectionId(), fieldId()).then(function() {
				saved(true);
			});
		},
		activate : function(args) {
			fieldId(args.fieldId);
			feedId(args.feedId);
			collectionId(args.collectionId);
			saved(false);
			return loadField(args.feedId, args.collectionId, args.fieldId);
		}
	};
});
