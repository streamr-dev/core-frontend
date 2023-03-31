import React, {FunctionComponent} from 'react'
import { Route as RouterRoute, Redirect } from 'react-router-dom'
import {UserIsAuthenticatedRoute} from '$auth/utils/userAuthenticated'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorPage from '$shared/components/ErrorPage'
// Userpages
import StreamCreatePage from '$app/src/pages/StreamCreatePage'
import StreamEditPage from '$app/src/pages/StreamEditPage'
import TransactionList from '$userpages/components/TransactionPage/List'
import PurchasesPage from '$userpages/components/PurchasesPage'
import ProductsPage from '$userpages/components/ProductsPage'
import EditProjectContainer from "$mp/containers/ProjectEditing/EditProjectPage"
import routes from '$routes'

const Route = withErrorBoundary(ErrorPage)(RouterRoute)
// Userpages Auth
const TransactionListAuth: FunctionComponent = (props) => <UserIsAuthenticatedRoute>
    <TransactionList {...props}/>
</UserIsAuthenticatedRoute>
const PurchasesPageAuth: FunctionComponent = (props) => <UserIsAuthenticatedRoute>
    <PurchasesPage {...props}/>
</UserIsAuthenticatedRoute>
const ProductsPageAuth: FunctionComponent = (props) => <UserIsAuthenticatedRoute>
    <ProductsPage {...props}/>
</UserIsAuthenticatedRoute>
const EditProductAuth: FunctionComponent = (props) => <UserIsAuthenticatedRoute>
    <EditProjectContainer {...props} />
</UserIsAuthenticatedRoute>
const StreamCreatePageAuth: FunctionComponent = (props) => <UserIsAuthenticatedRoute>
    <StreamCreatePage {...props}/>
</UserIsAuthenticatedRoute>

const UserpagesRouter = () => [
    <Route exact path={routes.streams.new()} component={StreamCreatePageAuth} key="StreamCreatePage" />,
    <Route exact path={routes.streams.show()} component={StreamEditPage} key="streamEditPage" />,
    <Redirect exact from={routes.streams.public.show()} to={routes.streams.show()} key="publicStreamPageRedir" />,
    <Redirect
        exact
        from={routes.streams.public.preview()}
        to={routes.streams.preview()}
        key="publicStreamPreviewPageRedir"
    />,
    <Route exact path={routes.transactions()} component={TransactionListAuth} key="TransactionList" />,
    <Route exact path={routes.subscriptions()} component={PurchasesPageAuth} key="PurchasesPage" />,
    <Route exact path={routes.products.index()} component={ProductsPageAuth} key="ProductsPage" />,
    // Redirect for the deleted page
    <Route exact path={routes.dataunions.index()} component={<Redirect to={routes.marketplace.index()}/>} key="DataUnionPage" />,
    <Route exact path={routes.products.edit()} component={EditProductAuth} key="EditProduct" />,
]

export default UserpagesRouter
