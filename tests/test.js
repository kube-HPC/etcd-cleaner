const chai = require('chai');
const { expect } = chai;
const mockery = require('mockery');
const sinon = require('sinon');

describe('dummy test', () => {
    before(async () => {
        mockery.enable({
            useCleanCache: false,
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerSubstitute('../store/store-manager', `${process.cwd()}/tests/mocks/store-manager.js`);
        mockery.registerSubstitute('./lib/store/store-manager', `${process.cwd()}/tests/mocks/store-manager.js`);
    });
    it('clean objects', async () => {
        const bootstrap = require('../bootstrap');
        await bootstrap.init();
        const cleaner = require('../lib/cleaner/cleaner');
        await cleaner.clean();
    });
});