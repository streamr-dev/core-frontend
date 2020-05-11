// @flow

import React from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'

import Button from '$shared/components/Button'
import Toggle from '$shared/components/Toggle'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import useModal from '$shared/hooks/useModal'
import useCopy from '$shared/hooks/useCopy'
import Tooltip from '$shared/components/Tooltip'
import type { WhitelistItem } from '$mp/modules/contractProduct/types'

import useWhitelist from './useWhitelist'
import { Provider as WhitelistContextProvider } from './WhitelistContext'
import { WhitelistAddModal, WhitelistRemoveModal } from './WhitelistModals'

const Container = styled.div`
    background: #fdfdfd;
    border-radius: 4px;
    border: 1px solid #ebebeb;
    font-size: 14px;
`

const Rows = styled.div`
    height: 336px;
    overflow: auto;
`

const TableRow = styled.span`
    display: grid;
    grid-template-columns: 1fr 90px 90px;
    height: 56px;
    opacity: ${(props) => (props.pending ? '0.5' : '1.0')};
    background: #fdfdfd;

    &:not(:last-child) {
        border-bottom: 1px solid #ebebeb;
    }
`

const TableHeaderRow = styled(TableRow)`
    position: sticky;
    top: 0;
    z-index: 1000;
`

const TableColumnBase = styled.span`
    display: flex;
    justify-content: ${(props) => (props.center ? 'center' : 'unset')};
    align-items: center;
    padding: 0 24px;

    * {
        opacity: ${(props) => (props.disabled ? '0.5' : '1.0')};
    }

    &:not(:last-child) {
        border-right: 1px solid #ebebeb;
    }
`

const TableHeaderColumn = styled(TableColumnBase)`
    font-weight: 500;
    letter-spacing: 0px;
`

const TableColumn = styled(TableColumnBase)`
    ${TableRow}:hover & {
        background-color: ${(props) => (props.disabled ? '#fdfdfd' : '#f8f8f8')};
    }
`

const StyledDropdownActions = styled(DropdownActions)`
    visibility: hidden;

    ${TableRow}:hover & {
        visibility: ${(props) => (props.disabled ? 'hidden' : 'visible')};
    }
`

const Controls = styled.div`
    height: 72px;
    padding: 0 16px 0 24px;
    border-top: 1px solid #ebebeb;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-column-gap: 16px;
    align-items: center;
`

const StyledToggle = styled(Toggle)`
    display: flex;
    align-items: center;

    * {
        margin-bottom: 0;
    }
`

const StyledTooltip = styled(Tooltip)`
    * {
        display: flex;
    }
`

const Status = styled.span`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${(props) => {
        if (props.disabled) {
            return '#cdcdcd'
        } else if (props.status === 'added') {
            return '#ffbc00'
        } else if (props.status === 'removed') {
            return '#adadad'
        }
        return '#2ac437'
    }};
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
`

const Label = styled.label`
    margin-bottom: 0;
`

type Props = {
    className?: string,
    enabled: boolean,
    items: Array<WhitelistItem>,
    onEnableChanged: (boolean) => void,
    addDialog: any,
    removeDialog: any,
    copy: (string) => void,
}

const MIN_ROWS = 5

const padWithEmptyRows = (rows: Array<WhitelistItem>) => {
    if (rows.length < MIN_ROWS) {
        const empties = new Array(MIN_ROWS - rows.length).fill(null)
        return empties.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <TableRow key={index} disabled>
                <TableColumn disabled />
                <TableColumn disabled center />
                <TableColumn disabled center />
            </TableRow>
        ))
    }

    return null
}

export const WhitelistEditorComponent = ({
    className,
    enabled,
    items,
    onEnableChanged,
    addDialog,
    removeDialog,
    copy,
}: Props) => (
    <Container className={className}>
        <Rows>
            <TableHeaderRow>
                <TableHeaderColumn>{I18n.t('editProductPage.whitelist.header.address')}</TableHeaderColumn>
                <TableHeaderColumn>{I18n.t('editProductPage.whitelist.header.status')}</TableHeaderColumn>
                <TableHeaderColumn />
            </TableHeaderRow>
            {items.map((item) => {
                const disabled = !enabled || item.isPending

                return (
                    <TableRow key={item.address}>
                        <TableColumn disabled={disabled}>
                            <span>{item.address}</span>
                        </TableColumn>
                        <TableColumn disabled={disabled} center>
                            <StyledTooltip
                                value={I18n.t(`editProductPage.whitelist.status.${item.status}`)}
                                placement="bottom"
                                boundariesElement="viewport"
                                disabled={disabled}
                            >
                                <Status
                                    status={item.status}
                                    disabled={disabled}
                                />
                            </StyledTooltip>
                        </TableColumn>
                        <TableColumn disabled={disabled} center>
                            <StyledDropdownActions
                                title={<Meatball alt="Select" />}
                                noCaret
                                disabled={disabled}
                            >
                                <DropdownActions.Item onClick={() => copy(item.address)}>
                                    {I18n.t('editProductPage.whitelist.copy')}
                                </DropdownActions.Item>
                                {item.status !== 'removed' && (
                                    <DropdownActions.Item onClick={() => removeDialog.open({
                                        address: item.address,
                                    })}
                                    >
                                        {I18n.t('editProductPage.whitelist.remove')}
                                    </DropdownActions.Item>
                                )}
                            </StyledDropdownActions>
                        </TableColumn>
                    </TableRow>
                )
            })}
            {padWithEmptyRows(items)}
        </Rows>
        <Controls>
            <Label htmlFor="whitelist">{I18n.t('editProductPage.whitelist.enable')}</Label>
            <StyledToggle
                id="whitelist"
                value={enabled}
                onChange={(val) => {
                    onEnableChanged(val)
                }}
            />
            <Button
                kind="secondary"
                size="normal"
                disabled={!enabled}
                onClick={() => {
                    addDialog.open()
                }}
            >
                {I18n.t('editProductPage.whitelist.add')}
            </Button>
        </Controls>
    </Container>
)

export const WhitelistEditorContainer = () => {
    const { isEnabled, setEnabled, items } = useWhitelist()
    const { api: addDialog } = useModal('addWhitelistAddress')
    const { api: removeDialog } = useModal('removeWhitelistAddress')
    const { copy } = useCopy()

    // TODO: Email address must be provided when we enable whitelist!
    //       Add this validation when we have contact email for products.

    return (
        <WhitelistEditorComponent
            items={items}
            enabled={isEnabled}
            onEnableChanged={(value) => setEnabled(value)}
            addDialog={addDialog}
            removeDialog={removeDialog}
            copy={copy}
        />
    )
}

export const WhitelistEditor = () => (
    <WhitelistContextProvider>
        <WhitelistEditorContainer />
        <WhitelistAddModal />
        <WhitelistRemoveModal />
    </WhitelistContextProvider>
)

export default WhitelistEditor
