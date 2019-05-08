// @flow

import React from 'react'
import styles from './initials.pcss'

type Props = {
    children: string,
}

const Initials = ({ children }: Props) => (
    <div className={styles.root}>
        <svg
            viewBox="0 0 1 1"
            xmlns="http://www.w3.org/2000/svg"
        />
        <div className={styles.value}>
            {children}
        </div>
    </div>
)

export default Initials
