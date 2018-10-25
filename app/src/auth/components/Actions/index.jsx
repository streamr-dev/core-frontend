// @flow

import * as React from 'react'
import styles from './actions.pcss'

type Props = {
    children: React.Node,
}

// FIXME(mr): Maybe it's better to do something like Action.styles
//            instead of a stand-alone export? #staticstyles
export { styles }

const Actions = ({ children }: Props) => (
    <div className={styles.root}>
        {React.Children.count(children) === 1 && <span />}
        {children}
    </div>
)

export default Actions
