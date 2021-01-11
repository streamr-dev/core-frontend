import { GET, EDIT, SUBSCRIBE } from '../operations'
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
        const permissions = [{
            id: 1,
            operation: 'stream_get',
            user: 'FOO',
        }, {
            id: 2,
            operation: 'stream_edit',
            user: 'FOO',
        }, {
            id: 3,
            operation: 'stream_get',
            anonymous: true,
        }]

        const state = r({
            changeset: {},
        }, {
            type: SET_PERMISSIONS,
            permissions,
        })

        expect(state.raw).toBe(permissions)

        expect(state.combinations).toEqual({
            FOO: GET + EDIT,
            anonymous: GET,
        })

        expect(state.changeset).toEqual({})
    })

    it('re-applies current changeset', () => {
        const permissions = [{
            id: 1,
            operation: 'stream_get',
            user: 'FOO',
        }, {
            id: 2,
            operation: 'stream_edit',
            user: 'FOO',
        }, {
            id: 3,
            operation: 'stream_get',
            anonymous: true,
        }]

        const state = r({
            changeset: {
                FOO: GET + EDIT,
                BAR: GET,
                anonymous: GET,
            },
        }, {
            type: SET_PERMISSIONS,
            permissions,
        })

        expect(state.raw).toBe(permissions)

        expect(state.combinations).toEqual({
            FOO: GET + EDIT,
            anonymous: GET,
        })

        expect(state.changeset).toEqual({
            BAR: GET,
        })

        expect(({}).hasOwnProperty.call(state.changeset, 'FOO')).toBe(false)

        expect(({}).hasOwnProperty.call(state.changeset, 'anonymous')).toBe(false)
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
                FOO: GET,
            },
        }

        expect(r(state, {
            type: ADD_PERMISSION,
            user: 'FOO',
        })).toBe(state)
    })

    it('does not overwrite unchanged existing combination', () => {
        const state = {
            changeset: {},
            combinations: {
                FOO: GET,
            },
        }

        expect(r(state, {
            type: ADD_PERMISSION,
            user: 'FOO',

        })).toBe(state)
    })

    it('adds new combination if the old one was removed', () => {
        expect(r({
            changeset: {
                FOO: undefined,
            },
            combinations: {
                FOO: GET,
            },
            resourceType: 'STREAM',
        }, {
            type: ADD_PERMISSION,
            user: 'FOO',
        })).toEqual({
            changeset: {
                FOO: GET + SUBSCRIBE,
            },
            combinations: {
                FOO: GET,
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
                FOO: GET + SUBSCRIBE,
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
            user: 'FOO',
            value: GET + EDIT,
        })).toEqual({
            changeset: {
                FOO: GET + EDIT,
            },
            combinations: {},
        })
    })

    it('changes existing changeset combination', () => {
        expect(r({
            changeset: {
                FOO: EDIT,
            },
            combinations: {},
        }, {
            type: UPDATE_PERMISSION,
            user: 'FOO',
            value: GET + SUBSCRIBE,
        })).toEqual({
            changeset: {
                FOO: GET + SUBSCRIBE,
            },
            combinations: {},
        })
    })

    it('does not store changeset combination equal to one of loaded combinations', () => {
        const newState = r({
            changeset: {},
            combinations: {
                FOO: GET,
            },
        }, {
            type: UPDATE_PERMISSION,
            user: 'FOO',
            value: GET,
        })

        expect(newState).toEqual({
            changeset: {},
            combinations: {
                FOO: GET,
            },
        })

        expect(({}).hasOwnProperty.call(newState.changeset, 'FOO')).toBe(false)
    })

    describe('undefined/null value', () => {
        it('drops changeset combination entirely if user does not exist in loaded combinations', () => {
            const newState = r({
                changeset: {
                    FOO: GET,
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

            expect(({}).hasOwnProperty.call(newState.changeset, 'FOO')).toBe(false)
        })

        it('sets changeset to undefined if user exists in loaded combinations', () => {
            const newState = r({
                changeset: {},
                combinations: {
                    FOO: GET,
                },
            }, {
                type: UPDATE_PERMISSION,
                user: 'FOO',
                value: undefined,
            })

            expect(newState).toEqual({
                changeset: {
                    FOO: undefined,
                },
                combinations: {
                    FOO: GET,
                },
            })

            expect(({}).hasOwnProperty.call(newState.changeset, 'FOO')).toBe(true)
        })
    })
})
