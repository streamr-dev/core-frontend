import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'

import { Products, mapStateToProps, mapDispatchToProps } from '../../../../src/containers/Products'
import * as categoryActions from '../../../../src/modules/categories/actions'
import * as productActions from '../../../../src/modules/productList/actions'
import ProductsComponent from '../../../../src/components/Products'
import ActionBar from '../../../../src/components/ActionBar'

describe('Products', () => {
    let wrapper
    let props
    let sandbox

    const products = [
        {
            id: 1, name: 'product 1',
        },
        {
            id: 2, name: 'product 1',
        },
        {
            id: 3, name: 'product 1',
        },
    ]
    const categories = [
        {
            id: 1, name: 'category 1',
        },
        {
            id: 2, name: 'category 1',
        },
    ]
    const filter = {
        search: '',
        categories: null,
        sortBy: null,
        maxPrice: null,
    }

    beforeEach(() => {
        sandbox = sinon.createSandbox()

        props = {
            categories,
            products,
            productsError: null,
            filter,
            isFetching: false,
            hasMoreSearchResults: false,
            loadCategories: sandbox.spy(),
            loadProducts: sandbox.spy(),
            onFilterChange: sandbox.spy(),
            onSearchChange: sandbox.spy(),
            clearFiltersAndReloadProducts: sandbox.spy(),
        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('renders the component', () => {
        wrapper = shallow(<Products {...props} />)
        expect(wrapper.find(ActionBar).length).toEqual(1)
        expect(wrapper.find(ProductsComponent).length).toEqual(1)
    })

    it('maps state to props', () => {
        const state = {
            categories: {
                ids: [1, 2],
            },
            productList: {
                ids: [1, 2, 3],
                error: null,
                filter,
                fetching: false,
                hasMoreSearchResults: false,
            },
            entities: {
                products: {
                    '1': products[0],
                    '2': products[1],
                    '3': products[2],
                },
                categories: {
                    '1': categories[0],
                    '2': categories[1],
                },
            },
        }

        const expectedProps = {
            categories,
            products,
            productsError: null,
            filter,
            isFetching: false,
            hasMoreSearchResults: false,
        }

        assert.deepStrictEqual(mapStateToProps(state), expectedProps)
    })

    it('maps actions to props', () => {
        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const getCategoriesStub = sandbox.stub(categoryActions, 'getCategories')
            .callsFake(() => 'getCategories')
        const getProductsStub = sandbox.stub(productActions, 'getProducts')
            .callsFake(() => 'getProducts')
        const getProductsDebouncedStub = sandbox.stub(productActions, 'getProductsDebounced')
            .callsFake(() => 'getProductsDebounced')
        const updateFilterStub = sandbox.stub(productActions, 'updateFilter')
            .callsFake(() => 'updateFilter')
        const clearFiltersStub = sandbox.stub(productActions, 'clearFilters')
            .callsFake(() => 'clearFilters')

        const actions = mapDispatchToProps(dispatchStub)

        actions.loadCategories()
        actions.loadProducts()
        actions.onFilterChange(filter)
        actions.onSearchChange(filter)
        actions.clearFiltersAndReloadProducts()

        expect(dispatchStub.callCount).toEqual(8)
        expect(getCategoriesStub.calledOnce).toEqual(true)
        expect(getCategoriesStub.calledWith(false)).toEqual(true)
        expect(getProductsStub.callCount).toEqual(3)
        expect(getProductsStub.calledWith(true)).toEqual(true)
        expect(getProductsDebouncedStub.callCount).toEqual(1)
        expect(getProductsDebouncedStub.calledWith(true)).toEqual(true)
        expect(updateFilterStub.callCount).toEqual(2)
        expect(updateFilterStub.calledWith(filter)).toEqual(true)
        expect(clearFiltersStub.callCount).toEqual(1)
    })

    it('loads categories', () => {
        wrapper = shallow(<Products {...props} />)

        expect(props.loadCategories.calledOnce).toEqual(true)
        expect(props.clearFiltersAndReloadProducts.calledOnce).toEqual(false)
    })

    it('loads categories and products if necessary', () => {
        const nextProps = {
            ...props,
            products: [],
        }
        wrapper = shallow(<Products {...nextProps} />)

        expect(props.loadCategories.calledOnce).toEqual(true)
        expect(props.clearFiltersAndReloadProducts.calledOnce).toEqual(true)
    })
})
