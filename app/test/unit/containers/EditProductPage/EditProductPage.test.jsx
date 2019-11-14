import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'
import { productStates } from '$shared/utils/constants'
import * as validators from '$mp/validators'
import { I18n } from 'react-redux-i18n'

import { EditProductPage, mapStateToProps, mapDispatchToProps } from '$mp/containers/deprecated/EditProductPage'
import ProductPageEditorComponent from '$mp/components/deprecated/ProductPageEditor'
import * as productActions from '$mp/modules/product/actions'
import * as editProductActions from '$mp/modules/deprecated/editProduct/actions'
import * as streamsActions from '$mp/modules/streams/actions'
import * as categoriesActions from '$mp/modules/categories/actions'
import * as contractProductActions from '$mp/modules/contractProduct/actions'

import * as contactProductSelectors from '$mp/modules/contractProduct/selectors'
import * as productSelectors from '$mp/modules/product/selectors'
import * as web3Selectors from '$mp/modules/web3/selectors'
import * as categoriesSelectors from '$mp/modules/categories/selectors'
import * as userSelectors from '$shared/modules/user/selectors'
import * as streamsSelectors from '$mp/modules/streams/selectors'
import * as editProductSelectors from '$mp/modules/deprecated/editProduct/selectors'

describe('EditProductPage', () => {
    let wrapper
    let props
    let sandbox

    const product = {
        id: '300edc545c7f5315c132e3ce472cc63ce7fdb71515ed07431ff4c9434c97c04f',
        name: 'testName',
        description: 'testDescription',
        state: productStates.NOT_DEPLOYED,
        pricePerSecond: '30',
        beneficiaryAddress: '0x123',
    }

    beforeEach(() => {
        sandbox = sinon.createSandbox()

        props = {
            availableStreams: [],
            categories: [],
            category: {
                id: '0xid',
                name: 'name',
                imageUrl: 'url',
            },
            contractProduct: product,
            confirmNoCoverImage: sandbox.spy(),
            editPermission: true,
            editProduct: product,
            fetchingProduct: false,
            fetchingStreams: false,
            getContractProduct: sandbox.spy(),
            getCategories: sandbox.spy(),
            getProductById: sandbox.spy(),
            getStreams: sandbox.spy(),
            getUserProductPermissions: sandbox.spy(),
            initEditProductProp: sandbox.spy(),
            initProduct: sandbox.spy(),
            match: {
                params: {
                    id: product.id,
                },
            },
            onCancel: sandbox.spy(),
            onEditProp: sandbox.spy(),
            onPublish: sandbox.spy(),
            onReset: sandbox.spy(),
            onSaveAndExit: sandbox.spy(),
            ownerAddress: '0xid',
            product,
            publishPermission: true,
            redirect: sandbox.spy(),
            setImageToUploadProp: sandbox.spy(),
            streams: [],
            user: {
                name: 'bob',
                username: 'bobcat69',
            },
        }
        sandbox.stub(I18n, 't').callsFake(String)
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('render()', () => {
        it('renders the component', () => {
            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.find(ProductPageEditorComponent).length).toEqual(1)
        })

        it('renders the correct toolbar actions with editPermission', () => {
            const nextProps = {
                ...props,
                editPermission: true,
            }

            wrapper = shallow(<EditProductPage {...nextProps} />)

            const innerComponent = wrapper.find(ProductPageEditorComponent)
            expect(innerComponent.length).toEqual(1)
            expect(typeof innerComponent.prop('toolbarActions').saveAndExit).toEqual('object')
        })

        it('renders the correct toolbar actions with publishPermission', () => {
            const nextProps = {
                ...props,
                publishPermission: true,
            }

            wrapper = shallow(<EditProductPage {...nextProps} />)

            const innerComponent = wrapper.find(ProductPageEditorComponent)
            expect(innerComponent.length).toEqual(1)
            expect(typeof innerComponent.prop('toolbarActions').saveAndExit).toEqual('object')
        })
    })

    describe('componentDidUpdate()', () => {
        it('initiates the EditProduct redux object on load', () => {
            const alteredProps = {
                ...props,
            }
            delete alteredProps.editProduct
            wrapper = shallow(<EditProductPage {...alteredProps} />)
            wrapper.setProps(props)
            expect(props.initEditProductProp.callCount).toEqual(1)
        })
    })

    describe('componentDidMount()', () => {
        it('resets the EditProduct redux object', () => {
            wrapper = shallow(<EditProductPage {...props} />)
            expect(props.onReset.callCount).toEqual(1)
            expect(props.getCategories.callCount).toEqual(1)
            expect(props.getStreams.callCount).toEqual(1)
        })
    })

    describe('componentWillUnmount()', () => {
        it('resets the EditProduct redux object', () => {
            wrapper = shallow(<EditProductPage {...props} />)
            props.onReset.callCount = 0
            wrapper.unmount()
            expect(props.onReset.callCount).toEqual(1)
        })
    })

    it('maps state to props', () => {
        const fetchingCategoriesStub = sandbox.stub(categoriesSelectors, 'selectFetchingCategories').callsFake(() => 'selectFetchingCategories')
        const selectAllCategoriesStub = sandbox.stub(categoriesSelectors, 'selectAllCategories').callsFake(() => 'selectAllCategories')
        const selectContractProductStub = sandbox.stub(contactProductSelectors, 'selectContractProduct').callsFake(() => 'selectContractProduct')
        const selectEditProductStub = sandbox.stub(editProductSelectors, 'selectEditProduct').callsFake(() => 'selectEditProduct')
        const selectEditProductStreamsStub = sandbox.stub(editProductSelectors, 'selectStreams').callsFake(() => 'selectStreams')
        const selectCategoryStub = sandbox.stub(editProductSelectors, 'selectCategory').callsFake(() => 'selectCategory')
        const selectImageToUploadStub = sandbox.stub(editProductSelectors, 'selectImageToUpload').callsFake(() => 'selectImageToUpload')
        const selectProductStub = sandbox.stub(productSelectors, 'selectProduct').callsFake(() => 'selectProduct')
        const selectFetchingProductStub = sandbox.stub(productSelectors, 'selectFetchingProduct').callsFake(() => 'selectFetchingProduct')
        const selectProductErrorStub = sandbox.stub(productSelectors, 'selectProductError').callsFake(() => 'selectProductError')
        const selectFetchingStreamsStub = sandbox.stub(productSelectors, 'selectFetchingStreams').callsFake(() => 'selectFetchingStreams')
        const selectStreamsErrorStub = sandbox.stub(productSelectors, 'selectStreamsError').callsFake(() => 'selectStreamsError')
        const selectStreamsStub = sandbox.stub(streamsSelectors, 'selectStreams').callsFake(() => 'selectStreams')
        const selectProductEditPermissionStub = sandbox.stub(productSelectors, 'selectProductEditPermission')
            .callsFake(() => 'selectProductEditPermission')
        const selectUserDataStub = sandbox.stub(userSelectors, 'selectUserData').callsFake(() => 'selectUserData')
        const selectAccountIdStub = sandbox.stub(web3Selectors, 'selectAccountId').callsFake(() => 'selectAccountId')

        const state = {}
        const expectedProps = {
            availableStreams: 'selectStreams',
            categories: 'selectAllCategories',
            category: 'selectCategory',
            contractProduct: 'selectContractProduct',
            editPermission: 'selectProductEditPermission',
            editProduct: 'selectEditProduct',
            fetchingCategories: 'selectFetchingCategories',
            fetchingProduct: 'selectFetchingProduct',
            fetchingStreams: 'selectFetchingStreams',
            imageUpload: 'selectImageToUpload',
            product: 'selectProduct',
            productError: 'selectProductError',
            ownerAddress: 'selectAccountId',
            streams: 'selectStreams',
            streamsError: 'selectStreamsError',
            user: 'selectUserData',
        }

        assert.deepStrictEqual(mapStateToProps(state), expectedProps)
        expect(fetchingCategoriesStub.calledWith(state)).toEqual(true)
        expect(selectAllCategoriesStub.calledWith(state)).toEqual(true)
        expect(selectContractProductStub.calledWith(state)).toEqual(true)
        expect(selectEditProductStub.calledWith(state)).toEqual(true)
        expect(selectEditProductStreamsStub.calledWith(state)).toEqual(true)
        expect(selectStreamsStub.calledWith(state)).toEqual(true)
        expect(selectCategoryStub.calledWith(state)).toEqual(true)
        expect(selectImageToUploadStub.calledWith(state)).toEqual(true)
        expect(selectProductStub.calledWith(state)).toEqual(true)
        expect(selectFetchingProductStub.calledWith(state)).toEqual(true)
        expect(selectProductErrorStub.calledWith(state)).toEqual(true)
        expect(selectFetchingStreamsStub.calledWith(state)).toEqual(true)
        expect(selectStreamsErrorStub.calledWith(state)).toEqual(true)
        expect(selectProductEditPermissionStub.calledWith(state)).toEqual(true)
        expect(selectUserDataStub.calledWith(state)).toEqual(true)
        expect(selectAccountIdStub.calledWith(state)).toEqual(true)
    })

    it('maps actions to props', () => {
        sandbox.stub(productActions, 'getProductById').callsFake(() => 'getProductById')
        sandbox.stub(contractProductActions, 'getProductFromContract').callsFake(() => 'getProductFromContract')
        sandbox.stub(editProductActions, 'setImageToUpload').callsFake(() => 'setImageToUpload')
        sandbox.stub(editProductActions, 'updateEditProductField').callsFake(() => 'updateEditProductField')
        sandbox.stub(editProductActions, 'initEditProduct').callsFake(() => 'initEditProduct')
        sandbox.stub(productActions, 'getUserProductPermissions').callsFake(() => 'getUserProductPermissions')
        sandbox.stub(editProductActions, 'initNewProduct').callsFake(() => 'initNewProduct')
        sandbox.stub(categoriesActions, 'getCategories').callsFake(() => 'getCategories')
        sandbox.stub(streamsActions, 'getStreams').callsFake(() => 'getStreams')
        sandbox.stub(editProductActions, 'resetEditProduct').callsFake(() => 'resetEditProduct')
        sandbox.stub(editProductActions, 'createProductAndRedirect').callsFake(() => 'createProductAndRedirect')

        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const actions = mapDispatchToProps(dispatchStub)

        const result = {
            getProductById: actions.getProductById(),
            getContractProduct: actions.getContractProduct(),
            setImageToUploadProp: actions.setImageToUploadProp(),
            onEditProp: actions.onEditProp(),
            initEditProductProp: actions.initEditProductProp(),
            getUserProductPermissions: actions.getUserProductPermissions(),
            initProduct: actions.initProduct(),
            getCategories: actions.getCategories(),
            getStreams: actions.getStreams(),
            onPublish: actions.onPublish(),
            onSaveAndExit: actions.onSaveAndExit(),
            onReset: actions.onReset(),
        }

        const expectedResult = {
            getProductById: 'getProductById',
            getContractProduct: 'getProductFromContract',
            setImageToUploadProp: 'setImageToUpload',
            onEditProp: 'updateEditProductField',
            initEditProductProp: 'initEditProduct',
            getUserProductPermissions: 'getUserProductPermissions',
            initProduct: 'initNewProduct',
            getCategories: 'getCategories',
            getStreams: 'getStreams',
            onPublish: 'createProductAndRedirect',
            onSaveAndExit: 'createProductAndRedirect',
            onReset: 'resetEditProduct',
        }

        assert.deepStrictEqual(result, expectedResult)
        expect(dispatchStub.callCount).toEqual(Object.keys(expectedResult).length)
    })

    describe('isPublishButtonDisabled()', () => {
        it('publish button is disabled when the product is deploying', () => {
            const p = {
                ...product,
                state: productStates.DEPLOYING,
            }

            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().isPublishButtonDisabled(p)).toEqual(true)
        })

        it('publish button is disabled when the product is undeploying', () => {
            const p = {
                ...product,
                state: productStates.UNDEPLOYING,
            }

            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().isPublishButtonDisabled(p)).toEqual(true)
        })

        it('publish button is enabled when the product is deployed', () => {
            const p = {
                ...product,
                state: productStates.DEPLOYED,
            }

            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().isPublishButtonDisabled(p)).toEqual(false)
        })

        it('publish button is enabled when the product is undeployed', () => {
            const p = {
                ...product,
                state: productStates.UNDEPLOYED,
            }

            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().isPublishButtonDisabled(p)).toEqual(false)
        })
    })

    describe('isUpdateButtonDisabled()', () => {
        it('update button is disabled when the product is deploying', () => {
            const p = {
                ...product,
                state: productStates.DEPLOYING,
            }

            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().isUpdateButtonDisabled(p)).toEqual(true)
        })

        it('update button is disabled when the product is undeploying', () => {
            const p = {
                ...product,
                state: productStates.UNDEPLOYING,
            }

            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().isUpdateButtonDisabled(p)).toEqual(true)
        })

        it('update button is enabled when the product is deployed', () => {
            const p = {
                ...product,
                state: productStates.DEPLOYED,
            }

            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().isUpdateButtonDisabled(p)).toEqual(false)
        })

        it('update button is enabled when the product is undeployed', () => {
            const p = {
                ...product,
                state: productStates.UNDEPLOYED,
            }

            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().isUpdateButtonDisabled(p)).toEqual(false)
        })
    })

    describe('getUpdateButtonTitle()', () => {
        it('sets correct title for the update button when product is undeployed', () => {
            const alteredProps = {
                ...props,
                editProduct: {
                    ...product,
                    beneficiaryAddress: '0x5678hurryuporyoullbelate',
                    pricePerSecond: '99',
                    state: productStates.NOT_DEPLOYED,
                },
            }

            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().getUpdateButtonTitle(alteredProps.editProduct)).toEqual('editProductPage.save')
        })

        it('sets correct title for the update button when smart contract interaction is required', () => {
            const alteredProps = {
                ...props,
                editProduct: {
                    ...product,
                    beneficiaryAddress: '0x5678hurryuporyoullbelate',
                    pricePerSecond: '99',
                    state: productStates.DEPLOYED,
                },
            }

            wrapper = shallow(<EditProductPage {...alteredProps} />)
            expect(wrapper.instance().getUpdateButtonTitle(alteredProps.editProduct)).toEqual('editProductPage.republish')
        })

        it('sets correct title for the update button when no smart contract interaction is required', () => {
            const alteredProps = {
                ...props,
                editProduct: {
                    ...product,
                    name: 'new title',
                    description: 'new description',
                    state: productStates.DEPLOYED,
                },
            }

            wrapper = shallow(<EditProductPage {...alteredProps} />)
            expect(wrapper.instance().getUpdateButtonTitle(alteredProps.editProduct)).toEqual('editProductPage.update')
        })
    })

    describe('getPublishButtonTitle()', () => {
        it('sets correct title for publish button', () => {
            const p = {
                ...product,
                state: productStates.NOT_DEPLOYED,
            }

            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().getPublishButtonTitle(p)).toEqual('editProductPage.publish')
        })

        it('sets correct title for publish button if product is undeploying', () => {
            const p = {
                ...product,
                state: productStates.UNDEPLOYING,
            }

            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().getPublishButtonTitle(p)).toEqual('editProductPage.unpublishing')
        })

        it('sets correct title for publish button if product is deploying', () => {
            const p = {
                ...product,
                state: productStates.DEPLOYING,
            }

            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().getPublishButtonTitle(p)).toEqual('editProductPage.publishing')
        })

        it('sets correct title for publish button if product is deployed', () => {
            const p = {
                ...product,
                state: productStates.DEPLOYED,
            }

            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().getPublishButtonTitle(p)).toEqual('editProductPage.unpublish')
        })
    })

    describe('isEdit()', () => {
        it('returns true if ID is found in the URL', () => {
            const alteredProps = {
                ...props,
                match: {
                    params: {
                        id: 'weatherdata123',
                    },
                },
            }

            wrapper = shallow(<EditProductPage {...alteredProps} />)
            expect(wrapper.instance().isEdit()).toEqual(true)
        })

        it('returns false if the ID cannot be retrieved from the URL', () => {
            const alteredProps = {
                ...props,
                match: {
                    params: {
                        id: undefined,
                    },
                },
            }

            wrapper = shallow(<EditProductPage {...alteredProps} />)
            expect(wrapper.instance().isEdit()).toEqual(false)
        })

        it('returns false if ID from the URL is empty', () => {
            const alteredProps = {
                ...props,
                match: {
                    params: {
                        id: '',
                    },
                },
            }

            wrapper = shallow(<EditProductPage {...alteredProps} />)
            expect(wrapper.instance().isEdit()).toEqual(false)
        })
    })

    describe('isWeb3Required()', () => {
        it('Web3 is not required when the price & beneficiary addresses remain unchanged', () => {
            wrapper = shallow(<EditProductPage {...props} />)
            expect(wrapper.instance().isWeb3Required()).toEqual(false)
        })

        it('Web3 is not required for a free product', () => {
            const alteredProps = {
                ...props,
                product: {
                    ...product,
                    pricePerSecond: '0',
                },
            }

            wrapper = shallow(<EditProductPage {...alteredProps} />)
            expect(wrapper.instance().isWeb3Required()).toEqual(false)
        })

        it('Web3 is required when the price has been changed', () => {
            const alteredProps = {
                ...props,
                editProduct: {
                    ...product,
                    pricePerSecond: '20',
                },
            }

            wrapper = shallow(<EditProductPage {...alteredProps} />)
            expect(wrapper.instance().isWeb3Required()).toEqual(true)
        })

        it('Web3 is required when the beneficiary address has been changed', () => {
            const alteredProps = {
                ...props,
                editProduct: {
                    ...product,
                    beneficiaryAddress: '0x5678',
                },
            }

            wrapper = shallow(<EditProductPage {...alteredProps} />)
            expect(wrapper.instance().isWeb3Required()).toEqual(true)
        })
    })

    describe('validateProductBeforeSaving()', () => {
        it('displays user confirmation/validations before saving', (done) => {
            const alteredProps = {
                ...props,
                editProduct: {
                    ...product,
                    state: productStates.NOT_DEPLOYED,
                    pricePerSecond: '30',
                    isFree: false,
                },
            }
            wrapper = shallow(<EditProductPage {...alteredProps} />)
            const confirmCoverImageBeforeSavingSpy = sandbox.spy(wrapper.instance(), 'confirmCoverImageBeforeSaving')
            sandbox.stub(validators, 'editProductValidator').resolves(true)
            wrapper.instance().validateProductBeforeSaving()
            setTimeout(() => {
                expect(confirmCoverImageBeforeSavingSpy.callCount).toEqual(1)
                done()
            }, 300)
        })
    })
})
