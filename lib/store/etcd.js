const Etcd = require('@hkube/etcd');
const log = require('@hkube/logger').GetLogFromContainer();

class StateManager {
    init(options) {
        this._etcd = new Etcd({ ...options.etcd, serviceName: options.serviceName });
    }

    async getKeys(path) {
        try {
            const ret = await this._etcd._client.getByQuery(path, { limit: 10000, sort: 'asc' });
            return ret;
        }
        catch (error) {
            log.warning(`error getting path ${path} from etcd. Error: ${error.message}`);
            return {};
        }
    }

    deleteKey(path) {
        return this._etcd._client.delete(path);
    }
}

module.exports = new StateManager();
