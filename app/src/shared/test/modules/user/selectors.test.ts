import set from 'lodash/fp/set'
import * as all from '$shared/modules/user/selectors'
import { initialState } from '$shared/modules/user/reducer'
import { StoreState } from '$shared/types/store-state'
const state: Partial<StoreState> = {
    user: {
        user: {
            name: 'Tester1',
            username: 'tester1@streamr.com',
            imageUrlLarge: '',
            imageUrlSmall: '',
            email: ''
        },
        fetchingUserData: false,
        userDataError: null,
        deleteUserAccountError: null,
        balances: null,
        deletingUserAccount: false,
        saved: true,
    },
}
describe('user - selectors', () => {
    it('selects user data error', () => {
        expect(all.selectUserDataError(state as StoreState)).toStrictEqual(null)
        const err = new Error()
        const errorState = set('user.userDataError', err, state)
        expect(all.selectUserDataError(errorState as StoreState)).toStrictEqual(err)
    })
    it('selects user data fetching status', () => {
        expect(all.selectFetchingUserData(state as StoreState)).toStrictEqual(false)
    })
    it('selects user data', () => {
        expect(all.selectUserData(state as StoreState)).toStrictEqual(state.user.user)
    })
    describe('isAuthenticating', () => {
        it('gives false on init', () => {
            expect(
                all.isAuthenticating({
                    user: initialState,
                } as any),
            ).toEqual(false)
        })
        it('gives false on success', () => {
            expect(all.isAuthenticating(state as StoreState)).toEqual(false)
        })
        it('gives false on failure', () => {
            let errorState = set('user.user', null, state) as Partial<StoreState>
            errorState = set('user.userDataError', new Error(), errorState)
            expect(all.isAuthenticating(errorState as StoreState)).toEqual(false)
        })
        it('gives true when user data and user data error are blank and fetching is in progress', () => {
            let errorState = set('user.user', null, state) as Partial<StoreState>
            errorState = set('user.userDataError', null, errorState) as Partial<StoreState>
            errorState = set('user.fetchingUserData', true, errorState)
            expect(all.isAuthenticating(errorState as StoreState)).toEqual(true)
        })
    })
})
