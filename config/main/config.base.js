const config = {};

config.serviceName = 'etcd-cleaner';
config.objectExpiration = process.env.OBJECT_EXPIRATION_DAYS || 5;
config.etcd = {
    protocol: 'http',
    host: process.env.ETCD_CLIENT_SERVICE_HOST || 'localhost',
    port: process.env.ETCD_CLIENT_SERVICE_PORT || 4001
};

module.exports = config;
