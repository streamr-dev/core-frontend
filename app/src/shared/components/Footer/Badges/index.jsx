// @flow

import * as React from 'react'
import { Container } from 'reactstrap'
import styles from './badges.pcss'

type Props = {
    children: React.Node,
    perRow: number,
}

const placeholders = (count) => {
    const elements = []
    while (elements.length < count) {
        elements.push(<div key={elements.length} className={styles.placeholder} />)
    }
    return elements
}

const Badges = ({ children, perRow }: Props) => (
    <Container>
        <div className={styles.badges}>
            <div className={styles.inner}>
                {React.Children.map(children, (child, index) => [
                    index !== 0 && index % perRow === 0 && <div className={styles.break} />,
                    child,
                ])}
                {placeholders(React.Children.count(children) % perRow)}
            </div>
        </div>
    </Container>
)

Badges.defaultProps = {
    perRow: 4,
}

export default Badges
