const redisStore = require('../store/redis');
const { time, counter } = require('../helpers');

const paths = [
    '/hkube:pipeline:graph',
    '/pipeline-driver/graph',
    '/pipeline-driver/nodes-graph'
];

const clean = async (config, source) => {
    redisStore.init(config);
    const count = Object.create(null);
    for (const path of paths) {
        for await (const data of redisStore.getKeys(`${path}/*`)) {
            const promises = [];
            Object.entries(data).forEach(([k, v]) => {
                const timestamp = (v.graph && v.graph.timestamp) || v.timestamp || 0;
                if (time.shouldDelete(timestamp, config.objectExpiration.redis)) {
                    promises.push(redisStore.deleteKey(k));
                    counter.add(count, k, paths);
                }
            });
            await Promise.all(promises);
        }
    }
    counter.print(count, source);
};

module.exports = { clean };
