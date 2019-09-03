const { Factory } = require('@hkube/redis-utils');
const { json } = require('../helpers');

class Redis {
    init(config) {
        this._client = Factory.getClient(config.redis);
    }

    getKeys(match, count = 100) {
        return new Promise((resolve) => {
            const stream = this._client.scanStream({ match, count });
            const keys = [];
            stream.on('data', (k) => {
                keys.push(...k);
            });
            stream.on('end', async () => {
                const result = Object.create(null);
                if (keys.length > 0) {
                    const values = await this._client.mget(keys);
                    keys.forEach((k, i) => {
                        const value = values[i];
                        result[k] = json.tryParse(value);
                    });
                }
                resolve(result);
            });
        });
    }

    deleteKey(path) {
        return this._client._client.delete(path);
    }
}

module.exports = new Redis();
