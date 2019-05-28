// @flow

import React from 'react'
import { render } from 'react-dom'
import L from 'leaflet'
import { LeafletProvider, withLeaflet, MapLayer, type LatLng, type MapLayerProps } from 'react-leaflet'
import 'leaflet-rotatedmarker'

import SvgIcon from '$shared/components/SvgIcon'

import styles from './Marker.pcss'

type LeafletElement = L.Marker
type IconType = 'pin' | 'circle' | 'arrow' | 'arrowhead' | 'longarrow'

type Props = {
  icon: IconType,
  color: string,
  position: LatLng,
  rotation: number,
  zIndexOffset?: number,
} & MapLayerProps

class Marker extends MapLayer<LeafletElement, Props> {
    createLeafletElement(props: Props): LeafletElement {
        const el = new L.Marker(props.position, this.getOptions(props))
        this.contextValue = {
            ...props.leaflet,
            popupContainer: el,
        }

        const icon = new L.DivIcon({
            iconSize: new L.Point(16, 16),
            className: styles.marker,
        })
        el.setIcon(icon)
        el.setRotationOrigin('50% 50%')

        return el
    }

    updateLeafletElement(fromProps: Props, toProps: Props) {
        if (toProps.position[0] !== fromProps.position[0] ||
            toProps.position[1] !== fromProps.position[1]) {
            this.leafletElement.setLatLng(toProps.position)
        }
        if (toProps.zIndexOffset !== fromProps.zIndexOffset) {
            this.leafletElement.setZIndexOffset(toProps.zIndexOffset)
        }
        if (toProps.rotation !== fromProps.rotation) {
            this.leafletElement.setRotationAngle(toProps.rotation)
        }
    }

    componentDidMount() {
        super.componentDidMount()
        this.renderComponent()
    }

    componentDidUpdate(fromProps) {
        this.renderComponent()
        this.updateLeafletElement(fromProps, this.props)
    }

    renderComponent = () => {
        const { children, color, icon } = this.props

        /* eslint-disable-next-line no-underscore-dangle */
        const container = this.leafletElement._icon

        const component = (
            <LeafletProvider value={this.contextValue}>
                <SvgIcon name={icon} color={color} />
                {children}
            </LeafletProvider>
        )

        if (container) {
            render(
                component,
                container,
            )
        }
    }

    render() {
        return null
    }
}

export default withLeaflet(Marker)
