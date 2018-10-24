// @flow

import { connect } from 'react-redux'
import Nav from '../../components/Nav'
import { selectUserData } from '$shared/modules/user/selectors'
import { logout } from '$shared/modules/user/actions'
import type { User } from '$shared/flowtype/user-types'

type StateProps = {
    currentUser: ?User,
}

type DispatchProps = {
    logout: () => void,
}

const mapStateToProps = (state): StateProps => ({
    currentUser: selectUserData(state),
})

const mapDispatchToProps = (dispatch): DispatchProps => ({
    logout: () => dispatch(logout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
