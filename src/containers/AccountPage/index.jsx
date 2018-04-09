// @flow

import React from 'react'
import { connect } from 'react-redux'

import { getUserData, doLogout } from '../../modules/user/actions'
import AccountPageComponent from '../../components/AccountPage'
import type { User } from '../../flowtype/user-types'
import { selectUserData } from '../../modules/user/selectors'
import type { StoreState } from '../../flowtype/store-state'

export type AccountPageTab = 'purchases' | 'products'

type StateProps = {
    user: ?User,
}

type DispatchProps = {
    getUserData: () => void,
    onLogout: () => void,
}

type GivenProps = {
    tab: AccountPageTab, // Given in router
}

type RouterProps = {
    match: {
        params: {
            tab: AccountPageTab
        }
    }
}

type Props = StateProps & DispatchProps & GivenProps & RouterProps

class AccountPage extends React.Component<Props> {
    componentWillMount() {
        this.props.getUserData()
    }

    render() {
        return (
            <AccountPageComponent
                user={this.props.user}
                onLogout={this.props.onLogout}
                tab={this.props.match.params.tab}
            />
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    user: selectUserData(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getUserData: () => dispatch(getUserData()),
    onLogout: () => dispatch(doLogout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage)
