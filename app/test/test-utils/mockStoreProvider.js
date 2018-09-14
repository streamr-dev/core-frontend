import configureMockStore from 'redux-mock-store' // eslint-disable-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

export default mockStore
