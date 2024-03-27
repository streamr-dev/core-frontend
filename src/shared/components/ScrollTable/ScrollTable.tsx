import React, { FunctionComponent, ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { DropdownMenuItem } from '~/components/DropdownMenuItem'
import { LoadMoreButton } from '~/components/LoadMore'
import { Meatball } from '~/components/Meatball'
import { ActionsToggle } from '~/components/SalePointSelector/BeneficiaryAddressEditor'
import { SimpleDropdown, SimpleListDropdownMenu } from '~/components/SimpleDropdown'
import { useMediaQuery } from '~/hooks'
import { NoData } from '~/shared/components/NoData'
import {
    FloatingLoadingIndicator,
    NoDataWrap,
    OrderCaretIcon,
    ScrollTableCell,
    ScrollTableCellsWrap,
    ScrollTableColumn,
    ScrollTableHeaderCell,
    ScrollTableNonStickyColumnsWrap,
} from '~/shared/components/ScrollTable/ScrollTable.styles'
import { TABLET } from '~/shared/utils/styled'
import { OrderDirection } from '~/types'

type ScrollTableProps<Element> = {
    elements: Element[]
    isLoading?: boolean
    columns: ScrollTableColumnDef<Element>[]
    actions?: (ScrollTableAction<Element> | ScrollTableActionCallback<Element>)[]
    orderDirection?: OrderDirection
    orderBy?: string
    onOrderChange?: (columnKey: string) => void
    noDataFirstLine?: ReactNode
    noDataSecondLine?: ReactNode
    footerComponent?: ReactNode
    linkMapper?: (element: Element) => string
    hasMoreResults?: boolean
    onLoadMore?: () => void
}

export type ScrollTableColumnDef<T> = {
    key: string
    displayName: ReactNode
    isSticky?: boolean
    valueMapper: (element: T) => ReactNode
    align?: 'start' | 'end'
    sortable?: boolean
}

type ScrollTableActionCallback<T> = (element: T) => {
    displayName: string
    callback: () => void
    disabled?: boolean
}

export type ScrollTableAction<T> = {
    displayName: string | ((element: T) => string)
    callback: (element: T) => void
    disabled?: boolean | ((element: T) => boolean)
}

export const ScrollTable = <T extends object>({
    isLoading,
    footerComponent,
    hasMoreResults,
    onLoadMore,
    ...tableProps
}: ScrollTableProps<T>) => {
    return (
        <>
            <ScrollTableCore isLoading={isLoading} {...tableProps} />
            {hasMoreResults && (
                <LoadMoreButton
                    disabled={isLoading}
                    onClick={() => onLoadMore?.()}
                    kind="primary2"
                >
                    Load more
                </LoadMoreButton>
            )}
            {footerComponent != null && footerComponent}
        </>
    )
}

export const ScrollTableCore = <T extends object>({
    elements,
    columns,
    actions,
    isLoading,
    noDataFirstLine,
    noDataSecondLine,
    orderDirection,
    orderBy,
    onOrderChange,
    linkMapper,
}: ScrollTableProps<T>) => {
    const isMobile = !useMediaQuery(`only screen and ${TABLET}`)
    let actualColumns = columns

    // Disable sticky columns on mobile since it makes scrolling difficult
    if (isMobile) {
        actualColumns = columns.map((c) => ({
            ...c,
            isSticky: false,
        }))
    }

    const stickyColumns = actualColumns.filter((column) => column.isSticky)
    const nonStickyColumns = actualColumns.filter((column) => !column.isSticky)
    const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null)
    const hasOrderingEnabled = orderBy && orderDirection && onOrderChange
    return (
        <ScrollTableCellsWrap
            stickyColumnCount={stickyColumns.length}
            nonStickyColumnCount={nonStickyColumns.length}
        >
            {stickyColumns.map((stickyColumn) => {
                return (
                    <ScrollTableColumn key={stickyColumn.key}>
                        <ScrollTableHeaderCell
                            $align={stickyColumn.align}
                            $pointer={onOrderChange && stickyColumn.sortable}
                            onClick={() => {
                                if (onOrderChange && stickyColumn.sortable) {
                                    onOrderChange(stickyColumn.key)
                                }
                            }}
                        >
                            <span>{stickyColumn.displayName}</span>{' '}
                            {hasOrderingEnabled && stickyColumn.key === orderBy && (
                                <OrderCaret orderDirection={orderDirection} />
                            )}
                        </ScrollTableHeaderCell>
                        {elements && elements.length > 0 && (
                            <>
                                {elements.map((element, id) => {
                                    return (
                                        <ScrollTableCell
                                            key={id}
                                            $align={stickyColumn.align}
                                            $hover={hoveredRowIndex === id}
                                            as={linkMapper ? Link : 'div'}
                                            to={linkMapper ? linkMapper(element) : ''}
                                            onMouseEnter={() => setHoveredRowIndex(id)}
                                            onMouseLeave={() => setHoveredRowIndex(null)}
                                        >
                                            {stickyColumn.valueMapper(element)}
                                        </ScrollTableCell>
                                    )
                                })}
                            </>
                        )}
                    </ScrollTableColumn>
                )
            })}
            <ScrollTableNonStickyColumnsWrap>
                {nonStickyColumns.map((nonStickyColumn) => {
                    return (
                        <ScrollTableColumn key={nonStickyColumn.key}>
                            <ScrollTableHeaderCell
                                $align={nonStickyColumn.align}
                                $pointer={onOrderChange && nonStickyColumn.sortable}
                                onClick={() => {
                                    if (onOrderChange && nonStickyColumn.sortable) {
                                        onOrderChange(nonStickyColumn.key)
                                    }
                                }}
                            >
                                <span>{nonStickyColumn.displayName}</span>
                                {hasOrderingEnabled &&
                                    nonStickyColumn.key === orderBy && (
                                        <OrderCaret orderDirection={orderDirection} />
                                    )}
                            </ScrollTableHeaderCell>
                            {elements && elements.length > 0 && (
                                <>
                                    {elements.map((element, id) => {
                                        return (
                                            <ScrollTableCell
                                                as={linkMapper ? Link : 'div'}
                                                to={linkMapper ? linkMapper(element) : ''}
                                                key={id}
                                                $align={nonStickyColumn.align}
                                                $hover={hoveredRowIndex === id}
                                                onMouseEnter={() =>
                                                    setHoveredRowIndex(id)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredRowIndex(null)
                                                }
                                            >
                                                {nonStickyColumn.valueMapper(element)}
                                            </ScrollTableCell>
                                        )
                                    })}
                                </>
                            )}
                        </ScrollTableColumn>
                    )
                })}
                {actions && actions.length && (
                    <ScrollTableColumn $actionColumn={true}>
                        <ScrollTableHeaderCell $actionCell={true} />
                        {elements.map((element, id) => (
                            <ScrollTableCell
                                key={id}
                                $actionCell={true}
                                $hover={hoveredRowIndex === id}
                                onMouseEnter={() => setHoveredRowIndex(id)}
                                onMouseLeave={() => setHoveredRowIndex(null)}
                            >
                                <SimpleDropdown
                                    detached
                                    menu={(toggle) => (
                                        <SimpleListDropdownMenu>
                                            <ul>
                                                {actions.map((action, actionIndex) => {
                                                    const {
                                                        displayName,
                                                        callback,
                                                        disabled,
                                                    } =
                                                        typeof action === 'function'
                                                            ? action(element)
                                                            : {
                                                                  displayName:
                                                                      typeof action.displayName ===
                                                                      'function'
                                                                          ? action.displayName(
                                                                                element,
                                                                            )
                                                                          : action.displayName,
                                                                  callback() {
                                                                      action.callback(
                                                                          element,
                                                                      )
                                                                  },
                                                                  disabled:
                                                                      typeof action.disabled ===
                                                                      'function'
                                                                          ? action.disabled(
                                                                                element,
                                                                            )
                                                                          : action.disabled,
                                                              }

                                                    return (
                                                        <DropdownMenuItem
                                                            key={actionIndex}
                                                            type="button"
                                                            disabled={disabled}
                                                            onClick={() => {
                                                                callback()

                                                                toggle(false)
                                                            }}
                                                        >
                                                            {displayName}
                                                        </DropdownMenuItem>
                                                    )
                                                })}
                                            </ul>
                                        </SimpleListDropdownMenu>
                                    )}
                                >
                                    {(toggle) => (
                                        <ActionsToggle
                                            type="button"
                                            onClick={() => void toggle((x) => !x)}
                                        >
                                            <Meatball alt="" layout="vertical" />
                                        </ActionsToggle>
                                    )}
                                </SimpleDropdown>
                            </ScrollTableCell>
                        ))}
                    </ScrollTableColumn>
                )}
            </ScrollTableNonStickyColumnsWrap>
            {(!elements || elements.length === 0) && (
                <NoDataWrap>
                    <NoData
                        firstLine={noDataFirstLine || 'No data'}
                        secondLine={noDataSecondLine}
                        compact
                    />
                </NoDataWrap>
            )}
            <FloatingLoadingIndicator loading={isLoading} />
        </ScrollTableCellsWrap>
    )
}

const OrderCaret: FunctionComponent<{
    orderDirection: OrderDirection
}> = ({ orderDirection }) => {
    return <OrderCaretIcon name="caretUp" $direction={orderDirection} />
}
