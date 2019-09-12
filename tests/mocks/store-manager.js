const moment = require('moment');
let webhooks = require('./webhooks.json');
let jobStatus = require('./jobStatus.json');
let jobResults = require('./jobResults.json');
class StateManager {
    async init(options) {
        this._deleted = {};
        webhooks[0].timestamp = Date.now();
        webhooks[1].timestamp = new Date(2018, 1, 1, 10, 33, 30, 0).getTime();
        webhooks = [...webhooks, ...Array.from(Array(200)).map(j => ({ ...(webhooks[1]) })), ...Array.from(Array(200)).map(j => ({ ...(webhooks[0]) }))];
    }

    getKeys(path) {
        switch (path) {
            case "/webhooks":
                return webhooks.map((j, i) => ({ ...j, i }))
                .filter(j => !this._deleted[`/jobs/results/${j.i}`])
                .sort((a,b)=>a-b)
                .reduce((prev, cur) => {
                    prev[`/webhooks/${cur.i}`] = JSON.stringify(cur);
                    return prev;
                }, {});
                // return webhooks
                //     .map((j, i) => ({ ...j, i ,key: `/jobs/results/${i}`}))
                //     .filter(j => !this._deleted[j.key])
                    
            case "/jobs/status":
                jobStatus[0].timestamp = new Date();
                jobStatus[1].timestamp = new Date(2018, 1, 2, 10, 33, 30, 0);
                return jobStatus.map((j, i) => ({ ...j, i })).filter(j => !this._deleted[`/jobs/results/${j.i}`]).reduce((prev, cur) => {
                    prev[`/jobs/status/${cur.i}`] = JSON.stringify(cur);
                    return prev;
                }, {});
            case "/jobs/results":
                jobResults[0].timestamp = new Date();
                jobResults[1].timestamp = new Date(2018, 1, 3, 10, 33, 30, 0);
                return jobStatus.map((j, i) => ({ ...j, i })).filter(j => !this._deleted[`/jobs/results/${j.i}`]).reduce((prev, cur) => {
                    prev[`/jobs/results/${cur.i}`] = JSON.stringify(cur);
                    return prev;
                }, {});
            default:
                return [];
        }
    }

    deleteKey(key) {
        this._deleted[key] = true;
        console.log(key);
    }
}

module.exports = new StateManager();
