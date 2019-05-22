const moment = require('moment');
class StateManager {
    async init(options) {
    }

    getKeys(path) {
        switch (path) {
            case "/webhooks":
                let webhooks = require('./webhooks.json');
                webhooks[0].timestamp = new Date();
                webhooks[1].timestamp = new Date(2018, 1, 1, 10, 33, 30, 0);;
                return webhooks.map(j => JSON.stringify(j));
            case "/jobs/status":
                let jobStatus = require('./jobStatus.json');
                jobStatus[0].timestamp = new Date();
                jobStatus[1].timestamp = new Date(2018, 1, 2, 10, 33, 30, 0);;
                return jobStatus.map(j => JSON.stringify(j));
            case "/jobs/results":
                let jobResults = require('./jobResults.json');
                jobResults[0].timestamp = new Date();
                jobResults[1].timestamp = new Date(2018, 1, 3, 10, 33, 30, 0);;
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
