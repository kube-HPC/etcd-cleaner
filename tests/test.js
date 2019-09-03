const chai = require('chai');
const { expect } = chai;
const mockery = require('mockery');
const sinon = require('sinon');
const etcdMock = require('./mocks/etcd-store');
const redisMock = require('./mocks/redis-store');

describe('dummy test', () => {
    before(async () => {
        mockery.enable({
            useCleanCache: false,
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerSubstitute('../store/etcd', `${process.cwd()}/tests/mocks/etcd-store.js`);
        mockery.registerSubstitute('../store/redis', `${process.cwd()}/tests/mocks/redis-store.js`);
    });
    it('clean objects', async () => {
        const etcdSpy = sinon.spy(etcdMock, "deleteKey");
        const redisSpy = sinon.spy(redisMock, "deleteKey");
        const bootstrap = require('../bootstrap');
        await bootstrap.init();
        expect(etcdSpy.callCount).to.equal(3);
        expect(redisSpy.callCount).to.equal(1);
    });
});