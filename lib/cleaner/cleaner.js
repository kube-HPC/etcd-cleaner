const storeManager = require('../store/store-manager');
const moment = require('moment');
const util = require('path');
const Logger = require('@hkube/logger');
const log = Logger.GetLogFromContainer();
const paths = [
    '/webhooks',
    '/jobStatus',
    '/jobResults',
    '/workers',
    '/executions',
    '/algorithmQueue'
];

class Cleaner {
    init(config) {
        this._objectExpiration = config.objectExpiration;
    }

    async clean() {
        const promises = [];
        const data = await Promise.all(paths.map(async p => ({ keys: await storeManager.getKeys(p), path: p })));
        data.forEach(({ keys, path }) => {
            keys.forEach((obj) => {
                const timestamp = obj.value.timestamp || obj.value.startTime || 0;
                if (moment(timestamp).isBefore(moment().subtract(this._objectExpiration, 'days'))) {
                    promises.push(storeManager.deleteKey(this._getPath(path, obj)));
                }
            });
        });

        const res = await Promise.all(promises);
        log.info(`deleted ${res.length} keys`);
    }

    _getPath(path, obj) {
        if (obj.key2) {
            return util.join(path, obj.key, obj.key2);
        }
        return util.join(path, obj.key);
    }
}

module.exports = new Cleaner();
