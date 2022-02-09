import address0 from '$utils/address0'
import { EDIT, PUBLISH, SUBSCRIBE } from '../operations'
import r, {
    ADD_PERMISSION,
    PERSIST,
    SET_PERMISSIONS,
    SET_RESOURCE,
    UPDATE_PERMISSION,
} from './reducer'

describe('SET_PERMISSIONS', () => {
    it('unlocks state', () => {
        const state = r({
            locked: true,
            changeset: {},
        }, {
            type: SET_PERMISSIONS,
            permissions: [],
        })

        expect(state.locked).toBe(false)
    })

    it('sets raw permissions; combines', () => {
        const permissions = {
            [address0]: ['canSubscribe'],
            FOO: ['canSubscribe', 'canEdit'],
        }

        const state = r({
            changeset: {},
        }, {
            type: SET_PERMISSIONS,
            permissions,
        })

        expect(state.raw).toBe(permissions)

        expect(state.combinations).toEqual({
            [address0]: SUBSCRIBE,
            foo: SUBSCRIBE + EDIT,
        })

        expect(state.changeset).toEqual({})
    })

    it('re-applies current changeset', () => {
        const permissions = {
            [address0]: ['canSubscribe'],
            FOO: ['canSubscribe', 'canEdit'],
        }

        const state = r({
            changeset: {
                [address0]: SUBSCRIBE,
                bar: SUBSCRIBE,
                foo: SUBSCRIBE + EDIT,
            },
        }, {
            type: SET_PERMISSIONS,
            permissions,
        })

        expect(state.raw).toBe(permissions)

        expect(state.combinations).toEqual({
            [address0]: SUBSCRIBE,
            foo: SUBSCRIBE + EDIT,
        })

        expect(state.changeset).toEqual({
            bar: SUBSCRIBE,
        })

        expect(({}).hasOwnProperty.call(state.changeset, 'foo')).toBe(false)

        expect(({}).hasOwnProperty.call(state.changeset, address0)).toBe(false)
    })

    it('does not re-list empty permissions', () => {
        const newState = r({
            changeset: {
                foo: undefined,
            },
        }, {
            type: SET_PERMISSIONS,
            permissions: {
                FOO: [],
            },
        })

        expect(newState.changeset).toEqual({})

        expect(newState.combinations).toEqual({})
    })
})

describe('SET_RESOURCE', () => {
    it('updates resource type and id', () => {
        const state = {}

        const newState = r(state, {
            type: SET_RESOURCE,
            resourceType: 'TYPE',
            resourceId: 'ID',
        })

        expect(newState).not.toBe(state)

        expect(newState.resourceType).toBe('TYPE')

        expect(newState.resourceId).toBe('ID')
    })

    it('does not touch the state if resource type and id have not changes', () => {
        const state = {
            resourceType: 'TYPE',
            resourceId: 'ID',
        }

        expect(r(state, {
            resourceType: 'TYPE',
            resourceId: 'ID',
        })).toBe(state)
    })
})

describe('ADD_PERMISSION', () => {
    it('does not touch locked state', () => {
        const state = {
            locked: true,
        }

        expect(r(state, {
            type: ADD_PERMISSION,
        })).toBe(state)
    })

    it('does not overwrite recent changes', () => {
        const state = {
            changeset: {
                foo: SUBSCRIBE,
            },
        }

        expect(r(state, {
            type: ADD_PERMISSION,
            user: 'FOO',
        })).toBe(state)

        expect(r(state, {
            type: ADD_PERMISSION,
            user: 'foo',
        })).toBe(state)
    })

    it('does not overwrite unchanged existing combination', () => {
        const state = {
            changeset: {},
            combinations: {
                FOO: SUBSCRIBE,
            },
        }

        expect(r(state, {
            type: ADD_PERMISSION,
            user: 'FOO',
        })).toBe(state)

        expect(r(state, {
            type: ADD_PERMISSION,
            user: 'foo',
        })).toBe(state)
    })

    it('reverts removed permissions', () => {
        expect(r({
            changeset: {
                foo: undefined,
            },
            combinations: {
                foo: SUBSCRIBE,
            },
            resourceType: 'STREAM',
        }, {
            type: ADD_PERMISSION,
            user: 'FOO',
        })).toEqual({
            changeset: {}, // changeset == combinations? abandon.
            combinations: {
                foo: SUBSCRIBE,
            },
            resourceType: 'STREAM',
        })

        expect(r({
            changeset: {
                foo: undefined,
            },
            combinations: {
                foo: SUBSCRIBE,
            },
            resourceType: 'STREAM',
        }, {
            type: ADD_PERMISSION,
            user: 'foo',
        })).toEqual({
            changeset: {}, // changeset == combinations? abandon.
            combinations: {
                foo: SUBSCRIBE,
            },
            resourceType: 'STREAM',
        })
    })

    it('adds new combination', () => {
        expect(r({
            changeset: {},
            combinations: {},
            resourceType: 'STREAM',
        }, {
            type: ADD_PERMISSION,
            user: 'FOO',
        })).toEqual({
            changeset: {
                foo: SUBSCRIBE,
            },
            combinations: {},
            resourceType: 'STREAM',
        })
    })
})

describe('PERSIST', () => {
    it('locks the state', () => {
        expect(r({}, {
            type: PERSIST,
        })).toEqual({
            locked: true,
        })
    })

    it('does not touch locked state', () => {
        const state = {
            locked: true,
        }

        expect(r(state, {
            type: PERSIST,
        })).toBe(state)
    })
})

describe('UPDATE_PERMISSION', () => {
    it('does not touch locked state', () => {
        const state = {
            locked: true,
        }

        expect(r(state, {
            type: UPDATE_PERMISSION,
        })).toBe(state)
    })

    it('adds new user combination to changeset', () => {
        expect(r({
            changeset: {},
            combinations: {},
        }, {
            type: UPDATE_PERMISSION,
            user: 'foo',
            value: PUBLISH + EDIT,
        })).toEqual({
            changeset: {
                foo: PUBLISH + EDIT,
            },
            combinations: {},
        })

        expect(r({
            changeset: {},
            combinations: {},
        }, {
            type: UPDATE_PERMISSION,
            user: 'FOO',
            value: PUBLISH + EDIT,
        })).toEqual({
            changeset: {
                foo: PUBLISH + EDIT,
            },
            combinations: {},
        })
    })

    it('changes existing changeset combination', () => {
        expect(r({
            changeset: {
                foo: EDIT,
            },
            combinations: {},
        }, {
            type: UPDATE_PERMISSION,
            user: 'FOO',
            value: PUBLISH + SUBSCRIBE,
        })).toEqual({
            changeset: {
                foo: PUBLISH + SUBSCRIBE,
            },
            combinations: {},
        })

        expect(r({
            changeset: {
                foo: EDIT,
            },
            combinations: {},
        }, {
            type: UPDATE_PERMISSION,
            user: 'foo',
            value: PUBLISH + SUBSCRIBE,
        })).toEqual({
            changeset: {
                foo: PUBLISH + SUBSCRIBE,
            },
            combinations: {},
        })
    })

    it('does not store changeset combination equal to one of loaded combinations', () => {
        let newState = r({
            changeset: {},
            combinations: {
                foo: PUBLISH,
            },
        }, {
            type: UPDATE_PERMISSION,
            user: 'FOO',
            value: PUBLISH,
        })

        expect(newState).toEqual({
            changeset: {},
            combinations: {
                foo: PUBLISH,
            },
        })

        expect(({}).hasOwnProperty.call(newState.changeset, 'foo')).toBe(false)

        newState = r({
            changeset: {},
            combinations: {
                foo: PUBLISH,
            },
        }, {
            type: UPDATE_PERMISSION,
            user: 'foo',
            value: PUBLISH,
        })

        expect(newState).toEqual({
            changeset: {},
            combinations: {
                foo: PUBLISH,
            },
        })

        expect(({}).hasOwnProperty.call(newState.changeset, 'foo')).toBe(false)
    })

    describe('undefined/null value', () => {
        it('drops changeset combination entirely if user does not exist in loaded combinations', () => {
            let newState = r({
                changeset: {
                    foo: PUBLISH,
                },
                combinations: {},
            }, {
                type: UPDATE_PERMISSION,
                user: 'FOO',
                value: undefined,
            })

            expect(newState).toEqual({
                changeset: {},
                combinations: {},
            })

            expect(({}).hasOwnProperty.call(newState.changeset, 'foo')).toBe(false)

            newState = r({
                changeset: {
                    foo: PUBLISH,
                },
                combinations: {},
            }, {
                type: UPDATE_PERMISSION,
                user: 'foo',
                value: undefined,
            })

            expect(newState).toEqual({
                changeset: {},
                combinations: {},
            })

            expect(({}).hasOwnProperty.call(newState.changeset, 'foo')).toBe(false)
        })

        it('sets changeset to undefined if user exists in loaded combinations', () => {
            let newState = r({
                changeset: {},
                combinations: {
                    foo: PUBLISH,
                },
            }, {
                type: UPDATE_PERMISSION,
                user: 'FOO',
                value: undefined,
            })

            expect(newState).toEqual({
                changeset: {
                    foo: undefined,
                },
                combinations: {
                    foo: PUBLISH,
                },
            })

            expect(({}).hasOwnProperty.call(newState.changeset, 'foo')).toBe(true)

            newState = r({
                changeset: {},
                combinations: {
                    foo: PUBLISH,
                },
            }, {
                type: UPDATE_PERMISSION,
                user: 'foo',
                value: undefined,
            })

            expect(newState).toEqual({
                changeset: {
                    foo: undefined,
                },
                combinations: {
                    foo: PUBLISH,
                },
            })

            expect(({}).hasOwnProperty.call(newState.changeset, 'foo')).toBe(true)
        })
    })
})
