const chai = require('chai');
const { expect } = chai;
const mockery = require('mockery');
const sinon = require('sinon');
const moment = require('moment');
const etcdMock = require('./mocks/etcd-store');
const redisMock = require('./mocks/redis-store');
const etcd = require('../lib/store/etcd');

const config = {
    serviceName: 'cleaner-test',
    etcd: {
        protocol: 'http',
        host: process.env.ETCD_CLIENT_SERVICE_HOST || 'localhost',
        port: process.env.ETCD_CLIENT_SERVICE_PORT || 4001
    }
};
let clock;
describe('dummy test', () => {
    before(async function () {
        this.timeout(5000);
        mockery.enable({
            useCleanCache: false,
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerSubstitute('../store/redis', `${process.cwd()}/tests/mocks/redis-store.js`);
        let startTime = moment().subtract(100, 'days');
        clock = sinon.useFakeTimers(startTime.valueOf());
        etcd.init(config)
        await etcd._etcd._client.delete('/',{isPrefix:true});
        for (let i = 0; i < 150; i++) {
            await etcd._etcd.jobs.status.set({ jobId: `jobId-old-${i}`, status: 'completed' });
            await etcd._etcd.jobs.results.set({ jobId: `jobId-old-${i}`, status: 'completed' });
            await etcd._etcd.webhooks.set({ jobId: `jobId-old-${i}`, type: 'progress' });
            clock.tick(1000);
        }
        for (let i = 0; i < 25; i++) {
            await etcd._etcd.jobs.status.set({ jobId: `jobId-old-active-${i}`, status: 'active' });
            await etcd._etcd.jobs.results.set({ jobId: `jobId-old-active-${i}`, status: 'active' });
            await etcd._etcd.webhooks.set({ jobId: `jobId-old-active-${i}`, type: 'progress' });
            clock.tick(1000);
        }
        clock.restore();
        startTime = moment().subtract(1, 'days');
        clock = sinon.useFakeTimers(startTime.valueOf());
        for (let i = 0; i < 99; i++) {
            await etcd._etcd.jobs.status.set({ jobId: `jobId-new-active-${i}`, status: 'active' });
            await etcd._etcd.jobs.results.set({ jobId: `jobId-new-active-${i}`, status: 'active' });
            clock.tick(1000);
        }
        for (let i = 0; i < 120; i++) {
            await etcd._etcd.jobs.status.set({ jobId: `jobId-new${i}`, status: 'completed' });
            await etcd._etcd.jobs.results.set({ jobId: `jobId-new-${i}`, status: 'active' });
            await etcd._etcd.webhooks.set({ jobId: `jobId-new-${i}`, type: 'progress' });
            clock.tick(1000);
        }
        clock.restore();
    });
    after(() => {
        clock.restore();
    });
    it('clean objects', async () => {
        const etcdSpy = sinon.spy(etcd, "deleteKey");
        const redisSpy = sinon.spy(redisMock, "deleteKey");
        const bootstrap = require('../bootstrap');
        await bootstrap.init();
        expect(etcdSpy.callCount).to.equal(450);
        expect(redisSpy.callCount).to.equal(2);
    });
});