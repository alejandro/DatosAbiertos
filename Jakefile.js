var util = require('util')
var secret = require('./secret');

desc('This is the default task.');
task('default', [], function(params) {
	console.log('This is the default task.');
	console.log(util.inspect(arguments));
}); 

task('deploy', [], function(){
	//use secret to log in and deploy
	jake.exec("af login " + secret.appFog.username + " " + secret.appFog.password);
	//
});
