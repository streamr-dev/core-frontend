// @flow

type Variables = {
    landingPage: string,
}

export default ({ landingPage }: Variables) => ({
    account: '/account/:tab(purchases|products)?',
    createProduct: '/account/products/create',
    editProduct: '/products/:id/edit',
    error: '/error',
    product: '/products/:id',
    publish: '/products/:id/publish',
    purchase: '/products/:id/purchase',
    streamPreview: '/products/:id/streamPreview/:streamId',
    whitepaper: `${landingPage}/whitepaper`,
})
