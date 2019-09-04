const packageJson = require(process.cwd() + '/package.json');
const config = {};

config.version = packageJson.version;
config.serviceName = packageJson.name;
config.objectExpiration = process.env.OBJECT_EXPIRATION_DAYS || 5;
config.sources = process.env.CLEAN_SOURCES || 'Etcd | Redis';

const useSentinel = !!process.env.REDIS_SENTINEL_SERVICE_HOST;

config.etcd = {
    protocol: 'http',
    host: process.env.ETCD_CLIENT_SERVICE_HOST || 'localhost',
    port: process.env.ETCD_CLIENT_SERVICE_PORT || 4001
};

config.redis = {
    host: useSentinel ? process.env.REDIS_SENTINEL_SERVICE_HOST : process.env.REDIS_SERVICE_HOST || 'localhost',
    port: useSentinel ? process.env.REDIS_SENTINEL_SERVICE_PORT : process.env.REDIS_SERVICE_PORT || 6379,
    sentinel: useSentinel,
};

module.exports = config;
