// @flow

import { connect } from 'react-redux'
import Nav from '../../components/Nav'
import { selectUserData } from '$shared/modules/user/selectors'
import type { User } from '$shared/flowtype/user-types'

type StateProps = {
    currentUser: ?User,
}

const mapStateToProps = (state): StateProps => ({
    currentUser: selectUserData(state),
})

export default connect(mapStateToProps)(Nav)
