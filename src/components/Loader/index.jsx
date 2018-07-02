import React from 'react'
import { connect } from 'react-redux'
import { getCurrentUser } from '../../modules/user/actions'

export default connect(null, {
    load() {
        return getCurrentUser()
    },
})(class Loader extends React.Component {
    componentDidMount() {
        this.props.load()
    }

    render() {
        return null
    }
})
