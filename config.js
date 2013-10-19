
module.exports = {
  development: {
    port: process.env.PORT || 3000,
    baseUrl: 'http://localhost:3000',
    db: {
      host: 'localhost',
      port: 27017,
      name: 'DatosAbiertos'
    }
  },
  production: {
    port: process.env.PORT || 80,
    baseUrl: 'http://datosabiertoshn.aws.af.cm',
    db: {
      host: 'localhost',
      port: 27017,
      name: 'DatosAbiertos'
    }
  }
};
