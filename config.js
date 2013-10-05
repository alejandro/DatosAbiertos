var url = 'http://localhost:3000';
if(process.env.environment == "development"){
	var url = 'http://datosabiertoshn.aws.af.cm';
}

module.exports = {
	baseUrl : url
};
