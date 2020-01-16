// @flow

import { useMemo, useCallback, useContext } from 'react'
import { useSelector } from 'react-redux'
import BN from 'bignumber.js'

import { Context as UndoContext } from '$shared/contexts/Undo'
import { Context as ValidationContext } from './ValidationContextProvider'

import useEditableProductUpdater from '../ProductController/useEditableProductUpdater'
import { pricePerSecondFromTimeUnit, convert } from '$mp/utils/price'
import { contractCurrencies as currencies, timeUnits } from '$shared/utils/constants'
import { selectDataPerUsd } from '$mp/modules/global/selectors'

import type { Product } from '$mp/flowtype/product-types'
import type { StreamIdList } from '$shared/flowtype/stream-types'

const getPricePerSecond = (isFree, price, currency, timeUnit, dataPerUsd) => {
    let pricePerSecond
    if (isFree) {
        pricePerSecond = BN(0)
    } else {
        const newPrice = (currency !== currencies.DATA) ?
            convert(price || '0', dataPerUsd, currency, currencies.DATA) : price
        pricePerSecond = pricePerSecondFromTimeUnit(newPrice || BN(0), timeUnit || timeUnits.hour)
    }

    return pricePerSecond
}

export function useEditableProductActions() {
    const { updateProduct: commit } = useEditableProductUpdater()
    const { undo } = useContext(UndoContext)
    const { touch } = useContext(ValidationContext)
    const dataPerUsd = useSelector(selectDataPerUsd)

    const updateProduct = useCallback((product: Object, msg: string = 'Update product') => {
        commit(msg, (p) => ({
            ...p,
            ...product,
        }))
    }, [commit])
    const updateName = useCallback((name: $ElementType<Product, 'name'>) => {
        commit('Update name', (p) => ({
            ...p,
            name,
        }))
        touch('name')
    }, [commit, touch])
    const updateDescription = useCallback((description: $ElementType<Product, 'description'>) => {
        commit('Update description', (p) => ({
            ...p,
            description,
        }))
        touch('description')
    }, [commit, touch])
    const updateImageUrl = useCallback((image: $ElementType<Product, 'imageUrl'>) => {
        commit('Update image url', (p) => ({
            ...p,
            imageUrl: image,
        }))
        touch('imageUrl')
    }, [commit, touch])
    const updateImageFile = useCallback((image: File) => {
        commit('Update image file', (p) => ({
            ...p,
            newImageToUpload: image,
        }))
        touch('imageUrl')
    }, [commit, touch])
    const updateStreams = useCallback((streams: StreamIdList) => {
        commit('Update streams', (p) => ({
            ...p,
            streams,
        }))
        touch('streams')
    }, [commit, touch])
    const updateCategory = useCallback((category: $ElementType<Product, 'category'>) => {
        commit('Update category', (p) => ({
            ...p,
            category,
        }))
        touch('category')
        touch('details')
    }, [commit, touch])
    const updateAdminFee = useCallback((adminFee: number) => {
        commit('Update admin fee', (p) => ({
            ...p,
            adminFee,
        }))
        touch('adminFee')
        touch('details')
    }, [commit, touch])
    const updateIsFree = useCallback((isFree: $ElementType<Product, 'isFree'>) => {
        commit('Update is free', (p) => ({
            ...p,
            isFree,
            pricePerSecond: getPricePerSecond(isFree, p.price, p.priceCurrency, p.timeUnit, dataPerUsd),
        }))
        touch('pricePerSecond')
    }, [commit, touch, dataPerUsd])
    const updatePrice = useCallback((price: $ElementType<Product, 'price'>) => {
        commit('Update price', (p) => ({
            ...p,
            price,
            pricePerSecond: getPricePerSecond(p.isFree, price, p.priceCurrency, p.timeUnit, dataPerUsd),
        }))
        touch('pricePerSecond')
    }, [commit, touch, dataPerUsd])
    const updateTimeUnit = useCallback((timeUnit: $ElementType<Product, 'timeUnit'>) => {
        commit('Update time unit', (p) => ({
            ...p,
            timeUnit,
            pricePerSecond: getPricePerSecond(p.isFree, p.price, p.priceCurrency, timeUnit, dataPerUsd),
        }))
        touch('pricePerSecond')
    }, [commit, touch, dataPerUsd])
    const updatePriceCurrency = useCallback((priceCurrency: $ElementType<Product, 'priceCurrency'>) => {
        commit('Update price currency', (p) => ({
            ...p,
            priceCurrency,
            pricePerSecond: getPricePerSecond(p.isFree, p.price, priceCurrency, p.timeUnit, dataPerUsd),
        }))
        touch('pricePerSecond')
    }, [commit, touch, dataPerUsd])
    const updateBeneficiaryAddress = useCallback((beneficiaryAddress: $ElementType<Product, 'beneficiaryAddress'>) => {
        commit('Update beneficiary address', (p) => ({
            ...p,
            beneficiaryAddress,
        }))
        touch('beneficiaryAddress')
    }, [commit, touch])
    const updateType = useCallback((type: $ElementType<Product, 'type'>) => {
        commit('Update type', (p) => ({
            ...p,
            type,
        }))
        touch('type')
    }, [commit, touch])

    return useMemo(() => ({
        undo,
        updateProduct,
        updateName,
        updateDescription,
        updateImageUrl,
        updateImageFile,
        updateStreams,
        updateCategory,
        updateAdminFee,
        updateIsFree,
        updatePrice,
        updateTimeUnit,
        updatePriceCurrency,
        updateBeneficiaryAddress,
        updateType,
    }), [
        undo,
        updateProduct,
        updateName,
        updateDescription,
        updateImageUrl,
        updateImageFile,
        updateStreams,
        updateCategory,
        updateAdminFee,
        updateIsFree,
        updatePrice,
        updateTimeUnit,
        updatePriceCurrency,
        updateBeneficiaryAddress,
        updateType,
    ])
}

export default useEditableProductActions
