const moment = require('moment');
const Logger = require('@hkube/logger');
const storeManager = require('../store/store-manager');
const log = Logger.GetLogFromContainer();

const paths = [
    '/webhooks',
    '/jobs/status',
    '/jobs/results',
    '/jobs/tasks',
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
        const counter = Object.create(null);
        let deleted = await this.cleanPartial(counter);
        while (deleted > 0) {
            deleted = await this.cleanPartial(counter); // eslint-disable-line no-await-in-loop
        }
        Object.entries(counter).forEach(([k, v]) => {
            log.info(`${k} deleted ${v} keys`);
        });
    }

    async cleanPartial(counter) {
        const promises = [];
        const data = await Promise.all(paths.map(p => storeManager.getKeys(p)));
        data.forEach((d) => {
            Object.entries(d).forEach(([k, v]) => {
                const obj = this._tryParseValue(v);
                const timestamp = obj.timestamp || obj.startTime || obj.endTime || 0;
                if (moment(timestamp).isBefore(moment().subtract(this._objectExpiration, 'days'))) {
                    promises.push(storeManager.deleteKey(k));
                    const path = paths.find(p => k.startsWith(p));
                    // eslint-disable-next-line no-param-reassign
                    counter[path] = (counter[path] || 0) + 1;
                }
            });
        });
        await Promise.all(promises);
        const deleted = promises.length;
        log.info(`deleted ${deleted}`);
        return deleted;
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
