// @flow

type Variables = {
    landingPage: string,
    streamr: string,
}

export default ({ landingPage, streamr }: Variables) => ({
    marketplace: '/',
    account: '/account/:tab(purchases|products)?',
    createProduct: '/account/products/create',
    editProduct: '/products/:id/edit',
    error: '/error',
    externalForgotPassword: `${streamr}/auth/forgotPassword`,
    externalLogin: `${streamr}/j_spring_security_check`,
    externalRegister: `${streamr}/auth/register`,
    externalResetPassword: `${streamr}/auth/resetPassword`,
    externalSignUp: `${streamr}/auth/signup`,
    forgotPassword: '/',
    product: '/products/:id',
    publish: '/products/:id/publish',
    purchase: '/products/:id/purchase',
    streamPreview: '/products/:id/streamPreview/:streamId',
    whitepaper: `${landingPage}/whitepaper`,
})
