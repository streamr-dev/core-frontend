import reducer from '../../../modules/canvas/reducer'
import * as actions from '../../../modules/canvas/actions'

describe('Canvas reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual({
            ids: [],
            error: null,
            fetching: false,
        })
    })

    it('should handle GET_CANVASES', () => {
        expect(reducer({}, {
            type: actions.GET_CANVASES_REQUEST,
        })).toEqual({
            fetching: true,
        })

        expect(reducer({}, {
            type: actions.GET_CANVASES_SUCCESS,
            canvases: [1, 2, 3],
        })).toEqual({
            fetching: false,
            ids: [1, 2, 3],
            error: null,
        })

        expect(reducer({
            list: ['test'],
        }, {
            type: actions.GET_CANVASES_FAILURE,
            error: new Error('test-error'),
        })).toEqual({
            fetching: false,
            list: ['test'],
            error: new Error('test-error'),
        })
    })
})
