// @flow

import React, { useContext } from 'react'
import { Translate } from 'react-redux-i18n'
import cx from 'classnames'

import { Context as EditControllerContext } from './EditControllerProvider'
import SvgIcon from '$shared/components/SvgIcon'

import styles from './backButton.pcss'

type Props = {
    className?: string,
}

const BackButton = ({ className }: Props) => {
    const { back } = useContext(EditControllerContext)

    return (
        <div
            className={cx(styles.root, className)}
        >
            <button
                type="button"
                onClick={back}
                className={styles.button}
            >
                <SvgIcon name="back" className={styles.backIcon} />
                <span>
                    <Translate value="general.back" />
                </span>
            </button>
        </div>
    )
}

export default BackButton
