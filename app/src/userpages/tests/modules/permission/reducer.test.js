import assert from 'assert-diff'
import reducer from '../../../modules/permission/reducer'
import * as actions from '../../../modules/permission/actions'

describe('Permission reducer', () => {
    it('should return the initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), {
            byTypeAndId: {},
            error: null,
            fetching: false,
        })
    })

    describe('GET_RESOURCE_PERMISSIONS', () => {
        it('should set fetching = true on GET_RESOURCE_PERMISSIONS_REQUEST', () => {
            assert.deepStrictEqual(reducer(undefined, {
                type: actions.GET_RESOURCE_PERMISSIONS_REQUEST,
            }), {
                fetching: true,
                error: null,
                byTypeAndId: {},
            })
        })

        it('should add the permission to the resource on GET_RESOURCE_PERMISSIONS_SUCCESS', () => {
            assert.deepStrictEqual(reducer({
                byTypeAndId: {},
            }, {
                type: actions.GET_RESOURCE_PERMISSIONS_SUCCESS,
                resourceId: 'testResourceId',
                resourceType: 'testResourceType',
                permissions: [{
                    operation: 'test',
                }, {
                    operation: 'test2',
                }],
            }), {
                byTypeAndId: {
                    testResourceType: {
                        testResourceId: ['test', 'test2'],
                    },
                },
                fetching: false,
                error: null,
            })
        })

        it('should handle the error on GET_RESOURCE_PERMISSIONS_FAILURE', () => {
            assert.deepStrictEqual(reducer(undefined, {
                type: actions.GET_RESOURCE_PERMISSIONS_FAILURE,
                error: new Error('test-error'),
                resourceId: 'testResourceId',
                resourceType: 'testResourceType',
            }), {
                fetching: false,
                error: new Error('test-error'),
                byTypeAndId: {
                    testResourceType: {
                        testResourceId: [],
                    },
                },
            })
        })
    })
})
