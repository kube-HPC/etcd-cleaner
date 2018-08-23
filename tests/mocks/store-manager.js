const moment = require('moment');
class StateManager {
    async init(options) {
    }

    getKeys(path) {
        switch (path) {
            case "/webhooks":
                let webhooks = require('./webhooks.json');
                webhooks[0].value.timestamp = new Date();
                webhooks[1].value.timestamp = new Date(2018, 1, 1, 10, 33, 30, 0);;
                return webhooks
            case "/jobStatus":
                let jobStatus = require('./jobStatus.json');
                jobStatus[0].value.timestamp = new Date();
                jobStatus[1].value.timestamp = new Date(2018, 1, 2, 10, 33, 30, 0);;
                return jobStatus
            case "/jobResults":
                let jobResults = require('./jobResults.json');
                jobResults[0].value.timestamp = new Date();
                jobResults[1].value.timestamp = new Date(2018, 1, 3, 10, 33, 30, 0);;
                return jobResults
        }
    }

    delete(key) {
        console.log(key);
    }
}

module.exports = new StateManager();
