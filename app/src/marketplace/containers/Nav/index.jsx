// @flow

import { connect } from 'react-redux'
import Nav from '../../components/Nav'
import { selectUserData } from '../../modules/user/selectors'
import type { User } from '../../flowtype/user-types'

type StateProps = {
    currentUser: ?User,
}

const mapStateToProps = (state): StateProps => ({
    currentUser: selectUserData(state),
})

export default connect(mapStateToProps)(Nav)
