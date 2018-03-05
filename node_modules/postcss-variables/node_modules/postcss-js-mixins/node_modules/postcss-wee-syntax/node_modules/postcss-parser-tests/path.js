var path = require('path');

module.exports = function (name) {
    return path.join(__dirname, 'cases', name);
};
