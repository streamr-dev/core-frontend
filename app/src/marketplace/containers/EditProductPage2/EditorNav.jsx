// @flow

import React from 'react'
import cx from 'classnames'

import useValidation from '../ProductController/useValidation'
import SvgIcon from '$shared/components/SvgIcon'
import styles from './editorNav.pcss'

const Error = () => (
    <div className={styles.errorMarker}>
        <SvgIcon name="crossHeavy" className={styles.icon} />
    </div>
)

const Ok = () => (
    <div className={styles.okMarker}>
        <SvgIcon name="tick" className={styles.icon} />
    </div>
)

type NavSectioProps = {
    title: string,
    hasError?: boolean,
    touched?: boolean,
    connectToPrevious?: boolean,
}

const NavSection = ({ title, hasError = false, touched = false, connectToPrevious = false }: NavSectioProps) => (
    <div className={styles.navSection}>
        <div className={styles.title}>{title}</div>
        <div className={styles.status}>
            {!!touched && !!connectToPrevious && (
                <div className={styles.connectTrack} />
            )}
            <div className={styles.marker} />
            {!!touched && (hasError ? <Error /> : <Ok />)}
        </div>
    </div>
)

const EditorNav = () => {
    const { isValid: isNameValid } = useValidation('name')
    const { isValid: isCoverImageValid } = useValidation('coverImage')
    const { isValid: isDescriptionValid } = useValidation('description')
    const { isValid: areStreamsValid } = useValidation('streams')
    const { isValid: isCategoryValid } = useValidation('category')
    const { isValid: isAdminFeeValid } = useValidation('adminFee')

    return (
        <div className={cx(styles.root, styles.EditorNav)}>
            <div className={styles.track} />
            <NavSection
                title="Name"
                hasError={!isNameValid}
                touched
            />
            <NavSection
                title="Cover image"
                hasError={!isCoverImageValid}
                touched
                connectToPrevious
            />
            <NavSection title="Description" hasError={!isDescriptionValid} />
            <NavSection title="Streams" hasError={!areStreamsValid} />
            <NavSection title="Set price" />
            <NavSection title="Details" hasError={(!isCategoryValid || !isAdminFeeValid)} />
        </div>
    )
}

export default EditorNav
