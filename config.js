
module.exports = {
  development: {
    port: process.env.PORT || 3001,
    baseUrl: 'http://localhost:3001',
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
