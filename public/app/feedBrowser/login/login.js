define(function() {

	var viewModel = function() {
		
		return {
			activate: function(){
				
			},
			viewAttached: function(x){
				console.log(x);
			}
		};
	}();

	return viewModel;
});
