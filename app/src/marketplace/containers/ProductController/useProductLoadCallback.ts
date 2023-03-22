import BN from 'bignumber.js'
import { useCallback } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'
import usePending from '$shared/hooks/usePending'
import { Project, ProjectId } from '$mp/types/project-types'
import { getProductById } from '$mp/modules/product/services'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { isPaidProject, isDataUnionProduct } from '$mp/utils/product'
import { timeUnits, DEFAULT_CURRENCY, projectStates } from '$shared/utils/constants'
import { getChainIdFromApiString } from '$shared/utils/chains'
import { priceForTimeUnits } from '$mp/utils/price'
import { isEthereumAddress } from '$mp/utils/validate'
import { getCustomTokenDecimals } from '$mp/utils/web3'
import { fromDecimals } from '$mp/utils/math'
import { getAdminFee } from '$mp/modules/dataUnion/services'
import ResourceNotFoundError, { ResourceType } from '$shared/errors/ResourceNotFoundError'
import useFailure from '$shared/hooks/useFailure'
import useController from './useController'
type LoadProps = {
    productId: ProjectId
    ignoreUnauthorized?: boolean
    requirePublished?: boolean
}
export default function useProductLoadCallback() {
    const { wrap } = usePending('product.LOAD')
    const isMounted = useIsMounted()
    const fail = useFailure()
    const { setProduct } = useController()
    const load = useCallback(
        async ({ productId, ignoreUnauthorized, requirePublished }: LoadProps) =>
            wrap(async () => {
                let product

                try {
                    // $FlowFixMe: possibly missing property beneficiaryAddress in Promise
                    product = await getProductById(productId)
                } catch (error) {
                    if (!isMounted()) {
                        return
                    }

                    throw error
                }

                if (!isMounted()) {
                    return
                }

                const chainId = getChainIdFromApiString(product.chain)

                // bail if the product is not actually published - this is an edge case
                // because this should only happen with user's own products, otherwise
                // the product load will fail due to permissions
                if (!!requirePublished && product.state !== projectStates.DEPLOYED) {
                    throw new ResourceNotFoundError(ResourceType.PRODUCT, product.id)
                }

                // fetch admin fee from data union contract
                let currentAdminFee
                let dataUnionDeployed = false

                if (isDataUnionProduct(product) && isEthereumAddress(product.beneficiaryAddress)) {
                    try {
                        currentAdminFee = await getAdminFee(product.beneficiaryAddress, chainId)
                        dataUnionDeployed = true
                    } catch (e) {
                        // ignore error, assume contract has not been deployed
                    }
                }

                if (!isMounted()) {
                    return
                }

                // Fetch status from contract product and adjust pending changes
                let pricingTokenAddress = null
                let pricePerSecond = null

                try {
                    const contractProduct = await getProductFromContract(productId, true, chainId)
                    ;({ pricingTokenAddress, pricePerSecond } = contractProduct)

                    // remove from pending changes if pricingTokenAddress setting is correct
                    if (product.pendingChanges && pricingTokenAddress === product.pendingChanges.pricingTokenAddress) {
                        delete product.pendingChanges.pricingTokenAddress
                    }
                } catch (e) {
                    // ignore error, assume product is not published
                    pricingTokenAddress = product && product.pendingChanges && product.pendingChanges.pricingTokenAddress
                }

                // Load pricingToken decimal count
                let pricingTokenDecimals: number | BN = 18

                if (pricingTokenAddress) {
                    try {
                        pricingTokenDecimals = await getCustomTokenDecimals(pricingTokenAddress, chainId)
                    } catch (e) {
                        // Not an ERC-20 contract
                        console.error('Invalid pricingTokenAddress', e)
                    }
                }

                if (!isMounted()) {
                    return
                }

                const nextProduct: Project = {
                    ...product,
                    isFree: !!product.isFree || !isPaidProject(product),
                    timeUnit: timeUnits.hour,
                    priceCurrency: product.priceCurrency || DEFAULT_CURRENCY,
                    price:
                        product.price ||
                        fromDecimals(
                            priceForTimeUnits(pricePerSecond || product.pricePerSecond || '0', 1, timeUnits.hour),
                            String(pricingTokenDecimals)
                        ).toString(),
                    adminFee: currentAdminFee,
                    dataUnionDeployed,
                    pricingTokenAddress,
                    pricingTokenDecimals: new BN(pricingTokenDecimals).toNumber(),
                    pricePerSecond: pricePerSecond || product.pricePerSecond,
                }
                setProduct({ ...nextProduct, pendingChanges: null })
            }),
        [wrap, setProduct, isMounted],
    )
    return useCallback(
        async (props: LoadProps) => {
            try {
                await load(props)
            } catch (e) {
                if (e instanceof ResourceNotFoundError) {
                    fail(e)
                    return
                }

                throw e
            }
        },
        [load, fail],
    )
}
