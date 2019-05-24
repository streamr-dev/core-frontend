/**
 * Configure analytics data from app state.
 */

import { connect } from 'react-redux'
import { selectUserData } from '$shared/modules/user/selectors'
import * as Sentry from '@sentry/browser'

export const mapStateToProps = (state) => ({
    user: selectUserData(state),
})

function Analytics({ user }) {
    Sentry.configureScope((scope) => {
        scope.setUser(user)
    })
    return null
}

export default connect(mapStateToProps, null)(Analytics)
