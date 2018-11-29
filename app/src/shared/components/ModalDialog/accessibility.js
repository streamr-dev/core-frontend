// @flow

import ReactModal2 from 'react-modal2'

// See: https://github.com/cloudflare/react-modal2#accessibility
ReactModal2.getApplicationElement = () => document.getElementById('app')
