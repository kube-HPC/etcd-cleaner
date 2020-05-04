const log = require('@hkube/logger').GetLogFromContainer();
const etcdStore = require('../store/etcd');
const { json, time, counter } = require('../helpers');

const paths = [
    '/webhooks',
    '/jobs/status',
    '/jobs/results',
    '/jobs/tasks',
    '/workers',
    '/executions',
    '/algorithms/queue',
    '/algorithms/builds',
    '/algorithms/executions',
];

const clean = async (config, source) => {
    etcdStore.init(config);
    const promises = [];
    const count = Object.create(null);
    const data = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const p of paths) {
        try {
            // eslint-disable-next-line no-await-in-loop
            data.push(await etcdStore.getKeys(p));
        }
        catch (error) {
            log.error(`failed getting keys from etcd (${p}). Error: ${error.message}`)
        }
    }
    // const data = await Promise.all(paths.map(p => etcdStore.getKeys(p)));
    data.forEach((d) => {
        Object.entries(d).forEach(([k, v]) => {
            const obj = json.tryParse(v);
            const timestamp = obj.timestamp || obj.startTime || obj.endTime || 0;
            if (time.shouldDelete(timestamp, config.objectExpiration)) {
                promises.push(etcdStore.deleteKey(k));
                counter.add(count, k, paths);
            }
        });
    });

    await Promise.all(promises);
    counter.print(count, source);
};

module.exports = { clean };
