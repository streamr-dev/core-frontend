// @flow

import React, { useContext } from 'react'
import cx from 'classnames'
import findLastIndex from 'lodash/findLastIndex'

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
                {!!touched && hasError && (<SvgIcon name="exclamation" className={styles.icon} />)}
                {!!touched && !hasError && (<SvgIcon name="tick" className={styles.icon} />)}
            </div>
        </div>
    </div>
)

const sections = ['name', 'coverImage', 'description', 'streams', 'price', 'category']

const EditorNav = () => {
    const { isTouched } = useContext(ValidationContext)
    const { isValid: isNameValid } = useValidation('name')
    const { isValid: isCoverImageValid } = useValidation('coverImage')
    const { isValid: isDescriptionValid } = useValidation('description')
    const { isValid: areStreamsValid } = useValidation('streams')
    const { isValid: isCategoryValid } = useValidation('category')
    const { isValid: isAdminFeeValid } = useValidation('adminFee')

    const lastIndex = findLastIndex(sections, (name) => isTouched(name))

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
            <NavSection
                title="Name"
                hasError={!isNameValid}
                touched={lastIndex >= 0}
            />
            <NavSection
                title="Cover image"
                hasError={!isCoverImageValid}
                touched={lastIndex >= 1}
            />
            <NavSection
                title="Description"
                hasError={!isDescriptionValid}
                touched={lastIndex >= 2}
            />
            <NavSection
                title="Streams"
                hasError={!areStreamsValid}
                touched={lastIndex >= 3}
            />
            <NavSection
                title="Set price"
                touched={lastIndex >= 4}
            />
            <NavSection
                title="Details"
                touched={lastIndex >= 5}
                hasError={(!isCategoryValid || !isAdminFeeValid)}
            />
        </div>
    )
}

export default EditorNav
