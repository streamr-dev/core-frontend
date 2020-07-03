// https://github.com/popperjs/popper-core/issues/478#issuecomment-341494703
// eslint-disable-next-line import/no-extraneous-dependencies
const PopperJS = require('popper.js')

class MockedPopperJS {
    static placements = PopperJS.placements;

    constructor() {
        return {
            destroy: () => {},
            scheduleUpdate: () => {},
        }
    }
}

module.exports = MockedPopperJS
