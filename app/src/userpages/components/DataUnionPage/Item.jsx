// @flow

import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { ago } from '$shared/utils/time'
import { productStates } from '$shared/utils/constants'
import Rect from '$shared/components/Rect'

const Container = styled.div`
    width: 100%;
    background: #FFFFFF;
    border: 1px solid #EFEFEF;
    border-radius: 4px;
    margin-bottom: 1rem;
`

const Header = styled.div`
    display: grid;
    grid-template-columns: 48px 1fr auto;
    height: 80px;
`

const ImageContainer = styled.div`
    overflow: hidden;
    position: relative;
`

const Image = styled.img`
    display: block;
    object-fit: cover;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
`

const Title = styled.div`

`

const Buttons = styled.div`

`

const Stats = styled.div`

`

type Props = {
    product: any,
}

const Item = ({ product }: Props) => {
    console.log(product)
    const productState = useMemo(() => {
        switch (product.state) {
            case productStates.NOT_DEPLOYED:
                return 'Not deployed'
            case productStates.DEPLOYED:
                return 'Deployed'
            case productStates.UNDEPLOYING:
                return 'Undeploying'
            case productStates.DEPLOYING:
                return 'Deploying'
            default:
                return 'N/A'
        }
    }, [product])

    return (
        <Container>
            <Header>
                <ImageContainer>
                    <Image src={product.imageUrl} />
                    <Rect height={48} ratio="1x1" />
                </ImageContainer>
                <Title>
                    {product.name}
                    {productState}
                    Updated {ago(new Date(product.updated))}
                </Title>
                <Buttons>
                    todo
                </Buttons>
            </Header>
            <Stats>
                todo
            </Stats>
        </Container>
    )
}

export default Item
