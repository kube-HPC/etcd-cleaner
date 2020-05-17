const Etcd = require('@hkube/etcd');
const { Factory } = require('@hkube/redis-utils');

const fillEtcd = async () => {
    const SERVICE_NAME = 'my-test-service';
    const config = { host: 'localhost', port: '4001', serviceName: SERVICE_NAME };
    etcd = new Etcd(config);

    const prefix = '/workers';
    const count = 10;
    const dataSize = 80;
    const data = Buffer.alloc(dataSize, 'x');
    const array = Array.from(Array(count).keys());
    await Promise.all(array.map(a => etcd._client.put(`${prefix}/${a}`, { timestamp: 1, data })));
};

const array_chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));
const fillRedis = async () => {
    const useSentinel = !!process.env.REDIS_SENTINEL_SERVICE_HOST;
    const config = {
        host: useSentinel ? process.env.REDIS_SENTINEL_SERVICE_HOST : process.env.REDIS_SERVICE_HOST || 'localhost',
        port: useSentinel ? process.env.REDIS_SENTINEL_SERVICE_PORT : process.env.REDIS_SERVICE_PORT || 6379,
        sentinel: useSentinel,
    }
    const redis = Factory.getClient(config);

    const prefix = '/hkube:pipeline:graph';
    const count = 100;
    const dataSize = 50;
    const data = Buffer.alloc(dataSize, 'x').toString();
    const array = Array.from(Array(count).keys());
    let counter = 0;
    for (const chunk of array_chunks(array,300)){
        await Promise.all(chunk.map(a => redis.set(`${prefix}/${a}`, JSON.stringify({ timestamp: 1, data }))));
        counter = counter + 300;
        console.log(`wrote ${counter}`)
    }
    console.log('Done')
};

fillRedis();