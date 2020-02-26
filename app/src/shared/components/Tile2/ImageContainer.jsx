// @flow

import React, { type Node } from 'react'
import styled from 'styled-components'
import ReactImage from 'react-image'
import Skeleton from '$shared/components/Skeleton'
import UnstyledLogo from '$shared/components/Logo'

type Props = {
    alt?: ?string,
    children?: Node,
    ratio?: string,
    skeletonize?: boolean,
    src?: ?string,
}

const Root = styled.div`
    border-radius: 2px;
    overflow: hidden;
    position: relative;

    svg {
        display: block;
    }
`

const Logo = styled(UnstyledLogo)`
    height: auto;
    left: 50%;
    max-width: 32%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
`

export const Image = styled(ReactImage)`
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;

    img& {
        object-fit: cover;
    }
`

const Placeholder = styled.div`
    background-image: linear-gradient(135deg, #0045FF 0%, #7200EE 100%);
`

const ImageContainer = ({
    alt = '',
    src,
    ratio = '3:2',
    children,
    skeletonize,
    ...props
}: Props) => (
    <Root {...props}>
        {skeletonize ? (
            <Image as={Skeleton} block />
        ) : (
            <Image
                alt={alt}
                src={src}
                loader={(
                    <Image as={Skeleton} block />
                )}
                unloader={(
                    <Image as={Placeholder}>
                        <Logo color="black" opacity="0.15" />
                    </Image>
                )}
            />
        )}
        {children}
        <svg
            viewBox={`0 0 ${ratio.split(/[:x]/).join(' ')}`}
            xmlns="http://www.w3.org/2000/svg"
        />
    </Root>
)

export default ImageContainer
