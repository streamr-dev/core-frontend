// @flow

import React, { useContext, useMemo } from 'react'
import { withRouter } from 'react-router-dom'
import { I18n } from 'react-redux-i18n'

import { isCommunityProduct } from '$mp/utils/product'
import EditorNavComponent from '$mp/components/ProductPage/EditorNav'

import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import useValidation from '../ProductController/useValidation'
import useProduct from '../ProductController/useProduct'

import styles from './editorNav.pcss'

type EditorNavProps = {
    location: {
        hash: string,
    },
}

const EditorNav = withRouter(({ location: { hash } }: EditorNavProps) => {
    const product = useProduct()

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
            return 'EMPTY'
        }
        return isNameValid ? 'VALID' : 'ERROR'
    }, [isTouched, isNameValid])

    const coverImageStatus = useMemo(() => {
        if (!isTouched('coverImage')) {
            return 'EMPTY'
        }
        return isCoverImageValid ? 'VALID' : 'ERROR'
    }, [isTouched, isCoverImageValid])

    const descriptionStatus = useMemo(() => {
        if (!isTouched('description')) {
            return 'EMPTY'
        }
        return isDescriptionValid ? 'VALID' : 'ERROR'
    }, [isTouched, isDescriptionValid])

    const streamsStatus = useMemo(() => {
        if (!isTouched('streams')) {
            return 'EMPTY'
        }
        return areStreamsValid ? 'VALID' : 'ERROR'
    }, [isTouched, areStreamsValid])

    const priceStatus = useMemo(() => {
        if (!isTouched('price')) {
            return 'EMPTY'
        }
        return (isPriceValid && (isCommunity || isBeneficiaryAddressValid)) ? 'VALID' : 'ERROR'
    }, [isTouched, isCommunity, isPriceValid, isBeneficiaryAddressValid])

    const detailsStatus = useMemo(() => {
        if (!isTouched('details')) {
            return 'EMPTY'
        }
        return (isCategoryValid && (!isCommunity || isAdminFeeValid)) ? 'VALID' : 'ERROR'
    }, [isTouched, isCommunity, isCategoryValid, isAdminFeeValid])

    const sections = useMemo(() => [{
        id: 'name',
        anchorId: 'product-name',
        title: I18n.t('editProductPage.navigation.name'),
        status: nameStatus,
    }, {
        id: 'coverImage',
        anchorId: 'cover-image',
        title: I18n.t('editProductPage.navigation.coverImage'),
        status: coverImageStatus,
    }, {
        id: 'description',
        anchorId: 'description',
        title: I18n.t('editProductPage.navigation.description'),
        status: descriptionStatus,
    }, {
        id: 'streams',
        anchorId: 'streams',
        title: I18n.t('editProductPage.navigation.streams'),
        status: streamsStatus,
    }, {
        id: 'price',
        anchorId: 'price',
        title: I18n.t('editProductPage.navigation.price'),
        status: priceStatus,
    }, {
        id: 'details',
        anchorId: 'details',
        title: I18n.t('editProductPage.navigation.details'),
        status: detailsStatus,
    }], [
        nameStatus,
        coverImageStatus,
        descriptionStatus,
        streamsStatus,
        priceStatus,
        detailsStatus,
    ])

    const activeSectionId = useMemo(() => {
        const activeSection = sections.find(({ anchorId }) => anchorId === hash.substr(1))

        return activeSection ? activeSection.id : undefined
    }, [sections, hash])

    return (
        <EditorNavComponent
            className={styles.sticky}
            sections={sections}
            activeSection={activeSectionId}
        />
    )
})

export default EditorNav
