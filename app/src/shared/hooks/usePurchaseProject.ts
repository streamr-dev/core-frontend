import {useCallback, useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment/moment'
import { useDispatch } from 'react-redux'
import { getProductSubscription } from '$mp/modules/product/actions'
import { addFreeProduct } from '$mp/modules/product/services'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { getMyPurchases } from '$mp/modules/myPurchaseList/actions'
import useModal from '$shared/hooks/useModal'
import usePending from '$shared/hooks/usePending'
import { useController } from '$mp/containers/ProductController'
import { getChainIdFromApiString } from '$shared/utils/chains'
import { isPaidProject } from '$mp/utils/product'
import useAccountAddress from '$shared/hooks/useAccountAddress'
import useIsMounted from '$shared/hooks/useIsMounted'
import validateWeb3 from '$utils/web3/validateWeb3'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import { isAddressWhitelisted } from '$mp/modules/contractProduct/services'
import { ProjectId } from '$mp/types/project-types'
import {useIsAuthenticated} from "$auth/hooks/useIsAuthenticated"
import routes from '$routes'

export const usePurchaseProject = (): () => Promise<void> => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { product } = useController()
    const { api: purchaseDialog } = useModal('purchase')
    const { isPending, wrap } = usePending('product.PURCHASE_DIALOG')
    const isLoggedIn = useIsAuthenticated()
    const account = useAccountAddress()
    const { api: requestAccessDialog } = useModal('requestWhitelistAccess')
    const isMounted = useIsMounted()
    const productId = product.id
    const chainId = product && getChainIdFromApiString(product.chain)
    const contactEmail = product && product.contact && product.contact.email
    const productName = product && product.name
    const isPaid = isPaidProject(product)
    const isWhitelistEnabled = !!(isPaid && product.requiresWhitelist)
    const [isWhitelisted, setIsWhitelisted] = useState(isWhitelistEnabled ? null : false)
    useEffect(() => {
        const loadWhitelistStatus = async () => {
            // set product as whitelisted if that feature is enabled, and if
            // 1) metamask is locked -> clicking request access will prompt Metamask
            // 2) metamask is unlocked and user has access
            const whitelisted =
                !isWhitelistEnabled ||
                (await getWhitelistStatus({
                    productId,
                    chainId,
                }))

            if (isMounted()) {
                setIsWhitelisted(whitelisted)
            }
        }

        if (productId && !isPending) {
            loadWhitelistStatus()
        }
    }, [productId, chainId, account, isWhitelistEnabled, isPending, isMounted])
    return useCallback(
        async () =>
            wrap(async () => {
                if (isLoggedIn) {
                    if (isPaid) {
                        if (isWhitelistEnabled && !isWhitelisted) {
                            // at this point we know either that user has access or Metamask was locked
                            // do a another check but this time validate web3 which will prompt Metamask
                            const canPurchase = await getWhitelistStatus({
                                productId,
                                validate: true,
                                // prompts metamask if locked
                                chainId,
                            })

                            if (!isMounted()) {
                                return
                            }

                            if (!canPurchase) {
                                await requestAccessDialog.open({
                                    contactEmail,
                                    productName,
                                })
                                return
                            }
                        }

                        // Paid product has to be bought with Metamask
                        const { started, succeeded, viewInCore } = await purchaseDialog.open({
                            productId,
                        })

                        if (isMounted() && !!started && !!succeeded) {
                            if (viewInCore) {
                                history.replace(routes.subscriptions())
                            } else {
                                dispatch(getProductSubscription(productId, chainId))
                            }
                        }
                    } else {
                        // Free product can be bought directly
                        // subscribe for one year (TODO: move to constant)
                        const endsAt = moment().add(1, 'year').unix() // Unix timestamp (seconds)

                        await addFreeProduct(productId || '', endsAt)

                        if (!isMounted()) {
                            return
                        }

                        Notification.push({
                            title: 'Saved to your subscriptions',
                            icon: NotificationIcon.CHECKMARK,
                        })
                        dispatch(getMyPurchases())
                    }
                } else {
                    history.replace(
                        routes.auth.login({
                            redirect: routes.marketplace.product.overview({
                                id: productId,
                            }),
                        }),
                    )
                }
            }),
        [
            productId,
            dispatch,
            history,
            isLoggedIn,
            purchaseDialog,
            isPaid,
            wrap,
            isMounted,
            isWhitelistEnabled,
            isWhitelisted,
            requestAccessDialog,
            contactEmail,
            productName,
            chainId,
        ],
    )
}

const getWhitelistStatus = async ({ productId, validate = false, chainId }: WhitelistStatus) => {
    try {
        if (validate) {
            await validateWeb3({
                requireNetwork: false,
                // network check is done later if purchase is possible
                unlockTimeout: true,
            })
        }

        const account = await getDefaultWeb3Account()
        return !!account && isAddressWhitelisted(productId, account, true, chainId)
    } catch (e) {
        // log error but ignore otherwise
        console.warn(e)
    }

    return false
}

type WhitelistStatus = {
    productId: ProjectId
    validate?: boolean
    chainId: number
}
