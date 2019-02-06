import React from 'react'
import cx from 'classnames'

import ModuleSubscription from '../ModuleSubscription'
import styles from './Label.pcss'

export default class CommentModule extends React.Component {
    state = {
        value: '',
    }

    onMessage = ({ value }) => {
        this.setState({
            value,
        })
    }

    render() {
        return (
            <div className={cx(this.props.className, styles.Label)}>
                <ModuleSubscription
                    {...this.props}
                    onMessage={this.onMessage}
                    ref={this.subscription}
                    loadOptions={ModuleSubscription.loadJSON}
                />
                {this.state.value}
            </div>
        )
    }
}
