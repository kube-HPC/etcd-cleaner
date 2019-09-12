const Etcd = require('@hkube/etcd');

class StateManager {
    async init(options) {
        this._etcd = new Etcd({ ...options.etcd, serviceName: options.serviceName });
    }

    getKeys(path) {
        return this._etcd._client.getByQuery(path, { limit: 50, sort: 'asc' });
    }

    deleteKey(path) {
        return this._etcd._client.delete(path);
    }
}

module.exports = new StateManager();
