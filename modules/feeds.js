var monk = require('monk');
var db =  monk('localhost:27017/DatosAbiertos');
var feeds = "feeds";

var mod = function() {

	var getCollection = function() {
		return db.get(feeds);
	};

	var getAll = function() {
		return getCollection().find();
	};

	var getOne = function(id) {
		return getCollection().find({
			_id : id
		});
	};

	var archive = function(id) {
		return getCollection().find({
			_id : id
		}).on('success', function(feeds) {
			return users.updateById('id', {
				archived : true
			});
		});
	};

	getCollection().find({},function(err, feeds) {

		if (err) {
			getCollection().insert({
				Active : true,
				Name : 'Homicide in Tegucigalpa'
			});
		}

	});

	return {
		getAll : getAll,
		get : getOne,
		archive : archive
	};
}();

module.exports = mod;
