// @flow

import React, { type ComponentType } from 'react'

import Calendar from '$shared/components/Calendar'
import styles from './withCalendar.pcss'

export type Props = {
    closeOnChange?: boolean,
    disabled?: boolean,
    openOnFocus?: boolean,
}

type State = {
    open: boolean,
    date: Date,
}

const withCalendar = (WrappedComponent: ComponentType<any>) => {
    class WithCalendar extends React.Component<Props, State> {
        static defaultProps = {
            closeOnChange: true,
            disabled: false,
            openOnFocus: false,
        }

        state = {
            open: false,
            date: new Date(),
        }

        componentDidMount() {
            document.addEventListener('focus', this.onFocus, true)
            document.addEventListener('mousedown', this.onMouseDown)
        }

        componentWillUnmount() {
            document.removeEventListener('focus', this.onFocus, true)
            document.removeEventListener('mousedown', this.onMouseDown)
        }

        onFocus = () => {
            const { root } = this
            const { openOnFocus } = this.props
            const { open } = this.state
            const { activeElement } = document

            if (root) {
                if (!open && openOnFocus && root.contains(activeElement)) {
                    this.toggle(true)
                    return
                }
                if (!root.contains(activeElement)) {
                    this.toggle(false)
                }
            }
        }

        onMouseDown = (e: MouseEvent) => {
            const { root } = this
            const { target } = e

            if (root && (root === target || (target instanceof Node && !root.contains(target)))) {
                this.toggle(false)
            }
        }

        setDate = (date: Date) => {
            const { closeOnChange } = this.props

            this.setState({
                date,
            })

            if (closeOnChange) {
                setTimeout(() => {
                    this.toggle(false)
                }, 0)
            }
        }

        setRoot = (root: ?HTMLDivElement) => {
            this.root = root
        }

        root: ?HTMLDivElement

        toggle = (open?: boolean) => {
            this.setState((state) => ({
                open: typeof open === 'boolean' ? open : !state.open,
            }))
        }

        render() {
            const { date, open } = this.state
            const { openOnFocus, closeOnChange, disabled, ...props } = this.props

            return (
                <div ref={this.setRoot}>
                    <WrappedComponent
                        {...props}
                        date={date}
                        toggleCalendar={this.toggle}
                    />
                    {!disabled && open && (
                        <div className={styles.wrapper}>
                            <Calendar
                                value={date}
                                onChange={this.setDate}
                            />
                        </div>
                    )}
                </div>
            )
        }
    }

    return WithCalendar
}

export default withCalendar
