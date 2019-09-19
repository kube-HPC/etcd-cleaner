const moment = require('moment');

const shouldDelete = (timestamp, days) => {
    return moment(timestamp).isBefore(moment().subtract(days, 'days'));
};

module.exports = { shouldDelete };
