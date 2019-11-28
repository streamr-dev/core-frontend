// @flow

import React, { useContext, useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { I18n } from 'react-redux-i18n'

import { isCommunityProduct } from '$mp/utils/product'
import EditorNavComponent, { statuses } from '$mp/components/ProductPage/EditorNav'
import Scrollspy from 'react-scrollspy'

import useEditableProduct from '../ProductController/useEditableProduct'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import { Context as EditControllerContext } from './EditControllerProvider'
import { isPublished } from './state'

import styles from './editorNav.pcss'

const SCROLLSPY_OFFSET = -40
const CLICK_OFFSET = -120

const EditorNav = () => {
    const product = useEditableProduct()
    const productRef = useRef()
    productRef.current = product

    const [activeSectionId, setActiveSectionId] = useState(undefined)

    const { isValid, isTouched, isPendingChange } = useContext(ValidationContext)
    const { lastSectionRef } = useContext(EditControllerContext)

    const isCommunity = isCommunityProduct(product)
    const isPublic = isPublished(product)

    const getStatus = useCallback((name: string) => {
        const pending = !!isPublic && isPendingChange(name)

        if (!isTouched(name) && !pending) {
            return statuses.EMPTY
        }
        const validState = pending ? statuses.UNPUBLISHED : statuses.VALID

        return isValid(name) ? validState : statuses.ERROR
    }, [isPublic, isPendingChange, isTouched, isValid])

    const priceStatus = useMemo(() => {
        const price = getStatus('pricePerSecond')

        if (!isCommunity) {
            return price
        }
        const address = getStatus('beneficiaryAddress')

        if (price === statuses.ERROR || address === statuses.ERROR) {
            return statuses.ERROR
        } else if (price === statuses.UNPUBLISHED || address === statuses.UNPUBLISHED) {
            return statuses.UNPUBLISHED
        } else if (price === statuses.VALID || address === statuses.VALID) {
            return statuses.VALID
        }

        return statuses.EMPTY
    }, [getStatus, isCommunity])

    const detailsStatus = useMemo(() => {
        const category = getStatus('category')

        if (!isCommunity) {
            return category
        }
        const adminFee = getStatus('adminFee')

        if (category === statuses.ERROR || adminFee === statuses.ERROR) {
            return statuses.ERROR
        } else if (category === statuses.UNPUBLISHED || adminFee === statuses.UNPUBLISHED) {
            return statuses.UNPUBLISHED
        } else if (category === statuses.VALID || adminFee === statuses.VALID) {
            return statuses.VALID
        }

        return statuses.EMPTY
    }, [getStatus, isCommunity])

    const sharedSecretStatus = useMemo(() => {
        if (!isTouched('sharedSecrets')) {
            return statuses.EMPTY
        }
        return statuses.VALID
    }, [isTouched])

    const clickTargetRef = useRef(null)

    const scrollTo = useCallback((id, smooth = true) => {
        const anchor = document.getElementById(id)

        if (anchor) {
            const offsetTop = anchor.getBoundingClientRect().top + window.pageYOffset + CLICK_OFFSET
            window.scroll({
                top: offsetTop,
                behavior: smooth ? 'smooth' : undefined,
            })
            clickTargetRef.current = id
        }
    }, [clickTargetRef])

    const onClickFn = useCallback((id, e) => {
        e.preventDefault()
        scrollTo(id)
    }, [scrollTo])

    let sections = useMemo(() => [{
        id: 'product-name',
        heading: I18n.t('editProductPage.navigation.name'),
        status: getStatus('name'),
    }, {
        id: 'cover-image',
        heading: I18n.t('editProductPage.navigation.coverImage'),
        status: getStatus('imageUrl'),
    }, {
        id: 'description',
        heading: I18n.t('editProductPage.navigation.description'),
        status: getStatus('description'),
    }, {
        id: 'streams',
        heading: I18n.t('editProductPage.navigation.streams'),
        status: getStatus('streams'),
    }, {
        id: 'price',
        heading: I18n.t('editProductPage.navigation.price'),
        status: priceStatus,
    }, {
        id: 'details',
        heading: I18n.t('editProductPage.navigation.details'),
        status: detailsStatus,
    }, {
        id: 'shared-secrets',
        heading: I18n.t('editProductPage.navigation.sharedSecrets'),
        status: sharedSecretStatus,
    }].map((section) => ({
        ...section,
        onClick: onClickFn.bind(null, section.id),
    })), [
        getStatus,
        priceStatus,
        detailsStatus,
        sharedSecretStatus,
        onClickFn,
    ])

    if (!isCommunity) {
        sections = sections.filter((s) => s.id !== 'shared-secrets')
    }

    const sectionAnchors = useMemo(() => sections.map(({ id }) => id), [sections])

    const onUpdate = useCallback((el) => {
        if (el && typeof el.getAttribute === 'function') {
            const scrolledId = el.getAttribute('id')

            // don't update active position if clicked on a menu item
            if (!clickTargetRef.current || clickTargetRef.current === scrolledId) {
                setActiveSectionId(scrolledId)
                clickTargetRef.current = null
            }
        }
    }, [clickTargetRef])

    const activeSectionRef = useRef()
    activeSectionRef.current = activeSectionId

    useEffect(() => {
        if (lastSectionRef.current) {
            scrollTo(lastSectionRef.current, false)
            setActiveSectionId((prevActive) => {
                if (prevActive !== lastSectionRef.current) {
                    return lastSectionRef.current
                }
                return prevActive
            })
            lastSectionRef.current = undefined
        }

        return () => {
            lastSectionRef.current = activeSectionRef.current
        }
    }, [scrollTo, lastSectionRef])

    return (
        <Scrollspy
            items={sectionAnchors}
            componentTag="div"
            onUpdate={onUpdate}
            offset={SCROLLSPY_OFFSET}
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
