import reducer, { initialState } from '$shared/modules/user/reducer'
import * as constants from '$shared/modules/user/constants'

describe('user - reducer', () => {
    it('has initial state', () => {
        expect(reducer(undefined, {})).toStrictEqual({
            ...initialState,
            fetchingUserData: true,
        })
    })

    describe('USER_DATA', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                fetchingUserData: true,
            }

            expect(reducer(undefined, {
                type: constants.USER_DATA_REQUEST,
                payload: {},
            })).toStrictEqual(expectedState)
        })

        it('handles success', () => {
            const user = {
                name: 'Tester1',
                username: 'tester1@streamr.com',
            }

            const expectedState = {
                ...initialState,
                user,
                fetchingUserData: false,
            }

            expect(reducer(undefined, {
                type: constants.USER_DATA_SUCCESS,
                payload: {
                    user,
                },
            })).toStrictEqual(expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                user: null,
                fetchingUserData: false,
                userDataError: error,
            }

            expect(reducer(undefined, {
                type: constants.USER_DATA_FAILURE,
                payload: {
                    error,
                },
            })).toStrictEqual(expectedState)
        })

        it('resets current user when fetch fails', () => {
            const user = {
                name: 'Tester1',
                username: 'tester1@streamr.com',
            }

            const expectedState1 = {
                ...initialState,
                user,
                fetchingUserData: false,
            }

            expect(reducer(undefined, {
                type: constants.USER_DATA_SUCCESS,
                payload: {
                    user,
                },
            })).toStrictEqual(expectedState1)

            const error = new Error('Test')
            const expectedState2 = {
                ...initialState,
                user: null,
                fetchingUserData: false,
                userDataError: error,
            }

            expect(reducer(undefined, {
                type: constants.USER_DATA_FAILURE,
                payload: {
                    error,
                },
            })).toStrictEqual(expectedState2)
        })
    })

    describe('UPDATE_CURRENT_USER', () => {
        it('should update the user on UPDATE_CURRENT_USER', () => {
            expect(reducer({
                some: 'state',
                user: {
                    name: 'test',
                    email: 'test2',
                },
            }, {
                type: constants.UPDATE_CURRENT_USER,
                payload: {
                    user: {
                        email: 'test3',
                    },
                },
            })).toStrictEqual({
                some: 'state',
                saved: false,
                user: {
                    name: 'test',
                    email: 'test3',
                },
            })
        })
        it('should add the user if currentUser === null', () => {
            expect(reducer({
                some: 'state',
                user: null,
            }, {
                type: constants.UPDATE_CURRENT_USER,
                payload: {
                    user: {
                        name: 'test',
                        email: 'test3',
                    },
                },
            })).toStrictEqual({
                some: 'state',
                saved: false,
                user: {
                    name: 'test',
                    email: 'test3',
                },
            })
        })
    })

    describe('SAVE_CURRENT_USER', () => {
        it('should set fetching = true on SAVE_CURRENT_USER_REQUEST', () => {
            expect(reducer({
                some: 'state',
            }, {
                type: constants.SAVE_CURRENT_USER_REQUEST,
            })).toStrictEqual({
                some: 'state',
                fetchingUserData: true,
            })
        })

        it('should set the user as currentUser on SAVE_CURRENT_USER_SUCCESS', () => {
            expect(reducer({
                some: 'state',
            }, {
                type: constants.SAVE_CURRENT_USER_SUCCESS,
                payload: {
                    user: {
                        just: 'someField',
                    },
                },
            })).toStrictEqual({
                some: 'state',
                user: {
                    just: 'someField',
                },
                fetchingUserData: false,
                userDataError: null,
                saved: true,
            })
        })

        it('should handle the error on SAVE_CURRENT_USER_FAILURE', () => {
            expect(reducer({
                some: 'field',
            }, {
                type: constants.SAVE_CURRENT_USER_FAILURE,
                payload: {
                    error: new Error('test-error'),
                },
            })).toStrictEqual({
                some: 'field',
                fetchingUserData: false,
                userDataError: new Error('test-error'),
            })
        })
    })
})
