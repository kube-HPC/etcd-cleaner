const { Factory } = require('@hkube/redis-utils');
const { json } = require('../helpers');

class Redis {
    init(config) {
        this._client = Factory.getClient(config.redis);
    }

    async* keysToValues(stream) {
        for await (const chunk of stream) {
            if (!chunk.length) {
                yield {};
            }
            else {
                const result = Object.create(null);
                const values = await this._client.mget(chunk);
                chunk.forEach((k, i) => {
                    const value = values[i];
                    result[k] = json.tryParse(value);
                });
                yield result;
            }
        }
    }

    getKeys(match) {
        const stream = this._client.scanStream({ match });
        return { [Symbol.asyncIterator]: () => this.keysToValues(stream) };
    }

    deleteKey(path) {
        return this._client.del(path);
    }
}

module.exports = new Redis();
