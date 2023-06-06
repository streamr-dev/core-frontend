import React, { FunctionComponent } from 'react'
import classNames from 'classnames'
import styles from './spinner.pcss'
export type SpinnerSize = 'small' | 'large'
export type SpinnerColor = 'green' | 'white' | 'gray' | 'blue'
type Props = {
    size?: SpinnerSize
    color?: SpinnerColor
    className?: string
    containerClassname?: string
}

const Spinner: FunctionComponent<Props> = ({
    size = 'small',
    color = 'green',
    className,
    containerClassname,
}: Props) => (
    <div className={classNames(styles.container, containerClassname)}>
        <span
            className={classNames(className, styles[size], styles.spinner, styles[color])}
        />
        <span className={styles.screenReaderText}>Loading...</span>
    </div>
)

export default Spinner
