
class StateManager {
    async init(options) {
    }

    getKeys(path) {
        switch (path) {
            case "/webhooks":
                const webhooks = require('./webhooks.json');
                return webhooks.map(j => JSON.stringify(j));
            case "/jobs/status":
                const jobStatus = require('./jobStatus.json');
                return jobStatus.reduce((acc, j) => {
                    acc[j.jobId] = JSON.stringify(j);
                    return acc;
                }, {});
            case "/jobs/results":
                const jobResults = require('./jobResults.json');
                return jobResults.map(j => JSON.stringify(j));
            default:
                return [];
        }
    }

    deleteKey(key) {
        console.log(key);
    }
}

module.exports = new StateManager();
