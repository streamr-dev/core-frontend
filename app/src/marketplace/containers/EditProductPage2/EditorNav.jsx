// @flow

import React, { useContext } from 'react'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'

import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import useValidation from '../ProductController/useValidation'
import styles from './editorNav.pcss'

type NavSectioProps = {
    title: string,
    hasError?: boolean,
    touched?: boolean,
}

const NavSection = ({ title, hasError = false, touched = false }: NavSectioProps) => (
    <div className={styles.navSection}>
        <div className={styles.title}>{title}</div>
        <div className={styles.status}>
            <div className={cx(styles.marker, {
                [styles.markerComplete]: !!touched && !hasError,
                [styles.markerError]: !!touched && hasError,
            })}
            >
                {!!touched && hasError && (<SvgIcon name="crossHeavy" className={styles.icon} />)}
                {!!touched && !hasError && (<SvgIcon name="tick" className={styles.icon} />)}
            </div>
        </div>
    </div>
)

const EditorNav = () => {
    const { isTouched } = useContext(ValidationContext)
    const { isValid: isNameValid } = useValidation('name')
    const { isValid: isCoverImageValid } = useValidation('coverImage')
    const { isValid: isDescriptionValid } = useValidation('description')
    const { isValid: areStreamsValid } = useValidation('streams')
    const { isValid: isCategoryValid } = useValidation('category')
    const { isValid: isAdminFeeValid } = useValidation('adminFee')

    return (
        <div className={cx(styles.root, styles.EditorNav)}>
            <div className={styles.progressBar}>
                <div className={styles.baseTrack} />
                <div className={styles.progressTrack} />
            </div>
            <NavSection
                title="Name"
                hasError={!isNameValid}
                touched={isTouched('name')}
            />
            <NavSection
                title="Cover image"
                hasError={!isCoverImageValid}
                touched={isTouched('coverImage')}
            />
            <NavSection
                title="Description"
                hasError={!isDescriptionValid}
                touched={isTouched('description')}
            />
            <NavSection
                title="Streams"
                hasError={!areStreamsValid}
                touched={isTouched('streams')}
            />
            <NavSection
                title="Set price"
                touched={isTouched('price')}
            />
            <NavSection
                title="Details"
                touched={isTouched('category')}
                hasError={(!isCategoryValid || !isAdminFeeValid)}
            />
        </div>
    )
}

export default EditorNav
