import React, { useState, useMemo, useCallback, useContext, useRef, Context, ReactNode, useEffect } from 'react'
import { DataUnionStats } from '@dataunions/client/types/src/DataUnion'
import qs from 'query-string'
import { useLocation, useNavigate } from 'react-router-dom'
import { Project } from '$mp/types/project-types'
import { isDataUnionProduct } from '$mp/utils/product'
import usePending from '$shared/hooks/usePending'
import useIsMounted from '$shared/hooks/useIsMounted'
import Notification from '$shared/utils/Notification'
import { getDataUnionObject } from '$mp/modules/dataUnion/services'
import { NotificationIcon, projectStates } from '$shared/utils/constants'
import { numberToText } from '$shared/utils/text'
import { isEthereumAddress } from '$mp/utils/validate'
import { areAddressesEqual } from '$mp/utils/smartContract'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import useModal from '$shared/hooks/useModal'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import {SeverityLevel, ValidationContext} from '$mp/containers/ProductController/ValidationContextProvider'
import routes from '$routes'
import { useController } from '../ProductController'

type ContextProps = {
    isPreview?: boolean
    setIsPreview?: (arg0: boolean | ((...args: Array<any>) => any)) => void
    validate?: () => boolean
    back?: () => void | Promise<void>
    save?: () => void | Promise<void>
    publish?: () => void | Promise<void>
    deployDataUnion?: () => void | Promise<void>
    lastSectionRef?: any
    publishAttempted?: boolean
}
const EditControllerContext: Context<ContextProps> = React.createContext<ContextProps>({})

/**
 * TODO - We're just keeping this temporarlity because some code might need to be copied from here when writing the new edit implementation
 * @deprecated
 * @param product
 */
function useEditController(product: Project) {
    const location = useLocation()
    const navigate = useNavigate()
    const { isAnyTouched, resetTouched, status } = useContext(ValidationContext)
    // lastSectionRef is stored here and set in EditorNav so it remembers its state when toggling
    // between editor and preview
    const isMounted = useIsMounted()
    const savePending = usePending('product.SAVE')
    const { product: originalProduct } = useController()
    const { updateState, state } = useContext(ProjectStateContext)
    const [dataUnionStats, setDataUnionStats] = useState<DataUnionStats>(null)
    const [publishAttempted, setPublishAttempted] = useState(!!(qs.parse(location.search).publishAttempted || ''))

    usePreventNavigatingAway({
        isDirty: isAnyTouched,
    })

    const { dataUnionPublishMemberLimit } = getCoreConfig()
    const productRef = useRef(product)
    productRef.current = product
    const chainId = product && product.dataUnionChainId
    // const nextAddress = state && (state.existingDUAddress || state.beneficiaryAddress)
    const nextAddress = state && state.existingDUAddress

    const errors = useMemo(
        () =>
            Object.keys(status)
                .filter((key) => status[key] && status[key].level === SeverityLevel.ERROR)
                .map((key) => ({
                    key,
                    message: status[key].message,
                })),
        [status],
    )
    const { api: deployDataUnionDialog } = useModal('dataUnion.DEPLOY')
    const { api: confirmSaveDialog } = useModal('confirmSave')
    const { api: publishDialog } = useModal('publish')

    useEffect(() => {
        const loadDU = async () => {
            if (isDataUnionProduct(productRef.current) && nextAddress) {
                const du = await getDataUnionObject(nextAddress, chainId)
                const stats = await du.getStats()
                setDataUnionStats(stats)
            }
        }
        loadDU()
    }, [nextAddress, chainId])

    const redirectToProductList = useCallback(() => {
        if (!isMounted()) {
            return
        }

        navigate(routes.projects.index(), { replace: true })
    }, [isMounted, navigate])
    const productId = product.id
    const redirectToProduct = useCallback(() => {
        if (!isMounted()) {
            return
        }

        navigate(
            routes.projects.overview({
                id: productId,
            }),
            {
                replace: true,
            },
        )
    }, [productId, isMounted, navigate])
    const save = useCallback(
        async (
            options = {
                redirect: true,
            },
        ) => {
            if (!originalProduct) {
                throw new Error('originalProduct is missing')
            }

            const savedSuccessfully = await savePending.wrap(async () => {
                const nextProduct = { ...productRef.current }

                // upload image
                if (nextProduct.newImageToUpload != null) {
                    try {
                        /* eslint-disable object-curly-newline */
                        /*const { imageUrl: newImageUrl, thumbnailUrl: newThumbnailUrl } = await postImage(
                            nextProduct.id || '',
                            nextProduct.newImageToUpload,
                        )*/

                        /* eslint-enable object-curly-newline */
                        /*nextProduct.imageUrl = newImageUrl
                        nextProduct.thumbnailUrl = newThumbnailUrl*/
                        delete nextProduct.newImageToUpload
                        updateState(nextProduct)
                    } catch (e) {
                        console.error('Could not upload image', e)
                    }
                }

                // save product (don't need to abort if unmounted)
                // $FlowFixMe: object literal weirdness
                /*await putProduct(
                    State.update(originalProduct, () => ({ ...nextProduct })) as Project,
                    nextProduct.id || '',
                )*/
                resetTouched()
                // TODO: handle saving errors
                return true
            })

            // Everything ok, do a redirect back to product page
            if (savedSuccessfully && !!options.redirect) {
                redirectToProductList()
            }
        },
        [savePending, redirectToProductList, originalProduct, updateState, resetTouched],
    )
    const validate = useCallback(() => {
        // Notify missing fields
        if (errors.length > 0) {
            errors.forEach(({ message }) => {
                Notification.push({
                    title: message,
                    icon: NotificationIcon.ERROR,
                })
            })
            return false
        }

        return true
    }, [errors])
    const publish = useCallback(async () => {
        setPublishAttempted(true)

        if (validate()) {
            if (isDataUnionProduct(productRef.current) && isEthereumAddress(nextAddress)) {
                if (!dataUnionStats || (dataUnionStats.activeMemberCount.toNumber() || 0) < dataUnionPublishMemberLimit) {
                    Notification.push({
                        title: `The minimum community size for a Data Union is ${
                            dataUnionPublishMemberLimit === 1 ? 'one member' : `${numberToText(dataUnionPublishMemberLimit)} members`
                        }.`,
                        icon: NotificationIcon.ERROR,
                    })
                    return
                }
            }

            await save({
                redirect: false,
            })
            const { isUnpublish, started, succeeded, showPublishedProduct } = await publishDialog.open({
                product: productRef.current,
            })

            if (!isMounted()) {
                return
            }

            /*if (started) {
                updateState({
                    ...state,
                    state: (isUnpublish ? projectStates.UNDEPLOYING : projectStates.DEPLOYING) as ProjectState,
                })
            }*/

            if (succeeded && (isUnpublish || !showPublishedProduct)) {
                redirectToProductList()
            } else if (succeeded && showPublishedProduct) {
                redirectToProduct()
            }
        }
    }, [validate, save, publishDialog, redirectToProductList, redirectToProduct, isMounted, dataUnionPublishMemberLimit, dataUnionStats, nextAddress])
    /*const updateBeneficiary = useCallback(
        async (address) => {
            // const { beneficiaryAddress } = productRef.current

            if ((!address || isEthereumAddress(address)) && (!beneficiaryAddress || !areAddressesEqual(beneficiaryAddress, address))) {
                updateBeneficiaryAddress(address, false)
                // save the new address immediately to db
                // $FlowFixMe: object literal weirdness
                await putProduct(
                    State.update(productRef.current, () => ({
                        ...productRef.current,
                        beneficiaryAddress: address,
                    })) as Project,
                    productRef.current.id || '',
                )
            }
        },
        [updateBeneficiaryAddress],
    )
    const deployDataUnion = useCallback(async () => {
        setPublishAttempted(true)

        if (validate()) {
            await save({
                redirect: false,
            })
            const dataUnionCreated = await deployDataUnionDialog.open({
                product: productRef.current,
                // updateAddress: updateBeneficiary,
            })

            // TODO: doesn't save unless dialog closed
            if (dataUnionCreated) {
                await save()
            }
        }
    }, [validate, deployDataUnionDialog, save, updateBeneficiary])
    const back = useCallback(async () => {
        let doSave = isAnyTouched()
        let doRedirect = true

        if (doSave) {
            const { save: saveRequested, redirect: redirectRequested } = await confirmSaveDialog.open()
            doSave = saveRequested
            doRedirect = redirectRequested
        }

        if (doSave) {
            await save({
                redirect: doRedirect,
            })
        } else if (doRedirect) {
            redirectToProductList()
        }
    }, [isAnyTouched, confirmSaveDialog, save, redirectToProductList])
    return useMemo(
        () => ({
            isPreview,
            setIsPreview,
            validate,
            back,
            save,
            publish,
            deployDataUnion,
            lastSectionRef,
            publishAttempted,
        }),
        [isPreview, setIsPreview, validate, back, save, publish, deployDataUnion, lastSectionRef, publishAttempted],
    )*/
}

type ControllerProps = {
    children?: ReactNode | ReactNode[]
    product: Project
}

function EditControllerProvider({ children, product }: ControllerProps) {
    return <EditControllerContext.Provider value={useEditController(product) as unknown}>{children || null}</EditControllerContext.Provider>
}

export { EditControllerContext as Context, EditControllerProvider as Provider }
