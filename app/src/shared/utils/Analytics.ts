/**
 * Configure analytics data from app state.
 */
import { connect } from 'react-redux'
import * as Sentry from '@sentry/browser'
import { selectUserData } from '$shared/modules/user/selectors'
import { User } from "$shared/types/user-types"
import { StoreState } from "$shared/types/store-state"

export const mapStateToProps = (state: StoreState): {user: User} => ({
    user: selectUserData(state),
})

function Analytics({ user }: {user: User}): null {
    Sentry.configureScope((scope) => {
        scope.setUser({...user, id: String(user.id)})
    })
    return null
}

export default connect(mapStateToProps, null)(Analytics)
