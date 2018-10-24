// @flow

import { connect } from 'react-redux'
import LoginPage from '../../components/LoginPage'
import { endExternalLogin } from '$shared/modules/user/actions'

type StateProps = {
}

type DispatchProps = {
    endExternalLogin: () => void,
}

const mapStateToProps = (): StateProps => ({})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    endExternalLogin: () => dispatch(endExternalLogin()),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
