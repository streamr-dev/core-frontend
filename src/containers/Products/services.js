import { callApi } from '../../utils/api'

export const getProducts = () => callApi('products')

export const getProductById = (id) => callApi(`products/${id}`)