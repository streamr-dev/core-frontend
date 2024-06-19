import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { EmptyState } from '~/components/EmptyState'
import Layout from '~/components/Layout'
import pageNotFoundPic from '~/shared/assets/images/404_blocks.png'
import pageNotFoundPic2x from '~/shared/assets/images/404_blocks@2x.png'
import { Button } from '~/components/Button'
import { Route as R, routeOptions } from '~/utils/routes'
import { useCurrentChainSymbolicName } from '~/utils/chains'

export default function NotFoundPage() {
    return (
        <Layout rootBackgroundColor="#EFEFEF">
            <NotFoundPageContent />
        </Layout>
    )
}

export function NotFoundPageContent() {
    const chainName = useCurrentChainSymbolicName()

    return (
        <Root>
            <EmptyState
                image={
                    <img
                        src={pageNotFoundPic}
                        srcSet={`${pageNotFoundPic2x} 2x`}
                        alt="Not found"
                    />
                }
                link={
                    <>
                        <Button
                            kind="special"
                            as={Link}
                            to={R.streams(routeOptions(chainName))}
                        >
                            Go to streams
                        </Button>
                        <Button
                            kind="special"
                            as={Link}
                            to={R.projects(routeOptions(chainName))}
                        >
                            Go to projects
                        </Button>
                        <Button kind="special" as={Link} to={R.root()}>
                            Go to public site
                        </Button>
                    </>
                }
                linkOnMobile
            >
                <p>
                    Whoops! We don&apos;t seem to be able to find your data.
                    <br />
                    <small>Something might have been moved around or changed.</small>
                </p>
            </EmptyState>
        </Root>
    )
}

const Root = styled.div`
    text-align: center;
    width: 100%;
`
