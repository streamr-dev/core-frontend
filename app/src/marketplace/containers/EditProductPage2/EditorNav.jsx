// @flow

import React, { useContext } from 'react'
import cx from 'classnames'
import findLastIndex from 'lodash/findLastIndex'
import { withRouter } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'

import SvgIcon from '$shared/components/SvgIcon'

import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import useValidation from '../ProductController/useValidation'
import styles from './editorNav.pcss'

type NavSectioProps = {
    id: string,
    anchorId: string,
    hasError?: boolean,
    touched?: boolean,
    location: {
        hash: string,
    },
}

const NavSection = withRouter(({
    id,
    anchorId,
    hasError = false,
    touched = false,
    location: { hash },
}: NavSectioProps) => (
    <div className={cx(styles.navSection, {
        [styles.active]: !!(anchorId === hash.substr(1)),
    })}
    >
        <div className={styles.title}>
            <a href={`#${anchorId}`}>
                <Translate value={`editProductPage.navigation.${id}`} />
            </a>
        </div>
        <div className={styles.status}>
            <div className={cx(styles.marker, {
                [styles.markerComplete]: !!touched && !hasError,
                [styles.markerError]: !!touched && hasError,
            })}
            >
                {!!touched && hasError && (<SvgIcon name="exclamation" className={styles.icon} />)}
                {!!touched && !hasError && (<SvgIcon name="tick" className={styles.icon} />)}
            </div>
        </div>
    </div>
))

const sections = [{
    id: 'name',
    anchorId: 'product-name',
}, {
    id: 'coverImage',
    anchorId: 'cover-image',
}, {
    id: 'description',
    anchorId: 'description',
}, {
    id: 'streams',
    anchorId: 'streams',
}, {
    id: 'price',
    anchorId: 'price',
}, {
    id: 'details',
    anchorId: 'details',
}]

const EditorNav = () => {
    const { isTouched } = useContext(ValidationContext)
    const { isValid: isNameValid } = useValidation('name')
    const { isValid: isCoverImageValid } = useValidation('coverImage')
    const { isValid: isDescriptionValid } = useValidation('description')
    const { isValid: areStreamsValid } = useValidation('streams')
    const { isValid: isCategoryValid } = useValidation('category')
    const { isValid: isAdminFeeValid } = useValidation('adminFee')

    const validSections = {
        name: isNameValid,
        coverImage: isCoverImageValid,
        description: isDescriptionValid,
        streams: areStreamsValid,
        price: false,
        details: isCategoryValid && isAdminFeeValid,
    }
    const lastIndex = findLastIndex(sections, ({ id }) => isTouched(id))

    return (
        <div className={cx(styles.root, styles.EditorNav)}>
            <div className={styles.progressBar}>
                <div className={styles.baseTrack} />
                <div
                    className={styles.progressTrack}
                    style={{
                        height: `${(Math.max(0, lastIndex) / Math.max(1, sections.length - 1)) * 100}%`,
                    }}
                />
            </div>
            {sections.map(({ id, anchorId }, index) => (
                <NavSection
                    key={id}
                    id={id}
                    anchorId={anchorId}
                    hasError={!validSections[id]}
                    touched={lastIndex >= index}
                />
            ))}
        </div>
    )
}

export default EditorNav
