/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const etcdStore = require('../store/etcd');
const { json, time, counter } = require('../helpers');

const COMPLETED_JOB_STATUS = [
    'completed',
    'failed',
    'stopped',
];

const statusPath = '/jobs/status';
const paths = [
    '/webhooks',
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

const cleanOnePath = async (data, statuses, objectExpiration, count) => {
    const promises = [];
    Object.entries(data).forEach(([k, v]) => {
        const obj = json.tryParse(v);
        const timestamp = obj.timestamp || obj.startTime || obj.endTime || 0;
        let canDelete = true;
        if (statuses[obj.jobId] && !COMPLETED_JOB_STATUS.includes(statuses[obj.jobId])) {
            canDelete = false;
        }
        if (canDelete && time.shouldDelete(timestamp, objectExpiration)) {
            promises.push(etcdStore.deleteKey(k));
            counter.add(count, k, paths);
        }
    });
    await Promise.all(promises);
};

const clean = async (config, source) => {
    etcdStore.init(config);
    const count = Object.create(null);
    const statusesRaw = await etcdStore.getKeys(statusPath);
    const statuses = Object.values(statusesRaw).reduce((acc, j) => {
        const obj = json.tryParse(j);
        acc[obj.jobId] = obj.status;
        return acc;
    }, {});

    for (const path of [...paths]) {
        const data = await etcdStore.getKeys(path);
        await cleanOnePath(data, statuses, config.objectExpiration, count);
    }
    await cleanOnePath(statusesRaw, statuses, config.objectExpiration, count);
    counter.print(count, source);
};

module.exports = { clean };
