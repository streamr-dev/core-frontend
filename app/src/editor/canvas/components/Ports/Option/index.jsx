// @flow

import React, { useCallback } from 'react'
import cx from 'classnames'
import { I18n, Translate } from 'react-redux-i18n'
import styles from './option.pcss'

type Props = {
    activated?: boolean,
    className?: string,
    disabled?: boolean,
    onToggle?: ?(string) => void,
    name: 'drivingInput' | 'noRepeat',
}

const Option = ({
    activated,
    className,
    disabled,
    name,
    onToggle,
}: Props) => {
    const onClick = useCallback(() => {
        if (onToggle) {
            onToggle(name)
        }
    }, [name, onToggle])

    return (
        <div
            className={cx(styles.root, className, {
                [styles.activated]: !!activated,
                [styles[name]]: true,
            })}
        >
            <div className={styles.inner}>
                <button
                    disabled={!!disabled}
                    onClick={onClick}
                    title={`${I18n.t(`editor.module.portOption.${name}.name`)}: ${activated ? I18n.t('general.on') : I18n.t('general.off')}`}
                    type="button"
                >
                    <Translate value={`editor.module.portOption.${name}.abbr`} />
                </button>
            </div>
        </div>
    )
}

export default Option
