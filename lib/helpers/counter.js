const log = require('@hkube/logger').GetLogFromContainer();


const add = (counter, key, paths) => {
    const path = paths.find(p => key.startsWith(p));
    counter[path] = (counter[path] || 0) + 1; //eslint-disable-line
};

const print = (counter, source) => {
    if (Object.keys(counter).length === 0) {
        log.info('there are no deleted keys', { component: source });
    }
    else {
        Object.entries(counter).forEach(([k, v]) => {
            log.info(`${k} deleted ${v} keys`, { component: source });
        });
    }
};

module.exports = {
    add,
    print
};
