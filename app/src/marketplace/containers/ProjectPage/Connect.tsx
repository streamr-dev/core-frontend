import React, {FunctionComponent, useMemo} from 'react'
import styled from 'styled-components'
import ProjectPage, { ProjectPageContainer } from '$shared/components/ProjectPage'
import { StreamConnect } from '$shared/components/StreamConnect'
import { useUserHasAccessToProject } from '$mp/containers/ProductController/useUserHasAccessToProject'
import { MEDIUM } from '$shared/utils/styled'
import ProjectPng from '$shared/assets/images/project.png'
import Button from '$shared/components/Button'
import { projectTypeNames } from '$mp/utils/constants'
import PaymentRate from '$mp/components/PaymentRate'
import { formatChainName } from '$shared/utils/chains'
import { WhiteBox } from '$shared/components/WhiteBox'
import useModal from '$shared/hooks/useModal'
import PurchaseModal from '$mp/components/Modal/PurchaseModal'
import {useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import {SalePoint} from "$mp/types/project-types"
import {getConfigForChain} from "$shared/web3/config"
import {timeUnits} from "$shared/utils/timeUnit"

export const Connect: FunctionComponent = () => {
    const { api: purchaseDialog } = useModal('purchaseProject')
    const {loadedProject: project} = useLoadedProject()
    const userHasAccess: boolean = useUserHasAccessToProject()
    const firstSalePoint = useMemo<SalePoint>(() => Object.values(project.salePoints)[0], [project.salePoints])
    const firstSalePointChainName = useMemo<string>(() => getConfigForChain(firstSalePoint.chainId).name,[firstSalePoint])
    const moreSalePoints = useMemo<number>(() => Object.values(project.salePoints).length - 1, [project.salePoints])
    return <ProjectPage>
        <ProjectPageContainer>
            {
                userHasAccess
                    ? <WhiteBox>
                        <StreamConnect streams={project.streams}/>
                    </WhiteBox>
                    : <GetAccessContainer>
                        <img src={ProjectPng}/>
                        <h1>Get access to {project.name}</h1>
                        <p>
                            <span>The streams in this {projectTypeNames[project.type]} can be accessed for <br/></span>
                            <strong>
                                <PaymentRate
                                    amount={firstSalePoint.pricePerSecond}
                                    chainId={firstSalePoint.chainId}
                                    pricingTokenAddress={firstSalePoint.pricingTokenAddress}
                                    timeUnit={timeUnits.hour}
                                    tag={'span'}
                                />
                            </strong>
                            <span> on </span>
                            <strong>{formatChainName(firstSalePointChainName)}</strong>
                            {moreSalePoints > 0 && <span> [and on {moreSalePoints} other {moreSalePoints === 1 ? 'chain' : 'chains'}]</span>}
                        </p>
                        <Button onClick={() => { purchaseDialog.open({ projectId: project.id }) }}>Get Access</Button>
                    </GetAccessContainer>
            }
            <PurchaseModal />
        </ProjectPageContainer>
    </ProjectPage>
}

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

