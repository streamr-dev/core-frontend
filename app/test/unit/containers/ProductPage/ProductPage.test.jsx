import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'

import { productStates } from '$mp/utils/constants'
import { ProductPage, mapStateToProps, mapDispatchToProps } from '$mp/containers/ProductPage'
import * as productActions from '$mp/modules/product/actions'
import * as relatedProductsActions from '$mp/modules/relatedProducts/actions'
import * as userActions from '$mp/modules/user/actions'
import * as modalActions from '$mp/modules/modals/actions'
import * as authUtils from '$mp/utils/auth'
import * as urlUtils from '$shared/utils/url'

import ProductPageComponent from '$mp/components/ProductPage'
import NotFoundPage from '$mp/components/NotFoundPage'

describe('ProductPage', () => {
    let wrapper
    let props
    let sandbox

    const product = {
        id: 'product-1',
        name: 'Product 1',
        state: productStates.NOT_DEPLOYED,
    }
    const categories = [
        {
            id: 1, name: 'category 1',
        },
        {
            id: 2, name: 'category 1',
        },
    ]

    beforeEach(() => {
        sandbox = sinon.createSandbox()

        props = {
            product,
            streams: [],
            relatedProducts: [],
            fetchingProduct: false,
            fetchingStreams: false,
            isLoggedIn: false,
            editPermission: false,
            publishPermission: false,
            isProductSubscriptionValid: false,
            fetchingSharePermission: false,
            getProductById: sandbox.spy(),
            getProductSubscription: sandbox.spy(),
            getUserProductPermissions: sandbox.spy(),
            deniedRedirect: sandbox.spy(),
            onPurchase: sandbox.spy(),
            showPurchaseDialog: sandbox.spy(),
            showPublishDialog: sandbox.spy(),
            showStreamLiveDataDialog: sandbox.spy(),
            getRelatedProducts: sandbox.spy(),
            match: {
                params: {
                    id: product.id,
                },
            },
            translate: sandbox.stub().callsFake((str) => str),
        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('maps state to props', () => {
        const state = {
            categories: {
                ids: [1, 2],
            },
            relatedProducts: {
                ids: [],
                fetching: false,
                error: null,
            },
            product: {
                id: product.id,
                fetchingProduct: false,
                productError: null,
                streams: [],
                fetchingStreams: false,
                streamsError: null,
                fetchingContractProduct: false,
                contractProductError: null,
                fetchingContractSubscription: false,
                contractSubscriptionError: null,
                contractSubscription: null,
            },
            myPurchaseList: {
                ids: [],
                fetching: false,
                error: null,
            },
            user: {
                user: null,
                fetchingUserData: false,
                userDataError: null,
                apiKey: null,
                fetchingApiKey: false,
                apiKeyError: null,
                web3Accounts: null,
                fetchingWeb3Accounts: false,
                web3AccountsError: null,
                productPermissions: {
                    read: false,
                    write: false,
                    share: false,
                    fetchingPermissions: false,
                    permissionsError: null,
                },
                fetchingExternalLogin: false,
            },
            web3: {
                accountId: null,
                error: null,
                enabled: false,
            },
            entities: {
                products: {
                    'product-1': product,
                },
                categories: {
                    '1': categories[0],
                    '2': categories[1],
                },
            },
        }

        const expectedProps = {
            product,
            productError: null,
            streams: [],
            relatedProducts: [],
            fetchingProduct: false,
            fetchingStreams: false,
            isLoggedIn: false,
            editPermission: false,
            publishPermission: false,
            isProductSubscriptionValid: false,
            fetchingSharePermission: false,
        }

        assert.deepStrictEqual(mapStateToProps(state), expectedProps)
    })

    it('maps actions to props', () => {
        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const formatPathStub = sandbox.stub(urlUtils, 'formatPath')
        const doExternalLoginStub = sandbox.stub(authUtils, 'doExternalLogin')
        const getProductByIdStub = sandbox.stub(productActions, 'getProductById')
        const getProductSubscriptionStub = sandbox.stub(productActions, 'getProductSubscription')
        const purchaseProductStub = sandbox.stub(productActions, 'purchaseProduct')
        const getRelatedProductsStub = sandbox.stub(relatedProductsActions, 'getRelatedProducts')
        const getUserProductPermissions = sandbox.stub(userActions, 'getUserProductPermissions')
        const showModalStub = sandbox.stub(modalActions, 'showModal')

        const actions = mapDispatchToProps(dispatchStub)

        actions.getProductById(product.id)
        actions.getProductSubscription(product.id)
        actions.getUserProductPermissions(product.id)
        actions.deniedRedirect(product.id)
        actions.onPurchase(product.id, false)
        actions.onPurchase(product.id, true)
        actions.showPurchaseDialog(product)
        actions.showPurchaseDialog({
            ...product,
            id: null,
        })
        actions.showPublishDialog(product)
        actions.showPublishDialog({
            ...product,
            id: null,
        })
        actions.showStreamLiveDataDialog(product.id)
        actions.getRelatedProducts(product.id)

        expect(dispatchStub.callCount).toEqual(11)

        expect(getProductByIdStub.calledOnce).toEqual(true)
        expect(getProductByIdStub.calledWith(product.id)).toEqual(true)

        expect(getUserProductPermissions.calledOnce).toEqual(true)
        expect(getUserProductPermissions.calledWith(product.id)).toEqual(true)

        expect(getProductSubscriptionStub.calledOnce).toEqual(true)
        expect(getProductSubscriptionStub.calledWith(product.id)).toEqual(true)

        expect(formatPathStub.callCount).toEqual(2)
        expect(formatPathStub.calledWith('/products', product.id)).toEqual(true)

        expect(purchaseProductStub.calledOnce).toEqual(true)
        expect(doExternalLoginStub.calledOnce).toEqual(true)

        expect(getRelatedProductsStub.callCount).toEqual(1)
        expect(getRelatedProductsStub.calledWith(product.id)).toEqual(true)

        expect(showModalStub.callCount).toEqual(5)
    })

    describe('componentWillReceiveProps()', () => {
        it('handles id change in route param', () => {
            wrapper = shallow(<ProductPage {...props} />)

            const nextProductId = 'product-2'
            const nextProps = {
                ...props,
                match: {
                    params: {
                        id: nextProductId,
                    },
                },
            }

            wrapper.setProps(nextProps)

            expect(props.getProductById.callCount).toEqual(2)
            expect(props.getProductById.calledWith(product.id)).toEqual(true)
            expect(props.getProductById.calledWith(nextProductId)).toEqual(true)
            expect(props.getUserProductPermissions.callCount).toEqual(2)
            expect(props.getUserProductPermissions.calledWith(product.id)).toEqual(true)
            expect(props.getUserProductPermissions.calledWith(nextProductId)).toEqual(true)
            expect(props.getRelatedProducts.callCount).toEqual(2)
            expect(props.getRelatedProducts.calledWith(product.id)).toEqual(true)
            expect(props.getRelatedProducts.calledWith(nextProductId)).toEqual(true)
        })

        it('fetch subscription on hard load if login state changes', () => {
            wrapper = shallow(<ProductPage {...props} />)

            const nextProps = {
                ...props,
                isLoggedIn: true,
            }

            wrapper.setProps(nextProps)

            expect(props.getProductSubscription.calledOnce).toEqual(true)
            expect(props.getProductSubscription.calledWith(product.id)).toEqual(true)
        })

        it('overlays purchase dialog if purchase is allowed', () => {
            wrapper = shallow(<ProductPage {...props} />)

            const p = {
                ...product,
                state: productStates.DEPLOYED,
            }
            const nextProps = {
                ...props,
                overlayPurchaseDialog: true,
                isProductSubscriptionValid: false,
                product: p,
                isLoggedIn: true,
            }

            wrapper.setProps(nextProps)

            expect(props.showPurchaseDialog.calledOnce).toEqual(true)
            expect(props.showPurchaseDialog.calledWith(p)).toEqual(true)
        })

        it('must not overlay purchase dialog if we are logged out', () => {
            wrapper = shallow(<ProductPage {...props} />)

            const p = {
                ...product,
                state: productStates.DEPLOYED,
            }
            const nextProps = {
                ...props,
                overlayPurchaseDialog: true,
                isProductSubscriptionValid: false,
                product: p,
                isLoggedIn: false,
            }

            wrapper.setProps(nextProps)

            expect(props.showPurchaseDialog.calledOnce).toEqual(false)
            expect(props.deniedRedirect.calledOnce).toEqual(true)
        })

        it('redirects when overlaying purchase dialog and purchase is not allowed', () => {
            wrapper = shallow(<ProductPage {...props} />)

            const p = {
                ...product,
                state: productStates.NOT_DEPLOYED,
            }
            const nextProps = {
                ...props,
                overlayPurchaseDialog: true,
                isProductSubscriptionValid: false,
                product: p,
            }

            wrapper.setProps(nextProps)

            expect(props.deniedRedirect.calledOnce).toEqual(true)
            expect(props.deniedRedirect.calledWith(p.id)).toEqual(true)
        })

        it('redirects when overlaying purchase dialog and subscription exists', () => {
            wrapper = shallow(<ProductPage {...props} />)

            const p = {
                ...product,
                state: productStates.DEPLOYED,
            }
            const nextProps = {
                ...props,
                overlayPurchaseDialog: true,
                isProductSubscriptionValid: true,
                product: p,
            }

            wrapper.setProps(nextProps)

            expect(props.deniedRedirect.calledOnce).toEqual(true)
            expect(props.deniedRedirect.calledWith(p.id)).toEqual(true)
        })

        it('overlays publish dialog if publishing is allowed', () => {
            wrapper = shallow(<ProductPage {...props} />)

            const p = {
                ...product,
                state: productStates.DEPLOYED,
            }
            const nextProps = {
                ...props,
                overlayPublishDialog: true,
                fetchingSharePermission: false,
                publishPermission: true,
                product: p,
            }

            wrapper.setProps(nextProps)

            expect(props.showPublishDialog.calledOnce).toEqual(true)
            expect(props.showPublishDialog.calledWith(p)).toEqual(true)
        })

        it('overlays stream live data dialog', () => {
            wrapper = shallow(<ProductPage {...props} />)

            const streamId = 'stream-1'
            const nextProps = {
                ...props,
                overlayStreamLiveDataDialog: true,
                match: {
                    params: {
                        id: product.id,
                        streamId,
                    },
                },
            }

            wrapper.setProps(nextProps)

            expect(props.showStreamLiveDataDialog.calledOnce).toEqual(true)
            expect(props.showStreamLiveDataDialog.calledWith(streamId)).toEqual(true)
        })
    })

    describe('getProduct()', () => {
        it('starts product and related products fetching', () => {
            wrapper = shallow(<ProductPage {...props} />)
            wrapper.instance().getProduct(product.id)

            expect(props.getProductById.callCount).toEqual(2)
            expect(props.getProductById.calledWith(product.id)).toEqual(true)
            expect(props.getUserProductPermissions.callCount).toEqual(2)
            expect(props.getUserProductPermissions.calledWith(product.id)).toEqual(true)
            expect(props.getRelatedProducts.callCount).toEqual(2)
            expect(props.getRelatedProducts.calledWith(product.id)).toEqual(true)
        })

        it('starts product, related products and subscription fetching if logged in', () => {
            const nextProps = {
                ...props,
                isLoggedIn: true,
            }
            wrapper = shallow(<ProductPage {...nextProps} />)
            wrapper.instance().getProduct(product.id)

            expect(props.getProductById.callCount).toEqual(2)
            expect(props.getProductById.calledWith(product.id)).toEqual(true)
            expect(props.getUserProductPermissions.callCount).toEqual(2)
            expect(props.getUserProductPermissions.calledWith(product.id)).toEqual(true)
            expect(props.getRelatedProducts.callCount).toEqual(2)
            expect(props.getRelatedProducts.calledWith(product.id)).toEqual(true)
            expect(props.getProductSubscription.callCount).toEqual(2)
            expect(props.getProductSubscription.calledWith(product.id)).toEqual(true)
        })
    })

    describe('getPurchaseAllowed()', () => {
        it('must not allow purchase if product is not deployed', () => {
            const p = {
                ...product,
                state: productStates.NOT_DEPLOYED,
            }
            wrapper = shallow(<ProductPage {...props} />)
            expect(wrapper.instance().getPurchaseAllowed(p, false, true)).toEqual(false)
        })

        it('must not allow purchase if product is deploying', () => {
            const p = {
                ...product,
                state: productStates.DEPLOYING,
            }
            wrapper = shallow(<ProductPage {...props} />)
            expect(wrapper.instance().getPurchaseAllowed(p, false, true)).toEqual(false)
        })

        it('must not allow purchase if product is undeploying', () => {
            const p = {
                ...product,
                state: productStates.UNDEPLOYING,
            }
            wrapper = shallow(<ProductPage {...props} />)
            expect(wrapper.instance().getPurchaseAllowed(p, false, true)).toEqual(false)
        })

        it('allows purchase if product is free and no subscription exists', () => {
            const p = {
                ...product,
                state: productStates.DEPLOYED,
            }
            wrapper = shallow(<ProductPage {...props} />)
            expect(wrapper.instance().getPurchaseAllowed(p, false, true)).toEqual(true)
        })

        it('must not allow purchase if we are logged out', () => {
            const p = {
                ...product,
                state: productStates.DEPLOYED,
            }
            wrapper = shallow(<ProductPage {...props} />)
            expect(wrapper.instance().getPurchaseAllowed(p, false, false)).toEqual(false)
        })

        it('must not allow purchase if product is free and a subscription exists', () => {
            const p = {
                ...product,
                state: productStates.DEPLOYED,
            }
            wrapper = shallow(<ProductPage {...props} />)
            expect(wrapper.instance().getPurchaseAllowed(p, true, true)).toEqual(false)
        })
    })

    describe('getPublishButtonTitle()', () => {
        it('sets correct title for publish button', () => {
            const p = {
                ...product,
                state: productStates.NOT_DEPLOYED,
            }
            wrapper = shallow(<ProductPage {...props} />)
            expect(wrapper.instance().getPublishButtonTitle(p)).toEqual('editProductPage.publish')
        })

        it('sets correct title for publish button if product is undeploying', () => {
            const p = {
                ...product,
                state: productStates.UNDEPLOYING,
            }
            wrapper = shallow(<ProductPage {...props} />)
            expect(wrapper.instance().getPublishButtonTitle(p)).toEqual('editProductPage.unpublishing')
        })

        it('sets correct title for publish button if product is deploying', () => {
            const p = {
                ...product,
                state: productStates.DEPLOYING,
            }
            wrapper = shallow(<ProductPage {...props} />)
            expect(wrapper.instance().getPublishButtonTitle(p)).toEqual('editProductPage.publishing')
        })

        it('sets correct title for publish button if product is deployed', () => {
            const p = {
                ...product,
                state: productStates.DEPLOYED,
            }
            wrapper = shallow(<ProductPage {...props} />)
            expect(wrapper.instance().getPublishButtonTitle(p)).toEqual('editProductPage.unpublish')
        })
    })

    describe('getPublishButtonDisabled()', () => {
        it('sets publish button disabled if product is deploying', () => {
            const p = {
                ...product,
                state: productStates.UNDEPLOYING,
            }
            wrapper = shallow(<ProductPage {...props} />)
            expect(wrapper.instance().getPublishButtonDisabled(p)).toEqual(true)
        })

        it('sets publish button disabled if product is undeploying', () => {
            const p = {
                ...product,
                state: productStates.UNDEPLOYING,
            }
            wrapper = shallow(<ProductPage {...props} />)
            expect(wrapper.instance().getPublishButtonDisabled(p)).toEqual(true)
        })
    })

    describe('render()', () => {
        it('renders the component', () => {
            wrapper = shallow(<ProductPage {...props} />)
            expect(wrapper.find(ProductPageComponent).length).toEqual(1)
        })

        it('renders NotFoundPage when no product is found', () => {
            const nextProps = {
                ...props,
                productError: {
                    statusCode: 404,
                },
            }
            wrapper = shallow(<ProductPage {...nextProps} />)
            expect(wrapper.find(NotFoundPage).length).toEqual(1)
        })

        it('renders NotFoundPage when product id is invalid', () => {
            const nextProps = {
                ...props,
                productError: {
                    message: 'asdfasdf is not valid hex string',
                },
            }
            wrapper = shallow(<ProductPage {...nextProps} />)
            expect(wrapper.find(NotFoundPage).length).toEqual(1)
        })

        it('renders the correct toolbar actions with editPermission', () => {
            const nextProps = {
                ...props,
                editPermission: true,
            }

            wrapper = shallow(<ProductPage {...nextProps} />)

            const innerComponent = wrapper.find(ProductPageComponent)
            expect(innerComponent.length).toEqual(1)
            expect(typeof innerComponent.prop('toolbarActions').edit === 'object').toEqual(true)
        })

        it('renders the correct toolbar actions with publishPermission', () => {
            const nextProps = {
                ...props,
                publishPermission: true,
            }

            wrapper = shallow(<ProductPage {...nextProps} />)

            const innerComponent = wrapper.find(ProductPageComponent)
            expect(innerComponent.length).toEqual(1)
            expect(typeof innerComponent.prop('toolbarActions').publish === 'object').toEqual(true)
        })

        it('calls onPurchase', () => {
            wrapper = shallow(<ProductPage {...props} />)

            wrapper.find(ProductPageComponent).prop('onPurchase')()
            expect(props.onPurchase.calledOnce).toEqual(true)
            expect(props.onPurchase.calledWith(product.id, false)).toEqual(true)
        })
    })
})
