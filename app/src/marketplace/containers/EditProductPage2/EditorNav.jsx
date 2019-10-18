// @flow

import React, { useContext, useMemo, useState } from 'react'
import { I18n } from 'react-redux-i18n'

import { isCommunityProduct } from '$mp/utils/product'
import EditorNavComponent, { statuses } from '$mp/components/ProductPage/EditorNav'
import Scrollspy from 'react-scrollspy'

import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import useValidation from '../ProductController/useValidation'
import useProduct from '../ProductController/useProduct'

import styles from './editorNav.pcss'

const EditorNav = () => {
    const product = useProduct()
    const [activeSectionId, setActiveSectionId] = useState(undefined)

    const { isTouched } = useContext(ValidationContext)

    const { isValid: isNameValid } = useValidation('name')
    const { isValid: isCoverImageValid } = useValidation('coverImage')
    const { isValid: isDescriptionValid } = useValidation('description')
    const { isValid: areStreamsValid } = useValidation('streams')
    const { isValid: isPriceValid } = useValidation('price')
    const { isValid: isBeneficiaryAddressValid } = useValidation('beneficiaryAddress')
    const { isValid: isCategoryValid } = useValidation('category')
    const { isValid: isAdminFeeValid } = useValidation('adminFee')

    const isCommunity = isCommunityProduct(product)

    const nameStatus = useMemo(() => {
        if (!isTouched('name')) {
            return statuses.EMPTY
        }
        return isNameValid ? statuses.VALID : statuses.ERROR
    }, [isTouched, isNameValid])

    const coverImageStatus = useMemo(() => {
        if (!isTouched('coverImage')) {
            return statuses.EMPTY
        }
        return isCoverImageValid ? statuses.VALID : statuses.ERROR
    }, [isTouched, isCoverImageValid])

    const descriptionStatus = useMemo(() => {
        if (!isTouched('description')) {
            return statuses.EMPTY
        }
        return isDescriptionValid ? statuses.VALID : statuses.ERROR
    }, [isTouched, isDescriptionValid])

    const streamsStatus = useMemo(() => {
        if (!isTouched('streams')) {
            return statuses.EMPTY
        }
        return areStreamsValid ? statuses.VALID : statuses.ERROR
    }, [isTouched, areStreamsValid])

    const priceStatus = useMemo(() => {
        if (!isTouched('price')) {
            return statuses.EMPTY
        }
        return (isPriceValid && (isCommunity || isBeneficiaryAddressValid)) ? statuses.VALID : statuses.ERROR
    }, [isTouched, isCommunity, isPriceValid, isBeneficiaryAddressValid])

    const detailsStatus = useMemo(() => {
        if (!isTouched('details')) {
            return statuses.EMPTY
        }
        return (isCategoryValid && (!isCommunity || isAdminFeeValid)) ? statuses.VALID : statuses.ERROR
    }, [isTouched, isCommunity, isCategoryValid, isAdminFeeValid])

    const sections = useMemo(() => [{
        id: 'product-name',
        heading: I18n.t('editProductPage.navigation.name'),
        status: nameStatus,
    }, {
        id: 'cover-image',
        heading: I18n.t('editProductPage.navigation.coverImage'),
        status: coverImageStatus,
    }, {
        id: 'description',
        heading: I18n.t('editProductPage.navigation.description'),
        status: descriptionStatus,
    }, {
        id: 'streams',
        heading: I18n.t('editProductPage.navigation.streams'),
        status: streamsStatus,
    }, {
        id: 'price',
        heading: I18n.t('editProductPage.navigation.price'),
        status: priceStatus,
    }, {
        id: 'details',
        heading: I18n.t('editProductPage.navigation.details'),
        status: detailsStatus,
    }].map((section) => ({
        ...section,
        href: `#${section.id}`,
    })), [
        nameStatus,
        coverImageStatus,
        descriptionStatus,
        streamsStatus,
        priceStatus,
        detailsStatus,
    ])

    const sectionAnchors = useMemo(() => sections.map(({ id }) => id), [sections])

    return (
        <Scrollspy
            items={sectionAnchors}
            componentTag="div"
            onUpdate={(el) => {
                if (el && typeof el.getAttribute === 'function') {
                    setActiveSectionId(el.getAttribute('id'))
                }
            }}
            offset={-60}
            className={styles.sticky}
        >
            <EditorNavComponent
                sections={sections}
                activeSection={activeSectionId}
            />
        </Scrollspy>
    )
}

export default EditorNav
