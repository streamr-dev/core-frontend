import styled, { css } from 'styled-components'

export const FloatingToolbar = styled.div<{ $active?: boolean }>`
    align-items: center;
    backdrop-filter: blur(8px);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.02), 0 0 2px rgba(0, 0, 0, 0.03);
    display: flex;
    height: 60px;
    justify-content: flex-end;
    left: 0;
    opacity: 0;
    padding: 0 40px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9999;
    visiblity: hidden;
    transform: translateY(-100%);
    transition: 100ms;
    transition-delay: 100ms, 0s, 0s;
    transition-property: visibility, opacity, transform;

    ${({ $active = false }) =>
        $active &&
        css`
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            transition-delay: 0s;
        `}
`
