
class StateManager {
    async init(options) {
    }

    getKeys(path) {
        switch (path) {
            case "/pipeline-driver/graph/*":
                return require('./graph.json');
            case "/pipeline-driver/nodes-graph/*":
                return require('./graph-node.json');
            default:
                return [];
        }
    }

    deleteKey(key) {
        console.log(key);
    }
}

module.exports = new StateManager();
