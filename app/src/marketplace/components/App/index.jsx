// @flow

import './globalStyles'

import React from 'react'
import { Route as RouterRoute, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import ModalManager from '../../containers/ModalManager'
import ProductPage from '../../containers/ProductPage'
import EditProductPage from '../../containers/EditProductPage'
import Products from '../../containers/Products'
import LoginPage from '$auth/containers/LoginPage'
import LogoutPage from '$auth/containers/LogoutPage'
import SignupPage from '$auth/containers/SignupPage'
import ForgotPasswordPage from '$auth/containers/ForgotPasswordPage'
import ResetPasswordPage from '$auth/containers/ResetPasswordPage'
import RegisterPage from '$auth/containers/RegisterPage'
import AccountPage from '../../containers/AccountPage'
import ComponentLibrary from '../../components/ComponentLibrary'
// TODO: Use '../../../userpages' when userpages are production-ready. #userpages-on-demand
import UserPages from '../../../userpages/current'
// TODO: Use '../../../docs' when docs are production-ready.
import Docs from '../../../docs/current'

import ModalRoot from '../../containers/ModalRoot'
import Notifications from '../../containers/Notifications'
import { formatPath } from '$shared/utils/url'
import { userIsAuthenticated } from '../../utils/auth'
import links from '../../../links'
import history from '../../../history'
import '../../../analytics'

import DatePicker from '../../../shared/components/DatePicker'
import LocaleSetter from '../../containers/LocaleSetter'
import NotFoundPage from '../NotFoundPage'
import GoogleAnalyticsTracker from '../GoogleAnalyticsTracker'
import isProduction from '../../utils/isProduction'
import ErrorPageView from '../ErrorPageView'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import routes from '$routes'

// Wrap authenticated components here instead of render() method
const AccountAuth = userIsAuthenticated(AccountPage)
const CreateProductAuth = userIsAuthenticated(EditProductPage)
const EditProductAuth = userIsAuthenticated(EditProductPage)

// Other components
const ProductPurchasePage = (props) => <ProductPage overlayPurchaseDialog {...props} />
const ProductPublishPage = (props) => <ProductPage overlayPublishDialog {...props} />
const StreamPreviewPage = (props) => <ProductPage overlayStreamLiveDataDialog {...props} />

// Wrap each Route to an ErrorBoundary
const Route = withErrorBoundary(ErrorPageView)(RouterRoute)

class A extends React.Component<{}, {
    date: Date,
}> {
    state = {
        date: new Date('2000-10-10'),
    }
    render() {
        return (
            <div>
                <DatePicker
                    onChange={(val) => {
                        this.setState({
                            date: val,
                        })
                    }}
                    value={this.state.date}
                    placeholder="Testi"
                    style={{
                        width: '500px',
                        maxWidth: '100%',
                    }}
                />
            </div>
        )
    }
}

const App = () => (
    <div>
        <ConnectedRouter history={history}>
            <div id="app">
                <LocaleSetter />
                <ModalManager />
                <Switch>
                    <Route path="/test" component={A} />
                    <Route exact path={routes.login()} component={LoginPage} />
                    <Route exact path={routes.logout()} component={LogoutPage} />
                    <Route path={routes.signUp()} component={SignupPage} />
                    <Route path={routes.forgotPassword()} component={ForgotPasswordPage} />
                    <Route path={routes.resetPassword()} component={ResetPasswordPage} />
                    <Route exact path={routes.register()} component={RegisterPage} />
                    <Redirect from="/login/auth" to={routes.login()} />
                    <Redirect from="/register/register" to={routes.register()} />
                    <Redirect from="/register/resetPassword" to={routes.resetPassword()} />
                    <Redirect from="/register/forgotPassword" to={routes.forgotPassword()} />
                    <Route path={routes.editProduct()} component={EditProductAuth} />
                    <Route path={formatPath(links.products, ':id', 'purchase')} component={ProductPurchasePage} />
                    <Route path={formatPath(links.products, ':id', 'publish')} component={ProductPublishPage} />
                    <Route path={formatPath(links.products, ':id', 'streamPreview', ':streamId')} component={StreamPreviewPage} />
                    <Route path={formatPath(links.products, ':id')} component={ProductPage} />
                    <Route exact path={links.main} component={Products} />
                    <Route exact path={formatPath(links.account, ':tab(purchases|products)')} component={AccountAuth} />
                    <Redirect exact from={links.account} to={formatPath(links.account, 'purchases')} />
                    <Route exact path={links.createProduct} component={CreateProductAuth} />
                    <Route exact path={formatPath(links.docs)} component={Docs} />
                    {!isProduction() && <Route exact path={formatPath(links.componentLibrary)} component={ComponentLibrary} />}
                    {!isProduction() && <UserPages />}
                    <Route exact path="/error" component={ErrorPageView} />
                    <Route component={NotFoundPage} />
                </Switch>
                <Notifications />
                <ModalRoot />
                {isProduction() && <GoogleAnalyticsTracker />}
            </div>
        </ConnectedRouter>
    </div>
)

export default App
