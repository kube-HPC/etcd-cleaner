const moment = require('moment');
const Logger = require('@hkube/logger');
const storeManager = require('../store/store-manager');
const log = Logger.GetLogFromContainer();

const paths = [
    '/webhooks',
    '/jobs/status',
    '/jobs/results',
    '/workers',
    '/executions',
    '/algorithms/queue',
    '/algorithms/builds',
];
class Cleaner {
    init(config) {
        this._objectExpiration = config.objectExpiration;
    }

    async clean() {
        const promises = [];
        const data = await Promise.all(paths.map(p => storeManager.getKeys(p)));
        data.forEach((d) => {
            Object.entries(d).forEach(([k, v]) => {
                const obj = this._tryParseValue(v);
                const timestamp = obj.timestamp || obj.startTime || 0;
                if (moment(timestamp).isBefore(moment().subtract(this._objectExpiration, 'days'))) {
                    promises.push(storeManager.deleteKey(k));
                }
            });
        });

        const res = await Promise.all(promises);
        log.info(`deleted ${res.length} keys`);
    }

    _tryParseValue(json) {
        let parsed;
        try {
            parsed = JSON.parse(json);
        }
        catch (e) {
            parsed = null;
        }
        return parsed || {};
    }
}

module.exports = new Cleaner();
