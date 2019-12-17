// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import Calendar from '$shared/components/Calendar'
import { type Ref } from '$shared/flowtype/common-types'
import styles from './withCalendar.pcss'

export type WithCalendarProps = {
    onChange?: (Date) => void,
    closeOnSelect?: boolean,
    disabled?: boolean,
    openOnFocus?: boolean,
    className?: string,
    wrapperClassname?: string,
}

type Props = WithCalendarProps & {
    children: any,
    date?: Date,
}

type State = {
    open: boolean,
    date: ?Date,
}

class WithCalendar extends React.Component<Props, State> {
    static defaultProps = {
        closeOnSelect: true,
        disabled: false,
        openOnFocus: false,
    }

    state = {
        open: false,
        date: undefined,
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
        const { current: root } = this.rootRef
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
        const { current: root } = this.rootRef
        const { target } = e

        if (root && (root === target || (target instanceof Element && !root.contains(target)))) {
            this.toggle(false)
        }
    }

    setDate = (date: Date) => {
        const { closeOnSelect, onChange } = this.props

        this.setState({
            date,
        })

        if (typeof onChange === 'function') {
            onChange(date)
        }

        if (closeOnSelect) {
            setTimeout(() => {
                this.toggle(false)
            }, 0)
        }
    }

    rootRef: Ref<HTMLDivElement> = React.createRef()

    toggle = (open?: boolean) => {
        this.setState((state) => {
            const isOpen = typeof open === 'boolean' ? open : !state.open
            let date = isOpen ? state.date : undefined
            if (!state.open && isOpen) {
                date = this.props.date || new Date() // eslint-disable-line prefer-destructuring
            }
            return {
                open: isOpen,
                date,
            }
        })
    }

    children(): Node {
        const {
            children,
            openOnFocus,
            closeOnSelect,
            disabled,
            onChange,
            wrapperClassname,
            ...props
        } = this.props

        const date = this.state.open ? this.state.date : this.props.date

        if (typeof children === 'function') {
            return children({
                ...props,
                date,
                toggleCalendar: this.toggle,
            })
        }

        return children
    }

    render() {
        const { open } = this.state
        const { disabled, className, wrapperClassname } = this.props
        const date = open ? this.state.date : this.props.date

        return (
            <div ref={this.rootRef} className={cx(styles.root, className)}>
                {this.children()}
                {!disabled && open && (
                    <div className={cx(styles.wrapper, wrapperClassname)}>
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

export default WithCalendar
