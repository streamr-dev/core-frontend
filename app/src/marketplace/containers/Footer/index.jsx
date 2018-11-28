// @flow

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'

import Footer from '../../components/Footer'
import withI18n from '$mp/containers/WithI18n'

export type DispatchProps = {
    pushLocation: (string) => void,
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    pushLocation: (location: string) => (
        dispatch(push(location))
    ),
})

export default connect(null, mapDispatchToProps)(withRouter(withI18n(Footer)))
