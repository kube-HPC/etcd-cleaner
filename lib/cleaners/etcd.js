const etcdStore = require('../store/etcd');
const { json, time, counter } = require('../helpers');

const COMPLETED_JOB_STATUS = [
    'completed',
    'failed',
    'stopped',
];

const paths = [
    '/webhooks',
    '/jobs/status',
    '/jobs/results',
    '/jobs/tasks',
    '/workers',
    '/drivers',
    '/executions',
    '/events',
    '/algorithms/queue',
    '/algorithms/builds',
    '/algorithms/executions',
];

const clean = async (config, source) => {
    etcdStore.init(config);
    const promises = [];
    const count = Object.create(null);
    const statusesRaw = await etcdStore.getKeys('/jobs/status');
    const statuses = Object.values(statusesRaw).reduce((acc, j) => {
        const obj = json.tryParse(j);
        acc[obj.jobId] = obj.status;
        return acc;
    }, {});

    const data = await Promise.all(paths.map(p => etcdStore.getKeys(p)));
    data.forEach((d) => {
        Object.entries(d).forEach(([k, v]) => {
            const obj = json.tryParse(v);
            const timestamp = obj.timestamp || obj.startTime || obj.endTime || 0;
            let canDelete = true;
            if (statuses[obj.jobId] && !COMPLETED_JOB_STATUS.includes(statuses[obj.jobId])) {
                canDelete = false;
            }
            if (canDelete && time.shouldDelete(timestamp, config.objectExpiration)) {
                promises.push(etcdStore.deleteKey(k));
                counter.add(count, k, paths);
            }
        });
    });

    await Promise.all(promises);
    counter.print(count, source);
};

module.exports = { clean };
