// @flow

import React from 'react'
import styles from './imageUploadIcon.pcss'

type Props = {
    color: string,
}

const ImageUploadIcon = ({ color }: Props) => (
    <svg
        className={styles.uploadImageIcon}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g id="-Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round">
            <g
                id="Image-Uploader-Default"
                transform="translate(-217.000000, -136.000000)"
                stroke={color}
                strokeWidth="2"
            >
                <g id="Group-12">
                    <g id="Group-11" transform="translate(0.000000, 137.000000)">
                        <g id="Group-9" transform="translate(218.000000, 0.000000)">
                            <g id="Image-upload-icon">
                                <rect
                                    id="Rectangle-path"
                                    x="0.0472589792"
                                    y="0.0472589792"
                                    width="40.8589792"
                                    height="40.831758"
                                />
                                <path d="M0.0744801512,31.805293 L40.9062382,31.805293" id="Shape" />
                                <polyline
                                    id="Shape"
                                    strokeLinecap="round"
                                    points="17.6888469 45.415879 43.5240076 49.952741 49.952741 13.3402647 45.415879 12.5440454"
                                />
                                <polygon
                                    id="Shape"
                                    points="28.4026465 15.926276 21.5973535 27.268431 15.926276
                                    25 11.389414 31.805293 34.073724 31.805293"
                                />
                                <polygon
                                    id="Shape"
                                    strokeLinecap="round"
                                    points="18.194707 15.3591682 13.657845 18.194707 9.12098299
                                    15.3591682 9.12098299 10.8223062 13.657845 7.98676749 18.194707 10.8223062"
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
)

ImageUploadIcon.defaultProps = {
    color: '#DDDDDD',
}

export default ImageUploadIcon
