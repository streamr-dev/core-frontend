const axios = require('axios')
const lunr = require('lunr')

let idx = null

export function searchSpecs (text) {
  if (idx && !idx.then) {
    return text ? idx.search(text).map(d => d.ref) : null
  } else if (!idx) {
    idx = axios.get('https://github.com/streamr-dev/engine-and-editor/blob/8cc0e1b2ccd43e601d4af46e2bd08d39f2e3ae0e/web-app/misc/swagger.json').then(res => {
      idx = lunr.Index.load(res.data)
    })
  }

  return new Promise(resolve => {
    idx.then(() => {
      resolve(text ? idx.search(text).map(d => d.ref) : null)
    })
  })
}
