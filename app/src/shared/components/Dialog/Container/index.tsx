import React, {ReactNode} from 'react'
import cx from 'classnames'
import styles from './container.pcss'
export type Props = {
    children?: ReactNode
    className?: string
}
export const Container = ({ children, className }: Props) => (
    <div className={cx(styles.modalContainer, className)}>{children}</div>
)
export default Container
