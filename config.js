var url = 'http://localhost:3000';
//var url = 'http://datosabiertoshn.aws.af.cm';

module.exports = {
	baseUrl : url,
  development: {
    port: process.env.PORT || 3000,
    db: {
      host: 'localhost',
      port: 27017,
      name: 'DatosAbiertos'
    }
  },
  production: {
    port: process.env.PORT || 80,
    db: {
      host: 'localhost',
      port: 27017,
      name: 'DatosAbiertos'
    }
  }
};
