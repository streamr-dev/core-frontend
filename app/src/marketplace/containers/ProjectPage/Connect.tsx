import React, { FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import BN from 'bignumber.js'
import ProjectPage, { ProjectPageContainer, RelatedProductsContainer } from '$shared/components/ProjectPage'
import { StreamConnect } from '$shared/components/StreamConnect'
import { useUserHasAccessToProject } from '$mp/containers/ProductController/useUserHasAccessToProject'
import { DESKTOP, MEDIUM, TABLET } from '$shared/utils/styled'
import ProjectPng from '$shared/assets/images/project.png'
import { useController } from '$mp/containers/ProductController'
import Button from '$shared/components/Button'
import { usePurchaseProject } from '$shared/hooks/usePurchaseProject'
import RelatedProducts from '$mp/containers/ProjectPage/RelatedProducts'
import { projectTypeNames } from '$mp/utils/constants'
import PaymentRate from '$mp/components/PaymentRate'
import { formatChainName, getChainIdFromApiString } from '$shared/utils/chains'
import { timeUnits } from '$shared/utils/constants'
import { SelectedStreamContext } from '../SelectedStreamContext/SelectedStreamContext'

export const Connect: FunctionComponent = () => {
    const onPurchase = usePurchaseProject()
    const {product} = useController()
    const streamId: string = useContext(SelectedStreamContext)
    const userHasAccess: boolean = useUserHasAccessToProject()
    return <ProjectPage>
        <ProjectPageContainer>
            {
                userHasAccess
                    ? <StreamConnectContainer>
                        <StreamConnect streamId={streamId} />
                    </StreamConnectContainer>
                    : <GetAccessContainer>
                        <img src={ProjectPng}/>
                        <h1>Get access to {product.name}</h1>
                        <p>
                            <span>The streams in this {projectTypeNames[product.type]} can be accessed for <br/></span>
                            <strong>
                                <PaymentRate
                                    amount={new BN(product.pricePerSecond)}
                                    chainId={getChainIdFromApiString(product.chain)}
                                    pricingTokenAddress={product.pricingTokenAddress}
                                    timeUnit={timeUnits.hour}
                                    tag={'span'}
                                />
                            </strong>
                            <span> on </span>
                            <strong>{formatChainName(product.chain)}</strong>
                        </p>
                        <Button onClick={onPurchase}>Get Access</Button>
                    </GetAccessContainer>
            }
            <RelatedProductsContainer>
                <RelatedProducts />
            </RelatedProductsContainer>
        </ProjectPageContainer>
    </ProjectPage>
}

const StreamConnectContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  @media(${TABLET}) {
    padding: 40px;
  }
  @media(${DESKTOP}) {
    padding: 52px;
  }
  > * {
    max-width: 696px;
  }
  
`

const GetAccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 488px;
  margin: 0 auto;
  padding: 15px 0 100px;
  img {
    display: block;
  }
  h1 {
    font-weight: ${MEDIUM};
    font-size: 34px;
    line-height: 44px;
    margin-bottom: 19px;
    text-align: center;
  }
  p {
    font-size: 18px;
    line-height: 30px;
    margin-bottom: 50px;
    text-align: center;
  }
`

