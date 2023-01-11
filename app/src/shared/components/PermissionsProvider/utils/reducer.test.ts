import address0 from '$utils/address0'
import { Operation } from '../operations'
import r, { ADD_PERMISSION, PERSIST, SET_PERMISSIONS, SET_RESOURCE, UPDATE_PERMISSION } from './reducer'
describe('SET_PERMISSIONS', () => {
    it('unlocks state', () => {
        const state = r(
            {
                locked: true,
                changeset: {},
            },
            {
                type: SET_PERMISSIONS,
                permissions: [],
            },
        )
        expect(state.locked).toBe(false)
    })
    it('sets raw permissions; combines', () => {
        const permissions = [
            {
                public: true,
                permissions: ['subscribe'],
            },
            {
                user: 'FOO',
                permissions: ['subscribe', 'edit'],
            },
        ]
        const state = r(
            {
                changeset: {},
            },
            {
                type: SET_PERMISSIONS,
                permissions,
            },
        )
        expect(state.raw).toBe(permissions)
        expect(state.combinations).toEqual({
            [address0]: Operation.Subscribe,
            foo: Operation.Subscribe | Operation.Edit,
        })
        expect(state.changeset).toEqual({})
    })
    it('re-applies current changeset', () => {
        const permissions = [
            {
                public: true,
                permissions: ['subscribe'],
            },
            {
                user: 'FOO',
                permissions: ['subscribe', 'edit'],
            },
        ]
        const state = r(
            {
                changeset: {
                    [address0]: Operation.Subscribe,
                    bar: Operation.Subscribe,
                    foo: Operation.Subscribe | Operation.Edit,
                },
            },
            {
                type: SET_PERMISSIONS,
                permissions,
            },
        )
        expect(state.raw).toBe(permissions)
        expect(state.combinations).toEqual({
            [address0]: Operation.Subscribe,
            foo: Operation.Subscribe | Operation.Edit,
        })
        expect(state.changeset).toEqual({
            bar: Operation.Subscribe,
        })
        expect({}.hasOwnProperty.call(state.changeset, 'foo')).toBe(false)
        expect({}.hasOwnProperty.call(state.changeset, address0)).toBe(false)
    })
    it('does not re-list empty permissions', () => {
        const newState = r(
            {
                changeset: {
                    foo0: undefined,
                    foo1: 0,
                    foo2: undefined,
                    foo3: 0,
                },
            },
            {
                type: SET_PERMISSIONS,
                permissions: [
                    {
                        user: 'FOO0',
                        permissions: [],
                    },
                    {
                        user: 'Foo1',
                        permissions: [],
                    },
                ],
            },
        )
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
        expect(
            r(state, {
                resourceType: 'TYPE',
                resourceId: 'ID',
            }),
        ).toBe(state)
    })
})
describe('ADD_PERMISSION', () => {
    it('does not touch locked state', () => {
        const state = {
            locked: true,
        }
        expect(
            r(state, {
                type: ADD_PERMISSION,
            }),
        ).toBe(state)
    })
    it('does not overwrite recent changes', () => {
        const state = {
            changeset: {
                foo: Operation.Subscribe,
            },
        }
        expect(
            r(state, {
                type: ADD_PERMISSION,
                user: 'FOO',
            }),
        ).toBe(state)
        expect(
            r(state, {
                type: ADD_PERMISSION,
                user: 'foo',
            }),
        ).toBe(state)
    })
    it('does not overwrite unchanged existing combination', () => {
        const state = {
            changeset: {},
            combinations: {
                FOO: Operation.Subscribe,
            },
        }
        expect(
            r(state, {
                type: ADD_PERMISSION,
                user: 'FOO',
            }),
        ).toBe(state)
        expect(
            r(state, {
                type: ADD_PERMISSION,
                user: 'foo',
            }),
        ).toBe(state)
    })
    it('reverts removed permissions', () => {
        expect(
            r(
                {
                    changeset: {
                        foo: undefined,
                    },
                    combinations: {
                        foo: Operation.Subscribe,
                    },
                    resourceType: 'STREAM',
                },
                {
                    type: ADD_PERMISSION,
                    user: 'FOO',
                },
            ),
        ).toEqual({
            changeset: {},
            // changeset == combinations? abandon.
            combinations: {
                foo: Operation.Subscribe,
            },
            resourceType: 'STREAM',
        })
        expect(
            r(
                {
                    changeset: {
                        foo: undefined,
                    },
                    combinations: {
                        foo: Operation.Subscribe,
                    },
                    resourceType: 'STREAM',
                },
                {
                    type: ADD_PERMISSION,
                    user: 'foo',
                },
            ),
        ).toEqual({
            changeset: {},
            // changeset == combinations? abandon.
            combinations: {
                foo: Operation.Subscribe,
            },
            resourceType: 'STREAM',
        })
    })
    it('adds new combination', () => {
        expect(
            r(
                {
                    changeset: {},
                    combinations: {},
                    resourceType: 'STREAM',
                },
                {
                    type: ADD_PERMISSION,
                    user: 'FOO',
                },
            ),
        ).toEqual({
            changeset: {
                foo: Operation.Subscribe,
            },
            combinations: {},
            resourceType: 'STREAM',
        })
    })
})
describe('PERSIST', () => {
    it('locks the state', () => {
        expect(
            r(
                {},
                {
                    type: PERSIST,
                },
            ),
        ).toEqual({
            locked: true,
        })
    })
    it('does not touch locked state', () => {
        const state = {
            locked: true,
        }
        expect(
            r(state, {
                type: PERSIST,
            }),
        ).toBe(state)
    })
})
describe('UPDATE_PERMISSION', () => {
    it('does not touch locked state', () => {
        const state = {
            locked: true,
        }
        expect(
            r(state, {
                type: UPDATE_PERMISSION,
            }),
        ).toBe(state)
    })
    it('adds new user combination to changeset', () => {
        expect(
            r(
                {
                    changeset: {},
                    combinations: {},
                },
                {
                    type: UPDATE_PERMISSION,
                    user: 'foo',
                    value: Operation.Publish | Operation.Edit,
                },
            ),
        ).toEqual({
            changeset: {
                foo: Operation.Publish | Operation.Edit,
            },
            combinations: {},
        })
        expect(
            r(
                {
                    changeset: {},
                    combinations: {},
                },
                {
                    type: UPDATE_PERMISSION,
                    user: 'FOO',
                    value: Operation.Publish | Operation.Edit,
                },
            ),
        ).toEqual({
            changeset: {
                foo: Operation.Publish | Operation.Edit,
            },
            combinations: {},
        })
    })
    it('changes existing changeset combination', () => {
        expect(
            r(
                {
                    changeset: {
                        foo: Operation.Edit,
                    },
                    combinations: {},
                },
                {
                    type: UPDATE_PERMISSION,
                    user: 'FOO',
                    value: Operation.Publish | Operation.Subscribe,
                },
            ),
        ).toEqual({
            changeset: {
                foo: Operation.Publish | Operation.Subscribe,
            },
            combinations: {},
        })
        expect(
            r(
                {
                    changeset: {
                        foo: Operation.Edit,
                    },
                    combinations: {},
                },
                {
                    type: UPDATE_PERMISSION,
                    user: 'foo',
                    value: Operation.Publish | Operation.Subscribe,
                },
            ),
        ).toEqual({
            changeset: {
                foo: Operation.Publish | Operation.Subscribe,
            },
            combinations: {},
        })
    })
    it('does not store changeset combination equal to one of loaded combinations', () => {
        let newState = r(
            {
                changeset: {},
                combinations: {
                    foo: Operation.Publish,
                },
            },
            {
                type: UPDATE_PERMISSION,
                user: 'FOO',
                value: Operation.Publish,
            },
        )
        expect(newState).toEqual({
            changeset: {},
            combinations: {
                foo: Operation.Publish,
            },
        })
        expect({}.hasOwnProperty.call(newState.changeset, 'foo')).toBe(false)
        newState = r(
            {
                changeset: {},
                combinations: {
                    foo: Operation.Publish,
                },
            },
            {
                type: UPDATE_PERMISSION,
                user: 'foo',
                value: Operation.Publish,
            },
        )
        expect(newState).toEqual({
            changeset: {},
            combinations: {
                foo: Operation.Publish,
            },
        })
        expect({}.hasOwnProperty.call(newState.changeset, 'foo')).toBe(false)
    })
    describe('undefined/null value', () => {
        it('drops changeset combination entirely if user does not exist in loaded combinations', () => {
            let newState = r(
                {
                    changeset: {
                        foo: Operation.Publish,
                    },
                    combinations: {},
                },
                {
                    type: UPDATE_PERMISSION,
                    user: 'FOO',
                    value: undefined,
                },
            )
            expect(newState).toEqual({
                changeset: {},
                combinations: {},
            })
            expect({}.hasOwnProperty.call(newState.changeset, 'foo')).toBe(false)
            newState = r(
                {
                    changeset: {
                        foo: Operation.Publish,
                    },
                    combinations: {},
                },
                {
                    type: UPDATE_PERMISSION,
                    user: 'foo',
                    value: undefined,
                },
            )
            expect(newState).toEqual({
                changeset: {},
                combinations: {},
            })
            expect({}.hasOwnProperty.call(newState.changeset, 'foo')).toBe(false)
        })
        it('sets changeset to undefined if user exists in loaded combinations', () => {
            let newState = r(
                {
                    changeset: {},
                    combinations: {
                        foo: Operation.Publish,
                    },
                },
                {
                    type: UPDATE_PERMISSION,
                    user: 'FOO',
                    value: undefined,
                },
            )
            expect(newState).toEqual({
                changeset: {
                    foo: undefined,
                },
                combinations: {
                    foo: Operation.Publish,
                },
            })
            expect({}.hasOwnProperty.call(newState.changeset, 'foo')).toBe(true)
            newState = r(
                {
                    changeset: {},
                    combinations: {
                        foo: Operation.Publish,
                    },
                },
                {
                    type: UPDATE_PERMISSION,
                    user: 'foo',
                    value: undefined,
                },
            )
            expect(newState).toEqual({
                changeset: {
                    foo: undefined,
                },
                combinations: {
                    foo: Operation.Publish,
                },
            })
            expect({}.hasOwnProperty.call(newState.changeset, 'foo')).toBe(true)
        })
    })
})