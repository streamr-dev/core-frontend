// @flow

import { connect } from 'react-redux'

import { doLogout } from '../../modules/user/actions'
import AccountPage from '../../components/AccountPage'

type DispatchProps = {
    onLogout: () => void,
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    onLogout: () => dispatch(doLogout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage)
