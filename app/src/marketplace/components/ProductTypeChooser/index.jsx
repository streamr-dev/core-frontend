// @flow

import * as React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import standardProductImage from '$mp/assets/product_standard.png'
import standardProductImage2x from '$mp/assets/product_standard@2x.png'
import dataUnionImage from '$mp/assets/product_dataunion.png'
import dataUnionImage2x from '$mp/assets/product_dataunion@2x.png'
import routes from '$routes'
import docsLinks from '$shared/../docsLinks'
import { productTypes } from '$mp/utils/constants'

type Props = {
    className?: string,
}

const Root = styled.div`
  color: #323232;
`

const PageTitle = styled.div`
    font-family: var(--sans);
    font-size: 36px;
    letter-spacing: 0;
    line-height: 40px;
    text-align: center;
`

const ProductChoices = styled.div`
    margin-top: 6.25em;
    display: grid;
    grid-template-columns: 440px 440px;
    grid-column-gap: 80px;
`

const Product = styled.div`
    display: grid;
    grid-row-gap: 1px;

    > *:first-child {
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    > *:last-child {
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
    }

    > * {
        background: white;
    }
`

const ProductTitle = styled(Translate)`
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-size: 20px;
    letter-spacing: 0;
    font-family: var(--sans);
`

const ProductImage = styled.div`
    height: 304px;
    position: relative;

    > img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 200px;
        width: auto;
    }
`

const ProductText = styled.div`
    padding: 1.875rem 3.15rem 2.5rem 3.15rem;
    line-height: 24px;
    letter-spacing: 0;
    font-size: 16px;
    text-align: center;

    > a {
        margin-top: 2rem;
    }
`

const ProductTypeChooser = ({ className }: Props) => (
    <Root className={className}>
        <PageTitle>
            <Translate value="productTypeChooser.title" />
        </PageTitle>
        <ProductChoices>
            <Product>
                <ProductTitle tag="div" value="productTypeChooser.standard.title" />
                <ProductImage>
                    <img
                        src={standardProductImage}
                        srcSet={`${standardProductImage2x} 2x`}
                        alt={I18n.t('productTypeChooser.standard.title')}
                    />
                </ProductImage>
                <ProductText>
                    <Translate
                        value="productTypeChooser.standard.description"
                        docsLink={docsLinks.streams}
                        dangerousHTML
                    />
                    <Button
                        kind="primary"
                        outline
                        tag={Link}
                        to={routes.newProduct({
                            type: productTypes.NORMAL,
                        })}
                    >
                        <Translate value="productTypeChooser.standard.linkTitle" />
                    </Button>
                </ProductText>
            </Product>
            <Product>
                <ProductTitle tag="div" value="productTypeChooser.dataUnion.title" />
                <ProductImage>
                    <img
                        src={dataUnionImage}
                        srcSet={`${dataUnionImage2x} 2x`}
                        alt={I18n.t('productTypeChooser.dataUnion.title')}
                    />
                </ProductImage>
                <ProductText>
                    <Translate value="productTypeChooser.dataUnion.description" />
                    <Button
                        kind="primary"
                        outline
                        tag={Link}
                        to={routes.newProduct({
                            type: productTypes.DATAUNION,
                        })}
                    >
                        <Translate value="productTypeChooser.dataUnion.linkTitle" />
                    </Button>
                </ProductText>
            </Product>
        </ProductChoices>
    </Root>
)

export default ProductTypeChooser
