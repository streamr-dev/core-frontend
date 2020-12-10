// @flow

import React, { useMemo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { type Product } from '$mp/flowtype/product-types'
import { ago } from '$shared/utils/time'
import { productStates } from '$shared/utils/constants'
import SvgIcon from '$shared/components/SvgIcon'
import UnstyledPopover from '$shared/components/Popover'
import Tooltip from '$shared/components/Tooltip'
import { isEthereumAddress } from '$mp/utils/validate'
import { MEDIUM } from '$shared/utils/styled'

import Management from './Management'

const Container = styled.div`
    width: 100%;
    background: #FFFFFF;
    border: 1px solid #EFEFEF;
    border-radius: 4px;
    margin-bottom: 1rem;
    color: #323232;

    &:hover {
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
    }
`

const Header = styled.div`
    display: grid;
    grid-template-columns: 80px 1fr auto;
    height: 80px;    
`

const ImageContainer = styled.div`
    overflow: hidden;
    position: relative;
    padding: 16px;
    cursor: pointer;
`

const Image = styled.img`
    display: block;
    object-fit: cover;
    height: 48px;
    width: 48px;
`

const TitleContainer = styled.div`
    align-self: center;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const Name = styled.div`
    font-weight: ${MEDIUM};
    font-size: 16px;
    line-height: 18px;
`

const Details = styled.div`
    line-height: 18px;
`

const State = styled.span`
    font-weight: ${MEDIUM};
    font-size: 12px;
    line-height: 18px;
    margin-right: 6px;
`

const Updated = styled.span`
    font-size: 12px;
    line-height: 18px;
    color: #ADADAD;
`

const Buttons = styled.div`
    align-self: center;
    margin-right: 24px;
`

const Button = styled.button`
    margin: 0 4px 0 0;
    padding: 0;
    border: none;
    background: none;
    outline: none;
    color: #ADADAD;
    transition: 200ms ease-in-out color;

    &:hover {
        color: #323232;
    }

    &:focus {
        outline: none;
    }
`

const Icon = styled(SvgIcon)`
    width: 32px;
    height: 32px;
`

const Popover = styled(UnstyledPopover)`
    display: inline-flex;
    vertical-align: middle;
`

const Stats = styled.div`
    border-top: 1px solid #EFEFEF;
    display: grid;
    grid-auto-flow: column;
`

const Stat = styled.div`
    border-right: 1px solid #EFEFEF;
    margin: 16px 0;

    &:last-child {
        border-right: none;
    }
`

const Key = styled.div`
    display: flex;
    justify-content: center;
    font-size: 12px;
    line-height: 26px;
    color: #ADADAD;
`

const Value = styled.div`
    display: flex;
    justify-content: center;
    font-size: 16px;
    line-height: 21px;
    color: #323232;
`

type Props = {
    product: Product,
}

const Item = ({ product }: Props) => {
    const [isOpen, setIsOpen] = useState(true)

    const productState = useMemo(() => {
        if (product.state === productStates.DEPLOYED &&
            isEthereumAddress(product.beneficiaryAddress)) {
            return 'Deployed'
        }
        return 'Draft'
    }, [product])

    const onHeaderClick = useCallback(() => {
        setIsOpen(!isOpen)
    }, [isOpen])

    return (
        <Container>
            <Header>
                <ImageContainer onClick={onHeaderClick}>
                    <Image src={product.imageUrl} />
                </ImageContainer>
                <TitleContainer onClick={onHeaderClick}>
                    <Name>
                        {product.name}
                    </Name>
                    <Details>
                        <State>
                            {productState}
                        </State>
                        {product.state === productStates.DEPLOYED ? (
                            product.beneficiaryAddress
                        ) : (
                            <Updated>
                                Updated {ago(new Date(product.updated || 0))}
                            </Updated>
                        )}
                    </Details>
                </TitleContainer>
                <Buttons>
                    <Tooltip value="View on Etherscan">
                        <Button onClick={() => console.log('click')}>
                            <Icon name="externalLink" />
                        </Button>
                    </Tooltip>
                    <Tooltip value="Edit product">
                        <Button onClick={() => console.log('click')}>
                            <Icon name="pencil" />
                        </Button>
                    </Tooltip>
                    <Tooltip value="View on marketplace">
                        <Button onClick={() => console.log('click')}>
                            <Icon name="eye" />
                        </Button>
                    </Tooltip>
                    <Popover
                        title="Options"
                        noCaret
                        type="meatball"
                        menuProps={{
                            right: true,
                        }}
                    >
                        <Popover.Item onClick={() => console.log('test')}>Unpublish</Popover.Item>
                        <Popover.Item onClick={() => console.log('test')}>Hide</Popover.Item>
                    </Popover>
                </Buttons>
            </Header>
            <Stats>
                <Stat>
                    <Key>Join requests</Key>
                    <Value>0</Value>
                </Stat>
                <Stat>
                    <Key>Members</Key>
                    <Value>12</Value>
                </Stat>
                <Stat>
                    <Key>Revenue</Key>
                    <Value>123</Value>
                </Stat>
                <Stat>
                    <Key>Admin fees</Key>
                    <Value>123</Value>
                </Stat>
                <Stat>
                    <Key>Avg user revenue / wk</Key>
                    <Value>123</Value>
                </Stat>
                <Stat>
                    <Key>Subscribers</Key>
                    <Value>123</Value>
                </Stat>
            </Stats>
            {isOpen && (
                <Management product={product} />
            )}
        </Container>
    )
}

export default Item
