var env = process.env
module.exports = {
  development: {
    port: env.PORT || 3001,
    baseUrl: 'http://localhost:3001',
    db: {
      host: 'localhost',
      port: 27017,
      name: 'DatosAbiertos'
    }
  },
  production: {
    port: env.PORT || 80,
    baseUrl: 'http://datosabiertos.nodejitsu.com',
    db: {
      host: env.MONGO_HOST,
      port: env.MONGO_PORT,
      password: env.MONGO_PASS,
      user: env.MONGO_USER,
      name: env.MONGO_DB
    }
  }
};
