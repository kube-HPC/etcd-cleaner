const Etcd = require('@hkube/etcd');

class StateManager {
    init(options) {
        this._etcd = new Etcd({ ...options.etcd, serviceName: options.serviceName });
    }

    getKeys(path) {
        return this._etcd._client.getByQuery(path, { limit: 1000, sort: 'asc' });
    }

    deleteKey(path) {
        return this._etcd._client.delete(path);
    }
}

module.exports = new StateManager();
