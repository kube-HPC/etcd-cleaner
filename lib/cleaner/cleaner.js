const storeManager = require('../store/store-manager');
const moment = require('moment');
const util = require('path');

const paths = [
    '/webhooks',
    '/jobStatus',
    '/jobResults'
];

class Cleaner {
    init(config) {
        this._objectExpiration = config.objectExpiration;
    }

    async clean() {
        return paths.forEach(async (path) => {
            const keys = await storeManager.getKeys(path);
            Object.entries(keys).forEach(async ([, obj]) => {
                const timestamp = new Date(obj.value.timestamp);
                if (moment(timestamp).isBefore(moment().subtract(this._objectExpiration, 'days'))) {
                    await storeManager.deleteKey(this._getPath(path, obj));
                }
            });
        });
    }

    _getPath(path, obj) {
        if (obj.key2) {
            return util.join(path, obj.key, obj.key2);
        }
        return util.join(path, obj.key);
    }
}

module.exports = new Cleaner();
