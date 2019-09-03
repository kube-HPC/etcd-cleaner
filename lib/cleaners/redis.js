const redisStore = require('../store/redis');
const { time, counter } = require('../helpers');

const paths = [
    '/pipeline-driver/graph',
    '/pipeline-driver/nodes-graph' // NEED TO ADD timestamp TO THIS
];

const clean = async (config, source) => {
    redisStore.init(config);
    const data = await Promise.all(paths.map(p => redisStore.getKeys(`${p}/*`)));
    const promises = [];
    const count = Object.create(null);
    data.forEach((d) => {
        Object.entries(d).forEach(([k, v]) => {
            const { timestamp } = v.graph || {}; // NEED TO CHANGE THIS timestamp LOCATION
            if (time.shouldDelete(timestamp, config.objectExpiration)) {
                promises.push(redisStore.deleteKey(k));
                counter.add(count, k, paths);
            }
        });
    });
    await Promise.all(promises);
    counter.print(count, source);
};

module.exports = { clean };
