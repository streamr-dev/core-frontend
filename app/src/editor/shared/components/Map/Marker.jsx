// @flow

import React from 'react'
import L from 'leaflet'
import { LeafletProvider, withLeaflet, MapLayer, type LatLng, type MapLayerProps } from 'react-leaflet'

import markerPinImage from '$shared/assets/images/checkmark.svg'

type LeafletElement = L.Marker
type Props = {
  icon?: L.Icon,
  position: LatLng,
  zIndexOffset?: number,
} & MapLayerProps

class Marker extends MapLayer<LeafletElement, Props> {
    createLeafletElement(props: Props): LeafletElement {
        const el = new L.Marker(props.position, this.getOptions(props))
        this.contextValue = {
            ...props.leaflet,
            popupContainer: el,
        }

        const icon = new L.Icon({
            iconUrl: markerPinImage,
            iconRetinaUrl: markerPinImage,
            iconAnchor: null,
            popupAnchor: new L.Point(0, 100),
            shadowUrl: null,
            shadowSize: null,
            shadowAnchor: null,
            iconSize: new L.Point(20, 20),
            className: 'custom-icon',
        })
        el.setIcon(icon)

        return el
    }

    updateLeafletElement(fromProps: Props, toProps: Props) {
        if (toProps.position !== fromProps.position) {
            this.leafletElement.setLatLng(toProps.position)
        }
        if (toProps.icon !== fromProps.icon) {
            this.leafletElement.setIcon(toProps.icon)
        }
        if (toProps.zIndexOffset !== fromProps.zIndexOffset) {
            this.leafletElement.setZIndexOffset(toProps.zIndexOffset)
        }
    }

    render() {
        const { children } = this.props
        return children == null || this.contextValue == null ? null : (
            <LeafletProvider value={this.contextValue}>{children}</LeafletProvider>
        )
    }
}

export default withLeaflet(Marker)
