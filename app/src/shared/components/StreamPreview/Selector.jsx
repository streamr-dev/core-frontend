import React from 'react'
import styled, { css } from 'styled-components'
import { Translate } from 'react-redux-i18n'
import { MEDIUM, SM, LG } from '$shared/utils/styled'
import SvgIcon from '$shared/components/SvgIcon'
import IconButton from './IconButton'

const SelectorRoot = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #525252;

    @media (min-width: ${SM}px) {
        min-width: 224px;
    }
`

const SelectorTitle = styled.div`
    font-weight: ${MEDIUM};
    line-height: 24px;
    min-width: 70px;

    @media (min-width: ${LG})px {
        flex: 1;
        min-width: 85px;
    }
`

const SelectorIcon = styled(IconButton)`
    svg {
        width: 8px;
        height: 14px;
        position: absolute;

        ${({ back }) => !!back && css`
            transform: translate(-60%, -50%);
        `}

        ${({ forward }) => !!forward && css`
            transform: translate(-40%, -50%);
        `}
    }
`

const SelectorPages = styled.div`
    min-width: 64px;
    text-align: center;
    padding: 0 0.5rem;
`

const Selector = ({
    active,
    onChange,
    options,
    title,
    ...rest
}) => {
    if (!options || options.length <= 0) {
        return null
    }

    const current = options.indexOf(active)

    function prev() {
        onChange(options[Math.max(0, current - 1)])
    }

    function next() {
        onChange(options[Math.min(current + 1, options.length)])
    }

    return (
        <SelectorRoot {...rest}>
            <SelectorTitle>
                {title}
            </SelectorTitle>
            <SelectorIcon
                back
                disabled={current <= 0}
                onClick={prev}
            >
                <SvgIcon name="back" />
            </SelectorIcon>
            <SelectorPages>
                <Translate
                    value="streamLivePreview.selectorPages"
                    current={current + 1}
                    total={options.length}
                    dangerousHTML
                />
            </SelectorPages>
            <SelectorIcon
                forward
                disabled={current >= options.length - 1}
                onClick={next}
            >
                <SvgIcon name="forward" />
            </SelectorIcon>
        </SelectorRoot>
    )
}

export default Selector
