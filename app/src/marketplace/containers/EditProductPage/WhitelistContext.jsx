// @flow

import React, { type Context, type Node, useMemo, useState, useCallback, useEffect, useContext } from 'react'

import { getWhitelistAddresses } from '$mp/modules/contractProduct/services'
import { transactionTypes } from '$shared/utils/constants'
import type { Address, Hash } from '$shared/flowtype/web3-types'
import type { TransactionType } from '$shared/flowtype/common-types'
import type { WhitelistItem } from '$mp/modules/contractProduct/types'

import useEditableProduct from '../ProductController/useEditableProduct'

type ContextProps = {
    items: Array<WhitelistItem>,
    addPendingItem: (Hash, Address, TransactionType) => void,
    removePendingItem: (Hash) => void,
}

type PendingItem = {
    txHash: Hash,
    item: WhitelistItem,
}

const WhitelistContext: Context<ContextProps> = React.createContext({})

const useWhitelistContextCreator = () => {
    const product = useEditableProduct()
    const productId = product.id
    const [items, setItems] = useState([])
    const [pendingItems, setPendingItems] = useState([])

    useEffect(() => {
        const loadWhitelist = async () => {
            const whitelist = await getWhitelistAddresses(productId)
            setItems(whitelist)
        }

        loadWhitelist()
    }, [productId, pendingItems])

    const addPendingItem = useCallback((txHash, address, type) => {
        const pendingItem: PendingItem = {
            txHash,
            item: {
                address,
                isPending: true,
                status: type === transactionTypes.WHITELIST_APPROVE ? 'added' : 'removed',
            },
        }
        setPendingItems((prev) => [
            ...prev,
            pendingItem,
        ])
    }, [])

    const removePendingItem = useCallback((txHash) => {
        setPendingItems((prev) => prev.filter((item) => item.txHash !== txHash))
    }, [])

    const combinedItems = [
        ...items.filter((i) => !pendingItems.map((p) => p.item.address).includes(i.address)),
        ...pendingItems.map((p) => p.item),
    ].sort((a, b) => a.address.localeCompare(b.address))

    return useMemo(() => ({
        items: combinedItems,
        addPendingItem,
        removePendingItem,
    }), [combinedItems, addPendingItem, removePendingItem])
}

const useWhitelistContext = () => {
    const context = useContext(WhitelistContext)
    if (context === undefined) {
        throw new Error('useWhitelistContext requires WhitelistContextProvider')
    }
    return context
}

type Props = {
    children?: Node,
}

const WhitelistContextProvider = ({ children }: Props) => (
    <WhitelistContext.Provider value={useWhitelistContextCreator()}>
        {children || null}
    </WhitelistContext.Provider>
)

export {
    WhitelistContextProvider as Provider,
    WhitelistContext as Context,
    useWhitelistContext,
}
